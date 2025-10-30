import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const investor = signer.address;
  
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const CONTROLLER = "0x4354Ac2A12b0eCeb85F5fa3328a7C3ADEBDd8fb7";
  
  console.log("\n🔍 VERIFICANDO ALLOWANCE Y BALANCE...\n");
  console.log("Investor:", investor);
  console.log("Controller:", CONTROLLER);
  
  const usdc = await ethers.getContractAt("IERC20", USDC);
  const controller = await ethers.getContractAt("InvestmentController", CONTROLLER);
  
  // 1. Balance USDC
  const balance = await usdc.balanceOf(investor);
  console.log("\n💰 Balance USDC:", ethers.formatUnits(balance, 6), "USDC");
  
  // 2. Allowance
  const allowance = await usdc.allowance(investor, CONTROLLER);
  console.log("✅ Allowance:", ethers.formatUnits(allowance, 6), "USDC");
  
  // 3. Quote para 1 token
  const quote = await controller.quoteUSDC(1);
  console.log("\n💵 Precio 1 token:", ethers.formatUnits(quote, 6), "USDC");
  
  // 4. Slippage
  const slippage = await controller.maxSlippageBps();
  console.log("📊 Slippage:", slippage, "bps");
  
  // 5. Max con slippage
  const maxUsdc = (quote * (10000n + slippage)) / 10000n;
  console.log("💸 Max USDC (con slippage):", ethers.formatUnits(maxUsdc, 6), "USDC");
  
  // Comparaciones
  console.log("\n" + "=".repeat(60));
  if (balance < quote) {
    console.log("❌ PROBLEMA: Balance insuficiente");
    console.log(`   Tienes: ${ethers.formatUnits(balance, 6)} USDC`);
    console.log(`   Necesitas: ${ethers.formatUnits(quote, 6)} USDC`);
  } else {
    console.log("✅ Balance suficiente");
  }
  
  if (allowance < quote) {
    console.log("❌ PROBLEMA: Allowance insuficiente");
    console.log(`   Aprobado: ${ethers.formatUnits(allowance, 6)} USDC`);
    console.log(`   Necesario: ${ethers.formatUnits(quote, 6)} USDC`);
  } else {
    console.log("✅ Allowance suficiente");
  }
  
  console.log("=".repeat(60) + "\n");
}

main().catch(console.error);
