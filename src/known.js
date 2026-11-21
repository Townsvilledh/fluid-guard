// Fluid Guard — known spenders and known tokens for the wallet scan.
//
// The lists are deliberately SMALL and every entry is sourced from the
// protocol's own documentation or deployment tables (Uniswap developer
// docs, 1inch deployment tables, PancakeSwap and Aerodrome contract
// references). An address that is NOT on this list is reported as
// "unknown" — never as "malicious". Being unknown is common and often
// legitimate (small protocols, newer routers, personal contracts); it
// simply means Guard cannot vouch for who the spender is.
//
// All keys are lowercase addresses.

// Spenders deployed at the same address on every supported chain.
const COMMON_SPENDERS = {
  "0x000000000022d473030f116ddee9f6b43ac78ba3": "Uniswap Permit2",
  "0x111111125421ca6dc452d289314280a0f8842a65": "1inch Aggregation Router V6",
  "0x1111111254fb6c44bac0bed2854e76f90643097d": "1inch Aggregation Router V5",
};

export const KNOWN_SPENDERS = {
  ethereum: {
    ...COMMON_SPENDERS,
    "0xe592427a0aece92de3edee1f18e0157c05861564": "Uniswap V3 SwapRouter",
    "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": "Uniswap SwapRouter02",
    "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad": "Uniswap Universal Router",
    "0x66a9893cc07d91d95644aedd05d03f95e1dba8af": "Uniswap Universal Router",
    "0x23617e59a5925b2a4bf75d73ff6711cd0b29de85": "Uniswap Universal Router 2.1.2",
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": "Uniswap V2 Router02",
  },
  base: {
    ...COMMON_SPENDERS,
    "0x2626664c2603336e57b271c5c0b26f421741e481": "Uniswap SwapRouter02",
    "0x6ff5693b99212da76ad316178a184ab56d299b43": "Uniswap Universal Router",
    "0x198ef79f1f515f02dfe9e3115ed9fc07183f02fc": "Uniswap Universal Router",
    "0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43": "Aerodrome Router",
  },
  arbitrum: {
    ...COMMON_SPENDERS,
    "0xe592427a0aece92de3edee1f18e0157c05861564": "Uniswap V3 SwapRouter",
    "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": "Uniswap SwapRouter02",
    "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad": "Uniswap Universal Router",
    "0xa51afafe0263b40edaef0df8781ea9aa03e381a3": "Uniswap Universal Router v2",
    "0x2d01411773c8c24805306e89a41f7855c3c4fe65": "Uniswap Universal Router 2.1.2",
  },
  bsc: {
    ...COMMON_SPENDERS,
    "0x10ed43c718714eb63d5aa57b78b54704e256024e": "PancakeSwap V2 Router",
    "0x13f4ea83d0bd40e75c8222255bc855a974568dd4": "PancakeSwap V3 Smart Router",
    "0x1b81d678ffb9c0263b24a97847620c99d213eb14": "PancakeSwap V3 SwapRouter",
    "0xb971ef87ede563556b2ed4b1c0b0019111dd85d2": "Uniswap SwapRouter02",
    "0x5302086a3a25d473aabbd0356eff8dd811a4d89b": "Uniswap Universal Router",
  },
};

/** Name of a known spender on a chain, or null when Guard cannot vouch for it. */
export function knownSpender(chainId, address) {
  const table = KNOWN_SPENDERS[chainId];
  if (!table || typeof address !== "string") return null;
  return table[address.toLowerCase()] || null;
}

// Major, widely held tokens per chain. Used only to label an approval's
// token as a major asset vs "other token" — the on-chain symbol() read is
// always shown as well, and a token not listed here is not suspicious by
// itself.
export const KNOWN_TOKENS = {
  ethereum: {
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": { symbol: "USDC", name: "USD Coin" },
    "0xdac17f958d2ee523a2206206994597c13d831ec7": { symbol: "USDT", name: "Tether USD" },
    "0x6b175474e89094c44da98b954eedeac495271d0f": { symbol: "DAI", name: "Dai Stablecoin" },
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": { symbol: "WETH", name: "Wrapped Ether" },
    "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": { symbol: "WBTC", name: "Wrapped BTC" },
  },
  base: {
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": { symbol: "USDC", name: "USD Coin" },
    "0x4200000000000000000000000000000000000006": { symbol: "WETH", name: "Wrapped Ether" },
    "0x50c5725949a6f0c72e6c4a641f24049a917db0cb": { symbol: "DAI", name: "Dai Stablecoin" },
    "0x940181a94a35a4569e4529a3cdfb74e38fd98631": { symbol: "AERO", name: "Aerodrome" },
  },
  arbitrum: {
    "0xaf88d065e77c8cc2239327c5edb3a432268e5831": { symbol: "USDC", name: "USD Coin" },
    "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9": { symbol: "USD₮0", name: "Tether USD" },
    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1": { symbol: "WETH", name: "Wrapped Ether" },
    "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1": { symbol: "DAI", name: "Dai Stablecoin" },
    "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f": { symbol: "WBTC", name: "Wrapped BTC" },
    "0x912ce59144191c1204e64559fe8253a0e49e6548": { symbol: "ARB", name: "Arbitrum" },
  },
  bsc: {
    "0x55d398326f99059ff775485246999027b3197955": { symbol: "USDT", name: "Tether USD" },
    "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d": { symbol: "USDC", name: "USD Coin" },
    "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c": { symbol: "WBNB", name: "Wrapped BNB" },
    "0xe9e7cea3dedca5984780bafc599bd69add087d56": { symbol: "BUSD", name: "Binance USD" },
    "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82": { symbol: "Cake", name: "PancakeSwap Token" },
    "0x2170ed0880ac9a755fd29b2688956bd959f933f8": { symbol: "ETH", name: "Ethereum Token" },
  },
};

/** { symbol, name } for a known major token on a chain, or null. */
export function knownToken(chainId, address) {
  const table = KNOWN_TOKENS[chainId];
  if (!table || typeof address !== "string") return null;
  return table[address.toLowerCase()] || null;
}
