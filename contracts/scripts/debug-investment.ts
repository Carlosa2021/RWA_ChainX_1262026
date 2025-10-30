import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const investorAddress = signer.address;
  
  console.log("🔍 DEBUG INVESTMENT FLOW");
  console.log("=" .repeat(70));
  console.log(`👤 Investor: ${investorAddress}\n`);

  // Contratos
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const CONTROLLER = "0x16377c24E52361AF460FAA064a95F7d32f522A8e";
  
  const usdc = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", USDC);
  const controller = await ethers.getContractAt("InvestmentController", CONTROLLER);

  // 1. Check USDC balance
  const balance = await usdc.balanceOf(investorAddress);
  console.log(`💰 USDC Balance: ${ethers.formatUnits(balance, 6)} USDC`);

  // 2. Check allowance
  const allowance = await usdc.allowance(investorAddress, CONTROLLER);
  console.log(`✅ USDC Allowance: ${ethers.formatUnits(allowance, 6)} USDC`);

  // 3. Quote 1 token
  const quote = await controller.quoteUSDC(1);
  console.log(`💵 Price for 1 token: ${ethers.formatUnits(quote, 6)} USDC`);

  // 4. Check slippage
  const slippage = await controller.maxSlippageBps();
  console.log(`📊 Max Slippage: ${slippage} bps (${Number(slippage) / 100}%)`);

  // 5. Calculate max with slippage
  const maxWithSlippage = (quote * (10000n + BigInt(slippage))) / 10000n;
  console.log(`💸 Max with slippage: ${ethers.formatUnits(maxWithSlippage, 6)} USDC`);

  console.log("\n" + "=".repeat(70));
  
  if (allowance < quote) {
    console.log("❌ PROBLEMA: Allowance insuficiente");
    console.log(`   Necesitas aprobar al menos: ${ethers.formatUnits(quote, 6)} USDC`);
  } else if (balance < quote) {
    console.log("❌ PROBLEMA: Balance insuficiente");
    console.log(`   Necesitas al menos: ${ethers.formatUnits(quote, 6)} USDC`);
  } else {
    console.log("✅ TODO OK - Puedes invertir");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
