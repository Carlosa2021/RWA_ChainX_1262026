// Contract addresses configuration
export const CONTRACTS = {
  // Core infrastructure (update after deployment)
  identityRegistry: process.env.NEXT_PUBLIC_IDENTITY_REGISTRY || "",
  compliance: process.env.NEXT_PUBLIC_COMPLIANCE || "",
  projectRegistry: process.env.NEXT_PUBLIC_PROJECT_REGISTRY || "",
  projectTokenFactory: process.env.NEXT_PUBLIC_PROJECT_FACTORY || "",
  
  // Tokens
  usdc: process.env.NEXT_PUBLIC_USDC || "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  eurUsdFeed: process.env.NEXT_PUBLIC_EUR_USD_FEED || "0x73366Fe0AA0Ded304479862808e02506FE556a98",
} as const;

// App configuration
export const APP_CONFIG = {
  name: "ChainX RWA Platform",
  description: "Tokenización de activos del mundo real con ERC-3643",
  url: "https://chainx.ch",
  logo: "/logo.png",
} as const;
