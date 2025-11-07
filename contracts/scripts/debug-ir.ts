import { ethers } from "hardhat";

async function main() {
  const IDENTITY_REGISTRY = process.env.IDENTITY_REGISTRY || "0xa9be2ab6ee90f407d2e802e2f6d0439d067a8e82";
  const TEST_ADDRESS = process.env.TEST_ADDRESS || "0xA0921344cdc4B0A1058dF3dd1Ec53070333ea712";
  const [signer] = await ethers.getSigners();
  console.log("IR:", IDENTITY_REGISTRY);
  console.log("Signer:", signer.address);

  const ir = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistry.sol:IdentityRegistry",
    IDENTITY_REGISTRY
  );

  try {
    const owner = await ir.owner();
    console.log("owner():", owner);
  } catch (e:any) {
    console.log("owner() error:", e.message);
  }

  try {
    const res = await ir.addAgent.staticCall(signer.address);
    console.log("addAgent.staticCall result:", res);
  } catch (e:any) {
    console.log("addAgent.staticCall revert:", e.message);
  }

  try {
    const res2 = await ir.registerIdentity.staticCall(TEST_ADDRESS, ethers.ZeroAddress, 0);
    console.log("registerIdentity.staticCall result:", res2);
  } catch (e:any) {
    console.log("registerIdentity.staticCall revert:", e.message);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
