import { ethers } from "hardhat";

/**
 * DEPLOY FRESH TO POLYGON MAINNET
 * - ProjectRegistry
 * - MockSecurityToken (DEMO, decimals=0)
 * - InvestmentController (slippage 5% = 500 bps)
 * - Register project: "Demo Property - 5 EUR" (5 tokens @ 1 EUR)
 */

async function main() {
  console.log("\n🚀 DEPLOYING TO POLYGON MAINNET (PRODUCCIÓN REAL) 🚀\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  // MAINNET addresses
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Polygon USDC
  const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98"; // Chainlink EUR/USD
  
  // 1. Deploy ProjectRegistry
  console.log("📋 Deploying ProjectRegistry...");
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const registry = await ProjectRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ ProjectRegistry:", registryAddress);

  // 2. Deploy MockSecurityToken (DEMO token, decimals=0)
  console.log("\n🪙 Deploying MockSecurityToken (DEMO)...");
  const MockSecurityToken = await ethers.getContractFactory("MockSecurityToken");
  const token = await MockSecurityToken.deploy(
    "Demo Token",
    "DEMO",
    0 // decimals = 0 (tokens enteros)
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ DEMO Token:", tokenAddress);

  // 3. Deploy InvestmentController with 5% slippage
  console.log("\n💰 Deploying InvestmentController (slippage 5%)...");
  const InvestmentController = await ethers.getContractFactory("InvestmentController");
  const controller = await InvestmentController.deploy(
    tokenAddress,        // _token3643
    USDC,                // _usdc
    deployer.address,    // _treasury
    EUR_USD_FEED,        // _eurUsdFeed
    100,                 // _priceEuroCents (1 EUR = 100 cents)
    5                    // _hardCap (5 tokens)
  );
  await controller.waitForDeployment();
  const controllerAddress = await controller.getAddress();
  console.log("✅ InvestmentController:", controllerAddress);

  // 4. Set slippage to 5% (500 basis points)
  console.log("\n⚙️ Setting slippage to 5% (500 bps)...");
  const txSlippage = await controller.setMaxSlippageBps(500);
  await txSlippage.wait();
  console.log("✅ Slippage updated to 5%");

  // 5. Transfer token ownership to controller (so it can mint)
  console.log("\n🔐 Transferring token ownership to controller...");
  const txOwner = await token.transferOwnership(controllerAddress);
  await txOwner.wait();
  console.log("✅ Ownership transferred");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE - POLYGON MAINNET 🎉");
  console.log("=".repeat(60));
  console.log("\n📝 CONTRACT ADDRESSES:\n");
  console.log(`NEXT_PUBLIC_PROJECT_REGISTRY=${registryAddress}`);
  console.log(`NEXT_PUBLIC_INVESTMENT_CONTROLLER=${controllerAddress}`);
  console.log(`NEXT_PUBLIC_DEMO_TOKEN=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_USDC=${USDC}`);
  console.log(`NEXT_PUBLIC_EUR_USD_FEED=${EUR_USD_FEED}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=137`);
  console.log("\n📊 PROJECT INFO:\n");
  console.log(`Controller can sell: 5 tokens @ 1 EUR each`);
  console.log(`Slippage tolerance: 5%`);
  console.log(`Treasury: ${deployer.address}`);
  console.log("\n🔥 PRODUCCIÓN REAL - POLYGON MAINNET 🔥\n");
  console.log("⚠️  MANUAL STEP: Register project in ProjectRegistry using admin panel\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
