import { ethers } from "hardhat";

/**
 * Script para aprobar usuario en IdentityRegistry
 * Permite que la wallet pueda recibir tokens ERC-3643 (compliance)
 */

const IDENTITY_REGISTRY = "0x41391dD49FeF214CCcCEfA3c0e7e5a8f7061B266";
const USER_ADDRESS = "0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca"; // Tu wallet

async function main() {
  console.log("🔐 Aprobando usuario en IdentityRegistry...\n");

  const [owner] = await ethers.getSigners();
  console.log("👤 Owner address:", owner.address);
  console.log("🎯 Usuario a aprobar:", USER_ADDRESS);
  console.log("📋 IdentityRegistry:", IDENTITY_REGISTRY, "\n");

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

    // Register identity (simplified - in production would need actual identity contract)
    console.log("📝 Registrando identidad...");
    
    // Note: This is simplified. In production, you'd need:
    // 1. Deploy Identity contract for user
    // 2. Add claims to identity
    // 3. Register identity in registry
    
    // For testing, we'll use registerIdentity if available
    const tx = await identityRegistry.registerIdentity(
      USER_ADDRESS,
      ethers.ZeroAddress, // Mock identity contract (should be real Identity in production)
      0 // country code (0 for testing)
    );
    
    console.log("⏳ Esperando confirmación...");
    await tx.wait();
    
    console.log("✅ Usuario aprobado exitosamente!");
    console.log("🎉 Ahora puede recibir tokens ERC-3643\n");

  } catch (error: any) {
    console.error("❌ Error aprobando usuario:", error.message);
    
    if (error.message.includes("already registered")) {
      console.log("ℹ️  Usuario ya estaba registrado");
    } else {
      console.log("\n📝 Nota: Si el contrato no tiene función registerIdentity,");
      console.log("necesitarás aprobar manualmente desde el admin del IdentityRegistry");
      console.log("\nAlternativa: Usar función addIdentityToRegistry() si está disponible");
    }
  }

  // Verify final status
  console.log("\n🔍 Verificación final...");
  const finalStatus = await identityRegistry.isVerified(USER_ADDRESS);
  console.log(`Estado: ${finalStatus ? "✅ VERIFICADO" : "❌ NO VERIFICADO"}`);
  
  if (!finalStatus) {
    console.log("\n⚠️  ACCIÓN REQUERIDA:");
    console.log("El usuario necesita ser aprobado manualmente.");
    console.log("Opciones:");
    console.log("1. Usar el Admin Panel de la plataforma");
    console.log("2. Llamar directamente a IdentityRegistry desde Polygonscan");
    console.log("3. Usar Hardhat console para aprobar manualmente\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
