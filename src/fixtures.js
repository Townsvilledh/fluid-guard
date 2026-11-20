// Fluid Guard — built-in demo fixtures.
//
// One-tap examples so anyone (including judges) can exercise the full flow
// without inventing input. The texts are realistic examples of what a wallet
// user actually sees: a malicious unlimited approval, a drainer-style
// message, and an ordinary transfer for contrast.

export const FIXTURES = [
  {
    id: "approval",
    label: "Malicious approval",
    kind: "Token approval request",
    text: [
      "Token approval request",
      "From: swap-rewards.example.com — unverified contract",
      "Action: approve — give spender 0x7f3a9c4b2d8e1f0a5c6b9d3e7f2a4c8b1d5e9f03 permission to spend your USDT.",
      "Amount: UNLIMITED (115792089237316195423570985008687907853269984665640564039457584007913129639935)",
      "Your tokens stay in your wallet, but the spender can move them at any time without asking again.",
    ].join("\n"),
  },
  {
    id: "message",
    label: "Drainer message",
    kind: "Suspicious message",
    text: [
      "URGENT — Fluid Security Team: your wallet has been flagged for suspicious activity.",
      "Verify your seed phrase within 10 minutes at fluid-verify.example.com or your funds will be frozen permanently.",
      "Act now. Do not share this message with anyone.",
    ].join("\n"),
  },
  {
    id: "plain",
    label: "Ordinary transfer",
    kind: "Plain transfer",
    text: [
      "Send 0.05 ETH to 0x0EBf5563F905E3B9D58718E28E08143511DC763b (saved contact) on Ethereum mainnet.",
      "Network fee: about 0.0004 ETH.",
      "This is a plain transfer — no token approval and no contract interaction.",
    ].join("\n"),
  },
];
