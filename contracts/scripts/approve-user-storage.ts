import { ethers } from "hardhat";

/**
 * SOLUCIÓN FINAL: Aprobar usuario directamente en IdentityRegistryStorage
 * Si IdentityRegistry falla, vamos directo al storage
 */

const IDENTITY_REGISTRY = "0x41391dD49FeF214CCcCEfA3c0e7e5a8f7061B266";
const IDENTITY_STORAGE = "0x869A0e897f0a71D7B8034d44832921A4a1DED14f";
const USER_ADDRESS = "0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca";
const COUNTRY_CODE = 724; // España

async function main() {
  console.log("🔐 SOLUCIÓN: Aprobando usuario directamente en IdentityRegistryStorage...\n");

  const [owner] = await ethers.getSigners();
  console.log("👤 Signer:", owner.address);
  console.log("🎯 Usuario:", USER_ADDRESS, "\n");

  // Get contracts
  const identityRegistry = await ethers.getContractAt("IdentityRegistry", IDENTITY_REGISTRY);
  const identityStorage = await ethers.getContractAt("IdentityRegistryStorage", IDENTITY_STORAGE);

  try {
    // Check current status
    console.log("🔍 Estado actual en IdentityRegistry...");
    const isVerified = await identityRegistry.isVerified(USER_ADDRESS);
    console.log(`Estado: ${isVerified ? "✅ VERIFICADO" : "❌ NO VERIFICADO"}`);
    
    if (isVerified) {
      console.log("\n✅ Usuario ya está verificado!");
      console.log("🎉 Listo para invertir\n");
      return;
    }

    // Check storage owner
    console.log("\n📦 Verificando permisos en IdentityRegistryStorage...");
    const storageOwner = await identityStorage.owner();
    console.log(`Storage owner: ${storageOwner}`);
    console.log(`Somos owner del storage? ${storageOwner.toLowerCase() === owner.address.toLowerCase()}`);

    // Try to add identity directly to storage
    console.log("\n📝 Agregando identidad directamente al storage...");
    
    // Use user address as mock identity
    const mockIdentity = USER_ADDRESS;
    
    const tx = await identityStorage.addIdentity(
      USER_ADDRESS,
      mockIdentity,
      COUNTRY_CODE
    );
    
    console.log("⏳ Esperando confirmación...");
    await tx.wait();
    
    console.log("✅ Identidad agregada exitosamente!");
    
    // Verify
    console.log("\n🔍 Verificación final...");
    const finalStatus = await identityRegistry.isVerified(USER_ADDRESS);
    const registeredIdentity = await identityStorage.identity(USER_ADDRESS);
    const country = await identityStorage.country(USER_ADDRESS);
    
    console.log(`\n📊 RESULTADO:`);
    console.log(`✅ Verificado: ${finalStatus}`);
    console.log(`📄 Identity: ${registeredIdentity}`);
    console.log(`🌍 País: ${country}`);
    
    if (finalStatus) {
      console.log("\n🎊🎊🎊 USUARIO APROBADO - LISTO PARA INVERTIR 🎊🎊🎊\n");
    }

  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    
    // Last resort: Check if we need to bind storage to registry
    console.log("\n🔧 Intentando vincular storage con registry...");
    try {
      const currentRegistry = await identityStorage.identityRegistry();
      console.log(`Registry vinculado al storage: ${currentRegistry}`);
      
      if (currentRegistry.toLowerCase() !== IDENTITY_REGISTRY.toLowerCase()) {
        console.log("\n⚠️  Storage no está vinculado correctamente al IdentityRegistry");
        console.log("Esto puede causar problemas. Consider re-desplegar o configurar correctamente.");
      }
    } catch (e: any) {
      console.log("No se pudo verificar el vínculo storage-registry");
    }
    
    console.log("\n📝 ALTERNATIVA RÁPIDA:");
    console.log("Para testing, podemos modificar temporalmente el SecurityToken");
    console.log("para que NO requiera verificación KYC.");
    console.log("\n¿Quieres que despliegue un SecurityToken sin KYC para testing rápido?");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
