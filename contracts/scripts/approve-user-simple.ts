import { ethers } from "hardhat";

/**
 * Script SIMPLIFICADO para aprobar usuario en IdentityRegistry
 * Crea un Identity contract mock y registra al usuario
 */

const IDENTITY_REGISTRY = "0x41391dD49FeF214CCcCEfA3c0e7e5a8f7061B266";
const USER_ADDRESS = "0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca"; // Tu wallet
const COUNTRY_CODE = 724; // España

async function main() {
  console.log("🔐 Aprobando usuario en IdentityRegistry (con Identity contract)...\n");

  const [owner] = await ethers.getSigners();
  console.log("👤 Owner address:", owner.address);
  console.log("🎯 Usuario a aprobar:", USER_ADDRESS);
  console.log("🌍 País:", COUNTRY_CODE, "(España)\n");

  // Get IdentityRegistry contract
  const identityRegistry = await ethers.getContractAt("IdentityRegistry", IDENTITY_REGISTRY);

  try {
    // Check if already verified
    console.log("🔍 Verificando estado actual...");
    const isVerified = await identityRegistry.isVerified(USER_ADDRESS);
    
    if (isVerified) {
      console.log("✅ Usuario YA está verificado en IdentityRegistry!");
      console.log("🎉 Puede invertir sin problemas\n");
      return;
    }

    console.log("⚠️  Usuario NO está verificado. Procediendo a aprobar...\n");

    // Get IdentityRegistryStorage address
    const storageAddress = await identityRegistry.identityStorage();
    console.log("📦 IdentityRegistryStorage:", storageAddress);

    // Option 1: Register with a valid mock identity address
    console.log("\n📝 Registrando usuario con identity simplificada...");
    console.log("⚠️  Nota: Usando wallet address como identity para testing rápido\n");

    // For testing, use the user's address as the identity contract address
    // In production, this would be a deployed Identity contract
    const mockIdentityAddress = USER_ADDRESS;
    
    console.log("🆔 Mock Identity Address:", mockIdentityAddress);
    
    const tx = await identityRegistry.registerIdentity(
      USER_ADDRESS,
      mockIdentityAddress, // Mock identity contract
      COUNTRY_CODE
    );
    
    console.log("⏳ Esperando confirmación...");
    const receipt = await tx.wait();
    
    console.log("✅ Usuario aprobado exitosamente!");
    console.log("📋 Transaction hash:", receipt.hash);
    console.log("🎉 Ahora puede recibir tokens ERC-3643\n");

    // Verify final status
    console.log("🔍 Verificación final...");
    const finalStatus = await identityRegistry.isVerified(USER_ADDRESS);
    console.log(`Estado: ${finalStatus ? "✅ VERIFICADO" : "❌ NO VERIFICADO"}`);
    
    if (finalStatus) {
      const registeredIdentity = await identityRegistry.identity(USER_ADDRESS);
      const country = await identityRegistry.investorCountry(USER_ADDRESS);
      console.log(`📄 Identity registrada: ${registeredIdentity}`);
      console.log(`🌍 País: ${country}`);
      console.log("\n🎊 LISTO PARA INVERTIR! 🎊\n");
    }

  } catch (error: any) {
    console.error("❌ Error aprobando usuario:", error);
    
    if (error.message.includes("already registered") || error.message.includes("already exists")) {
      console.log("\nℹ️  Usuario ya estaba registrado. Verificando...");
      const isVerified = await identityRegistry.isVerified(USER_ADDRESS);
      if (isVerified) {
        console.log("✅ Usuario está verificado y listo para invertir!");
      }
    } else {
      console.log("\n❌ No se pudo aprobar automáticamente.");
      console.log("\n📝 Alternativas:");
      console.log("1. Verificar que eres el owner del IdentityRegistry");
      console.log("2. Usar PolygonScan para llamar registerIdentity() manualmente");
      console.log("3. Simplificar el proceso de KYC para testing\n");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
