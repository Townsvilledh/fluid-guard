// Fluid Guard — Firebase AI Logic hybrid inference layer.
//
// Routing design (the hybrid routing is the product, not a checkbox):
//   - classify()        -> ONLY_ON_DEVICE. The sensitive first pass must never
//                          silently fall back to the cloud: if Gemini Nano is
//                          unavailable this throws, and the UI degrades to the
//                          built-in rule-based red-flag list instead.
//   - explain()         -> PREFER_ON_DEVICE. Short single-turn explanations
//                          are Nano's strength; cloud fallback is acceptable
//                          here and the badge reports which route served it.
//   - deepAnalysis()    -> ONLY_IN_CLOUD, user-triggered only, and only ever
//                          given a redacted summary the user has approved.
//
// Every result carries `inferenceSource` ("ON_DEVICE" | "IN_CLOUD") straight
// from the SDK response, which the UI renders as the routing badge.

import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  InferenceMode,
  Schema,
} from "firebase/ai";

import {
  firebaseConfig,
  APP_CHECK_DEBUG_TOKEN,
  DEEP_ANALYSIS_MODEL,
} from "./firebase-config.js";

let ai = null;
let deviceModelReady = false;

function initAI() {
  if (ai) return ai;

  const app = initializeApp(firebaseConfig);

  // App Check debug provider: must be set BEFORE initializeAppCheck.
  // In production this is replaced by a real attestation provider
  // (ReCaptchaEnterpriseProvider below); the debug token is for local
  // development and the hackathon demo build.
  if (APP_CHECK_DEBUG_TOKEN) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = APP_CHECK_DEBUG_TOKEN;
  }
  initializeAppCheck(app, {
    // TODO(production): replace with your reCAPTCHA Enterprise site key.
    provider: new ReCaptchaEnterpriseProvider("REPLACE_WITH_RECAPTCHA_SITE_KEY"),
    isTokenAutoRefreshEnabled: true,
  });

  ai = getAI(app, { backend: new GoogleAIBackend() });
  return ai;
}

// Structured verdict returned by the on-device classifier.
const verdictSchema = Schema.object({
  properties: {
    riskLevel: Schema.enumString({
      enum: ["safe", "caution", "danger"],
      description: "Overall risk of the transaction, approval or message.",
    }),
    reasonCodes: Schema.array({
      items: Schema.enumString({
        enum: [
          "unlimited_approval",
          "unknown_spender",
          "drainer_pattern",
          "urgency_pressure",
          "lookalike_address",
          "unverified_contract",
          "seed_phrase_request",
          "unusual_amount",
          "none",
        ],
      }),
      description: "Machine-readable red flags found in the input.",
    }),
    summary: Schema.string({
      description:
        "One or two plain-language sentences explaining the verdict for a non-technical wallet user.",
    }),
  },
  required: ["riskLevel", "reasonCodes", "summary"],
});

function classifierModel() {
  // MUST be created after/on a user interaction (SDK prerequisite for
  // inference modes). Callers invoke this from the button handler.
  return getGenerativeModel(initAI(), {
    mode: InferenceMode.ONLY_ON_DEVICE,
    onDeviceParams: {
      promptOptions: { responseConstraint: verdictSchema },
    },
  });
}

function explainerModel() {
  return getGenerativeModel(initAI(), {
    mode: InferenceMode.PREFER_ON_DEVICE,
  });
}

function deepAnalysisModel() {
  return getGenerativeModel(initAI(), {
    mode: InferenceMode.ONLY_IN_CLOUD,
    inCloudParams: { model: DEEP_ANALYSIS_MODEL },
  });
}

/**
 * Initialise the on-device model. Must be called after/on a user interaction
 * and before the first prompt request. Reports download progress (0..1).
 */
export async function warmUpDeviceModel(onProgress) {
  const model = classifierModel();
  await model.initializeDeviceModel((val) => {
    if (onProgress) onProgress(val);
  });
  deviceModelReady = true;
}

/**
 * On-device-only risk classification. Throws if Gemini Nano is unavailable —
 * the caller must NOT fall back to sending the raw input to the cloud.
 * @returns {Promise<{verdict: object, inferenceSource: string}>}
 */
export async function classify(text) {
  if (!deviceModelReady) await warmUpDeviceModel();
  const model = classifierModel();
  const prompt = [
    "You are a security checker inside a crypto wallet.",
    "Classify the following transaction, approval request or message.",
    "Respond only with the structured verdict.",
    "",
    text,
  ].join("\n");
  const result = await model.generateContent(prompt);
  return {
    verdict: JSON.parse(result.response.text()),
    inferenceSource: result.response.inferenceSource, // "ON_DEVICE"
  };
}

/**
 * Plain-language explanation of a verdict. Prefers on-device; may be served
 * by the cloud fallback if Nano is unavailable — check inferenceSource.
 */
export async function explain(text, verdict) {
  const model = explainerModel();
  const prompt = [
    "Explain, in plain language a beginner can understand, what this wallet",
    "transaction or message is and why it was rated " + verdict.riskLevel + ".",
    "Keep it under 120 words. Do not repeat the raw input verbatim.",
    "",
    text,
  ].join("\n");
  const result = await model.generateContent(prompt);
  return {
    text: result.response.text(),
    inferenceSource: result.response.inferenceSource, // "ON_DEVICE" | "IN_CLOUD"
  };
}

/**
 * Opt-in deep analysis in the cloud. ONLY ever pass a redacted summary that
 * the user has seen and approved — never the raw input.
 */
export async function deepAnalysis(redactedSummary) {
  const model = deepAnalysisModel();
  const prompt = [
    "You are a smart-contract security analyst. Analyse this redacted summary",
    "of a wallet transaction or approval. Explain what it actually does, the",
    "worst case if signed, and the exact steps the user should take next.",
    "",
    redactedSummary,
  ].join("\n");
  const result = await model.generateContent(prompt);
  return {
    text: result.response.text(),
    inferenceSource: result.response.inferenceSource, // "IN_CLOUD"
  };
}
