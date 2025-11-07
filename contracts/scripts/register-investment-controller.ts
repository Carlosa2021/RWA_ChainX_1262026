import { ethers } from "hardhat";

async function main() {
  console.log("🔐 Registrando InvestmentController en IdentityRegistry...\n");

  // Direcciones por ENV
  const IDENTITY_REGISTRY = process.env.IDENTITY_REGISTRY as string;
  const INVESTMENT_CONTROLLER = process.env.INVESTMENT_CONTROLLER as string;
  if (!IDENTITY_REGISTRY || !INVESTMENT_CONTROLLER) {
    throw new Error("Faltan ENV: IDENTITY_REGISTRY o INVESTMENT_CONTROLLER");
  }
  
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deployer:", deployer.address);

  // Obtener instancia del IdentityRegistry
  const IdentityRegistry = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/interface/IIdentityRegistry.sol:IIdentityRegistry",
    IDENTITY_REGISTRY
  );

  console.log("🎯 IdentityRegistry:", IDENTITY_REGISTRY);
  console.log("🏭 InvestmentController:", INVESTMENT_CONTROLLER);

  // Registrar identidad (address 0x0 como onchainID, país 0 = sin restricción)
  console.log("\n📝 Registrando identidad...");
  
  try {
    const tx = await IdentityRegistry.registerIdentity(
      INVESTMENT_CONTROLLER,
      ethers.ZeroAddress, // Sin OnchainID para contratos
      0 // País 0 = sin restricción geográfica
    );
    
    console.log("⏳ Esperando confirmación...");
    const receipt = await tx.wait();
    
    console.log("✅ Identidad registrada!");
    console.log("📝 TX Hash:", receipt.hash);
    console.log("⛽ Gas usado:", receipt.gasUsed.toString());

    // Verificar registro
    const isVerified = await IdentityRegistry.isVerified(INVESTMENT_CONTROLLER);
    console.log("\n🔍 Verificación:");
    console.log("   ¿Está verificado?:", isVerified ? "✅ SÍ" : "❌ NO");

    if (isVerified) {
      console.log("\n🎉 ¡Listo! Ahora ejecuta:");
      console.log("   npx hardhat run scripts/mint-tokens.ts --network polygon\n");
    }

  } catch (error: any) {
    console.error("❌ Error al registrar identidad:");
    console.error(error.message);
    
    if (error.message.includes("already registered")) {
      console.log("\n✅ El InvestmentController ya está registrado.");
      console.log("   Puedes continuar con el mint.\n");
    }
    
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
