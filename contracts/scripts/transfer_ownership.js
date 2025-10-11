const hre = require("hardhat");
const { ethers } = hre;
require("dotenv").config();

const TOKEN_ADDR = process.env.TOKEN3643; // MockSecurityToken
const NEW_OWNER  = process.env.NEW_OWNER; // controller address

async function main() {
  if (!TOKEN_ADDR || !NEW_OWNER) throw new Error("Faltan TOKEN3643 o NEW_OWNER en .env");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const abi = [
    "function owner() view returns (address)",
    "function transferOwnership(address newOwner) external",
  ];
  const token = new ethers.Contract(TOKEN_ADDR, abi, deployer);

  const current = await token.owner();
  console.log("Current owner:", current);

  if (current.toLowerCase() === NEW_OWNER.toLowerCase()) {
    console.log("Owner ya es el controller. Nada que hacer.");
    return;
  }

  const maxFeePerGas        = ethers.parseUnits("120", "gwei");
  const maxPriorityFeePerGas= ethers.parseUnits("40",  "gwei");

  const tx = await token.transferOwnership(NEW_OWNER, { maxFeePerGas, maxPriorityFeePerGas });
  console.log("transferOwnership tx:", tx.hash);
  await tx.wait();
  console.log("Ownership transferred to:", NEW_OWNER);
}

main().catch((e)=>{ console.error(e); process.exit(1); });
