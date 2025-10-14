import { ethers } from "hardhat";

/**
 * Aumentar max slippage tolerance del InvestmentController
 * Por defecto es 0.5% (50 bps), vamos a aumentarlo a 5% (500 bps)
 */

const INVESTMENT_CONTROLLER = "0x27451f36790d945D5cDfa5e95d6b5764Ed2E6897";

async function main() {
  console.log("🔧 Configurando slippage tolerance...\n");

  const [owner] = await ethers.getSigners();
  console.log("👤 Owner:", owner.address);

  const investmentController = await ethers.getContractAt("InvestmentController", INVESTMENT_CONTROLLER);

  // Check current slippage
  const currentSlippage = await investmentController.maxSlippageBps();
  console.log(`Slippage actual: ${currentSlippage} bps (${Number(currentSlippage) / 100}%)`);

  // Set to 500 bps (5%)
  console.log("\n⏳ Configurando slippage a 500 bps (5%)...");
  const tx = await investmentController.setMaxSlippageBps(500);
  await tx.wait();

  console.log("✅ Slippage actualizado!");
  console.log(`📜 Tx: ${tx.hash}`);

  // Verify
  const newSlippage = await investmentController.maxSlippageBps();
  console.log(`\n✅ Nuevo slippage: ${newSlippage} bps (${Number(newSlippage) / 100}%)`);
  console.log("\n🎯 Ahora puedes invertir con fluctuaciones de precio de hasta 5%\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
