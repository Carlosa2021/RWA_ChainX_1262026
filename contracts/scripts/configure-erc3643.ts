import { ethers } from "hardhat";

/**
 * CONFIGURE ERC-3643 POST-DEPLOY
 * - Verify owner address
 * - Register owner identity (KYC bypass for demo)
 */

async function main() {
  console.log("\n⚙️ CONFIGURING ERC-3643 CONTRACTS...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Owner:", deployer.address);
  
  // Deployed addresses from previous deploy
  const IDENTITY_REGISTRY = "0xfe230072d7c28018220c2378e4ce5e9221637c4e";
  const TOKEN = "0xe14Ed2e9570fceC1D5d54c484D81e7F80a82b910";
  
  const identityRegistry = await ethers.getContractAt("IdentityRegistry", IDENTITY_REGISTRY);
  
  // Verify owner in IdentityRegistry para que pueda invertir
  console.log("👤 Registering OWNER identity (KYC bypass)...");
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  
  try {
    const txVerify = await identityRegistry.registerIdentity(
      deployer.address,  // TU dirección
      ZERO_ADDRESS,      // identity contract (bypass)
      0                  // country code (universal)
    );
    await txVerify.wait();
    console.log("✅ Owner verified!");
  } catch (error: any) {
    if (error.message.includes("already registered")) {
      console.log("✅ Owner already verified!");
    } else {
      console.log("❌ Error:", error.message);
    }
  }
  
  // Check verification
  const isVerified = await identityRegistry.isVerified(deployer.address);
  console.log("\n📊 Status:");
  console.log(`Owner: ${deployer.address}`);
  console.log(`Verified: ${isVerified ? "✅ YES" : "❌ NO"}`);
  
  console.log("\n✨ Configuration complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
