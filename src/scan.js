// Fluid Guard — wallet approval scanner ("Scan my wallet").
//
// ADDRESS ONLY. This module reads public on-chain data through public
// nodes and public block-explorer indexes. It never connects a wallet,
// never asks for a signature and never touches a seed phrase — there is
// nothing here that could. The address being scanned is public
// information; the queries go to public sources, exactly like using a
// block explorer.
//
// Method — three source tiers, tried in order per chain:
//   1. INDEX. Where the chain has a Blockscout explorer, its indexed
//      logs API answers the wallet's whole Approval history in a few
//      calls (the index caps each answer at 1,000 rows, so a full page
//      splits the range and asks again — nothing is silently dropped).
//   2. RPC CRAWL. eth_getLogs for ERC-20 Approval events (topic0 =
//      Approval, topic1 = owner) over a bounded lookback, in chunks
//      sized to what each public node was MEASURED to serve. Nodes cap
//      ranges and throttle freely, so the crawl rotates endpoints,
//      splits refused ranges, backs off when throttled — and records
//      any range it could not scan as an explicit GAP. A partial scan
//      is reported as partial, never dressed up as complete.
//   3. TOKEN FALLBACK (Base and BSC). Free public RPC nodes refuse
//      Base-wide log scans outright (measured 2026-11-21 across 16+
//      endpoints: range caps of 50–2,000 blocks, or log queries refused
//      entirely), and BSC's dataseed mirrors refuse them from
//      rate-limited addresses. So if the index / crawl cannot serve a
//      chain, the scan falls back to what CAN be served: it checks
//      which tokens from a bundled list of known tokens the wallet
//      currently holds (batched balance reads through Multicall3),
//      then reads those tokens' approval history with address-filtered
//      log queries, which public nodes do serve. That fallback is
//      partial BY CONSTRUCTION — held tokens only — and the result's
//      coverage note says so in plain words.
//   Then, for every (token, spender) pair found, the CURRENT allowance
//   is read with eth_call allowance(owner, spender). Only allowances
//   still above zero are active risks; the rest are history. Each
//   active approval is classified locally by the same reason-code
//   language as Guard's red-flag engine (rules.js). No AI model is
//   involved in the scan itself.
//
// Coverage per chain is bounded by block time and by what free public
// sources will actually serve — see CHAINS and the README. All caps
// below were measured against the live endpoints on 2026-11-21.

import { knownSpender, knownToken } from "./known.js";
import { BASE_TOKENS } from "./base-tokens.js";
import { BSC_TOKENS } from "./bsc-tokens.js";

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
const BALANCE_OF_SELECTOR = "0x70a08231";

// Multicall3 — deployed at the same address on every chain Guard scans;
// used by the held-token fallback to batch thousands of balanceOf reads.
const MULTICALL3_ADDRESS = "0xca11bde05977b3631167028862be2a173976ca11";
const TRY_AGGREGATE_SELECTOR = "0xbce38bd7";

// Per-chain configuration.
//   endpoints:    nodes for head / allowance / metadata reads (eth_call).
//   logEndpoints: nodes for the topic-filtered log crawl, each with the
//                 largest block span it was measured to serve.
//   indexer:      a Blockscout logs API base, when the chain has one.
//   tokenFallback: address-filtered per-token log reads (Base, BSC).
// Measured 2026-11-21:
//   - Ethereum: Blockscout's node proxy served the full 2,628,000-block
//     lookback in a single eth_getLogs call; mevblocker caps spans at
//     10,000 blocks. The Blockscout index answers in a few calls.
//   - Base: mainnet.base.org refuses eth_getLogs ("request limit
//     reached") at every range and pace tried; publicnode requires an
//     address filter (50,000-block cap with one); every other keyless
//     endpoint caps spans at 50–2,000 blocks or refuses log queries.
//     So: index first, token fallback second, no topic crawl.
//   - Arbitrum One: the official node caps spans at 30,000 blocks and
//     sustained 16 back-to-back calls in ~7s. A year (~126M blocks) is
//     out of reach, so the lookback stays at ~30 days (~346 calls).
//   - BNB Smart Chain: the dataseed mirrors cap spans at ~5,000 blocks
//     when they serve log queries at all — from rate-limited addresses
//     they refuse them outright ("limit exceeded" at every span size,
//     measured 2026-11-21), so BSC carries the same held-token fallback
//     as Base (publicnode, address-filtered, 50,000-block spans).
export const CHAINS = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    chainId: 1,
    blockSeconds: 12,
    lookbackBlocks: 2628000,
    lookbackLabel: "about 12 months",
    explorer: "https://etherscan.io",
    indexer: { apiBase: "https://eth.blockscout.com/api" },
    endpoints: [
      { url: "https://eth.blockscout.com/api/eth-rpc" },
      { url: "https://rpc.mevblocker.io" },
      { url: "https://rpc.mevblocker.io/fast" },
    ],
    logEndpoints: [
      { url: "https://eth.blockscout.com/api/eth-rpc", chunk: 2000000 },
      { url: "https://rpc.mevblocker.io", chunk: 10000 },
      { url: "https://rpc.mevblocker.io/fast", chunk: 10000 },
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
    indexer: { apiBase: "https://base.blockscout.com/api" },
    endpoints: [
      { url: "https://mainnet.base.org" },
      { url: "https://base-rpc.publicnode.com" },
      { url: "https://base.daybreak-rpc.network" },
    ],
    logEndpoints: [],
    tokenFallback: {
      endpoint: "https://base-rpc.publicnode.com",
      chunk: 50000,
      lookbackBlocks: 3888000,
      lookbackLabel: "about 90 days",
      maxCalls: 1200,
    },
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum One",
    chainId: 42161,
    blockSeconds: 0.25,
    lookbackBlocks: 10368000,
    lookbackLabel: "about 30 days",
    explorer: "https://arbiscan.io",
    endpoints: [{ url: "https://arb1.arbitrum.io/rpc" }],
    logEndpoints: [{ url: "https://arb1.arbitrum.io/rpc", chunk: 30000 }],
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
      { url: "https://bsc-rpc.publicnode.com" },
      { url: "https://bsc-dataseed1.bnbchain.org" },
      { url: "https://bsc-dataseed1.defibit.io" },
      { url: "https://bsc-dataseed1.ninicoin.io" },
    ],
    logEndpoints: [
      { url: "https://bsc-dataseed1.bnbchain.org", chunk: 5000 },
      { url: "https://bsc-dataseed2.bnbchain.org", chunk: 5000 },
      { url: "https://bsc-dataseed3.bnbchain.org", chunk: 5000 },
      { url: "https://bsc-dataseed4.bnbchain.org", chunk: 5000 },
      { url: "https://bsc-dataseed1.defibit.io", chunk: 5000 },
      { url: "https://bsc-dataseed2.defibit.io", chunk: 5000 },
      { url: "https://bsc-dataseed1.ninicoin.io", chunk: 5000 },
      { url: "https://bsc-dataseed2.ninicoin.io", chunk: 5000 },
    ],
    tokenFallback: {
      endpoint: "https://bsc-rpc.publicnode.com",
      chunk: 50000,
      lookbackBlocks: 2592000,
      lookbackLabel: "about 90 days",
      maxCalls: 1200,
    },
  },
};

export function isValidAddress(value) {
  return typeof value === "string" && /^0x[0-9a-fA-F]{40}$/.test(value.trim());
}

const hex = (n) => "0x" + n.toString(16);
const padAddress = (address) =>
  "0".repeat(24) + address.toLowerCase().replace(/^0x/, "");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    /range|too large|too many results|exceed|limited to|response size|query spans|more than \d+|only \d+ are allowed/.test(
      text,
    )
  ) {
    return "range";
  }
  return "other";
}

function createRpcContext(fetchImpl, endpoints) {
  return {
    endpoints,
    fetchImpl,
    nextId: 1,
    rotate: 0,
    state: endpoints.map(() => ({ cooldownUntil: 0 })),
  };
}

async function rpcOnce(ctx, endpoint, method, params) {
  const controller = new AbortController();
  // 20s per call: the scan's users are often on slow mobile networks,
  // and a deliberate scan with a progress bar can afford the patience.
  const timer = setTimeout(() => controller.abort(), 20000);
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
// context's endpoints and cooling down any that throttle or fail. If
// every endpoint fails — typically a brief throttle window right after
// a burst of log queries — wait and make one more pass before giving
// up: these reads (allowances above all) decide the verdicts, so they
// get the extra patience.
async function rpcCall(ctx, method, params) {
  const count = ctx.endpoints.length;
  let lastError = null;
  for (let pass = 0; pass < 2; pass++) {
    if (pass > 0) await sleep(2000);
    for (let i = 0; i < count; i++) {
      const idx = (ctx.rotate + i) % count;
      if (pass === 0 && ctx.state[idx].cooldownUntil > Date.now()) continue;
      try {
        const result = await rpcOnce(ctx, ctx.endpoints[idx], method, params);
        ctx.rotate = idx;
        return result;
      } catch (error) {
        lastError = error;
        ctx.state[idx].cooldownUntil =
          Date.now() + (error.kind === "rate" ? 6000 : 1500);
      }
    }
  }
  throw lastError || new Error("No RPC endpoint available");
}

// ------------------------------------------------------- index (tier 1)

// Ask a Blockscout explorer's indexed logs API for the wallet's
// Approval events over the whole range. The index caps each answer at
// 1,000 rows; a full page means "there may be more", so the range is
// split and asked again — a capped answer is never silently accepted
// as complete. Throws on any transport or refusal error so the caller
// can fall through to the next tier.
const INDEXER_RESULT_CAP = 1000;

async function fetchLogsViaIndexer(chain, fetchImpl, owner, fromBlock, toBlock, onProgress) {
  const ownerTopic = "0x" + padAddress(owner);
  const total = toBlock - fromBlock + 1;
  const byKey = new Map();
  let scanned = 0;

  async function queryRange(from, to, depth) {
    const url =
      `${chain.indexer.apiBase}?module=logs&action=getLogs` +
      `&fromBlock=${from}&toBlock=${to}` +
      `&topic0=${APPROVAL_TOPIC}&topic1=${ownerTopic}&topic0_1_opr=and`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    let json;
    try {
      const res = await fetchImpl(url, { signal: controller.signal });
      if (!res.ok) throw new Error("Indexer HTTP " + res.status);
      json = await res.json();
    } finally {
      clearTimeout(timer);
    }
    let rows;
    if (json && json.status === "1" && Array.isArray(json.result)) {
      rows = json.result;
    } else if (
      json &&
      json.status === "0" &&
      /no logs found/i.test(String(json.message || "") + " " + String(json.result || ""))
    ) {
      rows = [];
    } else {
      throw new Error(
        "Indexer refused the query: " +
          (json && json.message ? json.message : "unexpected response"),
      );
    }
    if (rows.length >= INDEXER_RESULT_CAP && to > from && depth < 48) {
      const mid = from + Math.floor((to - from) / 2);
      await queryRange(from, mid, depth + 1);
      await queryRange(mid + 1, to, depth + 1);
      return;
    }
    for (const log of rows) {
      const key = `${log.transactionHash}|${log.logIndex}|${log.address}`;
      if (!byKey.has(key)) byKey.set(key, log);
    }
    scanned += to - from + 1;
    if (onProgress) onProgress({ scanned, total, gaps: 0 });
  }

  await queryRange(fromBlock, toBlock, 0);
  return [...byKey.values()];
}

// ---------------------------------------------------- RPC crawl (tier 2)

// Scan [fromBlock, toBlock] for Approval logs from `owner`, using a
// small worker pool over a queue of spans. Returns { logs, gaps,
// served } where gaps are [from, to] spans that no endpoint would
// serve after retries — the caller MUST surface them as unscanned
// coverage — and served says at least one span was actually read.
async function fetchApprovalLogs(ctx, owner, fromBlock, toBlock, onProgress) {
  const ownerTopic = "0x" + padAddress(owner);
  const maxChunk = Math.max(...ctx.endpoints.map((e) => e.chunk));
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
  // skipping any that are cooling down after a failure. An endpoint
  // that keeps failing is dropped for the rest of the scan: a hanging
  // host retried on every cooldown would otherwise stall the whole scan.
  const endpointOrder = ctx.endpoints
    .map((endpoint, idx) => idx)
    .sort((a, b) => ctx.endpoints[b].chunk - ctx.endpoints[a].chunk);
  const failures = ctx.endpoints.map(() => 0);
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
        endpoint = ctx.endpoints[idx];
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
  return { logs, gaps, served: successes > 0 };
}

// ------------------------------------------------ token fallback (tier 3)

// Minimal ABI codec for Multicall3 tryAggregate(bool, (address,bytes)[]),
// used to batch balanceOf reads for the Base fallback. Pure functions.

function wordHex(value) {
  return BigInt(value).toString(16).padStart(64, "0");
}

export function encodeTryAggregate(calls) {
  const elements = calls.map(({ target, data }) => {
    const dataHex = String(data).replace(/^0x/, "");
    const byteLength = dataHex.length / 2;
    const padded = dataHex.padEnd(Math.ceil(byteLength / 32) * 64, "0");
    return wordHex(BigInt(target)) + wordHex(64) + wordHex(byteLength) + padded;
  });
  let offset = 32 * calls.length;
  const offsets = elements.map((element) => {
    const word = wordHex(offset);
    offset += element.length / 2;
    return word;
  });
  return (
    TRY_AGGREGATE_SELECTOR +
    wordHex(0) + // requireSuccess = false: a bad token must not fail the batch
    wordHex(64) + // offset of the calls array
    wordHex(calls.length) +
    offsets.join("") +
    elements.join("")
  );
}

export function decodeTryAggregate(result) {
  const body = String(result).replace(/^0x/, "");
  const uintAt = (byteOffset) =>
    BigInt("0x" + body.slice(byteOffset * 2, byteOffset * 2 + 64));
  const arrayOffset = Number(uintAt(0));
  const length = Number(uintAt(arrayOffset));
  const elementsStart = arrayOffset + 32;
  const out = [];
  for (let i = 0; i < length; i++) {
    const elementOffset = elementsStart + Number(uintAt(elementsStart + i * 32));
    const success = uintAt(elementOffset) !== 0n;
    const bytesOffset = elementOffset + Number(uintAt(elementOffset + 32));
    const byteLength = Number(uintAt(bytesOffset));
    const data =
      "0x" +
      body.slice((bytesOffset + 32) * 2, (bytesOffset + 32) * 2 + byteLength * 2);
    out.push({ success, data });
  }
  return out;
}

// Which of `tokenAddresses` does `owner` currently hold (balance > 0)?
// Batched through Multicall3: a few eth_calls cover thousands of tokens.
async function heldTokens(ctx, owner, tokenAddresses) {
  const held = [];
  const batchSize = 400;
  for (let start = 0; start < tokenAddresses.length; start += batchSize) {
    const batch = tokenAddresses.slice(start, start + batchSize);
    const data = encodeTryAggregate(
      batch.map((token) => ({
        target: token,
        data: BALANCE_OF_SELECTOR + padAddress(owner),
      })),
    );
    const result = await rpcCall(ctx, "eth_call", [
      { to: MULTICALL3_ADDRESS, data },
      "latest",
    ]);
    if (typeof result !== "string" || result === "0x") {
      throw new Error("The batched balance read failed");
    }
    decodeTryAggregate(result).forEach((entry, i) => {
      if (entry.success && entry.data && entry.data !== "0x") {
        try {
          if (BigInt(entry.data) > 0n) held.push(batch[i]);
        } catch {
          // An undecodable return is treated as "not held".
        }
      }
    });
  }
  return held;
}

async function getLogsOnce(fetchImpl, url, filter, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getLogs",
        params: [filter],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const error = new Error("HTTP " + res.status);
      error.kind = res.status === 429 ? "rate" : "other";
      throw error;
    }
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error.message || JSON.stringify(json.error));
      error.kind = errorKind(error.message);
      throw error;
    }
    return json.result;
  } finally {
    clearTimeout(timer);
  }
}

function mergeRanges(ranges) {
  if (!ranges.length) return [];
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0]];
  for (const range of sorted.slice(1)) {
    const last = merged[merged.length - 1];
    if (range[0] <= last[1] + 1) last[1] = Math.max(last[1], range[1]);
    else merged.push(range);
  }
  return merged;
}

// The held-token fallback: find the tokens the wallet currently holds
// (from the bundled known-token list for the chain), then read each
// held token's Approval history with address-filtered log queries —
// the one log query shape the public nodes will serve on Base and BSC
// (measured 50,000-block spans, archive included). Partial by
// construction; the returned note says exactly what was and was not
// covered.
const FALLBACK_TOKEN_LISTS = { base: BASE_TOKENS, bsc: BSC_TOKENS };

async function fetchTokenFallbackLogs(chain, callCtx, fetchImpl, owner, toBlock, onProgress) {
  const fb = chain.tokenFallback;
  const fromBlock = Math.max(0, toBlock - fb.lookbackBlocks);
  const ownerTopic = "0x" + padAddress(owner);
  const tokenList = FALLBACK_TOKEN_LISTS[chain.id] || [];
  if (!tokenList.length) throw new Error("No fallback token list for this chain");

  const held = await heldTokens(callCtx, owner, tokenList);
  const spansPerToken = Math.max(
    1,
    Math.ceil((toBlock - fromBlock + 1) / fb.chunk),
  );
  const totalBlocks = toBlock - fromBlock + 1;
  const logs = [];
  const rawGaps = [];
  const failedSpans = [];
  let calls = 0;
  let doneSpans = 0;
  const totalSpans = Math.max(1, held.length * spansPerToken);
  const unscannedTokens = [];
  let budgetHit = false;

  const report = () =>
    onProgress &&
    onProgress({
      scanned: Math.floor((doneSpans / totalSpans) * totalBlocks),
      total: totalBlocks,
      gaps: rawGaps.length + failedSpans.length,
    });

  // One span, with retries. Public nodes rate-limit by address, and a
  // quota window can last far longer than any single span's backoff —
  // so the first pass retries briefly and moves on, and every span it
  // could not read gets one slower repair pass at the end, once the
  // quota has had time to refill. Spans that still fail become gaps.
  async function readSpan(token, start, end, attempts, backoffMs) {
    for (let attempt = 0; attempt < attempts; attempt++) {
      if (calls >= fb.maxCalls) return "budget";
      if (attempt > 0) await sleep(backoffMs * 2 ** attempt);
      calls++;
      try {
        const rows = await getLogsOnce(fetchImpl, fb.endpoint, {
          address: token,
          fromBlock: hex(start),
          toBlock: hex(end),
          topics: [APPROVAL_TOPIC, ownerTopic],
        });
        for (const log of rows) logs.push(log);
        return "ok";
      } catch {
        // fall through to the next attempt
      }
    }
    return "failed";
  }

  for (const token of held) {
    if (budgetHit) {
      unscannedTokens.push(token);
      continue;
    }
    for (let start = fromBlock; start <= toBlock; start += fb.chunk) {
      const end = Math.min(start + fb.chunk - 1, toBlock);
      const outcome = await readSpan(token, start, end, 2, 1000);
      if (outcome === "budget") {
        budgetHit = true;
        unscannedTokens.push(token);
        break;
      }
      if (outcome === "failed") failedSpans.push([token, start, end]);
      doneSpans++;
      report();
      await sleep(120); // be polite to the one public endpoint doing this
    }
  }

  if (failedSpans.length && !budgetHit) {
    await sleep(10000); // let the endpoint's quota window refill
    const stillFailed = [];
    for (const [token, start, end] of failedSpans) {
      const outcome = await readSpan(token, start, end, 3, 4000);
      if (outcome !== "ok") stillFailed.push([start, end]);
      await sleep(120);
    }
    for (const gap of stillFailed) rawGaps.push(gap);
  } else {
    for (const [, start, end] of failedSpans) rawGaps.push([start, end]);
  }

  const note =
    `Fallback scan — the complete approval history for ${chain.name} could not be ` +
    `served by the public sources, so this result covers only the ${held.length} token(s) ` +
    `this wallet currently holds (checked against a built-in list of ` +
    `${tokenList.length.toLocaleString("en-GB")} known ${chain.name} tokens), over ` +
    `${fb.lookbackLabel}. Approvals on tokens you no longer hold, and approvals older ` +
    `than that window, are NOT covered.` +
    (unscannedTokens.length
      ? ` ${unscannedTokens.length} held token(s) could not be scanned within the ` +
        `public-node call budget and are not covered either.`
      : "");

  return { logs, gaps: mergeRanges(rawGaps), heldCount: held.length, note };
}

// ------------------------------------------------------------- pair work

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
  const callCtx = createRpcContext(fetchImpl, chain.endpoints);
  const progress = onProgress
    ? (p) => onProgress({ phase: "logs", ...p })
    : null;

  const head = Number(BigInt(await rpcCall(callCtx, "eth_blockNumber", [])));
  const toBlock = head;

  // Acquire the Approval history from the first tier that serves it.
  let logs = null;
  let gaps = [];
  let source = null;
  let note = null;
  let complete = false;
  let fromBlock = Math.max(0, head - chain.lookbackBlocks);
  let coverageLabel = chain.lookbackLabel;

  if (chain.indexer) {
    try {
      logs = await fetchLogsViaIndexer(
        chain,
        fetchImpl,
        owner,
        fromBlock,
        toBlock,
        progress,
      );
      source = "block explorer index";
      complete = true;
    } catch {
      logs = null; // fall through to the next tier
    }
  }

  if (logs === null && (chain.logEndpoints || []).length) {
    const crawlCtx = createRpcContext(fetchImpl, chain.logEndpoints);
    try {
      const crawled = await fetchApprovalLogs(
        crawlCtx,
        owner,
        fromBlock,
        toBlock,
        progress,
      );
      if (crawled.served) {
        logs = crawled.logs;
        gaps = crawled.gaps;
        source = "public nodes (log crawl)";
        complete = gaps.length === 0;
      }
    } catch {
      logs = null; // fall through to the next tier
    }
  }

  if (logs === null && chain.tokenFallback) {
    const fallback = await fetchTokenFallbackLogs(
      chain,
      callCtx,
      fetchImpl,
      owner,
      toBlock,
      progress,
    );
    logs = fallback.logs;
    gaps = fallback.gaps;
    source = "public nodes (held-token fallback)";
    note = fallback.note;
    fromBlock = Math.max(0, head - chain.tokenFallback.lookbackBlocks);
    coverageLabel = chain.tokenFallback.lookbackLabel;
    complete = false; // partial by construction — see the note
  }

  if (logs === null) {
    throw new Error(
      "No public node would serve this chain's approval history right now",
    );
  }

  const pairs = collectPairs(logs);

  // Allowance reads are the scan's most safety-critical calls: a single
  // transient failure must not understate a live approval, so each read
  // is retried before the pair is marked unverified.
  const checked = await mapLimit(pairs, 4, async (pair) => {
    const data =
      ALLOWANCE_SELECTOR + padAddress(owner) + padAddress(pair.spender);
    let allowance = null;
    for (let attempt = 0; attempt < 3 && allowance === null; attempt++) {
      if (attempt > 0) await sleep(800);
      allowance = await callUint(callCtx, pair.token, data);
    }
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
    metadata.set(token, await tokenMetadata(callCtx, token));
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
    blockTimestamp(callCtx, fromBlock),
    blockTimestamp(callCtx, toBlock),
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
      complete,
      source,
      note,
      lookbackLabel: coverageLabel,
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
      `(${fmtDate(coverage.fromTime)} – ${fmtDate(coverage.toTime)}), read from the ${coverage.source}. ` +
      `${coverage.eventsFound} approval events found; ${coverage.pairsChecked} token/spender pairs checked; ` +
      `${coverage.activeCount} approvals still active; ${coverage.inactiveCount} now zero (revoked or used up).`,
    coverage.complete
      ? "Coverage gaps: none — every block in the range was scanned."
      : `Coverage gaps: ${coverage.gaps.length
          ? coverage.gaps
              .map(([a, b]) => `blocks ${a}–${b}`)
              .join(", ") + " could not be scanned, so approvals granted in those ranges may be missing."
          : "the scan is partial — see the coverage note."}`,
  ];
  if (coverage.note) lines.push(`Coverage note: ${coverage.note}`);
  lines.push(`Overall verdict: ${overall.toUpperCase()}.`, "", "Active approvals:");
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
