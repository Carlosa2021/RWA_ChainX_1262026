import { ethers } from "hardhat";

/**
 * DEPLOY SIMPLE CONTROLLER (NO KYC CHECK)
 * - Para demo funcional mañana
 * - Solo owner puede invertir (verificación frontend)
 * - Contracts simples sin ERC-3643 complejo
 */

async function main() {
  console.log("\n🚀 DEPLOYING DEMO CONTRACTS (NO KYC) FOR TOMORROW 🚀\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Owner:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98";
  
  // 1. Deploy MockSecurityToken (simple, no KYC)
  console.log("🪙 Deploying MockSecurityToken (RET)...");
  const MockSecurityToken = await ethers.getContractFactory("MockSecurityToken");
  const token = await MockSecurityToken.deploy(
    "Real Estate Token Alzira",
    "RET",
    0  // decimals = 0
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token:", tokenAddress);

  // 2. Deploy InvestmentController
  console.log("\n💰 Deploying InvestmentController...");
  const InvestmentController = await ethers.getContractFactory("InvestmentController");
  const controller = await InvestmentController.deploy(
    tokenAddress,        // token
    USDC,                // usdc
    deployer.address,    // treasury (TÚ)
    EUR_USD_FEED,        // oracle
    100,                 // price: 1 EUR (100 cents)
    100                  // hardCap: 100 tokens
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
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const registry = await ProjectRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ Registry:", registryAddress);

  // 6. Register Alzira Project
  console.log("\n🏠 Registering Alzira Project...");
  const txReg = await registry.registerProject(
    "Proyecto Alzira - Edificio Residencial",
    tokenAddress,
    controllerAddress,
    ethers.parseEther("1"),  // 1 EUR per token
    100,                      // 100 tokens
    USDC,
    "ipfs://QmAlziraWhitepaper"
  );
  await txReg.wait();
  console.log("✅ Alzira registered!");

  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("🎉 DEMO CONTRACTS READY - MAINNET POLYGON 🎉");
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
  console.log("🏠 Project: Alzira - 100 tokens @ 1 EUR");
  console.log("🔥 Slippage: 5%");
  console.log("✅ NO KYC CHECK - Owner can invest immediately!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
