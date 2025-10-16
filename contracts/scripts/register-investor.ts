/**
 * Script para registrar un inversor en el IdentityRegistry
 * Necesario para poder comprar tokens ERC-3643
 * 
 * Ejecutar: npx hardhat run scripts/register-investor.ts --network polygon
 */

import { ethers } from "hardhat";

async function main() {
  console.log("🔐 Registrando inversor en IdentityRegistry...");
  console.log("━".repeat(60));

  const [deployer] = await ethers.getSigners();
  console.log("📝 Cuenta:", deployer.address);

  const IDENTITY_REGISTRY = "0x41391dd49fef214ccccefa3c0e7e5a8f7061b266";
  
  // Conectar al IdentityRegistry
  const identityRegistry = await ethers.getContractAt("IdentityRegistry", IDENTITY_REGISTRY);
  
  // Verificar si ya está registrado
  const isVerified = await identityRegistry.isVerified(deployer.address);
  
  if (isVerified) {
    console.log("✅ Ya estás verificado en IdentityRegistry");
    console.log("   Puedes comprar tokens sin problemas");
    return;
  }
  
  console.log("⚠️  No estás verificado. Registrando...");
  
  // Registrar inversor
  // El IdentityRegistry necesita que el owner lo registre
  // Como eres el deployer, deberías tener permisos
  const tx = await identityRegistry.registerIdentity(
    deployer.address,    // investor
    deployer.address,    // identity (onchainID - usamos la misma dirección)
    724                  // country code (724 = España según ISO 3166-1)
  );
  
  await tx.wait();
  
  console.log("✅ Inversor registrado exitosamente");
  console.log("   Dirección:", deployer.address);
  console.log("   OnchainID:", deployer.address);
  
  // Verificar de nuevo
  const nowVerified = await identityRegistry.isVerified(deployer.address);
  console.log("   Estado verificado:", nowVerified);
  
  console.log("━".repeat(60));
  console.log("🎉 ¡Listo! Ahora puedes comprar tokens en Test Alicante 2025");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
