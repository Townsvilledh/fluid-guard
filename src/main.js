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

// -------------------------------------------------------------------- init

renderConnectionPill();
renderModePills();
renderRouteLog();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}
