import { ethers } from "hardhat";

async function main() {
  const IDENTITY_STORAGE = process.env.IDENTITY_STORAGE as string;
  if (!IDENTITY_STORAGE) throw new Error("Falta IDENTITY_STORAGE");

  const irs = await ethers.getContractAt(
    [
      "function init() external",
      "function owner() view returns (address)",
    ],
    IDENTITY_STORAGE
  );

  console.log("🧩 Inicializando IdentityRegistryStorage...");
  const tx = await irs.init();
  console.log("⏳ tx:", tx.hash);
  const rc = await tx.wait();
  console.log("✅ Hecho. Gas:", rc?.gasUsed?.toString());
  const owner = await irs.owner();
  console.log("👑 Nuevo owner:", owner);
}

main().catch((e) => { console.error(e); process.exit(1); });
