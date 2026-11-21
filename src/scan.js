// Fluid Guard — wallet approval scanner ("Scan my wallet").
//
// ADDRESS ONLY. This module reads public on-chain data through public
// JSON-RPC endpoints. It never connects a wallet, never asks for a
// signature and never touches a seed phrase — there is nothing here that
// could. The address being scanned is public information; the queries go
// to public blockchain nodes, exactly like a block explorer.
//
// Method:
//   1. eth_getLogs for ERC-20 Approval events (topic0 = Approval,
//      topic1 = owner) over a bounded lookback per chain, in chunks.
//      Public RPC endpoints cap the block range per query and rate-limit
//      freely, so the scanner rotates endpoints, splits ranges that an
//      endpoint refuses, backs off when throttled — and records any range
//      it could not scan as an explicit GAP. A partial scan is reported
//      as partial, never dressed up as complete.
//   2. For every (token, spender) pair found, the CURRENT allowance is
//      read with eth_call allowance(owner, spender). Only allowances
//      still above zero are active risks; the rest are history.
//   3. Each active approval is classified locally by the same reason-code
//      language as Guard's red-flag engine (rules.js). No AI model is
//      involved in the scan itself.
//
// Coverage per chain is bounded by block time and by what free public
// RPC endpoints will actually serve — see CHAINS and the README.

import { knownSpender, knownToken } from "./known.js";

export const APPROVAL_TOPIC =
  "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";
export const MAX_UINT256 = (1n << 256n) - 1n;
// Allowances at or above 2^255 are "effectively unbounded": no token has
// a supply anywhere near that, so the spender can move whatever exists.
export const UNLIMITED_THRESHOLD = 1n << 255n;

const ALLOWANCE_SELECTOR = "0xdd62ed3e";
const SYMBOL_SELECTOR = "0x95d89b41";
const NAME_SELECTOR = "0x06fdde03";
const DECIMALS_SELECTOR = "0x313ce567";

// Per-chain configuration. `chunk` is the largest eth_getLogs block span
// each endpoint is asked for initially; the scanner splits further when
// an endpoint refuses a range, so a smaller real cap costs time, not
// correctness. `lookbackBlocks` is the honest bound for v1, set by block
// time and by what public endpoints will serve:
//   - Ethereum (~12s blocks): about 12 months.
//   - Base (~2s blocks): about 12 months attempted; coverage depends on
//     endpoint goodwill and gaps are reported.
//   - Arbitrum One (~0.25s blocks): about 30 days — a year of Arbitrum
//     is ~126M blocks, which public RPC log queries will not serve.
//   - BNB Smart Chain (~3s blocks): about 90 days (dataseed endpoints
//     cap eth_getLogs at ~5,000-block spans).
export const CHAINS = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    chainId: 1,
    blockSeconds: 12,
    lookbackBlocks: 2628000,
    lookbackLabel: "about 12 months",
    explorer: "https://etherscan.io",
    endpoints: [
      { url: "https://eth.blockscout.com/api/eth-rpc", chunk: 1000000 },
      { url: "https://eth.api.onfinality.io/public", chunk: 100000 },
      { url: "https://rpc.mevblocker.io", chunk: 9999 },
      { url: "https://eth.llamarpc.com", chunk: 100000 },
    ],
  },
  base: {
    id: "base",
    name: "Base",
    chainId: 8453,
    blockSeconds: 2,
    lookbackBlocks: 15768000,
    lookbackLabel: "about 12 months",
    explorer: "https://basescan.org",
    endpoints: [
      { url: "https://mainnet.base.org", chunk: 10000 },
      { url: "https://base.llamarpc.com", chunk: 100000 },
      { url: "https://base-rpc.publicnode.com", chunk: 50000 },
    ],
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum One",
    chainId: 42161,
    blockSeconds: 0.25,
    lookbackBlocks: 10368000,
    lookbackLabel: "about 30 days",
    explorer: "https://arbiscan.io",
    endpoints: [
      { url: "https://arb1.arbitrum.io/rpc", chunk: 25000 },
      { url: "https://arbitrum.llamarpc.com", chunk: 100000 },
    ],
  },
  bsc: {
    id: "bsc",
    name: "BNB Smart Chain",
    chainId: 56,
    blockSeconds: 3,
    lookbackBlocks: 2592000,
    lookbackLabel: "about 90 days",
    explorer: "https://bscscan.com",
    endpoints: [
      { url: "https://bsc-dataseed.binance.org", chunk: 5000 },
      { url: "https://bsc-dataseed1.binance.org", chunk: 5000 },
      { url: "https://bsc-dataseed2.binance.org", chunk: 5000 },
      { url: "https://bsc-dataseed3.binance.org", chunk: 5000 },
    ],
  },
};

export function isValidAddress(value) {
  return typeof value === "string" && /^0x[0-9a-fA-F]{40}$/.test(value.trim());
}

const hex = (n) => "0x" + n.toString(16);
const padAddress = (address) =>
  "0".repeat(24) + address.toLowerCase().replace(/^0x/, "");

// ------------------------------------------------------------------ RPC

function errorKind(message) {
  const text = String(message || "").toLowerCase();
  // Rate limits first: "Too Many Requests" must never be read as a
  // range refusal (which would split the span instead of backing off).
  if (
    /429|too many requests|rate limit|ratelimit|throttl|quota|request limit reached|over your current rate/.test(
      text,
    )
  ) {
    return "rate";
  }
  if (
    /range|too large|too many results|exceed|limited to|response size|query spans|more than \d+/.test(
      text,
    )
  ) {
    return "range";
  }
  return "other";
}

function createRpcContext(chain, fetchImpl) {
  return {
    chain,
    fetchImpl,
    nextId: 1,
    rotate: 0,
    state: chain.endpoints.map(() => ({ cooldownUntil: 0 })),
  };
}

async function rpcOnce(ctx, endpoint, method, params) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await ctx.fetchImpl(endpoint.url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: ctx.nextId++, method, params }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const error = new Error("HTTP " + res.status);
      error.kind =
        res.status === 429 ? "rate" : res.status === 413 ? "range" : "other";
      throw error;
    }
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error.message || JSON.stringify(json.error));
      error.kind = errorKind(error.message);
      throw error;
    }
    return json.result;
  } catch (error) {
    if (error && error.kind) throw error;
    const wrapped = new Error(String((error && error.message) || error));
    wrapped.kind = error && error.name === "AbortError" ? "rate" : "other";
    throw wrapped;
  } finally {
    clearTimeout(timer);
  }
}

// Call a method on the first endpoint that answers, rotating across the
// chain's endpoints and cooling down any that throttle or fail.
async function rpcCall(ctx, method, params) {
  const count = ctx.chain.endpoints.length;
  let lastError = null;
  for (let i = 0; i < count; i++) {
    const idx = (ctx.rotate + i) % count;
    if (ctx.state[idx].cooldownUntil > Date.now()) continue;
    try {
      const result = await rpcOnce(ctx, ctx.chain.endpoints[idx], method, params);
      ctx.rotate = idx;
      return result;
    } catch (error) {
      lastError = error;
      ctx.state[idx].cooldownUntil =
        Date.now() + (error.kind === "rate" ? 6000 : 1500);
    }
  }
  throw lastError || new Error("No RPC endpoint available");
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ------------------------------------------------------------- log scan

// Scan [fromBlock, toBlock] for Approval logs from `owner`, using a small
// worker pool over a queue of spans. Returns { logs, gaps } where gaps
// are [from, to] spans that no endpoint would serve after retries — the
// caller MUST surface them as unscanned coverage.
async function fetchApprovalLogs(ctx, owner, fromBlock, toBlock, onProgress) {
  const chain = ctx.chain;
  const ownerTopic = "0x" + padAddress(owner);
  const maxChunk = Math.max(...chain.endpoints.map((e) => e.chunk));
  const total = toBlock - fromBlock + 1;
  const logs = [];
  const gaps = [];
  let scanned = 0;

  const queue = [];
  for (let start = fromBlock; start <= toBlock; start += maxChunk) {
    queue.push({
      from: start,
      to: Math.min(start + maxChunk - 1, toBlock),
      attempts: 0,
    });
  }
  // If every endpoint refuses the log queries, fail fast and say so
  // instead of churning the whole queue: two dozen attempts without a
  // single successful span means this chain cannot be read right now.
  let totalAttempts = 0;
  let successes = 0;
  const report = () =>
    onProgress &&
    onProgress({ scanned, total, gaps: gaps.length });

  // Prefer the endpoints that accept the largest spans (fewer calls),
  // skipping any that are cooling down after a failure. An endpoint that
  // keeps failing is dropped for the rest of the scan: a hanging host
  // retried on every cooldown would otherwise stall the whole scan.
  const endpointOrder = chain.endpoints
    .map((endpoint, idx) => idx)
    .sort((a, b) => chain.endpoints[b].chunk - chain.endpoints[a].chunk);
  const failures = chain.endpoints.map(() => 0);
  const usable = (idx) =>
    failures[idx] < 3 || failures.every((f) => f >= 3);

  async function processSpan(span) {
    if (successes === 0 && totalAttempts >= 24) {
      throw new Error(
        "No public node would serve this chain's approval history right now",
      );
    }
    const size = span.to - span.from + 1;
    let endpoint = null;
    let endpointIdx = -1;
    for (const idx of endpointOrder) {
      if (usable(idx) && ctx.state[idx].cooldownUntil <= Date.now()) {
        endpoint = chain.endpoints[idx];
        endpointIdx = idx;
        break;
      }
    }
    if (!endpoint) {
      // Everything is throttled: wait for the earliest cooldown, then retry.
      if (span.attempts >= 4) {
        gaps.push([span.from, span.to]);
        scanned += size;
        report();
        return;
      }
      span.attempts++;
      queue.push(span);
      await sleep(1200);
      return;
    }
    // Respect this endpoint's span cap by splitting before calling.
    if (size > endpoint.chunk) {
      for (let start = span.from; start <= span.to; start += endpoint.chunk) {
        queue.push({
          from: start,
          to: Math.min(start + endpoint.chunk - 1, span.to),
          attempts: span.attempts,
        });
      }
      return;
    }

    totalAttempts++;
    try {
      const result = await rpcOnce(ctx, endpoint, "eth_getLogs", [
        {
          fromBlock: hex(span.from),
          toBlock: hex(span.to),
          topics: [APPROVAL_TOPIC, ownerTopic],
        },
      ]);
      successes++;
      for (const log of result) logs.push(log);
      scanned += size;
      report();
    } catch (error) {
      // Range refusals are normal operation (the span gets split);
      // throttling, timeouts and unreachable hosts count as failures.
      if (error.kind !== "range") failures[endpointIdx]++;
      if (error.kind === "range" && size > 2000) {
        const mid = span.from + Math.floor(size / 2);
        queue.push({ from: span.from, to: mid - 1, attempts: span.attempts });
        queue.push({ from: mid, to: span.to, attempts: span.attempts });
        return;
      }
      // A throttled endpoint cools briefly; an unreachable or hanging
      // one cools much longer so it cannot stall every span.
      ctx.state[endpointIdx].cooldownUntil =
        Date.now() + (error.kind === "rate" ? 6000 : 20000);
      span.attempts++;
      if (span.attempts > 4 || (error.kind === "range" && size <= 2000)) {
        gaps.push([span.from, span.to]);
        scanned += size;
        report();
        return;
      }
      queue.push(span);
    }
  }

  const workers = [];
  const workerCount = 2;
  for (let i = 0; i < workerCount; i++) {
    workers.push(
      (async () => {
        while (queue.length) {
          const span = queue.shift();
          await processSpan(span);
        }
      })(),
    );
  }
  await Promise.all(workers);
  gaps.sort((a, b) => a[0] - b[0]);
  return { logs, gaps };
}

// ------------------------------------------------------------ pair work

/** Collapse raw Approval logs into unique (token, spender) pairs. */
export function collectPairs(logs) {
  const pairs = new Map();
  for (const log of logs) {
    if (!log || !Array.isArray(log.topics) || log.topics.length < 3) continue;
    const token = String(log.address || "").toLowerCase();
    const spender = "0x" + String(log.topics[2]).slice(26).toLowerCase();
    if (!/^0x[0-9a-f]{40}$/.test(token) || !/^0x[0-9a-f]{40}$/.test(spender)) {
      continue;
    }
    const key = token + "|" + spender;
    const block = parseInt(log.blockNumber || "0x0", 16);
    const existing = pairs.get(key);
    if (existing) {
      existing.events++;
      existing.lastBlock = Math.max(existing.lastBlock, block);
    } else {
      pairs.set(key, { token, spender, events: 1, lastBlock: block });
    }
  }
  return [...pairs.values()];
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}

async function callUint(ctx, to, data) {
  try {
    const result = await rpcCall(ctx, "eth_call", [{ to, data }, "latest"]);
    if (typeof result !== "string" || result === "0x") return null;
    return BigInt(result);
  } catch {
    return null;
  }
}

// Decode an ABI string result; falls back to bytes32-style strings used
// by a few older tokens. Returns null when undecodable.
export function decodeAbiString(result) {
  if (typeof result !== "string" || result === "0x" || result.length < 66) {
    return null;
  }
  const hexBody = result.slice(2);
  try {
    const offset = Number(BigInt("0x" + hexBody.slice(0, 64)));
    if (offset * 2 + 64 <= hexBody.length) {
      const length = Number(
        BigInt("0x" + hexBody.slice(offset * 2, offset * 2 + 64)),
      );
      const data = hexBody.slice(offset * 2 + 64, offset * 2 + 64 + length * 2);
      if (data.length === length * 2 && length > 0 && length < 200) {
        const bytes = new Uint8Array(
          data.match(/.{2}/g).map((b) => parseInt(b, 16)),
        );
        const text = new TextDecoder().decode(bytes).trim();
        if (text) return text;
      }
    }
  } catch {
    // Fall through to the bytes32 interpretation.
  }
  try {
    const bytes = new Uint8Array(
      hexBody
        .slice(0, 64)
        .match(/.{2}/g)
        .map((b) => parseInt(b, 16)),
    );
    const text = new TextDecoder()
      .decode(bytes)
      .replace(/\0/g, "")
      .trim();
    return text || null;
  } catch {
    return null;
  }
}

async function tokenMetadata(ctx, token) {
  const [symbolRaw, nameRaw, decimalsRaw] = await Promise.all([
    rpcCall(ctx, "eth_call", [{ to: token, data: SYMBOL_SELECTOR }, "latest"]).catch(() => null),
    rpcCall(ctx, "eth_call", [{ to: token, data: NAME_SELECTOR }, "latest"]).catch(() => null),
    rpcCall(ctx, "eth_call", [{ to: token, data: DECIMALS_SELECTOR }, "latest"]).catch(() => null),
  ]);
  let decimals = null;
  if (typeof decimalsRaw === "string" && decimalsRaw !== "0x") {
    const value = Number(BigInt(decimalsRaw));
    if (Number.isFinite(value) && value >= 0 && value <= 36) decimals = value;
  }
  return {
    symbol: decodeAbiString(symbolRaw),
    name: decodeAbiString(nameRaw),
    decimals,
  };
}

async function blockTimestamp(ctx, blockNumber) {
  try {
    const block = await rpcCall(ctx, "eth_getBlockByNumber", [
      hex(blockNumber),
      false,
    ]);
    if (block && block.timestamp) return parseInt(block.timestamp, 16) * 1000;
  } catch {
    // Timestamps are presentation only; absence is not a scan failure.
  }
  return null;
}

// --------------------------------------------------------- classification

export function isUnlimited(allowance) {
  return allowance >= UNLIMITED_THRESHOLD;
}

/**
 * Classify one active approval. Pure function — unit-tested.
 * @param {{allowance: bigint, decimals: (number|null), spenderKnown: boolean}}
 * @returns {{level: string, reasonCodes: string[], reasons: string[], unlimited: boolean}}
 */
export function classifyApproval({ allowance, decimals = null, spenderKnown }) {
  const reasonCodes = [];
  const reasons = [];
  const unlimited = isUnlimited(allowance);

  if (unlimited) {
    reasonCodes.push("unlimited_approval");
    reasons.push(
      "Unlimited allowance — this spender can move any amount of the token, at any time, without asking you again.",
    );
  }
  if (!spenderKnown) {
    reasonCodes.push("unknown_spender");
    reasons.push(
      "Guard does not recognise this spender — it is not one of the well-known protocol contracts on its list. Unknown is not proof of wrongdoing, but you should be able to say exactly who this is and why they can move your tokens.",
    );
  }
  let veryLarge = false;
  if (!unlimited && decimals !== null && decimals !== undefined) {
    const oneMillionTokens = 1000000n * 10n ** BigInt(decimals);
    if (allowance >= oneMillionTokens) {
      veryLarge = true;
      reasonCodes.push("unusual_amount");
      reasons.push(
        "The allowance is very large — at least 1,000,000 tokens — far more than a single ordinary swap needs.",
      );
    }
  }

  let level = "safe";
  if (!spenderKnown && unlimited) level = "danger";
  else if (!spenderKnown || unlimited || veryLarge) level = "caution";

  return { level, reasonCodes, reasons, unlimited };
}

/** Human-readable allowance: "Unlimited", or a scaled amount. */
export function formatAllowance(allowance, decimals) {
  if (isUnlimited(allowance)) return "Unlimited";
  if (decimals === null || decimals === undefined) {
    return allowance.toString() + " (smallest units — token decimals unknown)";
  }
  const base = 10n ** BigInt(decimals);
  const whole = allowance / base;
  const fraction = allowance % base;
  const wholeText = whole.toLocaleString("en-GB");
  if (fraction === 0n) return wholeText;
  const fracText = fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "")
    .slice(0, 4);
  return fracText ? `${wholeText}.${fracText}` : wholeText;
}

// -------------------------------------------------------------- the scan

/**
 * Scan one wallet address on one chain.
 * @param {object} chain  A CHAINS entry (or a compatible test config).
 * @param {string} ownerAddress
 * @param {{onProgress?: function, fetchImpl?: function}} [options]
 */
export async function scanWallet(chain, ownerAddress, options = {}) {
  const fetchImpl =
    options.fetchImpl || ((url, opts) => fetch(url, opts));
  const onProgress = options.onProgress || null;
  const owner = ownerAddress.trim().toLowerCase();
  const ctx = createRpcContext(chain, fetchImpl);

  const head = Number(
    BigInt(await rpcCall(ctx, "eth_blockNumber", [])),
  );
  const toBlock = head;
  const fromBlock = Math.max(0, head - chain.lookbackBlocks);

  const { logs, gaps } = await fetchApprovalLogs(
    ctx,
    owner,
    fromBlock,
    toBlock,
    onProgress
      ? (p) => onProgress({ phase: "logs", ...p, total: p.total })
      : null,
  );

  const pairs = collectPairs(logs);

  const checked = await mapLimit(pairs, 4, async (pair) => {
    const data =
      ALLOWANCE_SELECTOR + padAddress(owner) + padAddress(pair.spender);
    const allowance = await callUint(ctx, pair.token, data);
    return { ...pair, allowance };
  });
  if (onProgress) {
    onProgress({ phase: "allowances", done: checked.length, total: checked.length });
  }

  const active = checked.filter(
    (pair) => pair.allowance === null || pair.allowance > 0n,
  );
  const inactiveCount = checked.length - active.length;

  const tokenAddresses = [...new Set(active.map((pair) => pair.token))];
  const metadata = new Map();
  await mapLimit(tokenAddresses, 4, async (token) => {
    metadata.set(token, await tokenMetadata(ctx, token));
  });

  const approvals = active.map((pair) => {
    const meta = metadata.get(pair.token) || {
      symbol: null,
      name: null,
      decimals: null,
    };
    const spenderName = knownSpender(chain.id, pair.spender);
    const tokenKnown = knownToken(chain.id, pair.token);
    if (pair.allowance === null) {
      return {
        ...pair,
        tokenMeta: meta,
        tokenKnown: Boolean(tokenKnown),
        spenderName,
        level: "caution",
        reasonCodes: ["unverified_contract"],
        reasons: [
          "Guard could not read the current allowance for this pair on-chain — the token may not be a standard ERC-20. Treat it as unconfirmed rather than safe.",
        ],
        unlimited: false,
        verified: false,
      };
    }
    const verdict = classifyApproval({
      allowance: pair.allowance,
      decimals: meta.decimals,
      spenderKnown: Boolean(spenderName),
    });
    return {
      ...pair,
      tokenMeta: meta,
      tokenKnown: Boolean(tokenKnown),
      spenderName,
      level: verdict.level,
      reasonCodes: verdict.reasonCodes,
      reasons: verdict.reasons,
      unlimited: verdict.unlimited,
      verified: true,
    };
  });

  const levelRank = { danger: 3, caution: 2, safe: 1 };
  approvals.sort(
    (a, b) =>
      levelRank[b.level] - levelRank[a.level] ||
      Number(b.unlimited) - Number(a.unlimited) ||
      a.token.localeCompare(b.token),
  );

  let overall = "safe";
  if (approvals.some((a) => a.level === "danger")) overall = "danger";
  else if (approvals.some((a) => a.level === "caution")) overall = "caution";

  const [fromTime, toTime] = await Promise.all([
    blockTimestamp(ctx, fromBlock),
    blockTimestamp(ctx, toBlock),
  ]);

  return {
    owner,
    chain,
    overall,
    approvals,
    coverage: {
      fromBlock,
      toBlock,
      fromTime,
      toTime,
      eventsFound: logs.length,
      pairsChecked: checked.length,
      activeCount: approvals.length,
      inactiveCount,
      gaps,
      complete: gaps.length === 0,
    },
  };
}

// ------------------------------------------------------ deep-analysis text

function shortAddress(address) {
  return address.slice(0, 6) + "…" + address.slice(-4);
}

/**
 * The exact summary the scan's deep analysis would send to the cloud.
 * Everything in it is public on-chain data; the consent sheet shows this
 * text verbatim before anything is sent.
 */
export function buildScanSummary(result) {
  const { chain, owner, overall, approvals, coverage } = result;
  const fmtDate = (ms) =>
    ms
      ? new Date(ms).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "unknown date";
  const lines = [
    "Wallet approval scan summary — public on-chain data only.",
    `Chain: ${chain.name}. Wallet: ${owner}.`,
    `Coverage: blocks ${coverage.fromBlock} to ${coverage.toBlock} ` +
      `(${fmtDate(coverage.fromTime)} – ${fmtDate(coverage.toTime)}). ` +
      `${coverage.eventsFound} approval events found; ${coverage.pairsChecked} token/spender pairs checked; ` +
      `${coverage.activeCount} approvals still active; ${coverage.inactiveCount} now zero (revoked or used up).`,
    coverage.complete
      ? "Coverage gaps: none — every block in the range was scanned."
      : `Coverage gaps: ${coverage.gaps
          .map(([a, b]) => `blocks ${a}–${b}`)
          .join(", ")} could not be scanned (public endpoints refused them), so approvals granted in those ranges may be missing.`,
    `Overall verdict: ${overall.toUpperCase()}.`,
    "",
    "Active approvals:",
  ];
  if (!approvals.length) {
    lines.push("- None found in the scanned range.");
  }
  for (const approval of approvals) {
    const tokenLabel = approval.tokenMeta.symbol
      ? `${approval.tokenMeta.symbol} (${approval.token})`
      : `unknown token ${approval.token}`;
    const spenderLabel = approval.spenderName
      ? `${approval.spenderName} (${approval.spender})`
      : `unknown spender ${approval.spender}`;
    lines.push(
      `- ${tokenLabel} -> ${spenderLabel}: allowance ` +
        `${approval.verified ? formatAllowance(approval.allowance, approval.tokenMeta.decimals) : "could not be read"} — ` +
        `verdict ${approval.level.toUpperCase()} (${approval.reasonCodes.join(", ") || "no flags"}).`,
    );
  }
  lines.push(
    "",
    "Explain what the dangerous approvals would let someone do, the worst case for this wallet, and the exact steps to revoke or reduce the risky ones.",
  );
  return lines.join("\n");
}

export { shortAddress };
