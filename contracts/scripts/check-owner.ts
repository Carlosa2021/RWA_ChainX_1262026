import { ethers } from "hardhat";

const IDENTITY_REGISTRY = "0x41391dD49FeF214CCcCEfA3c0e7e5a8f7061B266";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Current signer:", signer.address);
  
  const identityRegistry = await ethers.getContractAt("IdentityRegistry", IDENTITY_REGISTRY);
  const owner = await identityRegistry.owner();
  
  console.log("IdentityRegistry owner:", owner);
  console.log("Are we owner?", owner.toLowerCase() === signer.address.toLowerCase());
}

main();
