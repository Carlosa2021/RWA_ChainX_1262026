import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  
  const CONTROLLER = "0x16377c24E52361AF460FAA064a95F7d32f522A8e";
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  
  console.log("🧪 SIMULANDO INVEST (static call)\n");
  console.log(`👤 Investor: ${signer.address}`);
  
  const controller = await ethers.getContractAt("InvestmentController", CONTROLLER);
  const usdc = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", USDC);
  
  // Get quote
  const quote = await controller.quoteUSDC(1);
  const maxWithSlippage = (quote * 10500n) / 10000n;
  
  console.log(`💵 Quote for 1 token: ${ethers.formatUnits(quote, 6)} USDC`);
  console.log(`💸 Max with slippage: ${ethers.formatUnits(maxWithSlippage, 6)} USDC`);
  
  // Check allowance
  const allowance = await usdc.allowance(signer.address, CONTROLLER);
  console.log(`✅ Current allowance: ${ethers.formatUnits(allowance, 6)} USDC`);
  
  // Check balance
  const balance = await usdc.balanceOf(signer.address);
  console.log(`💰 USDC Balance: ${ethers.formatUnits(balance, 6)} USDC\n`);
  
  // Try static call (simulation)
  try {
    console.log("🔍 Simulando invest(1, maxWithSlippage)...");
    await controller.invest.staticCall(1, maxWithSlippage);
    console.log("✅ Simulación exitosa - invest() debería funcionar");
  } catch (error: any) {
    console.log("❌ ERROR en simulación:");
    console.log(error.message);
    
    // Try to decode error
    if (error.data) {
      console.log("\n📋 Error data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
