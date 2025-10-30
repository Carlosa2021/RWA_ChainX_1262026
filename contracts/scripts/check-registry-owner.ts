import { ethers } from "hardhat";

async function main() {
  const REGISTRY = "0xEf1a4c26BC8a9a0a1477dA08056e406BDf00D560";
  
  console.log("\n🔍 CHECKING REGISTRY OWNER...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Your address:", deployer.address);
  
  const registry = await ethers.getContractAt("ProjectRegistry", REGISTRY);
  
  try {
    const owner = await registry.owner();
    console.log("Registry owner:", owner);
    console.log("You are owner?", owner.toLowerCase() === deployer.address.toLowerCase());
    
    // Check if you can register
    console.log("\n🧪 Testing if you can register project...");
    
    // Try to call registerProject (static call - no gas spent)
    try {
      await registry.registerProject.staticCall(
        "Test Project",
        "0x1c807Bd375a79249F34DC8EBfB6B426B8ffe4ca4", // token
        "0x16377c24E52361AF460FAA064a95F7d32f522A8e", // controller
        ethers.parseUnits("1", 6), // 1 USDC
        5, // 5 tokens
        "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // USDC
        "ipfs://test"
      );
      console.log("✅ You CAN register projects!");
    } catch (error: any) {
      console.log("❌ You CANNOT register projects");
      console.log("Error:", error.message);
    }
  } catch (error) {
    console.log("❌ Error checking owner:", error);
  }
}

main().catch(console.error);
