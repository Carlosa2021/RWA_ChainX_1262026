import { ethers } from "hardhat";

async function main() {
  const IR_ADDR = process.env.IDENTITY_REGISTRY || "0xa9be2ab6ee90f407d2e802e2f6d0439d067a8e82";
  const ir = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistry.sol:IdentityRegistry",
    IR_ADDR
  );

  const storageAddr = await ir.identityStorage();
  console.log("IdentityRegistry:", IR_ADDR);
  console.log("Storage:", storageAddr);

  const storage = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistryStorage.sol:IdentityRegistryStorage",
    storageAddr
  );

  try {
    const owner = await storage.owner();
    console.log("IRS.owner():", owner);
    const regs = await storage.linkedIdentityRegistries();
    console.log("linkedIdentityRegistries:", regs);
  } catch (e:any) {
    console.log("linkedIdentityRegistries error:", e.message);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
