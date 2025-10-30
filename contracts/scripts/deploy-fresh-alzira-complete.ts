import { ethers } from "hardhat";

/**
 * 🆕 DEPLOY COMPLETE FRESH ALZIRA PROJECT
 * - NEW Token (0 issued)
 * - NEW Controller (0 issued, hardCap 5)
 * - Register in clean registry
 */

async function main() {
  console.log("\n🆕 DEPLOYING FRESH ALZIRA PROJECT...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  // Addresses
  const REGISTRY = "0xEf1a4c26BC8a9a0a1477dA08056e406BDf00D560"; // Clean registry
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98";
  const TREASURY = deployer.address;
  
  // 1. Deploy NEW Token
  console.log("🪙 Step 1/4: Deploying NEW Token...");
  const Token = await ethers.getContractFactory("MockSecurityToken");
  const token = await Token.deploy(
    "Alzira Reyes Catolicos Token",
    "ALZIRA",
    0 // decimals = 0 (indivisible)
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token:", tokenAddress);
  
  // 2. Deploy NEW Controller
  console.log("\n💰 Step 2/4: Deploying NEW Controller...");
  const Controller = await ethers.getContractFactory("InvestmentController");
  const controller = await Controller.deploy(
    tokenAddress,
    USDC,
    TREASURY,
    EUR_USD_FEED,
    100, // 1 EUR = 100 cents
    5    // hardCap: 5 tokens
  );
  await controller.waitForDeployment();
  const controllerAddress = await controller.getAddress();
  console.log("✅ Controller:", controllerAddress);
  
  // 3. Transfer token ownership
  console.log("\n🔐 Step 3/4: Granting permissions...");
  const txOwn = await token.transferOwnership(controllerAddress);
  await txOwn.wait();
  console.log("✅ Controller owns token");
  
  // 4. Register in clean registry
  console.log("\n📝 Step 4/4: Registering in ProjectRegistry...");
  const registry = await ethers.getContractAt("ProjectRegistry", REGISTRY);
  
  const txReg = await registry.registerProject(
    "Inmueble Reyes Católicos Alzira",
    tokenAddress,
    controllerAddress,
    ethers.parseUnits("1", 6), // 1 USDC
    5, // 5 tokens
    USDC,
    "ipfs://QmAlziraReyesCatolicos2025"
  );
  await txReg.wait();
  console.log("✅ Project registered!");
  
  // Verify
  const issued = await controller.issued();
  const hardCap = await controller.hardCap();
  const projectCount = await registry.getProjectCount();
  
  console.log("\n" + "=".repeat(70));
  console.log("🎉 FRESH ALZIRA PROJECT DEPLOYED");
  console.log("=".repeat(70));
  console.log("\n📊 Status:");
  console.log("  Token:", tokenAddress);
  console.log("  Controller:", controllerAddress);
  console.log("  Issued:", issued.toString(), "/ HardCap:", hardCap.toString());
  console.log("  Registry projects:", projectCount.toString());
  
  console.log("\n📝 UPDATE .env.local:");
  console.log(`NEXT_PUBLIC_DEMO_TOKEN=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_INVESTMENT_CONTROLLER=${controllerAddress}`);
  
  console.log("\n✅ Ready for CLEAN investment (0/5 tokens)");
  console.log("🔍 Vercel will need these env vars updated!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
