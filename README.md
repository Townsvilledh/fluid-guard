# Fluid Guard

**A scam and transaction explainer for wallet users that thinks on your device first — private, free and offline — and only asks the cloud for help when you say so.**

Fluid Guard is a companion web app for self-custody wallet users (built for the [Fluid wallet](https://fluidwallet.dpdns.org) community). Paste a transaction summary, a token approval request, an address, or a suspicious message, and Guard explains — in plain language — what it is, how risky it looks, and what could go wrong if you sign it.

Guard can also **scan your wallet's existing token approvals**: paste a wallet address, pick a chain, and Guard reads that wallet's approval history from the public chain, checks which approvals are still active, and flags the dangerous ones — unlimited allowances to contracts it cannot recognise. Address only: no wallet connection, no signing, no seed phrase, ever.

The first pass runs **on your device** with Gemini Nano through the Firebase AI Logic Hybrid Inference SDK. Nothing sensitive leaves the device, it works offline, and it costs nothing to run. Only if you tap **Deep analysis** does a redacted summary — shown to you first — go to a cloud Gemini model for a deeper verdict. Every answer carries a badge, driven by the SDK's real `inferenceSource`, saying whether it was **answered on your device** or **answered in the cloud**.

> Built for [#BuildHybridAI 2026](https://firebasehybridaihackathon.devpost.com) (Web / Chrome category).

**Live demo: [Townsvilledh.github.io/fluid-guard](https://Townsvilledh.github.io/fluid-guard/)** — the hosted build runs in live mode against the fluid-guard Firebase project, with its App Check debug token registered, so the cloud routes (explanation fallback and opt-in deep analysis) work end to end.

## Why hybrid, and why here

Every other "AI scam checker" sends the sensitive data to a server to be checked. Guard inverts that:

- **Classification is `ONLY_ON_DEVICE`.** The SDK throws rather than falling back, so the privacy claim is enforced by the mode itself — the sensitive first pass *cannot* silently leave the device.
- **Explanations are `PREFER_ON_DEVICE`.** Short, single-turn text generation is Gemini Nano's strength: instant, free, offline.
- **Deep analysis is `ONLY_IN_CLOUD` and opt-in only.** It receives a redacted summary the user has seen and approved — never raw input, never automatically.
- **Follow-up chat is cloud-only, and labelled as such**, because multi-turn chat is not supported on-device in the SDK.

## Status

Complete, demo-ready build. The full product is in place: input flow with one-tap demo fixtures, verdict card, plain-language explanations, the opt-in deep-analysis consent flow, a persistent session routing panel, offline app-shell caching, honest degradation at every step — and the wallet approval scan described below.

This repo is configured for the live **fluid-guard** Firebase project (AI Logic enabled, Gemini Developer API provider, App Check API on), so the app attempts real Firebase AI Logic inference. Where a model route is unavailable at runtime — a browser without Gemini Nano, a stalled cloud call — Guard degrades to its built-in rule-based red-flag checks and labels the answer as such rather than faking AI output. Model calls carry a hard timeout (15 seconds; 45 for deep analysis) so a stalled route can never block a locally produced verdict.

**Demo mode:** if the config in `src/firebase-config.js` is replaced with placeholders (for example in a fork), the app runs in an explicitly labelled demo mode — no Firebase call is attempted, the rule engine answers, and a banner says so.

App Check: the hosted demo build carries a fixed App Check debug token that is registered in the Firebase console (App Check → Fluid Guard Web → "Fluid Guard demo"), and its cloud calls are verified working. The token lives only in the deployed bundle, never in this repo's source — `src/firebase-config.js` keeps `APP_CHECK_DEBUG_TOKEN` in generate-and-register mode (`true`) for local development (see Setup step 2).

Still outstanding:

- TODO(config): for a production deployment beyond the demo, register a reCAPTCHA provider and set `APP_CHECK_SITE_KEY` in `src/firebase-config.js`.

## Setup

To run against your own Firebase project instead of the bundled one:

### 1. Create the Firebase project (one-time, needs a Google account)

1. Sign in to the [Firebase console](https://console.firebase.google.com) and create a project (Google Analytics is not required).
2. Go to **AI Services → AI Logic → Get started** and run the guided workflow. Choose the **Gemini Developer API** provider (free tier). Register a Web app when prompted. The workflow automatically enforces **App Check** for AI Logic.
3. Copy your web app's `firebaseConfig` into `src/firebase-config.js`, replacing the existing values.

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
| Wallet approval scan | On this device — public chain reads + built-in checks | No AI model — public RPC reads, classified locally |

Key SDK surface used (Firebase JS SDK v12.5.0+): `getAI` with `GoogleAIBackend`, `getGenerativeModel` with `InferenceMode`, `model.initializeDeviceModel()` after a user interaction, `generateContent()` with an on-device `responseConstraint` schema for structured output, and `response.inferenceSource` (`"ON_DEVICE"` / `"IN_CLOUD"`) to render the routing badge. The default cloud fallback model is `gemini-3.5-flash-lite`; deep analysis overrides it via `inCloudParams`.

## Wallet approval scan

**Method.** For the chosen chain, Guard queries public JSON-RPC nodes for the wallet's ERC-20 `Approval` events (`eth_getLogs`, owner = the address) over a bounded lookback, then reads the **current** allowance of every (token, spender) pair with `eth_call` and keeps only allowances still above zero — an approval that was revoked or used up is history, not risk. Each active approval is classified locally with the same reason-code language as the checker:

- **DANGER** — unlimited allowance (≥ 2²⁵⁵, effectively unbounded) to a spender Guard cannot recognise.
- **CAUTION** — unlimited allowance to a recognised protocol, any allowance to an unrecognised spender, a very large finite allowance (≥ 1,000,000 tokens), or an allowance that could not be read back on-chain.
- **SAFE** — a finite, ordinary allowance to a recognised protocol (Uniswap routers and Permit2, 1inch, PancakeSwap, Aerodrome — a deliberately small list sourced from the protocols' own deployment docs; an unlisted spender is "unknown", never automatically "malicious").

Public RPC endpoints cap log ranges and throttle freely, so the scanner rotates endpoints, splits refused ranges, backs off when throttled — and records any range it could not scan as an explicit **gap**, shown in the result. A partial scan is reported as partial, never as complete. After the scan, the same opt-in deep analysis is offered: the consent sheet shows the exact scan summary (public chain data) before anything is sent to the cloud, and the routing panel logs the scan itself as a local call.

**Coverage limits (v1).** The lookback is bounded by block time and by what free public nodes will serve:

| Chain | Lookback | Why |
|---|---|---|
| Ethereum | ~12 months (2,628,000 blocks) | Archive-capable public endpoints exist |
| Base | ~12 months attempted (15,768,000 blocks) | Endpoint goodwill varies; gaps are reported |
| Arbitrum One | ~30 days (10,368,000 blocks) | ~0.25s blocks make a year ~126M blocks — public log queries will not serve that |
| BNB Smart Chain | ~90 days (2,592,000 blocks) | Dataseed endpoints cap `eth_getLogs` at ~5,000-block spans |

Not covered: approvals granted before the lookback, approvals on other chains (scan each chain separately), and NFT collection approvals (`setApprovalForAll`). A clean scan is a bounded statement — "no active approvals found in this range" — not a guarantee.

## Build and deploy

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

Deploy the contents of `dist/` to any static host — the build uses relative paths, so it works at a domain root or under a subpath. The live demo is served from this repo's `gh-pages` branch via GitHub Pages. Two notes for a hosted deployment:

- The service worker caches the app shell, so Guard **loads fully offline** after the first visit; on-device and local checks keep working with no connection, and only cloud deep analysis pauses.
- The hosted build's fixed App Check debug token must be registered in the Firebase console (Setup step 2) so its cloud calls pass App Check; the demo's token is already registered.

## Project structure

- `src/guard.js` — the Firebase AI Logic routing layer: the three model factories (`ONLY_ON_DEVICE` classification, `PREFER_ON_DEVICE` explanation, `ONLY_IN_CLOUD` deep analysis), timeouts, and the honest local fallback.
- `src/rules.js` — the built-in rule-based red-flag engine (demo mode and degraded mode) plus the redaction helpers behind the deep-analysis consent sheet.
- `src/fixtures.js` — the three one-tap demo fixtures.
- `src/scan.js` — the wallet approval scanner: public-RPC log scan with endpoint rotation, range splitting and explicit coverage gaps; current-allowance reads; local classification.
- `src/known.js` — the known-spender and known-token lists for the scan, sourced from the protocols' own deployment documentation.
- `src/main.js` / `src/style.css` / `index.html` — the interface, including the session routing panel.
- `public/sw.js` — the service worker that caches the app shell for offline use.

## Licence

MIT — see [LICENSE](LICENSE).
