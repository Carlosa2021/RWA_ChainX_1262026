import { ethers } from "hardhat";

async function main() {
  const IR = process.env.IDENTITY_REGISTRY || "0xa9be2ab6ee90f407d2e802e2f6d0439d067a8e82";
  const [signer] = await ethers.getSigners();
  const addr = signer.address;

  const ir = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistry.sol:IdentityRegistry",
    IR
  );

  const owner = await ir.owner();
  const isAgent = await ir.isAgent(addr);
  console.log("IR:", IR);
  console.log("owner():", owner);
  console.log("signer:", addr);
  console.log("isAgent(signer):", isAgent);
}

main().catch((e) => { console.error(e); process.exit(1); });
import { ethers } from "hardhat";

async function main() {
  const IDENTITY_REGISTRY = process.env.IDENTITY_REGISTRY as string;
  if (!IDENTITY_REGISTRY) throw new Error("Falta IDENTITY_REGISTRY");

  const [signer] = await ethers.getSigners();
  const ir = await ethers.getContractAt(
    [
      "function isAgent(address _agent) view returns (bool)",
      "function owner() view returns (address)",
    ],
    IDENTITY_REGISTRY
  );

  const isAgent = await ir.isAgent(signer.address);
  const owner = await ir.owner();

  console.log("IR:", IDENTITY_REGISTRY);
  console.log("Signer:", signer.address);
  console.log("Owner:", owner);
  console.log("isAgent:", isAgent);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
