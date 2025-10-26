import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  console.log("🚀 DEPLOYING PROJECT REGISTRY - POLYGON MAINNET");
  console.log("====================================================");
  console.log("");
  
  const clientWallet = "0xe24c92e5E86608B3029a78Dc9c8E4cAdDF69e9FB";
  
  console.log("📋 DEPLOYMENT DETAILS:");
  console.log("   Client Wallet:", clientWallet);
  console.log("   Network: Polygon Mainnet (Chain ID: 137)");
  console.log("");

  // Deploy ProjectRegistry
  console.log("📦 Deploying ProjectRegistry...");
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const projectRegistry = await ProjectRegistry.deploy();
  await projectRegistry.waitForDeployment();
  const projectRegistryAddress = await projectRegistry.getAddress();
  console.log("   ✅ ProjectRegistry deployed:", projectRegistryAddress);
  console.log("");

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log("   📌 Current owner (deployer):", deployer.address);
  console.log("");

  // IMPORTANT NOTE
  console.log("⚠️  IMPORTANT:");
  console.log("   The contract owner is currently the deployer wallet.");
  console.log("   To transfer ownership to the client, run:");
  console.log("");
  console.log("   npx hardhat run scripts/transfer-ownership.ts --network polygon");
  console.log("");

  // RESUMEN FINAL
  console.log("====================================================");
  console.log("✅ DEPLOYMENT COMPLETED!");
  console.log("====================================================");
  console.log("");
  console.log("📋 CONTRACT ADDRESS:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ProjectRegistry:", projectRegistryAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("🔗 VERIFY ON POLYGONSCAN:");
  console.log(`   https://polygonscan.com/address/${projectRegistryAddress}`);
  console.log("");
  console.log("⚙️  NEXT STEPS:");
  console.log("   1. Add to .env.local:");
  console.log(`      NEXT_PUBLIC_PROJECT_REGISTRY=${projectRegistryAddress}`);
  console.log("");
  console.log("   2. Set deployer wallet as OWNER in .env.local:");
  console.log(`      NEXT_PUBLIC_OWNER_WALLET=${deployer.address}`);
  console.log("");
  console.log("   3. Update Vercel environment variables");
  console.log("");
  console.log("   4. Connect with YOUR wallet (deployer) to create projects");
  console.log("");
  console.log("   5. Project specs for testing:");
  console.log("      - Supply: 5 tokens");
  console.log("      - Price: 1 EUR per token (100 cents)");
  console.log("      - Total Goal: 5 EUR");
  console.log("");
  console.log("💰 GAS USED: Check PolygonScan for exact POL spent");
  console.log("");

  // Guardar deployment info
  const deployment = {
    network: "polygon",
    chainId: 137,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    clientWallet: clientWallet,
    projectDetails: {
      tokenSupply: 5,
      pricePerToken: "1 EUR (100 cents)",
      totalGoal: "5 EUR"
    },
    contracts: {
      ProjectRegistry: projectRegistryAddress
    },
    verification: {
      polygonscan: `https://polygonscan.com/address/${projectRegistryAddress}`
    },
    notes: "Owner is currently deployer. Client wallet noted for future transfer."
  };

  const deploymentPath = "deployments/real-test-deployment.json";
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log(`💾 Deployment info saved to: ${deploymentPath}`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ DEPLOYMENT FAILED:");
    console.error(error);
    process.exit(1);
  });
