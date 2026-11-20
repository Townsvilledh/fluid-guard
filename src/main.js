// Fluid Guard — UI wiring (scaffold).
// The check flow demonstrates the routing story end to end:
//   1. classify() on-device only (ONLY_ON_DEVICE). If Nano is unavailable the
//      raw input is NEVER sent to the cloud — the UI degrades to a built-in
//      rule-based red-flag list and says so.
//   2. explain() preferring on-device, with the routing badge taken from the
//      SDK's real inferenceSource.
//   3. Deep analysis is a separate, explicit button (cloud) — wired in the
//      full build; the consent/redaction sheet is part of that pass.

import { classify, explain } from "./guard.js";

const FIXTURES = {
  approval:
    "Approval request: Allow 0x7f3…drainer (unverified contract) to spend an UNLIMITED amount of your USDT. Method: approve(address,uint256). Amount: 115792089237316195423570985008687907853269984665640564039457584007913129639935",
  message:
    "URGENT: Your wallet has been flagged. Verify your seed phrase within 10 minutes at fluid-verify.example.com or your funds will be frozen permanently. Act now.",
  plain:
    "Transfer 0.05 ETH to 0x0EBf…63b (contact: Ethuram) on Ethereum mainnet. Estimated fee: 0.0004 ETH. No contract interaction.",
};

// Very small rule-based fallback, used only when no model route is available.
// This is a safety net, not the product.
const RED_FLAGS = [
  { pattern: /unlimited|115792089237316195423570985008687907853269984665640564039457/i, label: "Unlimited token approval" },
  { pattern: /seed phrase|recovery phrase|private key/i, label: "Asks for a seed phrase or private key — always a scam" },
  { pattern: /urgent|act now|within \d+ minutes|will be frozen/i, label: "Urgency pressure tactics" },
  { pattern: /unverified contract/i, label: "Unverified contract" },
];

const $ = (id) => document.getElementById(id);

document.querySelectorAll("[data-fixture]").forEach((btn) => {
  btn.addEventListener("click", () => {
    $("input").value = FIXTURES[btn.dataset.fixture] || "";
  });
});

function ruleBasedFallback(text) {
  const hits = RED_FLAGS.filter((f) => f.pattern.test(text)).map((f) => f.label);
  return {
    riskLevel: hits.length ? "danger" : "caution",
    reasons: hits.length
      ? hits
      : ["No model route was available, so only basic checks ran. Treat anything you do not fully understand as unsafe."],
  };
}

function renderBadge(inferenceSource) {
  const badge = $("route-badge");
  if (inferenceSource === "ON_DEVICE") {
    badge.textContent = "Answered on your device — nothing was sent anywhere";
    badge.className = "badge on-device";
  } else if (inferenceSource === "IN_CLOUD") {
    badge.textContent = "Answered in the cloud";
    badge.className = "badge in-cloud";
  } else {
    badge.textContent = "Answered by built-in checks (no model available)";
    badge.className = "badge fallback";
  }
}

$("check").addEventListener("click", async () => {
  const text = $("input").value.trim();
  if (!text) {
    $("status").textContent = "Paste something to check first.";
    return;
  }
  $("status").textContent = "Checking on your device…";
  $("result").hidden = true;

  try {
    // getGenerativeModel + initializeDeviceModel happen inside classify(),
    // i.e. after this user interaction, as the SDK requires.
    const { verdict, inferenceSource } = await classify(text);
    const explanation = await explain(text, verdict);

    $("verdict").textContent = verdict.riskLevel.toUpperCase();
    $("verdict").className = "verdict " + verdict.riskLevel;
    renderBadge(explanation.inferenceSource || inferenceSource);
    $("explanation").textContent = explanation.text || verdict.summary;
    $("reasons").innerHTML = (verdict.reasonCodes || [])
      .map((code) => `<li>${code.replaceAll("_", " ")}</li>`)
      .join("");
    $("deep").hidden = verdict.riskLevel === "safe";
    $("result").hidden = false;
    $("status").textContent = "";
  } catch (err) {
    // On-device unavailable (or App Check/config not set up yet): degrade
    // honestly to the rule-based list. The raw input stays on the device.
    console.warn("On-device classification unavailable:", err);
    const fallback = ruleBasedFallback(text);
    $("verdict").textContent = fallback.riskLevel.toUpperCase();
    $("verdict").className = "verdict " + fallback.riskLevel;
    renderBadge(null);
    $("explanation").textContent =
      "The on-device model is not available in this browser yet, so Guard ran its built-in checks instead. Your input was not sent anywhere.";
    $("reasons").innerHTML = fallback.reasons.map((r) => `<li>${r}</li>`).join("");
    $("deep").hidden = true;
    $("result").hidden = false;
    $("status").textContent = "";
  }
});

$("deep-btn").addEventListener("click", () => {
  // Full build: show the redaction/consent sheet, then call
  // deepAnalysis(redactedSummary) from ./guard.js and render the result in
  // #deep-result with an "Answered in the cloud" badge.
  $("deep-result").textContent =
    "Deep analysis arrives in the full build: you will see the exact redacted summary before anything is sent.";
});
