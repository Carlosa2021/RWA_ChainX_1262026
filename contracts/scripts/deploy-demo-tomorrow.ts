import { ethers } from "hardhat";

/**
 * 🎯 DEPLOYMENT FOR TOMORROW'S DEMO (30 OCT 2025)
 * Deploys COMPLETE investment flow:
 * - ProjectRegistry
 * - MockSecurityToken (5 tokens)
 * - InvestmentController (USDC payments with EUR pricing)
 */
async function main() {
  console.log("🚀 Deploying DEMO Platform for Tomorrow...\n");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "POL\n");

  if (parseFloat(ethers.formatEther(balance)) < 0.15) {
    throw new Error("❌ Need at least 0.15 POL for deployment");
  }

  // Configuration
  const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98";
  const TREASURY = deployer.address;
  
  console.log("📋 Configuration:");
  console.log("Treasury:", TREASURY);
  console.log("USDC:", USDC_ADDRESS);
  console.log("EUR/USD Feed:", EUR_USD_FEED);
  console.log();

  // ========== Deploy ProjectRegistry ==========
  console.log("📦 Step 1/4: Deploying ProjectRegistry...");
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const projectRegistry = await ProjectRegistry.deploy();
  await projectRegistry.waitForDeployment();
  const registryAddress = await projectRegistry.getAddress();
  console.log("✅ ProjectRegistry:", registryAddress, "\n");

  // ========== Deploy MockSecurityToken ==========
  console.log("🪙 Step 2/4: Deploying Security Token...");
  const MockToken = await ethers.getContractFactory("MockSecurityToken");
  const token = await MockToken.deploy(
    "Demo Property Token",
    "DEMO",
    0  // decimals = 0 (indivisible tokens)
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token:", tokenAddress, "\n");

  // ========== Deploy InvestmentController ==========
  console.log("💰 Step 3/4: Deploying InvestmentController...");
  const InvestmentController = await ethers.getContractFactory("InvestmentController");
  const controller = await InvestmentController.deploy(
    tokenAddress,
    USDC_ADDRESS,
    TREASURY,
    EUR_USD_FEED,
    100, // 1 EUR = 100 cents
    5    // 5 tokens max
  );
  await controller.waitForDeployment();
  const controllerAddress = await controller.getAddress();
  console.log("✅ InvestmentController:", controllerAddress, "\n");

  // ========== Register Project ==========
  console.log("📝 Step 4/4: Registering project...");
  const registerTx = await projectRegistry.registerProject(
    "Demo Property - 5 EUR Project",
    tokenAddress,
    controllerAddress,
    ethers.parseUnits("1", 6),
    5,
    USDC_ADDRESS,
    "ipfs://demo-property-metadata"
  );
  await registerTx.wait();
  console.log("✅ Project registered!\n");

  // ========== Grant Permissions ==========
  console.log("🔐 Granting minting permission...");
  const grantTx = await token.transferOwnership(controllerAddress);
  await grantTx.wait();
  console.log("✅ Controller can mint tokens\n");

  // ========== SUMMARY ==========
  console.log("=".repeat(70));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(70));
  console.log("\n📝 Addresses:\n");
  console.log("ProjectRegistry:       ", registryAddress);
  console.log("Demo Token (DEMO):     ", tokenAddress);
  console.log("InvestmentController:  ", controllerAddress);
  console.log();
  console.log("🔗 Polygonscan:");
  console.log(`https://polygonscan.com/address/${registryAddress}`);
  console.log(`https://polygonscan.com/address/${tokenAddress}`);
  console.log(`https://polygonscan.com/address/${controllerAddress}`);
  console.log();
  console.log("📋 ADD TO .env.local:");
  console.log("─".repeat(70));
  console.log(`NEXT_PUBLIC_PROJECT_REGISTRY=${registryAddress}`);
  console.log(`NEXT_PUBLIC_INVESTMENT_CONTROLLER=${controllerAddress}`);
  console.log(`NEXT_PUBLIC_DEMO_TOKEN=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_USDC=${USDC_ADDRESS}`);
  console.log(`NEXT_PUBLIC_EUR_USD_FEED=${EUR_USD_FEED}`);
  console.log("─".repeat(70));
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
    }
  };

  const fs = await import("fs");
  fs.writeFileSync(
    "demo-deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Saved to: demo-deployment.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ FAILED:", error);
    process.exit(1);
  });
