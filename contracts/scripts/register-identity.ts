import { ethers } from "hardhat";

/**
 * Registra una dirección en el IdentityRegistry (isVerified = true).
 * ENV requeridas:
 * - IDENTITY_REGISTRY: dirección del IdentityRegistry
 * - USER_ADDRESS: dirección a registrar (por ejemplo, InvestmentController)
 * - IDENTITY (opcional): onchainID; por defecto 0x0
 * - COUNTRY (opcional): uint16; por defecto 0
 */
async function main() {
  const IDENTITY_REGISTRY = process.env.IDENTITY_REGISTRY as string;
  const USER_ADDRESS = process.env.USER_ADDRESS as string;
  const IDENTITY = (process.env.IDENTITY as `0x${string}`) ?? ethers.ZeroAddress;
  const COUNTRY = Number(process.env.COUNTRY ?? 0);
  if (!IDENTITY_REGISTRY || !USER_ADDRESS) throw new Error("Faltan IDENTITY_REGISTRY o USER_ADDRESS");

  const [signer] = await ethers.getSigners();
  console.log("\n👤 Signer:", signer.address);

  const ir = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistry.sol:IdentityRegistry",
    IDENTITY_REGISTRY
  );

  console.log(`\n📝 Registrando identidad ${USER_ADDRESS} en ${IDENTITY_REGISTRY}`);
  const tx = await ir.registerIdentity(USER_ADDRESS, IDENTITY, COUNTRY);
  console.log("⏳ tx:", tx.hash);
  const rc = await tx.wait();
  console.log("✅ Identidad registrada. Gas:", rc?.gasUsed?.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
