// Fluid Guard — UI wiring.
//
// The check flow demonstrates the routing story end to end:
//   1. classify() — on-device only (ONLY_ON_DEVICE). If Nano is unavailable
//      the raw input is NEVER sent to the cloud; guard.js degrades to the
//      built-in rule engine and the result says so.
//   2. explain() — PREFER_ON_DEVICE, with the routing badge taken from the
//      SDK's real inferenceSource.
//   3. Deep analysis — opt-in only: the user first sees the exact redacted
//      summary, approves it, and only then is it sent to the cloud.
// Every call is recorded in the persistent routing panel with the mode that
// was requested and the route that actually answered.

import {
  classify,
  explain,
  deepAnalysis,
  warmUpDeviceModel,
  probeDeviceModel,
  DEMO_MODE,
  DemoModeError,
} from "./guard.js";
import { FIXTURES } from "./fixtures.js";
import { buildRedactedSummary } from "./rules.js";
import {
  CHAINS,
  isValidAddress,
  scanWallet,
  buildScanSummary,
  formatAllowance,
  shortAddress,
} from "./scan.js";

const CODE_LABELS = {
  unlimited_approval: "Unlimited token approval",
  unknown_spender: "Spender you cannot identify",
  drainer_pattern: "Matches a known wallet-drainer pattern",
  urgency_pressure: "Urgency and pressure tactics",
  lookalike_address: "Address that imitates a known one",
  unverified_contract: "Unverified or unknown contract",
  seed_phrase_request: "Asks for a seed phrase or private key",
  unusual_amount: "Unusually large amount",
  none: "No red flags found",
};

const $ = (id) => document.getElementById(id);

const state = {
  currentText: "",
  currentVerdict: null,
  redactedSummary: "",
  warmedUp: false,
  routeLog: [],
  counts: { ON_DEVICE: 0, IN_CLOUD: 0, LOCAL_FALLBACK: 0, NOT_SENT: 0 },
};

// ---------------------------------------------------------------- fixtures

FIXTURES.forEach((fixture) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = fixture.label;
  button.addEventListener("click", () => {
    $("input").value = fixture.text;
    runCheck();
  });
  $("fixtures").appendChild(button);
});

// ------------------------------------------------------------- routing log

const SOURCE_LABELS = {
  ON_DEVICE: "On-device",
  IN_CLOUD: "In cloud",
  LOCAL_FALLBACK: "Local fallback",
  NOT_SENT: "Not sent",
};

function logRoute({ task, requestedMode, source, ms, note }) {
  const entry = {
    task,
    requestedMode,
    source,
    ms,
    note: note || "",
    time: new Date().toLocaleTimeString("en-GB"),
  };
  state.routeLog.unshift(entry);
  state.counts[source] = (state.counts[source] || 0) + 1;
  renderRouteLog();
}

function renderRouteLog() {
  const { ON_DEVICE, IN_CLOUD, LOCAL_FALLBACK, NOT_SENT } = state.counts;
  const parts = [];
  if (ON_DEVICE) parts.push(`${ON_DEVICE} on-device`);
  if (IN_CLOUD) parts.push(`${IN_CLOUD} in cloud`);
  if (LOCAL_FALLBACK) parts.push(`${LOCAL_FALLBACK} local fallback`);
  if (NOT_SENT) parts.push(`${NOT_SENT} not sent`);
  $("route-summary").textContent = parts.length
    ? `So far this session: ${parts.join(" · ")}.`
    : "No checks yet. Every AI call Guard makes will be listed here with the mode it requested and the route that actually answered.";

  $("route-log").innerHTML = state.routeLog
    .map((entry) => {
      const cls = entry.source.toLowerCase().replace("_", "-");
      return (
        `<li class="route-entry ${cls}">` +
        `<span class="route-task">${entry.task}</span>` +
        `<span class="route-meta">${entry.time} · requested ${entry.requestedMode} · ` +
        `<strong>${SOURCE_LABELS[entry.source] || entry.source}</strong>` +
        (typeof entry.ms === "number" ? ` · ${Math.round(entry.ms)} ms` : "") +
        `</span>` +
        (entry.note ? `<span class="route-note-line">${entry.note}</span>` : "") +
        `</li>`
      );
    })
    .join("");
}

// ------------------------------------------------------------ status pills

function renderConnectionPill() {
  const online = navigator.onLine;
  const pill = $("pill-conn");
  pill.textContent = online
    ? "Connection: online"
    : "Connection: offline — on-device checks still work";
  pill.classList.toggle("pill-warn", !online);
}

async function renderModePills() {
  const modePill = $("pill-mode");
  modePill.textContent = DEMO_MODE
    ? "Mode: demo — Firebase not configured"
    : "Mode: live — Firebase AI Logic";
  modePill.classList.toggle("pill-warn", DEMO_MODE);
  $("demo-banner").hidden = !DEMO_MODE;

  const nanoPill = $("pill-nano");
  const availability = await probeDeviceModel();
  const labels = {
    demo: "On-device model: not configured (demo mode)",
    available: "On-device model: Gemini Nano available",
    downloadable: "On-device model: Gemini Nano will download on first use",
    downloading: "On-device model: Gemini Nano downloading…",
    unavailable: "On-device model: not available in this browser",
    unknown: "On-device model: availability not confirmed",
  };
  nanoPill.textContent = labels[availability] || labels.unknown;
}

window.addEventListener("online", renderConnectionPill);
window.addEventListener("offline", renderConnectionPill);

// ------------------------------------------------------------------- check

function badgeFor(source) {
  if (source === "ON_DEVICE") {
    return {
      text: "Answered on your device — nothing was sent anywhere",
      cls: "badge on-device",
    };
  }
  if (source === "IN_CLOUD") {
    return { text: "Answered in the cloud", cls: "badge in-cloud" };
  }
  return {
    text: DEMO_MODE
      ? "Answered by built-in local checks (demo mode)"
      : "Answered by built-in local checks (no model available)",
    cls: "badge fallback",
  };
}

function routeNote(classification, explanation) {
  const lines = [];
  if (classification.demoMode) {
    lines.push(
      "Demo mode: no Firebase project is configured, so classification ran on Guard's built-in local checks. No AI model was called and nothing left this device.",
    );
  } else if (classification.inferenceSource === "ON_DEVICE") {
    lines.push(
      "Classification ran on your device with Gemini Nano — your raw input never left it.",
    );
  } else {
    lines.push(
      "The on-device model is not available in this browser, so Guard's built-in local checks ran instead. Your input was not sent anywhere.",
    );
  }
  if (explanation.inferenceSource === "IN_CLOUD") {
    lines.push("The explanation below was answered in the cloud.");
  } else if (explanation.inferenceSource === "ON_DEVICE") {
    lines.push("The explanation below was also answered on your device.");
  }
  return lines.join(" ");
}

async function runCheck() {
  const text = $("input").value.trim();
  if (!text) {
    $("status").textContent = "Paste something to check first, or tap an example.";
    return;
  }
  state.currentText = text;
  state.currentVerdict = null;
  $("check").disabled = true;
  $("result").hidden = true;
  resetDeep();

  try {
    if (!DEMO_MODE && !state.warmedUp) {
      state.warmedUp = true;
      $("status").textContent = "Preparing the on-device model…";
      await warmUpDeviceModel((progress) => {
        if (typeof progress === "number" && progress < 1) {
          $("status").textContent =
            "Downloading the on-device model… " + Math.round(progress * 100) + "%";
        }
      });
      renderModePills();
    }

    $("status").textContent = "Checking on your device…";
    const started = performance.now();
    const classification = await classify(text);
    logRoute({
      task: "Risk classification",
      requestedMode: classification.requestedMode,
      source: classification.inferenceSource,
      ms: performance.now() - started,
      note: classification.demoMode
        ? "Demo mode — built-in local checks answered."
        : classification.degraded
          ? "On-device model unavailable — local checks answered."
          : "",
    });

    const verdict = classification.verdict;
    state.currentVerdict = verdict;

    const explainStarted = performance.now();
    const explanation = await explain(text, verdict);
    logRoute({
      task: "Explanation",
      requestedMode: explanation.requestedMode,
      source: explanation.inferenceSource,
      ms: performance.now() - explainStarted,
      note: explanation.degraded && !explanation.demoMode
        ? "Model route unavailable — local checks answered."
        : "",
    });

    $("verdict").textContent = verdict.riskLevel.toUpperCase();
    $("verdict").className = "verdict " + verdict.riskLevel;
    const badge = badgeFor(explanation.inferenceSource);
    $("route-badge").textContent = badge.text;
    $("route-badge").className = badge.cls;
    $("route-note").textContent = routeNote(classification, explanation);
    $("explanation").textContent = explanation.text || verdict.summary;

    const codes = verdict.reasonCodes && verdict.reasonCodes.length
      ? verdict.reasonCodes
      : ["none"];
    $("reasons").innerHTML = codes
      .map((code) => `<li>${CODE_LABELS[code] || code.replaceAll("_", " ")}</li>`)
      .join("");

    $("deep").hidden = verdict.riskLevel === "safe";
    $("result").hidden = false;
    $("status").textContent = "";
    $("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    // classify()/explain() already degrade internally; reaching here means
    // something unexpected. Say so plainly rather than failing silently.
    console.error("Check failed:", error);
    $("status").textContent =
      "The check could not run in this browser. Nothing was sent anywhere — please try again.";
  } finally {
    $("check").disabled = false;
  }
}

$("check").addEventListener("click", runCheck);
$("input").addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runCheck();
});

// ------------------------------------------------------------ deep analysis

function resetDeep() {
  state.redactedSummary = "";
  $("consent").hidden = true;
  $("deep-result-wrap").hidden = true;
  $("deep-status").textContent = "";
  $("deep-prepare").hidden = false;
}

$("deep-prepare").addEventListener("click", () => {
  if (!state.currentText) return;
  state.redactedSummary = buildRedactedSummary(state.currentText);
  $("redacted").textContent = state.redactedSummary;
  $("consent").hidden = false;
  $("deep-status").textContent = DEMO_MODE
    ? "Demo mode: you can review and approve the summary, but with no Firebase project configured there is no cloud to send it to — approving will show exactly where the flow stops, and nothing will be sent."
    : "";
});

$("deep-cancel").addEventListener("click", () => {
  $("consent").hidden = true;
  $("deep-status").textContent = "Cancelled — nothing was sent.";
});

$("deep-approve").addEventListener("click", async () => {
  const summary = state.redactedSummary;
  if (!summary) return;
  $("deep-approve").disabled = true;
  $("deep-status").textContent = "Running deep analysis in the cloud…";
  const started = performance.now();
  try {
    if (!navigator.onLine) {
      logRoute({
        task: "Deep analysis",
        requestedMode: "ONLY_IN_CLOUD",
        source: "NOT_SENT",
        note: "You are offline — deep analysis needs a connection. Nothing was sent.",
      });
      $("deep-status").textContent =
        "You are offline, so deep analysis cannot run. Nothing was sent — try again when you are back online.";
      return;
    }
    const result = await deepAnalysis(summary);
    logRoute({
      task: "Deep analysis",
      requestedMode: result.requestedMode,
      source: result.inferenceSource,
      ms: performance.now() - started,
    });
    $("deep-badge").textContent = "Answered in the cloud";
    $("deep-badge").className = "badge in-cloud";
    $("deep-result").textContent = result.text;
    $("deep-result-wrap").hidden = false;
    $("consent").hidden = true;
    $("deep-status").textContent = "";
  } catch (error) {
    if (error instanceof DemoModeError || (error && error.code === "demo-mode")) {
      logRoute({
        task: "Deep analysis",
        requestedMode: "ONLY_IN_CLOUD",
        source: "NOT_SENT",
        note: "Demo mode — Firebase is not configured, so the approved summary was not sent.",
      });
      $("deep-status").textContent =
        "Demo mode: the summary above is exactly what would be sent, but no Firebase project is configured, so nothing was sent anywhere. Configure Firebase (see the README) to run the real cloud analysis.";
    } else {
      console.error("Deep analysis failed:", error);
      logRoute({
        task: "Deep analysis",
        requestedMode: "ONLY_IN_CLOUD",
        source: "NOT_SENT",
        note: "The cloud call failed — nothing was analysed.",
      });
      $("deep-status").textContent =
        "Deep analysis could not run just now. Nothing was analysed in the cloud — you can try again.";
    }
  } finally {
    $("deep-approve").disabled = false;
  }
});

// ------------------------------------------------------------ wallet scan
//
// "Scan my wallet" — address only, public chain reads, local rule engine.
// The scan itself is logged as LOCAL_FALLBACK in the routing panel: it is
// local by design (public RPC reads + built-in checks), not a model call
// that failed. Its optional deep analysis reuses the same consent flow as
// the checker: the exact summary is shown first and sent only on approval.

const scanState = { result: null, summary: "" };

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fmtScanDate(ms) {
  return ms
    ? new Date(ms).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
}

function resetScanDeep() {
  scanState.summary = "";
  $("scan-consent").hidden = true;
  $("scan-deep-wrap").hidden = true;
  $("scan-deep-status").textContent = "";
  $("scan-deep-prepare").hidden = false;
}

function renderScanResult(result) {
  const { chain, overall, approvals, coverage } = result;
  const dangerCount = approvals.filter((a) => a.level === "danger").length;
  const cautionCount = approvals.filter((a) => a.level === "caution").length;

  $("scan-verdict").textContent = overall.toUpperCase();
  $("scan-verdict").className = "verdict " + overall;

  if (overall === "danger") {
    $("scan-headline").textContent =
      `This wallet is in danger: ${dangerCount} approval${dangerCount === 1 ? "" : "s"} ` +
      "give an unrecognised spender unlimited access to a token. Whoever controls that spender can take the full balance at any time.";
  } else if (overall === "caution") {
    $("scan-headline").textContent =
      `No dangerous approvals found, but ${cautionCount} approval${cautionCount === 1 ? "" : "s"} ` +
      "below deserve a second look before you trust this wallet with more funds.";
  } else if (approvals.length) {
    $("scan-headline").textContent =
      "No dangerous or unusual approvals found — every active approval in the scanned range is a finite amount to a protocol Guard recognises.";
  } else {
    $("scan-headline").textContent =
      "No active approvals were found in the scanned range. Read the coverage note — that is not the same as a guarantee.";
  }

  const fromDate = fmtScanDate(coverage.fromTime);
  const toDate = fmtScanDate(coverage.toTime);
  $("scan-coverage").textContent =
    `Scanned ${chain.name}, blocks ${coverage.fromBlock.toLocaleString("en-GB")} to ` +
    `${coverage.toBlock.toLocaleString("en-GB")}` +
    (fromDate && toDate ? ` (${fromDate} – ${toDate}; ${chain.lookbackLabel})` : ` (${chain.lookbackLabel})`) +
    `. Found ${coverage.eventsFound} approval event${coverage.eventsFound === 1 ? "" : "s"} and checked ` +
    `${coverage.pairsChecked} token/spender pair${coverage.pairsChecked === 1 ? "" : "s"}: ` +
    `${coverage.activeCount} still active, ${coverage.inactiveCount} now zero (revoked or used up). ` +
    `Not covered: approvals granted before block ${coverage.fromBlock.toLocaleString("en-GB")}, ` +
    "approvals on other chains, and NFT collection approvals (setApprovalForAll). " +
    "Check each chain separately.";

  if (coverage.complete) {
    $("scan-gaps").hidden = true;
  } else {
    $("scan-gaps").hidden = false;
    $("scan-gaps").textContent =
      "Warning — this scan is incomplete: block ranges " +
      coverage.gaps.map(([a, b]) => `${a.toLocaleString("en-GB")}–${b.toLocaleString("en-GB")}`).join(", ") +
      " could not be read from any public node after retries. Approvals granted in those ranges may be missing from this result.";
  }

  $("scan-rows").innerHTML = approvals
    .map((approval) => {
      const symbol = approval.tokenMeta.symbol;
      const tokenTitle = symbol
        ? esc(symbol) +
          (approval.tokenMeta.name ? ` · ${esc(approval.tokenMeta.name)}` : "")
        : "Unknown token";
      const spenderLabel = approval.spenderName
        ? esc(approval.spenderName)
        : "Unknown spender — not a protocol Guard recognises";
      const amount = approval.verified
        ? esc(formatAllowance(approval.allowance, approval.tokenMeta.decimals)) +
          (symbol ? " " + esc(symbol) : "")
        : "Could not be read on-chain";
      const reasons = approval.reasons
        .map((reason) => `<li>${esc(reason)}</li>`)
        .join("");
      return (
        `<article class="approval level-${approval.level}">` +
        `<div class="approval-head">` +
        `<span class="verdict-chip ${approval.level}">${approval.level.toUpperCase()}</span>` +
        `<strong class="approval-token">${tokenTitle}</strong>` +
        (approval.tokenKnown ? `<span class="badge">Major asset</span>` : "") +
        `</div>` +
        `<p class="approval-line">Token: <a class="mono" href="${chain.explorer}/address/${approval.token}" target="_blank" rel="noopener">${approval.token}</a></p>` +
        `<p class="approval-line">Spender: <strong>${spenderLabel}</strong> <a class="mono" href="${chain.explorer}/address/${approval.spender}" target="_blank" rel="noopener">${shortAddress(approval.spender)}</a></p>` +
        `<p class="approval-line">They can move: <strong>${amount}</strong></p>` +
        (reasons ? `<ul class="approval-reasons">${reasons}</ul>` : "") +
        `</article>`
      );
    })
    .join("");

  $("scan-deep").hidden = approvals.length === 0;
  $("scan-result").hidden = false;
}

async function runScan() {
  const address = $("scan-address").value.trim();
  const chain = CHAINS[$("scan-chain").value];
  if (!isValidAddress(address)) {
    $("scan-status").textContent =
      "That does not look like a wallet address — it should start with 0x and be 42 characters long. Nothing was scanned.";
    return;
  }
  $("scan-run").disabled = true;
  $("scan-result").hidden = true;
  resetScanDeep();
  scanState.result = null;
  const progress = $("scan-progress");
  progress.hidden = false;
  progress.value = 0;
  $("scan-status").textContent =
    `Scanning ${chain.name}… reading approval history for ${shortAddress(address)}.`;
  const started = performance.now();
  try {
    const result = await scanWallet(chain, address, {
      onProgress: (p) => {
        if (p.phase === "logs") {
          const pct = p.total ? Math.floor((p.scanned / p.total) * 100) : 0;
          progress.value = pct;
          $("scan-status").textContent =
            `Scanning ${chain.name}… ${pct}% of blocks read` +
            (p.gaps ? ` · ${p.gaps} range(s) refused so far` : "") +
            ".";
        } else if (p.phase === "allowances") {
          progress.value = 100;
          $("scan-status").textContent =
            "History read — checking which approvals are still active…";
        }
      },
    });
    scanState.result = result;
    logRoute({
      task: "Wallet approval scan",
      requestedMode: "LOCAL (public chain reads)",
      source: "LOCAL_FALLBACK",
      ms: performance.now() - started,
      note:
        `${chain.name}: ${result.coverage.activeCount} active approval(s) from ` +
        `${result.coverage.pairsChecked} pair(s) checked. ` +
        (result.coverage.complete
          ? "Full range scanned."
          : "PARTIAL — some ranges could not be read; the gaps are listed in the result."),
    });
    renderScanResult(result);
    $("scan-status").textContent = "";
    $("scan-result").scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    console.error("Wallet scan failed:", error);
    logRoute({
      task: "Wallet approval scan",
      requestedMode: "LOCAL (public chain reads)",
      source: "NOT_SENT",
      note: "The public chain nodes could not be reached — the scan did not run.",
    });
    $("scan-status").textContent =
      "The scan could not read the chain — the public nodes are unreachable or throttling right now. Nothing was sent anywhere; try again in a moment.";
  } finally {
    $("scan-run").disabled = false;
    progress.hidden = true;
  }
}

$("scan-run").addEventListener("click", runScan);
$("scan-address").addEventListener("keydown", (event) => {
  if (event.key === "Enter") runScan();
});

$("scan-deep-prepare").addEventListener("click", () => {
  if (!scanState.result) return;
  scanState.summary = buildScanSummary(scanState.result);
  $("scan-summary").textContent = scanState.summary;
  $("scan-consent").hidden = false;
  $("scan-deep-status").textContent = DEMO_MODE
    ? "Demo mode: you can review and approve the summary, but with no Firebase project configured there is no cloud to send it to — approving will show exactly where the flow stops, and nothing will be sent."
    : "";
});

$("scan-deep-cancel").addEventListener("click", () => {
  $("scan-consent").hidden = true;
  $("scan-deep-status").textContent = "Cancelled — nothing was sent.";
});

$("scan-deep-approve").addEventListener("click", async () => {
  const summary = scanState.summary;
  if (!summary) return;
  $("scan-deep-approve").disabled = true;
  $("scan-deep-status").textContent = "Running deep analysis in the cloud…";
  const started = performance.now();
  try {
    if (!navigator.onLine) {
      logRoute({
        task: "Deep analysis (wallet scan)",
        requestedMode: "ONLY_IN_CLOUD",
        source: "NOT_SENT",
        note: "You are offline — deep analysis needs a connection. Nothing was sent.",
      });
      $("scan-deep-status").textContent =
        "You are offline, so deep analysis cannot run. Nothing was sent — try again when you are back online.";
      return;
    }
    const result = await deepAnalysis(summary);
    logRoute({
      task: "Deep analysis (wallet scan)",
      requestedMode: result.requestedMode,
      source: result.inferenceSource,
      ms: performance.now() - started,
    });
    $("scan-deep-badge").textContent = "Answered in the cloud";
    $("scan-deep-badge").className = "badge in-cloud";
    $("scan-deep-result").textContent = result.text;
    $("scan-deep-wrap").hidden = false;
    $("scan-consent").hidden = true;
    $("scan-deep-status").textContent = "";
  } catch (error) {
    if (error instanceof DemoModeError || (error && error.code === "demo-mode")) {
      logRoute({
        task: "Deep analysis (wallet scan)",
        requestedMode: "ONLY_IN_CLOUD",
        source: "NOT_SENT",
        note: "Demo mode — Firebase is not configured, so the approved scan summary was not sent.",
      });
      $("scan-deep-status").textContent =
        "Demo mode: the summary above is exactly what would be sent, but no Firebase project is configured, so nothing was sent anywhere. Configure Firebase (see the README) to run the real cloud analysis.";
    } else {
      console.error("Scan deep analysis failed:", error);
      logRoute({
        task: "Deep analysis (wallet scan)",
        requestedMode: "ONLY_IN_CLOUD",
        source: "NOT_SENT",
        note: "The cloud call failed — nothing was analysed.",
      });
      $("scan-deep-status").textContent =
        "Deep analysis could not run just now. Nothing was analysed in the cloud — you can try again.";
    }
  } finally {
    $("scan-deep-approve").disabled = false;
  }
});

// -------------------------------------------------------------------- init

renderConnectionPill();
renderModePills();
renderRouteLog();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + "sw.js")
      .catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
  });
}
