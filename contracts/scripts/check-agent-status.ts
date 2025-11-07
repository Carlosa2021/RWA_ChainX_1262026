import { ethers } from "hardhat";

async function main() {
  // Usa la dirección que realmente quieres verificar (ajustada a la última deployment)
  // Cambia aquí si corresponde. La discrepancia entre 0x3E915D4A... y 0xa9be2ab6... te está causando el revert.
  const IDENTITY_REGISTRY = process.env.IDENTITY_REGISTRY || "0xa9be2ab6ee90f407d2e802e2f6d0439d067a8e82";
  const [deployer] = await ethers.getSigners();

  const IdentityRegistry = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/interface/IIdentityRegistry.sol:IIdentityRegistry",
    IDENTITY_REGISTRY
  );

  console.log("🔍 Verificando roles...\n");
  console.log("Wallet:", deployer.address);
  console.log("IdentityRegistry:", IDENTITY_REGISTRY);
  
  try {
    // Intentar llamar una función que solo agents pueden ejecutar
    const TEST_ADDRESS = process.env.TEST_ADDRESS || "0xA0921344cdc4B0A1058dF3dd1Ec53070333ea712"; // InvestmentController
    await IdentityRegistry.registerIdentity.staticCall(
      TEST_ADDRESS,
      ethers.ZeroAddress,
      0
    );
    console.log("✅ Eres agent del IdentityRegistry");
  } catch (error: any) {
    if (error.message.includes("AgentRole")) {
      console.log("❌ NO eres agent del IdentityRegistry");
      console.log("\n💡 Espera 1-2 minutos y vuelve a intentar (la blockchain necesita sincronizar)");
    } else if (error.message.includes("already registered")) {
      console.log("✅ Eres agent (el contrato ya está registrado)");
    } else {
      console.log("⚠️ Error:", error.message);
    }
  }
}

main().then(() => process.exit(0)).catch(console.error);
