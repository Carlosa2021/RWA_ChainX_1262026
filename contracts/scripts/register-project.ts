import { ethers } from "hardhat";

/**
 * REGISTER PROJECT IN PROJECTREGISTRY
 * - Registers project so it appears in dashboard
 * - 100% on-chain, visible to all investors
 */

async function main() {
  console.log("\n📝 REGISTERING PROJECT IN PROJECTREGISTRY...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Owner:", deployer.address);
  
  // Deployed contracts
  const PROJECT_REGISTRY = process.env.NEXT_PUBLIC_PROJECT_REGISTRY || "0xB76DCD7A314F44fb839207266a2e1bA82973fb45";
  const TOKEN = process.env.NEXT_PUBLIC_DEMO_TOKEN || "0xe14Ed2e9570fceC1D5d54c484D81e7F80a82b910";
  const CONTROLLER = process.env.NEXT_PUBLIC_INVESTMENT_CONTROLLER || "0xD879A1f57158374b1638A1b1D480b63d33Ee787F";
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  
  console.log("📍 Contracts:");
  console.log("  Registry:", PROJECT_REGISTRY);
  console.log("  Token:", TOKEN);
  console.log("  Controller:", CONTROLLER);
  
  const registry = await ethers.getContractAt("ProjectRegistry", PROJECT_REGISTRY);
  
  // Project data
  const projectData = {
    name: "Apartamento Moderno Madrid Centro",
    securityToken: TOKEN,
    investmentController: CONTROLLER,
    pricePerToken: ethers.parseEther("1"), // 1 EUR per token
    maxCap: 100, // 100 tokens
    stablecoin: USDC,
    metadataURI: "ipfs://QmProjectMetadata123",
  };
  
  console.log("\n🏠 Registering project:");
  console.log(`  Name: ${projectData.name}`);
  console.log(`  Tokens: ${projectData.maxCap}`);
  console.log(`  Price: 1 EUR per token`);
  
  try {
    const tx = await registry.registerProject(
      projectData.name,
      projectData.securityToken,
      projectData.investmentController,
      projectData.pricePerToken,
      projectData.maxCap,
      projectData.stablecoin,
      projectData.metadataURI
    );
    
    console.log("\n⏳ Transaction sent:", tx.hash);
    console.log("Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Project registered! Block:", receipt.blockNumber);
    
    // Verify
    const count = await registry.getProjectCount();
    console.log("\n📊 Total projects in registry:", count.toString());
    
    console.log("\n🎉 SUCCESS! Project now visible in dashboard!");
    console.log("🔍 Verify at:", `https://polygonscan.com/tx/${tx.hash}`);
    
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    
    if (error.message.includes("already registered")) {
      console.log("ℹ️  Project already exists in registry");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
