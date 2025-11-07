import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

/**
 * Script para deployar la suite completa de ERC-3643 oficial
 * Orden de deployment siguiendo dependencias:
 * 1. IdentityRegistryStorage
 * 2. ClaimTopicsRegistry
 * 3. TrustedIssuersRegistry
 * 4. IdentityRegistry (usa los 3 anteriores)
 * 5. ModularCompliance
 * 6. Token (usa IdentityRegistry y Compliance)
 * 7. InvestmentController (usa Token)
 */

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying ERC-3643 suite with account:", deployer.address);
  console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Parámetros del token (pueden venir por ENV para reusabilidad)
  const TOKEN_NAME = process.env.TOKEN_NAME ?? "ChainX Test InmoToken";
  const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL ?? "CXIMT";
  const TOKEN_DECIMALS = Number(process.env.TOKEN_DECIMALS ?? 0);
  const ONCHAIN_ID = (process.env.TOKEN_ONCHAIN_ID as `0x${string}`) ?? ethers.ZeroAddress; // opcional

  // Parámetros del InvestmentController (por defecto en Polygon)
  const USDC_ADDRESS = (process.env.USDC_ADDRESS as `0x${string}`) ?? "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Polygon USDC
  const EUR_USD_FEED = (process.env.EUR_USD_FEED as `0x${string}`) ?? "0x73366Fe0AA0Ded304479862808e02506FE556a98"; // Chainlink EUR/USD
  const TREASURY = (process.env.TREASURY as `0x${string}`) ?? deployer.address;
  const PRICE_EUR_CENTS = Number(process.env.PRICE_EUR_CENTS ?? 100); // 1 EUR
  const HARD_CAP = Number(process.env.HARD_CAP ?? 100); // 100 tokens

  console.log("\n📋 Deployment Parameters:");
  console.log("Token:", TOKEN_NAME, `(${TOKEN_SYMBOL})`);
  console.log("Price:", PRICE_EUR_CENTS / 100, "EUR per token");
  console.log("Hard Cap:", HARD_CAP, "tokens");
  console.log("Treasury:", TREASURY);

  // 1. Deploy IdentityRegistryStorage
  console.log("\n1️⃣  Deploying IdentityRegistryStorage...");
  const IdentityRegistryStorage = await ethers.getContractFactory("DeployableIdentityRegistryStorage");
  const identityStorage = await IdentityRegistryStorage.deploy();
  await identityStorage.waitForDeployment();
  const identityStorageAddress = await identityStorage.getAddress();
  console.log("✅ IdentityRegistryStorage:", identityStorageAddress);

  // 2. Deploy ClaimTopicsRegistry
  console.log("\n2️⃣  Deploying ClaimTopicsRegistry...");
  const ClaimTopicsRegistry = await ethers.getContractFactory("DeployableClaimTopicsRegistry");
  const claimTopics = await ClaimTopicsRegistry.deploy();
  await claimTopics.waitForDeployment();
  const claimTopicsAddress = await claimTopics.getAddress();
  console.log("✅ ClaimTopicsRegistry:", claimTopicsAddress);

  // 3. Deploy TrustedIssuersRegistry
  console.log("\n3️⃣  Deploying TrustedIssuersRegistry...");
  const TrustedIssuersRegistry = await ethers.getContractFactory("DeployableTrustedIssuersRegistry");
  const trustedIssuers = await TrustedIssuersRegistry.deploy();
  await trustedIssuers.waitForDeployment();
  const trustedIssuersAddress = await trustedIssuers.getAddress();
  console.log("✅ TrustedIssuersRegistry:", trustedIssuersAddress);

  // 4. Deploy IdentityRegistry
  console.log("\n4️⃣  Deploying IdentityRegistry...");
  const IdentityRegistry = await ethers.getContractFactory("DeployableIdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.waitForDeployment();
  const identityRegistryAddress = await identityRegistry.getAddress();
  console.log("✅ IdentityRegistry deployed:", identityRegistryAddress);

  // Initialize IdentityRegistry
  console.log("🔧 Initializing IdentityRegistry...");
  const initTx = await identityRegistry.init(
    trustedIssuersAddress,
    claimTopicsAddress,
    identityStorageAddress
  );
  await initTx.wait();
  console.log("✅ IdentityRegistry initialized");

  // Bind IdentityRegistry to Storage
  console.log("🔗 Binding IdentityRegistry to Storage...");
  const tx1 = await identityStorage.bindIdentityRegistry(identityRegistryAddress);
  await tx1.wait();
  console.log("✅ Binding complete");

  // 5. Deploy ModularCompliance
  console.log("\n5️⃣  Deploying ModularCompliance...");
  const ModularCompliance = await ethers.getContractFactory("DeployableModularCompliance");
  const compliance = await ModularCompliance.deploy();
  await compliance.waitForDeployment();
  const complianceAddress = await compliance.getAddress();
  console.log("✅ ModularCompliance:", complianceAddress);

  // 6. Deploy Token
  console.log("\n6️⃣  Deploying Token...");
  const Token = await ethers.getContractFactory("DeployableToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token deployed:", tokenAddress);

  // Initialize Token
  console.log("🔧 Initializing Token...");
  const tx2 = await token.init(
    identityRegistryAddress,
    complianceAddress,
    TOKEN_NAME,
    TOKEN_SYMBOL,
    TOKEN_DECIMALS,
    ONCHAIN_ID
  );
  await tx2.wait();
  console.log("✅ Token initialized");

  // 7. Deploy InvestmentController
  console.log("\n7️⃣  Deploying InvestmentController...");
  const InvestmentController = await ethers.getContractFactory("ChainXInvestmentController");
  const investmentController = await InvestmentController.deploy(
    tokenAddress,
    USDC_ADDRESS,
    TREASURY,
    EUR_USD_FEED,
    PRICE_EUR_CENTS,
    HARD_CAP
  );
  await investmentController.waitForDeployment();
  const investmentControllerAddress = await investmentController.getAddress();
  console.log("✅ InvestmentController:", investmentControllerAddress);

  // 8. Mint tokens to InvestmentController
  console.log("\n8️⃣  Minting tokens to InvestmentController...");
  const tx3 = await token.mint(investmentControllerAddress, HARD_CAP);
  await tx3.wait();
  console.log("✅ Minted", HARD_CAP, "tokens to InvestmentController");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📝 Contract Addresses:");
  console.log("IdentityRegistryStorage:", identityStorageAddress);
  console.log("ClaimTopicsRegistry:", claimTopicsAddress);
  console.log("TrustedIssuersRegistry:", trustedIssuersAddress);
  console.log("IdentityRegistry:", identityRegistryAddress);
  console.log("ModularCompliance:", complianceAddress);
  console.log("Token:", tokenAddress);
  console.log("InvestmentController:", investmentControllerAddress);

  console.log("\n📋 Update your .env.local with:");
  console.log(`NEXT_PUBLIC_IDENTITY_REGISTRY_STORAGE=${identityStorageAddress}`);
  console.log(`NEXT_PUBLIC_CLAIM_TOPICS_REGISTRY=${claimTopicsAddress}`);
  console.log(`NEXT_PUBLIC_TRUSTED_ISSUERS_REGISTRY=${trustedIssuersAddress}`);
  console.log(`NEXT_PUBLIC_IDENTITY_REGISTRY=${identityRegistryAddress}`);
  console.log(`NEXT_PUBLIC_COMPLIANCE=${complianceAddress}`);
  console.log(`NEXT_PUBLIC_SECURITY_TOKEN=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_INVESTMENT_CONTROLLER=${investmentControllerAddress}`);

  // Guardar artefacto de deployment para referencia y para thirdweb metadata
  const outDir = path.resolve(__dirname, "../deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(outDir, `erc3643-${stamp}.json`);
  const payload = {
    network: (await ethers.provider.getNetwork()).name,
    deployer: deployer.address,
    token: {
      name: TOKEN_NAME,
      symbol: TOKEN_SYMBOL,
      decimals: TOKEN_DECIMALS,
    },
    addresses: {
      identityRegistryStorage: identityStorageAddress,
      claimTopicsRegistry: claimTopicsAddress,
      trustedIssuersRegistry: trustedIssuersAddress,
      identityRegistry: identityRegistryAddress,
      modularCompliance: complianceAddress,
      token: tokenAddress,
      investmentController: investmentControllerAddress,
    },
    controllerParams: {
      usdc: USDC_ADDRESS,
      eurUsdFeed: EUR_USD_FEED,
      treasury: TREASURY,
      priceEuroCents: PRICE_EUR_CENTS,
      hardCap: HARD_CAP,
    },
  } as const;
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`\n🗂️  Deployment file saved at: ${outPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
