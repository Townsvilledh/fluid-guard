// Fluid Guard — built-in rule-based red-flag engine.
//
// This engine is the honest safety net, not the product. It runs in two
// situations:
//   1. Demo mode — no Firebase project is configured, so no AI model can be
//      called at all. The UI labels every answer from this engine plainly.
//   2. Degraded mode — Firebase is configured, but the on-device model is
//      unavailable and the cloud cannot be reached either. Rather than fail
//      silently, Guard shows these basic checks and says so.
//
// Everything here is deterministic pattern matching on the text the user
// pasted. Nothing is sent anywhere. Reason codes match the structured-output
// schema used by the on-device classifier in guard.js, so both paths speak
// the same language.

const RULES = [
  {
    code: "seed_phrase_request",
    label: "Asks for a seed phrase or private key",
    severity: 3,
    pattern:
      /seed phrase|recovery phrase|private key|secret recovery|12[-\s]?word|24[-\s]?word|mnemonic/i,
    advice:
      "No legitimate wallet, exchange or support team will ever ask for your seed phrase or private key. Anyone who has it can take everything, and no one can undo that.",
  },
  {
    code: "drainer_pattern",
    label: "Matches a known wallet-drainer pattern",
    severity: 3,
    pattern:
      /verify your (wallet|account|seed)|claim your (airdrop|reward|refund)|wallet (has been|is) flagged|connect your wallet to (verify|claim)|double your (btc|eth|crypto)/i,
    advice:
      "“Verify”, “claim” and “flagged wallet” pages are the standard front end of a wallet drainer: the site gets you to sign or connect, then empties the wallet in one transaction.",
  },
  {
    code: "unlimited_approval",
    label: "Unlimited token approval",
    severity: 3,
    pattern:
      /unlimited|infinite approval|max(?:imum)?\s*(?:amount|approval)|115792089237316195423570985008687907853269984665640564039457584007913129639935/i,
    advice:
      "An unlimited approval lets the spender move your tokens at any time, without asking again — including months later, or after the site is sold or hacked. Approving a limited amount, or refusing, is far safer.",
  },
  {
    code: "urgency_pressure",
    label: "Urgency and pressure tactics",
    severity: 2,
    pattern:
      /urgent|act now|immediately|within \d+\s*(minutes|mins|hours)|will be frozen|will be (closed|suspended|deleted)|last chance|expires (in|soon)|do not (tell|share)/i,
    advice:
      "Real security processes do not rush you with countdowns. Pressure is there to stop you checking — treat any deadline in a message as a red flag in itself.",
  },
  {
    code: "unverified_contract",
    label: "Unverified or unknown contract",
    severity: 2,
    pattern: /unverified contract|unknown contract|not verified|new contract|unaudited/i,
    advice:
      "An unverified contract means nobody can read what the code actually does. Interacting with one is trusting a stranger's say-so with your funds.",
  },
  {
    code: "unknown_spender",
    label: "Spender you cannot identify",
    severity: 2,
    pattern:
      /spender|approve|allowance/i,
    advice:
      "Before approving, make sure you can name exactly who or what will be able to move your tokens, and why. If the spender is not a service you deliberately chose, do not approve.",
    // Only meaningful alongside an approval context; weighted by analyse().
    needsApprovalContext: true,
  },
  {
    code: "unusual_amount",
    label: "Unusually large amount",
    severity: 1,
    pattern: /\b\d{1,3}(?:,\d{3}){2,}\b|\b\d{7,}\b/,
    advice:
      "Very large amounts deserve a second look: check the digits, the destination and whether a smaller test transaction should go first.",
  },
];

// An approval context makes the unknown-spender rule meaningful; a plain
// transfer that merely contains the word "approve" in passing should not be
// flagged for it.
function hasApprovalContext(text) {
  return /approv|allowance|spender|setApprovalForAll/i.test(text);
}

function looksLikePlainTransfer(text, hits) {
  if (hits.length > 0) return false;
  if (!/transfer|send|sending/i.test(text)) return false;
  // An approval request or contract interaction dressed up as a transfer is
  // not plain. (Negated mentions — "no token approval, no contract
  // interaction" — are exactly what a plain transfer says, so they pass.)
  if (/approval request|interact with|interaction with|sign this message/i.test(text)) {
    return false;
  }
  return true;
}

/**
 * Analyse pasted text with the rule engine.
 * @returns {{riskLevel: string, reasonCodes: string[], reasons: string[],
 *            summary: string, explanation: string}}
 */
export function analyse(text) {
  const hits = RULES.filter((rule) => {
    if (rule.needsApprovalContext && !hasApprovalContext(text)) return false;
    return rule.pattern.test(text);
  });

  const severity = hits.reduce((sum, rule) => sum + rule.severity, 0);
  const hasCritical = hits.some((rule) => rule.severity >= 3);

  let riskLevel;
  if (hasCritical || severity >= 4) riskLevel = "danger";
  else if (hits.length > 0) riskLevel = "caution";
  else riskLevel = "safe";

  const reasonCodes = hits.length
    ? hits.map((rule) => rule.code)
    : ["none"];
  const reasons = hits.map((rule) => rule.label);

  let summary;
  let explanation;
  if (riskLevel === "danger") {
    summary =
      "This looks dangerous. Do not sign, approve or act on it until you understand exactly what it does.";
    explanation = [
      "Guard's checks found serious red flags here.",
      ...hits.map((rule) => rule.advice),
      "The safe move is to stop, close the page or message, and check through a route you trust — type the official address yourself rather than following any link in the message.",
    ].join(" ");
  } else if (riskLevel === "caution") {
    summary =
      "There are things here worth a careful second look before you go ahead.";
    explanation = [
      "Nothing here is proof of a scam, but Guard's checks found points to verify.",
      ...hits.map((rule) => rule.advice),
      "If everything checks out — the site is the real one, the amounts are what you expect, and you chose this action yourself — it is reasonable to proceed carefully.",
    ].join(" ");
  } else if (looksLikePlainTransfer(text, hits)) {
    summary = "This looks like an ordinary transfer.";
    explanation =
      "This reads as a plain transfer of funds to an address, with no token approval, no contract interaction and none of the usual scam patterns — no seed-phrase request, no urgency pressure, no suspicious link. As always, confirm the destination address character by character before sending: transfers cannot be reversed.";
  } else {
    summary = "No known red flags were found in this text.";
    explanation =
      "Guard's checks found none of the common scam patterns here — no seed-phrase request, no unlimited approval, no urgency pressure and no drainer-style wording. That is not a guarantee of safety: always confirm you are on the real site or app, and that the amounts and destination are exactly what you intend.";
  }

  return { riskLevel, reasonCodes, reasons, summary, explanation };
}

/**
 * Redact a raw input into the summary form that deep analysis is allowed to
 * see. Addresses, links, amounts and contact details are replaced with
 * placeholders; the red-flag findings are described, never quoted verbatim
 * where they carry identifiers.
 */
export function redact(text) {
  return text
    .replace(/https?:\/\/[^\s)]+/gi, "[link]")
    .replace(/\bwww\.[^\s)]+/gi, "[link]")
    .replace(
      /\b(?:[a-z0-9-]+\.)+(?:com|net|org|io|xyz|site|online|info|app|dev|co|example|finance|exchange|pro|live|click|link|page|space|fun|club|vip|top|icu)\b(?:\/[^\s)]*)?/gi,
      "[link]",
    )
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.]+\b/g, "[email]")
    .replace(/0x[0-9a-fA-F]{6,}/g, "[address]")
    .replace(/\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g, "[address]")
    .replace(/\bbc1[a-z0-9]{20,}\b/gi, "[address]")
    .replace(/\b\d{1,3}(?:,\d{3}){2,}(?:\.\d+)?\b/g, "[large amount]")
    .replace(/\b\d{7,}\b/g, "[large number]")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Build the exact redacted summary shown to the user in the consent sheet —
 * this string, and nothing else, is what deep analysis receives on approval.
 */
export function buildRedactedSummary(text) {
  const { riskLevel, reasons } = analyse(text);
  const lines = [
    "Redacted summary of a wallet item a user is about to act on.",
    `Initial on-device verdict: ${riskLevel.toUpperCase()}.`,
    reasons.length
      ? `Red flags found: ${reasons.join("; ")}.`
      : "Red flags found: none.",
    "Content with identifiers removed:",
    redact(text),
  ];
  return lines.join("\n");
}
