import { ethers } from "hardhat";

async function main() {
  const IR = process.env.IDENTITY_REGISTRY || "0xa9be2ab6ee90f407d2e802e2f6d0439d067a8e82";
  const ir = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistry.sol:IdentityRegistry",
    IR
  );

  const topics = await ir.topicsRegistry();
  const issuers = await ir.issuersRegistry();
  const storageAddr = await ir.identityStorage();
  const owner = await ir.owner();

  console.log("IR:", IR);
  console.log("owner():", owner);
  console.log("topicsRegistry():", topics);
  console.log("trustedIssuersRegistry():", issuers);
  console.log("identityStorage():", storageAddr);

  const irs = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistryStorage.sol:IdentityRegistryStorage",
    storageAddr
  );
  const linked = await irs.linkedIdentityRegistries();
  const isAgent = await irs.isAgent(IR);
  console.log("IRS.linkedIdentityRegistries():", linked);
  console.log("IRS.isAgent(IR):", isAgent);
}

main().catch((e) => { console.error(e); process.exit(1); });
