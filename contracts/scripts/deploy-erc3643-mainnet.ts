import { ethers } from "hardhat";

/**
 * 🔥 DEPLOY ERC-3643 REAL TO POLYGON MAINNET 🔥
 * - NO Mock, NO Test, NO Simulación
 * - SecurityToken ERC-3643 completo
 * - IdentityRegistry para KYC
 * - Compliance Module
 * - InvestmentController con slippage 5%
 * - Owner: 0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca (TÚ)
 */

async function main() {
  console.log("\n🔥 DEPLOYING ERC-3643 REAL TO POLYGON MAINNET 🔥\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  // Verificar que eres TÚ
  if (deployer.address !== "0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca") {
    console.log("⚠️  WARNING: Expected deployer ending in ...21ca");
    console.log("Current deployer:", deployer.address);
  }
  
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  // MAINNET addresses
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Polygon USDC
  const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98"; // Chainlink EUR/USD
  
  // 1. Deploy IdentityRegistryStorage
  console.log("📦 Deploying IdentityRegistryStorage...");
  const IdentityRegistryStorage = await ethers.getContractFactory("IdentityRegistryStorage");
  const idStorage = await IdentityRegistryStorage.deploy();
  await idStorage.waitForDeployment();
  const idStorageAddress = await idStorage.getAddress();
  console.log("✅ IdentityRegistryStorage:", idStorageAddress);

  // 2. Deploy TrustedIssuersRegistry
  console.log("\n🏛️ Deploying TrustedIssuersRegistry...");
  const TrustedIssuersRegistry = await ethers.getContractFactory("TrustedIssuersRegistry");
  const trustedIssuers = await TrustedIssuersRegistry.deploy();
  await trustedIssuers.waitForDeployment();
  const trustedIssuersAddress = await trustedIssuers.getAddress();
  console.log("✅ TrustedIssuersRegistry:", trustedIssuersAddress);

  // 3. Deploy ClaimTopicsRegistry
  console.log("\n📋 Deploying ClaimTopicsRegistry...");
  const ClaimTopicsRegistry = await ethers.getContractFactory("ClaimTopicsRegistry");
  const claimTopics = await ClaimTopicsRegistry.deploy();
  await claimTopics.waitForDeployment();
  const claimTopicsAddress = await claimTopics.getAddress();
  console.log("✅ ClaimTopicsRegistry:", claimTopicsAddress);

  // 4. Deploy IdentityRegistry
  console.log("\n🆔 Deploying IdentityRegistry...");
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy(
    trustedIssuersAddress,
    claimTopicsAddress,
    idStorageAddress
  );
  await identityRegistry.waitForDeployment();
  const identityRegistryAddress = await identityRegistry.getAddress();
  console.log("✅ IdentityRegistry:", identityRegistryAddress);

  // 5. Deploy Compliance Module
  console.log("\n⚖️ Deploying Compliance Module...");
  const Compliance = await ethers.getContractFactory("Compliance");
  const compliance = await Compliance.deploy();
  await compliance.waitForDeployment();
  const complianceAddress = await compliance.getAddress();
  console.log("✅ Compliance:", complianceAddress);

  // 6. Deploy SecurityToken ERC-3643 REAL
  console.log("\n🪙 Deploying SecurityToken (ERC-3643 REAL)...");
  const SecurityToken = await ethers.getContractFactory("SecurityToken");
  const token = await SecurityToken.deploy(
    "Real Estate Token", // name
    "RET",              // symbol
    0,                  // decimals (tokens indivisibles)
    identityRegistryAddress,
    complianceAddress,
    "https://chainx.ch/token-metadata" // tokenURI
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ SecurityToken (ERC-3643):", tokenAddress);

  // 7. Deploy ProjectRegistry
  console.log("\n📋 Deploying ProjectRegistry...");
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const registry = await ProjectRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ ProjectRegistry:", registryAddress);

  // 8. Deploy InvestmentController
  console.log("\n💰 Deploying InvestmentController (slippage 5%)...");
  const InvestmentController = await ethers.getContractFactory("InvestmentController");
  const controller = await InvestmentController.deploy(
    tokenAddress,        // _token3643
    USDC,                // _usdc
    deployer.address,    // _treasury (TÚ recibes el USDC)
    EUR_USD_FEED,        // _eurUsdFeed
    100,                 // _priceEuroCents (1 EUR = 100 cents)
    100                  // _hardCap (100 tokens para empezar)
  );
  await controller.waitForDeployment();
  const controllerAddress = await controller.getAddress();
  console.log("✅ InvestmentController:", controllerAddress);

  // 9. Configure slippage 5%
  console.log("\n⚙️ Setting slippage to 5% (500 bps)...");
  const txSlippage = await controller.setMaxSlippageBps(500);
  await txSlippage.wait();
  console.log("✅ Slippage: 5%");

  // 10. Grant controller ownership of token (para que pueda hacer issue)
  console.log("\n🔐 Transferring SecurityToken ownership to controller...");
  const txOwner = await token.transferOwnership(controllerAddress);
  await txOwner.wait();
  console.log("✅ Controller can now issue tokens");

  // 11. Link IdentityRegistry to storage
  console.log("\n🔗 Linking IdentityRegistry to storage...");
  const txLink = await idStorage.bindIdentityRegistry(identityRegistryAddress);
  await txLink.wait();
  console.log("✅ Registry linked");

  // 12. Pre-verify YOUR address for demo (OWNER BYPASS)
  console.log("\n👤 Pre-verifying OWNER address (YOU)...");
  // En producción, esto se haría con onchainID, pero para demo te verificamos directo
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const txVerify = await identityRegistry.registerIdentity(
    deployer.address,  // TU dirección
    ZERO_ADDRESS,      // identity contract (puede ser 0 para bypass)
    0                  // country code (0 = universal)
  );
  await txVerify.wait();
  console.log("✅ Owner verified (KYC bypass)");

  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("🎉 ERC-3643 DEPLOYMENT COMPLETE - POLYGON MAINNET 🎉");
  console.log("=".repeat(70));
  console.log("\n📝 COPY TO .env.local:\n");
  console.log(`NEXT_PUBLIC_PROJECT_REGISTRY=${registryAddress}`);
  console.log(`NEXT_PUBLIC_INVESTMENT_CONTROLLER=${controllerAddress}`);
  console.log(`NEXT_PUBLIC_DEMO_TOKEN=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_IDENTITY_REGISTRY=${identityRegistryAddress}`);
  console.log(`NEXT_PUBLIC_COMPLIANCE=${complianceAddress}`);
  console.log(`NEXT_PUBLIC_USDC=${USDC}`);
  console.log(`NEXT_PUBLIC_EUR_USD_FEED=${EUR_USD_FEED}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=137`);
  console.log("\n👑 OWNER INFO:\n");
  console.log(`Address: ${deployer.address}`);
  console.log(`Treasury: ${deployer.address} (recibes USDC)`);
  console.log(`KYC Status: ✅ Verified (bypass)`);
  console.log("\n💎 TOKEN INFO:\n");
  console.log(`Name: Real Estate Token (RET)`);
  console.log(`Type: ERC-3643 (T-REX Protocol)`);
  console.log(`Decimals: 0 (indivisible)`);
  console.log(`Hard Cap: 100 tokens`);
  console.log(`Price: 1 EUR per token`);
  console.log(`Slippage: 5%`);
  console.log("\n🔥 100% REAL - NO MOCK - PRODUCCIÓN 🔥\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
