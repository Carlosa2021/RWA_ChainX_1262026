import { ethers } from "hardhat";

/**
 * 🎯 DEPLOYMENT FOR TOMORROW'S DEMO
 * Deploys COMPLETE investment flow:
 * 1. ProjectRegistry
 * 2. MockSecurityToken (5 tokens)
 * 3. InvestmentController (handles USDC payments)
 * 4. Register project with all components
 */
async function main() {
  console.log("🚀 Deploying DEMO Platform...\n");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "POL\n");

  if (parseFloat(ethers.formatEther(balance)) < 0.15) {
    throw new Error("❌ Insufficient POL. Need at least 0.15 POL for deployment");
  }

  // Configuration
  const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Polygon USDC
  const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98"; // Chainlink EUR/USD
  const TREASURY = deployer.address;
  
  console.log("📋 Configuration:");
  console.log("Treasury:", TREASURY);
  console.log("USDC:", USDC_ADDRESS);
  console.log("EUR/USD Feed:", EUR_USD_FEED);
  console.log();

  // ========== STEP 1: Deploy ProjectRegistry ==========
  console.log("📦 Step 1/4: Deploying ProjectRegistry...");
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const projectRegistry = await ProjectRegistry.deploy();
  await projectRegistry.waitForDeployment();
  const registryAddress = await projectRegistry.getAddress();
  console.log("✅ ProjectRegistry:", registryAddress);
  console.log();

  // ========== STEP 2: Deploy MockSecurityToken ==========
  console.log("🪙 Step 2/4: Deploying Security Token...");
  console.log("   Name: Demo Property Token");
  console.log("   Symbol: DEMO");
  console.log("   Supply: 5 tokens\n");
  
  const MockToken = await ethers.getContractFactory("MockSecurityToken");
  const token = await MockToken.deploy(
    "Demo Property Token",
    "DEMO",
    5, // 5 tokens total
    deployer.address
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token:", tokenAddress);
  console.log();

  // ========== STEP 3: Deploy InvestmentController ==========
  console.log("� Step 3/4: Deploying InvestmentController...");
  console.log("   Price: 1 EUR per token (100 cents)");
  console.log("   Hard Cap: 5 tokens");
  console.log("   Payment: USDC (converted from EUR)\n");
  
  const InvestmentController = await ethers.getContractFactory("InvestmentController");
  const controller = await InvestmentController.deploy(
    tokenAddress,           // token3643
    USDC_ADDRESS,          // usdc
    TREASURY,              // treasury
    EUR_USD_FEED,          // eurUsdFeed
    100,                   // priceEuroCents (1 EUR = 100 cents)
    5                      // hardCap (5 tokens)
  );
  await controller.waitForDeployment();
  const controllerAddress = await controller.getAddress();
  console.log("✅ InvestmentController:", controllerAddress);
  console.log();

  // ========== STEP 4: Register Project ==========
  console.log("📝 Step 4/4: Registering project...");
  
  const registerTx = await projectRegistry.registerProject(
    "Demo Property - 5 EUR Project",  // name
    tokenAddress,                      // securityToken
    controllerAddress,                 // investmentController
    ethers.parseUnits("1", 6),        // pricePerToken (1 USDC)
    5,                                 // maxCap
    USDC_ADDRESS,                      // stablecoin
    "ipfs://demo-property-metadata"   // metadataURI
  );
  
  await registerTx.wait();
  console.log("✅ Project registered!");
  console.log();

  // Grant minting permission to controller
  console.log("🔐 Granting minting permission to InvestmentController...");
  const grantTx = await token.transferOwnership(controllerAddress);
  await grantTx.wait();
  console.log("✅ Controller can now mint tokens on investment");
  console.log();

  // ========== SUMMARY ==========
  console.log("=".repeat(70));
  console.log("🎉 DEMO DEPLOYMENT COMPLETE!");
  console.log("=".repeat(70));
  console.log("\n📝 Contract Addresses:\n");
  console.log("ProjectRegistry:        ", registryAddress);
  console.log("Demo Token (DEMO):      ", tokenAddress);
  console.log("InvestmentController:   ", controllerAddress);
  console.log();
  console.log("💰 Project Configuration:");
  console.log("  Name: Demo Property - 5 EUR Project");
  console.log("  Total Value: 5 EUR");
  console.log("  Price per Token: 1 EUR (paid in USDC)");
  console.log("  Total Tokens: 5");
  console.log("  Treasury: ", TREASURY);
  console.log();
  console.log("🔗 Verify on Polygonscan:");
  console.log(`  Registry: https://polygonscan.com/address/${registryAddress}`);
  console.log(`  Token: https://polygonscan.com/address/${tokenAddress}`);
  console.log(`  Controller: https://polygonscan.com/address/${controllerAddress}`);
  console.log();
  console.log("📋 UPDATE .env.local WITH:");
  console.log("─".repeat(70));
  console.log(`NEXT_PUBLIC_PROJECT_REGISTRY=${registryAddress}`);
  console.log(`NEXT_PUBLIC_INVESTMENT_CONTROLLER=${controllerAddress}`);
  console.log(`NEXT_PUBLIC_DEMO_TOKEN=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_USDC=${USDC_ADDRESS}`);
  console.log(`NEXT_PUBLIC_EUR_USD_FEED=${EUR_USD_FEED}`);
  console.log("─".repeat(70));
  console.log();
  console.log("✅ READY FOR TOMORROW'S DEMO!");
  console.log();
  console.log("🎬 Demo Flow:");
  console.log("  1. Restart server: npm run dev");
  console.log("  2. Admin creates project (already done!)");
  console.log("  3. Investor visits platform");
  console.log("  4. Investor clicks 'Invertir' → Metamask appears");
  console.log("  5. Approve USDC spending (if first time)");
  console.log("  6. Confirm investment → Tokens minted!");
  console.log();

  // Save deployment info
  const deploymentInfo = {
    network: "polygon-mainnet",
    chainId: 137,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      projectRegistry: registryAddress,
      demoToken: tokenAddress,
      investmentController: controllerAddress,
      usdc: USDC_ADDRESS,
      eurUsdFeed: EUR_USD_FEED,
      treasury: TREASURY
    },
    project: {
      name: "Demo Property - 5 EUR Project",
      symbol: "DEMO",
      totalTokens: 5,
      pricePerToken: "1 EUR",
      totalValue: "5 EUR",
      paymentMethod: "USDC (converted from EUR via Chainlink)"
    },
    envVariables: {
      NEXT_PUBLIC_PROJECT_REGISTRY: registryAddress,
      NEXT_PUBLIC_INVESTMENT_CONTROLLER: controllerAddress,
      NEXT_PUBLIC_DEMO_TOKEN: tokenAddress,
      NEXT_PUBLIC_USDC: USDC_ADDRESS,
      NEXT_PUBLIC_EUR_USD_FEED: EUR_USD_FEED
    }
  };

  const fs = await import("fs");
  const path = await import("path");
  const outputPath = path.join(process.cwd(), "demo-deployment.json");
  
  fs.writeFileSync(
    outputPath,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Deployment info saved to: demo-deployment.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
