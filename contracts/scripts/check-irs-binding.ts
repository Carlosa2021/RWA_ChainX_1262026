import { ethers } from "hardhat";

async function main() {
  const IDENTITY_STORAGE = process.env.IDENTITY_STORAGE as string;
  const IDENTITY_REGISTRY = process.env.IDENTITY_REGISTRY as string;
  if (!IDENTITY_STORAGE || !IDENTITY_REGISTRY) throw new Error("Faltan ENV: IDENTITY_STORAGE o IDENTITY_REGISTRY");

  const irs = await ethers.getContractAt(
    [
      "function isAgent(address _agent) view returns (bool)",
      "function linkedIdentityRegistries() view returns (address[] memory)",
      "function owner() view returns (address)",
    ],
    IDENTITY_STORAGE
  );

  const isIRAgent = await irs.isAgent(IDENTITY_REGISTRY);
  const linked = await irs.linkedIdentityRegistries();
  const owner = await irs.owner();

  console.log("IRS:", IDENTITY_STORAGE);
  console.log("IR:", IDENTITY_REGISTRY);
  console.log("IRS.owner:", owner);
  console.log("IRS.isAgent(IR):", isIRAgent);
  console.log("IRS.linkedIdentityRegistries:", linked);
}

main().catch((e) => { console.error(e); process.exit(1); });
