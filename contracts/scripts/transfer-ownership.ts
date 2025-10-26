import { ethers } from "hardhat";

async function main() {
  console.log("🔄 TRANSFERRING OWNERSHIP");
  console.log("====================================================");
  console.log("");
  
  const projectRegistryAddress = "0xce6658EacFc70fe142444d5E914cE756a32C6DC0";
  const newOwner = "0xe24c92e5E86608B3029a78Dc9c8E4cAdDF69e9FB";
  
  console.log("📋 TRANSFER DETAILS:");
  console.log("   Contract:", projectRegistryAddress);
  console.log("   New Owner:", newOwner);
  console.log("");

  // Get contract instance
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const projectRegistry = ProjectRegistry.attach(projectRegistryAddress);
  
  // Get current owner
  const [deployer] = await ethers.getSigners();
  console.log("   Current Owner:", deployer.address);
  console.log("");

  // Transfer ownership
  console.log("⏳ Transferring ownership...");
  const tx = await projectRegistry.transferOwnership(newOwner);
  console.log("   Transaction sent:", tx.hash);
  
  await tx.wait();
  console.log("   ✅ Transaction confirmed!");
  console.log("");

  console.log("====================================================");
  console.log("✅ OWNERSHIP TRANSFERRED!");
  console.log("====================================================");
  console.log("");
  console.log("   New Owner:", newOwner);
  console.log("");
  console.log("🔗 Verify transaction:");
  console.log(`   https://polygonscan.com/tx/${tx.hash}`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ TRANSFER FAILED:");
    console.error(error);
    process.exit(1);
  });
