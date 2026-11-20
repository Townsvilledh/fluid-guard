// ============================================================================
// CONFIG PLACEHOLDER — replace these values with your own Firebase project.
//
// Setup (one-time, needs a signed-in Google session):
//   1. Create a project in the Firebase console
//      (https://console.firebase.google.com). Google Analytics is NOT needed.
//   2. Go to AI Services -> AI Logic -> "Get started" and run the guided
//      workflow. Choose the Gemini Developer API provider (free tier) and
//      register a Web app when prompted. The workflow automatically enforces
//      Firebase App Check for AI Logic.
//   3. Paste the web app config the console gives you below.
//
// The values in a Firebase web config are client identifiers, not secrets —
// access is controlled by App Check and Firebase security rules. Even so,
// keep real project values out of shared forks of this repo.
// ============================================================================

export const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
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

// Cloud model used for the opt-in deep analysis (overrides the SDK's default
// hybrid fallback model, gemini-3.5-flash-lite, for that route only).
export const DEEP_ANALYSIS_MODEL = "gemini-2.5-flash";
