import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  console.log("🚀 DEPLOYING REAL ESTATE PROJECT - POLYGON MAINNET");
  console.log("====================================================");
  console.log("");
  
  const ownerWallet = "0xe24c92e5E86608B3029a78Dc9c8E4cAdDF69e9FB";
  
  console.log("📋 PROJECT DETAILS:");
  console.log("   Owner Wallet:", ownerWallet);
  console.log("   Token Supply: 5 tokens");
  console.log("   Price per Token: 1 EUR");
  console.log("   Total Investment Goal: 5 EUR");
  console.log("");

  // 1. Deploy ProjectRegistry
  console.log("📦 Step 1/3: Deploying ProjectRegistry...");
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const projectRegistry = await ProjectRegistry.deploy();
  await projectRegistry.waitForDeployment();
  const projectRegistryAddress = await projectRegistry.getAddress();
  console.log("   ✅ ProjectRegistry deployed:", projectRegistryAddress);
  
  // Transfer ownership to client
  console.log("   🔄 Transferring ownership to client...");
  const transferTx1 = await projectRegistry.transferOwnership(ownerWallet);
  await transferTx1.wait();
  console.log("   ✅ Ownership transferred to:", ownerWallet);
  console.log("");

  // 2. Deploy InvestmentController
  console.log("📦 Step 2/3: Deploying InvestmentController...");
  const InvestmentController = await ethers.getContractFactory("InvestmentController");
  const investmentController = await InvestmentController.deploy(
    projectRegistryAddress
  );
  await investmentController.waitForDeployment();
  const investmentControllerAddress = await investmentController.getAddress();
  console.log("   ✅ InvestmentController deployed:", investmentControllerAddress);
  
  // Transfer ownership to client
  console.log("   🔄 Transferring ownership to client...");
  const transferTx2 = await investmentController.transferOwnership(ownerWallet);
  await transferTx2.wait();
  console.log("   ✅ Ownership transferred to:", ownerWallet);
  console.log("");

  // 3. Deploy PayoutDistributor
  console.log("📦 Step 3/3: Deploying PayoutDistributor...");
  const PayoutDistributor = await ethers.getContractFactory("PayoutDistributor");
  const payoutDistributor = await PayoutDistributor.deploy(
    projectRegistryAddress
  );
  await payoutDistributor.waitForDeployment();
  const payoutDistributorAddress = await payoutDistributor.getAddress();
  console.log("   ✅ PayoutDistributor deployed:", payoutDistributorAddress);
  
  // Transfer ownership to client
  console.log("   🔄 Transferring ownership to client...");
  const transferTx3 = await payoutDistributor.transferOwnership(ownerWallet);
  await transferTx3.wait();
  console.log("   ✅ Ownership transferred to:", ownerWallet);
  console.log("");

  // RESUMEN FINAL
  console.log("====================================================");
  console.log("✅ DEPLOYMENT COMPLETED SUCCESSFULLY!");
  console.log("====================================================");
  console.log("");
  console.log("📋 CONTRACT ADDRESSES (SAVE THESE!):");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ProjectRegistry:      ", projectRegistryAddress);
  console.log("InvestmentController: ", investmentControllerAddress);
  console.log("PayoutDistributor:    ", payoutDistributorAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("🔗 VERIFY ON POLYGONSCAN:");
  console.log(`   https://polygonscan.com/address/${projectRegistryAddress}`);
  console.log(`   https://polygonscan.com/address/${investmentControllerAddress}`);
  console.log(`   https://polygonscan.com/address/${payoutDistributorAddress}`);
  console.log("");
  console.log("⚙️  NEXT STEPS:");
  console.log("   1. Copy the 3 addresses above");
  console.log("   2. Add them to your .env.local:");
  console.log(`      NEXT_PUBLIC_PROJECT_REGISTRY=${projectRegistryAddress}`);
  console.log(`      NEXT_PUBLIC_INVESTMENT_CONTROLLER=${investmentControllerAddress}`);
  console.log(`      NEXT_PUBLIC_PAYOUT_DISTRIBUTOR=${payoutDistributorAddress}`);
  console.log("   3. Update Vercel environment variables");
  console.log("   4. Owner can now create projects with:");
  console.log("      - Supply: 5 tokens");
  console.log("      - Price: 1 EUR per token");
  console.log("");
  console.log("💰 GAS USED: Check your wallet for exact POL spent");
  console.log("");

  // Guardar deployment info
  const deployment = {
    network: "polygon",
    chainId: 137,
    timestamp: new Date().toISOString(),
    owner: ownerWallet,
    projectDetails: {
      tokenSupply: 5,
      pricePerToken: "1 EUR",
      totalGoal: "5 EUR"
    },
    contracts: {
      ProjectRegistry: projectRegistryAddress,
      InvestmentController: investmentControllerAddress,
      PayoutDistributor: payoutDistributorAddress
    },
    verification: {
      polygonscan: [
        `https://polygonscan.com/address/${projectRegistryAddress}`,
        `https://polygonscan.com/address/${investmentControllerAddress}`,
        `https://polygonscan.com/address/${payoutDistributorAddress}`
      ]
    }
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
