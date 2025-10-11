import { ethers } from "hardhat";

/**
 * Deploy script for ERC-3643 infrastructure + Demo Project
 * Deploys:
 * 1. Core infrastructure (Identity, Compliance, Registry)
 * 2. ProjectTokenFactory
 * 3. Demo Project A (50,000 EUR = 50 tokens @ 1,000 EUR each)
 */
async function main() {
  console.log("🚀 Starting ERC-3643 RWA Platform Deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  // Configuration
  const TREASURY = process.env.TREASURY || deployer.address;
  const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC || "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Polygon USDC
  const EUR_USD_FEED = process.env.NEXT_PUBLIC_EUR_USD_FEED || "0x73366Fe0AA0Ded304479862808e02506FE556a98"; // Chainlink EUR/USD

  console.log("📋 Configuration:");
  console.log("Treasury:", TREASURY);
  console.log("USDC:", USDC_ADDRESS);
  console.log("EUR/USD Feed:", EUR_USD_FEED);
  console.log();

  // ========== STEP 1: Deploy Core Infrastructure ==========
  console.log("📦 Step 1: Deploying Core Infrastructure...\n");

  // 1.1 Deploy IdentityRegistryStorage
  console.log("Deploying IdentityRegistryStorage...");
  const IdentityRegistryStorage = await ethers.getContractFactory("IdentityRegistryStorage");
  const identityStorage = await IdentityRegistryStorage.deploy();
  await identityStorage.waitForDeployment();
  console.log("✅ IdentityRegistryStorage:", await identityStorage.getAddress());

  // 1.2 Deploy ClaimTopicsRegistry
  console.log("Deploying ClaimTopicsRegistry...");
  const ClaimTopicsRegistry = await ethers.getContractFactory("ClaimTopicsRegistry");
  const claimTopicsRegistry = await ClaimTopicsRegistry.deploy();
  await claimTopicsRegistry.waitForDeployment();
  console.log("✅ ClaimTopicsRegistry:", await claimTopicsRegistry.getAddress());

  // 1.3 Deploy TrustedIssuersRegistry
  console.log("Deploying TrustedIssuersRegistry...");
  const TrustedIssuersRegistry = await ethers.getContractFactory("TrustedIssuersRegistry");
  const trustedIssuersRegistry = await TrustedIssuersRegistry.deploy();
  await trustedIssuersRegistry.waitForDeployment();
  console.log("✅ TrustedIssuersRegistry:", await trustedIssuersRegistry.getAddress());

  // 1.4 Deploy IdentityRegistry
  console.log("Deploying IdentityRegistry...");
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy(
    await identityStorage.getAddress(),
    await claimTopicsRegistry.getAddress(),
    await trustedIssuersRegistry.getAddress()
  );
  await identityRegistry.waitForDeployment();
  console.log("✅ IdentityRegistry:", await identityRegistry.getAddress());

  // 1.5 Deploy Compliance
  console.log("Deploying Compliance...");
  const Compliance = await ethers.getContractFactory("Compliance");
  const compliance = await Compliance.deploy();
  await compliance.waitForDeployment();
  console.log("✅ Compliance:", await compliance.getAddress());

  // 1.6 Deploy ProjectRegistry
  console.log("Deploying ProjectRegistry...");
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const projectRegistry = await ProjectRegistry.deploy();
  await projectRegistry.waitForDeployment();
  console.log("✅ ProjectRegistry:", await projectRegistry.getAddress());

  console.log();

  // ========== STEP 2: Configure Infrastructure ==========
  console.log("⚙️  Step 2: Configuring Infrastructure...\n");

  // 2.1 Transfer ownership of IdentityStorage to IdentityRegistry
  console.log("Transferring IdentityStorage ownership...");
  await identityStorage.transferOwnership(await identityRegistry.getAddress());
  console.log("✅ Ownership transferred");

  // 2.2 Add demo claim topic (e.g., KYC = topic 1)
  console.log("Adding claim topic 1 (KYC)...");
  await claimTopicsRegistry.addClaimTopic(1);
  console.log("✅ Claim topic added");

  // 2.3 Configure compliance (allow some demo countries)
  console.log("Configuring compliance rules...");
  await compliance.allowCountry(840); // USA
  await compliance.allowCountry(724); // Spain
  await compliance.allowCountry(276); // Germany
  await compliance.allowCountry(826); // UK
  console.log("✅ Countries allowed: USA, Spain, Germany, UK");

  console.log();

  // ========== STEP 3: Deploy Factory ==========
  console.log("🏭 Step 3: Deploying ProjectTokenFactory...\n");

  const ProjectTokenFactory = await ethers.getContractFactory("ProjectTokenFactory");
  const factory = await ProjectTokenFactory.deploy(
    await identityRegistry.getAddress(),
    await compliance.getAddress(),
    await projectRegistry.getAddress()
  );
  await factory.waitForDeployment();
  console.log("✅ ProjectTokenFactory:", await factory.getAddress());

  // Transfer ProjectRegistry ownership to Factory
  console.log("Transferring ProjectRegistry ownership to Factory...");
  await projectRegistry.transferOwnership(await factory.getAddress());
  console.log("✅ Ownership transferred\n");

  // ========== STEP 4: Create Demo Project ==========
  console.log("🏢 Step 4: Creating Demo Project A...\n");
  console.log("Project: Property Madrid Centro");
  console.log("- 50,000 EUR total value");
  console.log("- 50 tokens @ 1,000 EUR each");
  console.log("- Indivisible tokens (decimals = 0)\n");

  const tx = await factory.createProject(
    "Property Madrid Centro", // name
    "PMC", // symbol
    0, // decimals (indivisible)
    100000, // priceEuroCents (1,000 EUR = 100,000 cents)
    50, // maxCap (50 tokens)
    USDC_ADDRESS, // stablecoin
    TREASURY, // treasury
    "ipfs://QmExample123456789", // metadataURI
    EUR_USD_FEED // eurUsdFeed
  );

  console.log("Waiting for transaction confirmation...");
  const receipt = await tx.wait();

  // Get project details from event
  const event = receipt?.logs.find((log) => {
    try {
      return factory.interface.parseLog(log)?.name === "ProjectCreated";
    } catch {
      return false;
    }
  });

  if (event) {
    const parsed = factory.interface.parseLog(event);
    console.log("\n✅ Project Created!");
    console.log("Project ID:", parsed?.args[0].toString());
    console.log("SecurityToken:", parsed?.args[1]);
    console.log("InvestmentController:", parsed?.args[2]);
    console.log("PayoutDistributor:", parsed?.args[3]);
  }

  console.log();

  // ========== STEP 5: Register demo investor ==========
  console.log("👤 Step 5: Registering demo investor (deployer)...\n");

  // For demo purposes, register deployer as verified investor
  const demoIdentity = ethers.ZeroAddress; // In production, use actual ONCHAINID
  await identityRegistry.registerIdentity(deployer.address, demoIdentity, 724); // Spain
  console.log("✅ Demo investor registered:", deployer.address);
  console.log("   Country: Spain (724)");
  console.log("   Verified:", await identityRegistry.isVerified(deployer.address));

  console.log();

  // ========== Summary ==========
  console.log("=" .repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=" .repeat(60));
  console.log("\n📝 Contract Addresses:\n");
  console.log("Core Infrastructure:");
  console.log("  IdentityRegistryStorage:", await identityStorage.getAddress());
  console.log("  ClaimTopicsRegistry:    ", await claimTopicsRegistry.getAddress());
  console.log("  TrustedIssuersRegistry: ", await trustedIssuersRegistry.getAddress());
  console.log("  IdentityRegistry:       ", await identityRegistry.getAddress());
  console.log("  Compliance:             ", await compliance.getAddress());
  console.log("  ProjectRegistry:        ", await projectRegistry.getAddress());
  console.log("  ProjectTokenFactory:    ", await factory.getAddress());
  console.log();
  console.log("Demo Project A (PMC):");
  
  if (event) {
    const parsed = factory.interface.parseLog(event);
    console.log("  SecurityToken:          ", parsed?.args[1]);
    console.log("  InvestmentController:   ", parsed?.args[2]);
    console.log("  PayoutDistributor:      ", parsed?.args[3]);
  }

  console.log();
  console.log("💡 Next Steps:");
  console.log("1. Update .env with contract addresses");
  console.log("2. Verify contracts on Polygonscan");
  console.log("3. Test investment flow with frontend");
  console.log("4. Register real KYC provider in TrustedIssuersRegistry");
  console.log();

  // Save addresses to file
  const addresses = {
    network: "polygon-amoy",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    core: {
      identityRegistryStorage: await identityStorage.getAddress(),
      claimTopicsRegistry: await claimTopicsRegistry.getAddress(),
      trustedIssuersRegistry: await trustedIssuersRegistry.getAddress(),
      identityRegistry: await identityRegistry.getAddress(),
      compliance: await compliance.getAddress(),
      projectRegistry: await projectRegistry.getAddress(),
      projectTokenFactory: await factory.getAddress(),
    },
    config: {
      treasury: TREASURY,
      usdc: USDC_ADDRESS,
      eurUsdFeed: EUR_USD_FEED,
    }
  };

  const { writeFileSync } = await import("fs");
  writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("✅ Addresses saved to deployed-addresses.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
