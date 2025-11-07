import { ethers } from "hardhat";

async function main() {
  const IDENTITY_STORAGE = process.env.IDENTITY_STORAGE || "0x9Ad9Aae89a2c9905D50680bDB70C316b559CDA95";
  const IDENTITY_REGISTRY = process.env.IDENTITY_REGISTRY || "0xa9be2ab6ee90f407d2e802e2f6d0439d067a8e82";

  const irs = await ethers.getContractAt(
    [
      "function bindIdentityRegistry(address _identityRegistry) external",
      "function linkedIdentityRegistries() view returns (address[] memory)",
      "function isAgent(address _agent) view returns (bool)",
      "function owner() view returns (address)",
      "function init() external",
    ],
    IDENTITY_STORAGE
  );

  const owner = await irs.owner();
  console.log("IRS.owner():", owner);
  if (owner === ethers.ZeroAddress) {
    console.log("⚠️ IRS no inicializado. Ejecutando init() para establecer owner...");
    const tx0 = await irs.init();
    console.log("⏳ init tx:", tx0.hash);
    await tx0.wait();
    console.log("✅ init() OK");
  }

  const already = await irs.linkedIdentityRegistries();
  if (already.includes(IDENTITY_REGISTRY)) {
    console.log("ℹ️ Ya estaba vinculada. Nada que hacer.");
  } else {
    console.log("🔗 Vinculando IR en IRS...");
    const tx = await irs.bindIdentityRegistry(IDENTITY_REGISTRY);
    console.log("⏳ tx:", tx.hash);
    const rc = await tx.wait();
    console.log("✅ Hecho. Gas:", rc?.gasUsed?.toString());
  }

  const linked = await irs.linkedIdentityRegistries();
  const isAgent = await irs.isAgent(IDENTITY_REGISTRY);
  console.log("IRS.linked:", linked);
  console.log("IRS.isAgent(IR):", isAgent);
}

main().catch((e) => { console.error(e); process.exit(1); });
