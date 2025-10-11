const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Token = await ethers.getContractFactory("MockSecurityToken");

  // Config del token mock (ajústalo si quieres)
  const NAME = "InmoShare A";
  const SYMBOL = "IMSA";
  const DECIMALS = 0; // participaciones indivisibles

  // Límites EIP-1559 (ajústalos si tu RPC lo requiere)
  const maxFeePerGas = ethers.parseUnits("120", "gwei");
  const maxPriorityFeePerGas = ethers.parseUnits("40", "gwei");

  const token = await Token.deploy(NAME, SYMBOL, DECIMALS, {
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("MockSecurityToken deployed at:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
