import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\n" + "=".repeat(70));
  console.log("🚀 DEPLOYING DEMO CONTRACTS - 5 TOKENS - POLYGON MAINNET");
  console.log("=".repeat(70));
  console.log("\n👤 Deployer:", deployer.address);

  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Polygon USDC
  const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98"; // Chainlink EUR/USD

  // 1. Deploy MockSecurityToken (NO KYC)
  console.log("\n🪙 Deploying MockSecurityToken (RET)...");
  const Token = await ethers.getContractFactory("MockSecurityToken");
  const token = await Token.deploy(
    "Real Estate Token",
    "RET",
    0  // decimals = 0 (tokens indivisibles)
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token:", tokenAddress);

  // 2. Deploy InvestmentController - HARDCAP 5 TOKENS
  console.log("\n💰 Deploying InvestmentController (5 tokens)...");
  const Controller = await ethers.getContractFactory("InvestmentController");
  const controller = await Controller.deploy(
    tokenAddress,
    USDC,
    EUR_USD_FEED,
    deployer.address,  // treasury
    100,               // price: 1 EUR (100 cents)
    5                  // hardCap: 5 TOKENS ⭐
  );
  await controller.waitForDeployment();
  const controllerAddress = await controller.getAddress();
  console.log("✅ Controller:", controllerAddress);

  // 3. Set slippage 5%
  console.log("\n⚙️ Setting slippage 5%...");
  const txSlip = await controller.setMaxSlippageBps(500);
  await txSlip.wait();
  console.log("✅ Slippage: 5%");

  // 4. Transfer token ownership
  console.log("\n🔐 Transfer ownership...");
  const txOwn = await token.transferOwnership(controllerAddress);
  await txOwn.wait();
  console.log("✅ Controller owns token");

  // 5. Deploy ProjectRegistry
  console.log("\n📋 Deploying ProjectRegistry...");
  const Registry = await ethers.getContractFactory("ProjectRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ Registry:", registryAddress);

  // 6. Register Alzira Project - 5 TOKENS
  console.log("\n🏠 Registering Alzira Project (5 tokens)...");
  const txReg = await registry.registerProject(
    "Proyecto Alzira - Edificio Residencial",
    tokenAddress,
    controllerAddress,
    ethers.parseEther("1"),  // 1 EUR per token
    5,                        // 5 TOKENS ⭐
    USDC,
    "ipfs://QmAlziraWhitepaper"
  );
  await txReg.wait();
  console.log("✅ Alzira registered (5 tokens)!");

  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("🎉 DEMO CONTRACTS READY - 5 TOKENS - MAINNET POLYGON 🎉");
  console.log("=".repeat(70));
  console.log("\n📝 UPDATE .env.local:\n");
  console.log(`NEXT_PUBLIC_PROJECT_REGISTRY=${registryAddress}`);
  console.log(`NEXT_PUBLIC_INVESTMENT_CONTROLLER=${controllerAddress}`);
  console.log(`NEXT_PUBLIC_DEMO_TOKEN=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_USDC=${USDC}`);
  console.log(`NEXT_PUBLIC_EUR_USD_FEED=${EUR_USD_FEED}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=137`);
  console.log(`NEXT_PUBLIC_OWNER_ADDRESS=${deployer.address}`);
  console.log("\n👑 OWNER: " + deployer.address);
  console.log("💰 Treasury: " + deployer.address);
  console.log("🏠 Project: Alzira - 5 tokens @ 1 EUR ⭐");
  console.log("💵 Total project: ~5.80 USDC");
  console.log("✅ NO KYC CHECK - Owner can invest immediately!");
  console.log("\n🎯 DEMO FLOW:");
  console.log("  1. Buy 2 tokens (~2.32 USDC) ✅");
  console.log("  2. Progress: 40% 📊");
  console.log("  3. Buy 3 more tokens (~3.48 USDC) ✅");
  console.log("  4. Status: FINANCIADO 🎉");
  console.log("\n" + "=".repeat(70));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
