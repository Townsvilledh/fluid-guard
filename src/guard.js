// Fluid Guard — Firebase AI Logic hybrid inference layer.
//
// Routing design (the hybrid routing is the product, not a checkbox):
//   - classify()        -> ONLY_ON_DEVICE. The sensitive first pass must never
//                          silently fall back to the cloud: if Gemini Nano is
//                          unavailable this does NOT send the raw input
//                          anywhere — it degrades to the built-in rule-based
//                          red-flag engine (rules.js) and reports
//                          inferenceSource "LOCAL_FALLBACK".
//   - explain()         -> PREFER_ON_DEVICE. Short single-turn explanations
//                          are Nano's strength; cloud fallback is acceptable
//                          here and the result reports which route served it.
//   - deepAnalysis()    -> ONLY_IN_CLOUD, user-triggered only, and only ever
//                          given a redacted summary the user has approved.
//
// Every result carries:
//   - requestedMode:   the InferenceMode the task was configured with;
//   - inferenceSource: what actually served it — "ON_DEVICE" | "IN_CLOUD"
//                      straight from the SDK response, or "LOCAL_FALLBACK"
//                      when the built-in rule engine answered instead;
//   - degraded:        true when the rule engine answered because no model
//                      route was available.
//
// Demo mode: while src/firebase-config.js still holds placeholder values,
// isFirebaseConfigured() is false and NO Firebase call is attempted. The rule
// engine answers and every result is marked demoMode: true, so the UI can
// label it plainly as "demo mode — Firebase not configured" instead of
// faking AI output.

import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  ReCaptchaV3Provider,
} from "firebase/app-check";
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
  APP_CHECK_SITE_KEY,
  DEEP_ANALYSIS_MODEL,
  isFirebaseConfigured,
} from "./firebase-config.js";
import { analyse } from "./rules.js";

export const DEMO_MODE = !isFirebaseConfigured();

/** Thrown by deepAnalysis() in demo mode: nothing was sent anywhere. */
export class DemoModeError extends Error {
  constructor() {
    super("Deep analysis is unavailable in demo mode (Firebase not configured).");
    this.name = "DemoModeError";
    this.code = "demo-mode";
  }
}

let ai = null;
let deviceModelReady = false;

// Model calls get a hard ceiling: a stalled cloud route (for example an
// App Check exchange that can never succeed) must not block a verdict the
// local route already produced. On timeout the caller's existing fallback
// engages — local checks for classify/explain, an honest failure notice
// for deep analysis.
const MODEL_TIMEOUT_MS = 15000;
const DEEP_TIMEOUT_MS = 45000;

function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(label + " timed out after " + ms + " ms.");
      error.name = "TimeoutError";
      error.code = "timeout";
      reject(error);
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function initAI() {
  if (ai) return ai;

  const app = initializeApp(firebaseConfig);

  // App Check debug provider: must be set BEFORE initializeAppCheck.
  // Debug tokens are for local development and the hackathon demo build and
  // are accepted in submissions; a production deployment registers the
  // reCAPTCHA provider instead (APP_CHECK_SITE_KEY in firebase-config.js).
  if (APP_CHECK_DEBUG_TOKEN) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = APP_CHECK_DEBUG_TOKEN;
  }
  initializeAppCheck(app, {
    provider: APP_CHECK_SITE_KEY
      ? new ReCaptchaEnterpriseProvider(APP_CHECK_SITE_KEY)
      : new ReCaptchaV3Provider("fluid-guard-debug-token-flow"),
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

async function ensureDeviceModel(onProgress) {
  const model = classifierModel();
  await model.initializeDeviceModel((val) => {
    if (onProgress) onProgress(val);
  });
  deviceModelReady = true;
}

/**
 * Initialise the on-device model. Must be called after/on a user interaction
 * and before the first prompt request. Reports download progress (0..1).
 * Never throws: resolves to { ok: true } or { ok: false, error } so the UI
 * can reflect availability without breaking the check flow. In demo mode it
 * is a no-op (there is no Firebase project to initialise against).
 */
export async function warmUpDeviceModel(onProgress) {
  if (DEMO_MODE) return { ok: false, demoMode: true };
  try {
    await ensureDeviceModel(onProgress);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

/**
 * Probe on-device model availability via the Chrome Prompt API, for the
 * status display. Returns "demo" in demo mode, otherwise the Prompt API
 * availability ("available" | "downloading" | "downloadable" |
 * "unavailable"), or "unknown" when the API cannot be queried.
 */
export async function probeDeviceModel() {
  if (DEMO_MODE) return "demo";
  try {
    if (typeof LanguageModel !== "undefined" && LanguageModel.availability) {
      return await LanguageModel.availability();
    }
  } catch {
    // Fall through: availability simply cannot be confirmed here.
  }
  return "unknown";
}

function localVerdict(text) {
  const { riskLevel, reasonCodes, summary } = analyse(text);
  return { riskLevel, reasonCodes, summary };
}

/**
 * On-device-only risk classification. If Gemini Nano is unavailable the raw
 * input is NEVER sent to the cloud — the rule engine answers locally and the
 * result is marked degraded with inferenceSource "LOCAL_FALLBACK".
 * @returns {Promise<{verdict: object, inferenceSource: string,
 *                    requestedMode: string, degraded: boolean,
 *                    demoMode: boolean}>}
 */
export async function classify(text) {
  const requestedMode = "ONLY_ON_DEVICE";
  if (DEMO_MODE) {
    return {
      verdict: localVerdict(text),
      inferenceSource: "LOCAL_FALLBACK",
      requestedMode,
      degraded: true,
      demoMode: true,
    };
  }
  try {
    if (!deviceModelReady) await ensureDeviceModel();
    const model = classifierModel();
    const prompt = [
      "You are a security checker inside a crypto wallet.",
      "Classify the following transaction, approval request or message.",
      "Respond only with the structured verdict.",
      "",
      text,
    ].join("\n");
    const result = await withTimeout(
      model.generateContent(prompt),
      MODEL_TIMEOUT_MS,
      "On-device classification",
    );
    return {
      verdict: JSON.parse(result.response.text()),
      inferenceSource: result.response.inferenceSource, // "ON_DEVICE"
      requestedMode,
      degraded: false,
      demoMode: false,
    };
  } catch (error) {
    console.warn("On-device classification unavailable, using local checks:", error);
    return {
      verdict: localVerdict(text),
      inferenceSource: "LOCAL_FALLBACK",
      requestedMode,
      degraded: true,
      demoMode: false,
    };
  }
}

/**
 * Plain-language explanation of a verdict. Prefers on-device; may be served
 * by the cloud fallback if Nano is unavailable — check inferenceSource.
 * If no model route works at all, the rule engine's explanation is used and
 * the result is marked degraded.
 */
export async function explain(text, verdict) {
  const requestedMode = "PREFER_ON_DEVICE";
  if (DEMO_MODE) {
    return {
      text: analyse(text).explanation,
      inferenceSource: "LOCAL_FALLBACK",
      requestedMode,
      degraded: true,
      demoMode: true,
    };
  }
  try {
    const model = explainerModel();
    const prompt = [
      "Explain, in plain language a beginner can understand, what this wallet",
      "transaction or message is and why it was rated " + verdict.riskLevel + ".",
      "Keep it under 120 words. Do not repeat the raw input verbatim.",
      "",
      text,
    ].join("\n");
    const result = await withTimeout(
      model.generateContent(prompt),
      MODEL_TIMEOUT_MS,
      "Explanation",
    );
    return {
      text: result.response.text(),
      inferenceSource: result.response.inferenceSource, // "ON_DEVICE" | "IN_CLOUD"
      requestedMode,
      degraded: false,
      demoMode: false,
    };
  } catch (error) {
    console.warn("Model explanation unavailable, using local checks:", error);
    return {
      text: analyse(text).explanation,
      inferenceSource: "LOCAL_FALLBACK",
      requestedMode,
      degraded: true,
      demoMode: false,
    };
  }
}

/**
 * Opt-in deep analysis in the cloud. ONLY ever pass a redacted summary that
 * the user has seen and approved — never the raw input.
 * Throws DemoModeError in demo mode (nothing is sent).
 */
export async function deepAnalysis(redactedSummary) {
  const requestedMode = "ONLY_IN_CLOUD";
  if (DEMO_MODE) throw new DemoModeError();
  const model = deepAnalysisModel();
  const prompt = [
    "You are a smart-contract security analyst. Analyse this redacted summary",
    "of a wallet transaction or approval. Explain what it actually does, the",
    "worst case if signed, and the exact steps the user should take next.",
    "",
    redactedSummary,
  ].join("\n");
  const result = await withTimeout(
    model.generateContent(prompt),
    DEEP_TIMEOUT_MS,
    "Deep analysis",
  );
  return {
    text: result.response.text(),
    inferenceSource: result.response.inferenceSource, // "IN_CLOUD"
    requestedMode,
    degraded: false,
    demoMode: false,
  };
}
