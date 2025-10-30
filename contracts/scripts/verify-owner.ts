import { ethers } from "hardhat";

/**
 * VERIFY OWNER IN IDENTITYREGISTRY (KYC BYPASS)
 * Para que puedas invertir sin restricciones
 */

async function main() {
  console.log("\n👤 VERIFYING OWNER IN IDENTITYREGISTRY...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Owner:", deployer.address);
  
  const IDENTITY_REGISTRY = "0xfe230072d7c28018220c2378e4ce5e9221637c4e";
  const IDENTITY_STORAGE = "0xF3440112a9E6Df247a3b9155b8839c3c1283357c";
  
  const storage = await ethers.getContractAt("IdentityRegistryStorage", IDENTITY_STORAGE);
  
  console.log("📝 Adding owner to storage...");
  
  try {
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    
    // Add identity to storage
    const tx = await storage.addIdentity(
      deployer.address,  // investor
      ZERO_ADDRESS,      // identity contract (bypass)
      0                  // country (universal)
    );
    
    console.log("⏳ Transaction:", tx.hash);
    await tx.wait();
    console.log("✅ Owner verified!");
    
    // Check
    const identity = await storage.identity(deployer.address);
    console.log("\n📊 Status:");
    console.log("  Address:", deployer.address);
    console.log("  Identity:", identity);
    console.log("\n✅ YOU CAN NOW INVEST!");
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
