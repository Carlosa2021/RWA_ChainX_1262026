import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Usar la private key del inversor de prueba
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
  const signer = new ethers.Wallet(process.env.TEST_INVESTOR_PK!, provider);
  console.log("🔑 Signer (inversor):", signer.address);

  const CTRL_ADDR = process.env.INVESTMENT_CONTROLLER!;
  const USDC_ADDR = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

  // Conectar contratos CON el signer del inversor
  const ctrl = await ethers.getContractAt("ChainXInvestmentController", CTRL_ADDR, signer);
  const usdc = await ethers.getContractAt("IERC20", USDC_ADDR, signer);

  // 1. Quote USDC para 1 token
  const quote = await ctrl.quoteUSDC(1);
  console.log(`📊 Quote para 1 token: ${quote} USDC (${ethers.formatUnits(quote, 6)} USDC)`);

  // 2. Verificar balance USDC del inversor
  const balance = await usdc.balanceOf(signer.address);
  console.log(`💰 Balance USDC inversor: ${ethers.formatUnits(balance, 6)} USDC`);

  if (balance < quote) {
    throw new Error(`⛔ Balance insuficiente. Necesitas ${ethers.formatUnits(quote, 6)} USDC`);
  }

  // 3. Verificar allowance actual
  const allowance = await usdc.allowance(signer.address, CTRL_ADDR);
  console.log(`🔍 Allowance actual: ${ethers.formatUnits(allowance, 6)} USDC`);

  // 4. Aprobar si es necesario
  const approvalAmount = ethers.parseUnits("10", 6); // 10 USDC
  if (allowance < approvalAmount) {
    console.log("⏳ Aprobando 10 USDC...");
    const approveTx = await usdc.approve(CTRL_ADDR, approvalAmount);
    await approveTx.wait();
    console.log("✅ Approve confirmado:", approveTx.hash);
  } else {
    console.log("✅ Ya hay allowance suficiente");
  }

  // 5. Invest 1 token
  const maxUsdc = (quote * 10500n) / 10000n; // +5% slippage
  console.log(`💸 Invirtiendo 1 token con max USDC: ${ethers.formatUnits(maxUsdc, 6)}`);
  
  const investTx = await ctrl.invest(1, maxUsdc);
  console.log("⏳ Esperando confirmación...");
  const receipt = await investTx.wait();
  console.log("✅ Inversión exitosa!");
  console.log("📝 TX Hash:", receipt?.hash);
  console.log("⛽ Gas usado:", receipt?.gasUsed.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
