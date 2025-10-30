import { ethers } from "hardhat";

/**
 * 🧹 DEPLOY CLEAN PROJECTREGISTRY FOR PRODUCTION
 * - Brand new registry with ZERO projects
 * - Only Alzira project will be registered manually after
 */

async function main() {
  console.log("\n🧹 DEPLOYING CLEAN PROJECTREGISTRY...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  // Deploy fresh ProjectRegistry
  console.log("📋 Deploying ProjectRegistry (CLEAN)...");
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const registry = await ProjectRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  
  console.log("✅ Clean ProjectRegistry:", registryAddress);
  
  // Verify it's empty
  const projectCount = await registry.getProjectCount();
  console.log("📊 Projects in registry:", projectCount.toString());
  
  if (projectCount > 0n) {
    console.log("⚠️  WARNING: Registry is not empty!");
  } else {
    console.log("✅ Registry is CLEAN (0 projects)");
  }
  
  console.log("\n" + "=".repeat(70));
  console.log("🎉 CLEAN REGISTRY DEPLOYED");
  console.log("=".repeat(70));
  console.log("\n📝 UPDATE .env.local:\n");
  console.log(`NEXT_PUBLIC_PROJECT_REGISTRY=${registryAddress}`);
  console.log("\n⚠️  IMPORTANT: Register ONLY real projects in this registry!");
  console.log("❌ NO test/demo/mock projects allowed");
  console.log("\n✅ Ready for production use\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
