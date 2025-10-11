const hre = require("hardhat");
const { ethers } = hre;
require("dotenv").config();

// Polygon mainnet
const USDC    = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
const EUR_USD = "0x73366Fe0AA0Ded304479862808e02506FE556a98";

// .env
const { TOKEN3643, TREASURY } = process.env;

// Piloto: 5 tokens * 1 EUR
const PRICE_EURO_CENTS = 100;
const HARD_CAP = 5;

async function main() {
  if (!TOKEN3643 || !TREASURY) {
    throw new Error("Faltan TOKEN3643 o TREASURY en .env");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Controller = await ethers.getContractFactory("InvestmentController");

  // límites EIP-1559 razonables (ajusta si tu RPC los exige)
  const maxFeePerGas = ethers.parseUnits("120", "gwei");
  const maxPriorityFeePerGas = ethers.parseUnits("40", "gwei");

  const ctrl = await Controller.deploy(
    TOKEN3643,
    USDC,
    TREASURY,
    EUR_USD,
    PRICE_EURO_CENTS,
    HARD_CAP,
    { maxFeePerGas, maxPriorityFeePerGas }
  );
  await ctrl.waitForDeployment();

  const address = await ctrl.getAddress();
  console.log("InvestmentController deployed at:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
