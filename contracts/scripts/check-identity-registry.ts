import { ethers } from "hardhat";

// Diagnóstico rápido para IdentityRegistry: verifica que la dirección tiene bytecode
// y que el método isVerified(address) responde correctamente.

// Ajusta estas constantes si deseas probar otra wallet o contrato.
const IDENTITY_REGISTRY = process.env.IDENTITY_REGISTRY || process.env.NEXT_PUBLIC_IDENTITY_REGISTRY || "0xa9be2Ab6Ee90f407D2E802E2f6D0439d067A8e82";
const TEST_INVESTOR = process.env.TEST_INVESTOR || "0xe24c92e5E86608B3029a78Dc9c8E4cAdDF69e9FB"; // Wallet registrada KYC

// ABI mínimo necesario para las llamadas de diagnóstico
const IDENTITY_REGISTRY_ABI = [
  "function isVerified(address) view returns (bool)
  ",
  "function identity(address) view returns (address)",
  "function investorCountry(address) view returns (uint16)"
];

async function main() {
  console.log("🔍 IdentityRegistry:", IDENTITY_REGISTRY);
  const code = await ethers.provider.getCode(IDENTITY_REGISTRY);
  console.log("📦 Bytecode length:", code.length);
  if (code === "0x") {
    console.error("❌ La dirección NO tiene bytecode (es EOA o mal copiada)");
    return;
  }

  const ir = new ethers.Contract(IDENTITY_REGISTRY, IDENTITY_REGISTRY_ABI, ethers.provider);
  try {
    const verified = await ir.isVerified(TEST_INVESTOR);
    const onchainId = await ir.identity(TEST_INVESTOR);
    const country = await ir.investorCountry(TEST_INVESTOR);
    console.log("✅ isVerified:", verified);
    console.log("🪪 identity():", onchainId);
    console.log("🌍 investorCountry:", country);
  } catch (e) {
    console.error("⚠️ Error llamando métodos del IdentityRegistry:", e);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
