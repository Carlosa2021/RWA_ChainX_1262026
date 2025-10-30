import { ethers } from "hardhat";

/**
 * 🏢 DEPLOY ALZIRA PROJECT - DEMO VERSION
 * Real project: Inmueble Reyes Católicos Alzira
 * Demo config: 5 tokens @ 1 EUR each = 5 EUR total
 */
async function main() {
  console.log("🏢 Deploying ALZIRA Project (Demo Version)...\n");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "POL\n");

  // Configuration
  const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Polygon USDC
  const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98"; // Chainlink EUR/USD
  const TREASURY = deployer.address;
  
  console.log("📋 Project Details:");
  console.log("Name: Inmueble Reyes Católicos Alzira");
  console.log("Total: 5 EUR (5 tokens @ 1 EUR)");
  console.log("Treasury:", TREASURY);
  console.log();

  // Use existing ProjectRegistry
  const REGISTRY_ADDRESS = "0xD0A787C10E1050cB994297206A5B251C6Ca11861";
  console.log("📦 Using existing ProjectRegistry:", REGISTRY_ADDRESS);
  console.log();

  // ========== Deploy SecurityToken ==========
  console.log("🪙 Step 1/3: Deploying Security Token...");
  const MockToken = await ethers.getContractFactory("MockSecurityToken");
  const token = await MockToken.deploy(
    "Alzira Reyes Catolicos",
    "RCA-97",
    0  // decimals = 0 (indivisible)
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token:", tokenAddress, "\n");

  // ========== Deploy InvestmentController ==========
  console.log("💰 Step 2/3: Deploying InvestmentController...");
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

  // ========== Register in ProjectRegistry ==========
  console.log("📝 Step 3/3: Registering project...");
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const registry = ProjectRegistry.attach(REGISTRY_ADDRESS);
  
  const registerTx = await registry.registerProject(
    "Inmueble Reyes Católicos Alzira",
    tokenAddress,
    controllerAddress,
    ethers.parseUnits("1", 6), // 1 USDC
    5,
    USDC_ADDRESS,
    "ipfs://QmAlziraReyesCatolicos2025"
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
  console.log("🎉 ALZIRA PROJECT DEPLOYED!");
  console.log("=".repeat(70));
  console.log("\n📝 Addresses:\n");
  console.log("Token (RCA-97):        ", tokenAddress);
  console.log("InvestmentController:  ", controllerAddress);
  console.log();
  console.log("🏢 Project Details:");
  console.log("  Name: Inmueble Reyes Católicos Alzira");
  console.log("  Symbol: RCA-97");
  console.log("  Total Value: 5 EUR");
  console.log("  Tokens: 5 @ 1 EUR each");
  console.log();
  console.log("📋 UPDATE .env.local:");
  console.log("NEXT_PUBLIC_ALZIRA_TOKEN=" + tokenAddress);
  console.log("NEXT_PUBLIC_ALZIRA_CONTROLLER=" + controllerAddress);
  console.log();

  // Save deployment info
  const deploymentInfo = {
    network: "polygon-mainnet",
    chainId: 137,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    project: {
      name: "Inmueble Reyes Católicos Alzira",
      symbol: "RCA-97",
      tokenAddress,
      controllerAddress,
      totalTokens: 5,
      pricePerToken: "1 EUR",
      totalValue: "5 EUR",
    }
  };

  const fs = await import("fs");
  fs.writeFileSync(
    "alzira-deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Saved to: alzira-deployment.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ FAILED:", error);
    process.exit(1);
  });
