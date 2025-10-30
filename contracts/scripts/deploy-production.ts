import { ethers } from "hardhat";

async function main() {
  console.log("\n" + "=".repeat(70));
  console.log("🚀 DEPLOYING PRODUCTION CONTRACTS TO POLYGON MAINNET");
  console.log("=".repeat(70) + "\n");

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "POL\n");

  // Polygon Mainnet addresses
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98";

  // 1. Deploy Token
  console.log("🪙 Deploying ProductionToken...");
  const Token = await ethers.getContractFactory("ProductionToken");
  const token = await Token.deploy(
    "Real Estate Token",
    "RET",
    0  // 0 decimals = indivisible tokens
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token:", tokenAddress);

  // 2. Deploy InvestmentController
  console.log("\n💼 Deploying InvestmentController...");
  const Controller = await ethers.getContractFactory("InvestmentController");
  const controller = await Controller.deploy(
    tokenAddress,
    USDC,
    deployer.address,  // treasury
    EUR_USD_FEED,
    100,  // 1.00 EUR (100 cents)
    5     // 5 tokens total
  );
  await controller.waitForDeployment();
  const controllerAddress = await controller.getAddress();
  console.log("✅ Controller:", controllerAddress);

  // 3. Set slippage to 5%
  console.log("\n⚙️ Setting slippage to 5%...");
  const txSlip = await controller.setMaxSlippageBps(500);
  await txSlip.wait();
  console.log("✅ Max slippage: 500 bps (5%)");

  // 4. Transfer token ownership to controller
  console.log("\n🔐 Transferring token ownership...");
  const txOwn = await token.transferOwnership(controllerAddress);
  await txOwn.wait();
  console.log("✅ Token owner:", controllerAddress);

  // 5. Deploy ProjectRegistry
  console.log("\n📋 Deploying ProjectRegistry...");
  const Registry = await ethers.getContractFactory("ProjectRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ Registry:", registryAddress);

  // 6. Register production project
  console.log("\n🏠 Registering production project...");
  const txReg = await registry.registerProject(
    "Edificio Residencial Valencia Centro",
    tokenAddress,
    controllerAddress,
    ethers.parseEther("1"),  // 1 EUR per token
    5,  // 5 tokens
    USDC,
    "ipfs://QmProductionWhitepaper"
  );
  await txReg.wait();
  console.log("✅ Project registered!");

  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("🎉 PRODUCTION DEPLOYMENT COMPLETE");
  console.log("=".repeat(70));
  console.log("\n📝 UPDATE .env.local WITH:\n");
  console.log(`NEXT_PUBLIC_PROJECT_REGISTRY=${registryAddress}`);
  console.log(`NEXT_PUBLIC_INVESTMENT_CONTROLLER=${controllerAddress}`);
  console.log(`NEXT_PUBLIC_DEMO_TOKEN=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_USDC=${USDC}`);
  console.log(`NEXT_PUBLIC_EUR_USD_FEED=${EUR_USD_FEED}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=137`);
  console.log(`NEXT_PUBLIC_OWNER_ADDRESS=${deployer.address}`);
  
  console.log("\n📊 PROJECT DETAILS:");
  console.log("• Name: Edificio Residencial Valencia Centro");
  console.log("• Tokens: 5 @ 1 EUR each");
  console.log("• Total value: 5 EUR (~5.80 USDC)");
  console.log("• Max slippage: 5%");
  
  console.log("\n✅ Ready for production use!");
  console.log("=".repeat(70) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
