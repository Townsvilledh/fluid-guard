# Fluid Guard

**A scam and transaction explainer for wallet users that thinks on your device first — private, free and offline — and only asks the cloud for help when you say so.**

Fluid Guard is a companion web app for self-custody wallet users (built for the [Fluid wallet](https://fluidwallet.dpdns.org) community). Paste a transaction summary, a token approval request, an address, or a suspicious message, and Guard explains — in plain language — what it is, how risky it looks, and what could go wrong if you sign it.

The first pass runs **on your device** with Gemini Nano through the Firebase AI Logic Hybrid Inference SDK. Nothing sensitive leaves the device, it works offline, and it costs nothing to run. Only if you tap **Deep analysis** does a redacted summary — shown to you first — go to a cloud Gemini model for a deeper verdict. Every answer carries a badge, driven by the SDK's real `inferenceSource`, saying whether it was **answered on your device** or **answered in the cloud**.

> Built for [#BuildHybridAI 2026](https://firebasehybridaihackathon.devpost.com) (Web / Chrome category).

## Why hybrid, and why here

Every other "AI scam checker" sends the sensitive data to a server to be checked. Guard inverts that:

- **Classification is `ONLY_ON_DEVICE`.** The SDK throws rather than falling back, so the privacy claim is enforced by the mode itself — the sensitive first pass *cannot* silently leave the device.
- **Explanations are `PREFER_ON_DEVICE`.** Short, single-turn text generation is Gemini Nano's strength: instant, free, offline.
- **Deep analysis is `ONLY_IN_CLOUD` and opt-in only.** It receives a redacted summary the user has seen and approved — never raw input, never automatically.
- **Follow-up chat is cloud-only, and labelled as such**, because multi-turn chat is not supported on-device in the SDK.

## Status

Scaffold (pass 1). The app shell, routing layer and Firebase AI Logic integration points are in place; the Firebase project configuration is a placeholder (see Setup). The full build — classification prompts, structured-output schema, demo fixtures, routing panel — lands during the Sprint 2 build weekend.

## Setup

### 1. Create the Firebase project (one-time, needs a Google account)

1. Sign in to the [Firebase console](https://console.firebase.google.com) and create a project (Google Analytics is not required).
2. Go to **AI Services → AI Logic → Get started** and run the guided workflow. Choose the **Gemini Developer API** provider (free tier). Register a Web app when prompted. The workflow automatically enforces **App Check** for AI Logic.
3. Copy your web app's `firebaseConfig` into `src/firebase-config.js`, replacing the placeholder values.

### 2. Register an App Check debug token

App Check is enforced, so local and demo builds use the debug provider (debug tokens are accepted in hackathon submissions):

1. In `src/firebase-config.js`, set `APP_CHECK_DEBUG_TOKEN` to `true` (generates a token in the browser console) or to a fixed token string.
2. Run the app, open DevTools, and copy the printed `AppCheck debug token: "..."`.
3. In the Firebase console: **Security → App Check → Apps** → your web app → **Manage debug tokens** → register the token.

### 3. Enable on-device inference in Chrome

On-device inference needs **Chrome on Desktop, version 139 or higher**:

1. Open `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`, set it to **Enabled**, and restart Chrome.
2. The first on-device request starts the Gemini Nano model download in the background; the app shows download progress. (In DevTools you can check `await LanguageModel.availability()`.)

### 4. Run

```bash
npm install
npm run dev
```

Open the printed localhost URL in Chrome, paste one of the built-in demo fixtures (or your own transaction text), and press **Check this**.

## How it works

| Task | Route | SDK mode |
|---|---|---|
| Risk classification (safe / caution / danger + reason codes, structured JSON) | On-device (Gemini Nano) | `ONLY_ON_DEVICE` |
| Plain-language explanation of the verdict | On-device first | `PREFER_ON_DEVICE` |
| Deep analysis (opt-in, redacted summary only) | Cloud Gemini | `ONLY_IN_CLOUD` |
| Follow-up questions | Cloud Gemini (labelled) | `ONLY_IN_CLOUD` |

Key SDK surface used (Firebase JS SDK v12.5.0+): `getAI` with `GoogleAIBackend`, `getGenerativeModel` with `InferenceMode`, `model.initializeDeviceModel()` after a user interaction, `generateContent()` with an on-device `responseConstraint` schema for structured output, and `response.inferenceSource` (`"ON_DEVICE"` / `"IN_CLOUD"`) to render the routing badge. The default cloud fallback model is `gemini-3.5-flash-lite`; deep analysis overrides it via `inCloudParams`.

## Licence

MIT — see [LICENSE](LICENSE).
