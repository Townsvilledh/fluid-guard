// ============================================================================
// Firebase project config — the Fluid Guard project (projectId: fluid-guard).
//
// AI Logic is enabled on this project with the Gemini Developer API provider
// (free tier), and the App Check API is enabled. The values in a Firebase web
// config are client identifiers, not secrets — access is controlled by App
// Check and Firebase security rules.
//
// Forks: replace these values with your own project's config (Firebase
// console -> Project settings -> Your apps -> Web app). While the values
// contain "REPLACE_WITH", isFirebaseConfigured() below returns false and the
// app runs in demo mode instead of attempting any Firebase call.
// ============================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyD3wiyfoBE2QLSeZU0nkzRHDRcc93oRrV4",
  authDomain: "fluid-guard.firebaseapp.com",
  projectId: "fluid-guard",
  storageBucket: "fluid-guard.firebasestorage.app",
  messagingSenderId: "161610398780",
  appId: "1:161610398780:web:043260846d8040f7f71739",
};

// App Check debug token for local development and the hosted demo.
// App Check is enforced for AI Logic, so a debug token is required outside
// production attestation. Debug tokens are accepted in hackathon submissions.
//
//   - Set to `true` to have the SDK generate a token and print it in the
//     browser console ("AppCheck debug token: ..."), then register that token
//     in the Firebase console: Security -> App Check -> Apps -> your web app
//     -> Manage debug tokens.
//   - Or set it to a fixed token string you have already registered.
export const APP_CHECK_DEBUG_TOKEN = true;

// Cloud model used for the opt-in deep analysis.
// Originally gemini-3.8-flash (the model the API directed new projects to;
// gemini-2.5-flash 404s for new users). On 2026-11-21/22 the 3.8-flash
// route failed 11 consecutive deep-analysis calls — zero-byte HTTP 200s,
// 500/503s, generations that never completed — while gemini-3.5-flash-lite
// kept serving in the same sessions. The deep route was moved to
// gemini-3.5-flash-lite on 2026-11-22 after an end-to-end proof on a
// scratch build (deep result rendered, routing panel recorded in_cloud,
// ~2.2 s, inside the 45 s timeout). Deep analysis stays ONLY_IN_CLOUD and
// user-triggered on an approved redacted summary; only the model changed.
export const DEEP_ANALYSIS_MODEL = "gemini-3.5-flash-lite";

// reCAPTCHA site key for App Check in a production build (from the Firebase
// console: Security -> App Check -> register the reCAPTCHA provider).
// Leave empty while using the debug-token flow above: when
// FIREBASE_APPCHECK_DEBUG_TOKEN is set, the SDK exchanges the debug token
// instead of running attestation, and this key is not exercised.
// TODO(config): set the real site key for a production deployment.
export const APP_CHECK_SITE_KEY = "";

/**
 * True once the placeholder values above have been replaced with a real
 * Firebase project config. While this is false the app runs in demo mode:
 * no Firebase call is attempted, the built-in rule engine answers, and the
 * UI labels every answer as demo mode rather than faking AI output.
 */
export function isFirebaseConfigured() {
  const values = [
    firebaseConfig.apiKey,
    firebaseConfig.projectId,
    firebaseConfig.appId,
  ];
  return values.every(
    (value) => typeof value === "string" && !value.includes("REPLACE_WITH"),
  );
}
