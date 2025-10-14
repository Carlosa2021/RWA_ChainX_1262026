import { ethers } from "hardhat";

/**
 * 🎯 PRIMERA INVERSIÓN REAL EN BLOCKCHAIN
 * Comprar 1 token de test campaign (€1) pagando con USDC
 * 
 * IMPORTANTE: Los tokens son INDIVISIBLES (como NFTs)
 * - No tienen decimales (decimals = 0 efectivamente para compra)
 * - Se compran en unidades enteras: 1, 2, 3... NO 0.5 o 1.5
 */

// Contratos desplegados
const INVESTMENT_CONTROLLER = "0x27451f36790d945D5cDfa5e95d6b5764Ed2E6897";
const SECURITY_TOKEN = "0xA15b7BFdc26eEE1e4687D45cd2C9d6049956fd45";
const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98";

// Cantidad a invertir: 1 token COMPLETO (indivisible)
const TOKENS_TO_BUY = BigInt(1); // 1 token (sin decimales)

async function main() {
  console.log("🚀 INICIANDO PRIMERA INVERSIÓN REAL\n");
  console.log("═══════════════════════════════════════════════════\n");

  const [investor] = await ethers.getSigners();
  console.log("👤 Inversor:", investor.address);
  
  // Get contracts
  const investmentController = await ethers.getContractAt("InvestmentController", INVESTMENT_CONTROLLER);
  const securityToken = await ethers.getContractAt("SecurityToken", SECURITY_TOKEN);
  const usdc = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", USDC_ADDRESS);
  
  console.log("\n📊 INFORMACIÓN PRE-INVERSIÓN");
  console.log("─────────────────────────────────────────────────");
  
  // Check USDC balance
  const usdcBalance = await usdc.balanceOf(investor.address);
  console.log(`💵 Balance USDC: ${ethers.formatUnits(usdcBalance, 6)} USDC`);
  
  // Check token balance before
  const tokenBalanceBefore = await securityToken.balanceOf(investor.address);
  console.log(`🪙 Tokens actuales: ${tokenBalanceBefore.toString()} tokens`);
  
  // Check if verified
  const identityRegistry = await securityToken.identityRegistry();
  const registry = await ethers.getContractAt("IdentityRegistry", identityRegistry);
  const isVerified = await registry.isVerified(investor.address);
  console.log(`✅ KYC verificado: ${isVerified ? "SÍ" : "NO"}`);
  
  if (!isVerified) {
    console.error("\n❌ ERROR: Usuario no verificado en KYC");
    console.log("Ejecuta primero: npx hardhat run scripts/approve-user-storage.ts --network polygon");
    return;
  }

  console.log("\n💰 CALCULANDO PRECIO");
  console.log("─────────────────────────────────────────────────");
  console.log(`🪙 Tokens a comprar: ${TOKENS_TO_BUY} token(s) (indivisibles)`);
  
  // Get quote: How much USDC for 1 token?
  const usdcRequired = await investmentController.quoteUSDC(TOKENS_TO_BUY);
  console.log(`💵 USDC requerido: ${ethers.formatUnits(usdcRequired, 6)} USDC`);
  
  // Check price details
  const priceEuroCents = await investmentController.priceEuroCents();
  console.log(`💶 Precio por token: ${priceEuroCents} eurocents (€${Number(priceEuroCents) / 100})`);
  
  // Get EUR/USD rate
  const priceFeed = await ethers.getContractAt("AggregatorV3Interface", EUR_USD_FEED);
  const [, answer] = await priceFeed.latestRoundData();
  const eurUsdRate = Number(answer) / 1e8;
  console.log(`📊 Tasa EUR/USD: $${eurUsdRate.toFixed(4)}`);
  
  const expectedEur = Number(priceEuroCents) / 100 * Number(TOKENS_TO_BUY);
  const expectedUsd = expectedEur * eurUsdRate;
  console.log(`💰 Equivalente: €${expectedEur.toFixed(2)} ≈ $${expectedUsd.toFixed(2)}`);
  
  // Verify we have enough USDC
  if (usdcBalance < usdcRequired) {
    console.error(`\n❌ ERROR: USDC insuficiente`);
    console.log(`Tienes: ${ethers.formatUnits(usdcBalance, 6)} USDC`);
    console.log(`Necesitas: ${ethers.formatUnits(usdcRequired, 6)} USDC`);
    return;
  }

  console.log("\n✅ Balance suficiente!");

  // Step 1: Approve USDC
  console.log("\n📝 PASO 1: Aprobar USDC");
  console.log("─────────────────────────────────────────────────");
  
  const currentAllowance = await usdc.allowance(investor.address, INVESTMENT_CONTROLLER);
  console.log(`Allowance actual: ${ethers.formatUnits(currentAllowance, 6)} USDC`);
  
  if (currentAllowance < usdcRequired) {
    console.log("⏳ Aprobando USDC...");
    const approveTx = await usdc.approve(INVESTMENT_CONTROLLER, usdcRequired);
    await approveTx.wait();
    console.log("✅ USDC aprobado!");
    console.log(`📜 Tx: ${approveTx.hash}`);
  } else {
    console.log("✅ Ya tiene suficiente allowance");
  }

  // Step 2: Invest!
  console.log("\n🎯 PASO 2: INVERTIR");
  console.log("─────────────────────────────────────────────────");
  console.log("⏳ Ejecutando inversión...");
  
  // Add 5% slippage for price fluctuation (EUR/USD puede cambiar rápido)
  const maxUsdcWithSlippage = (usdcRequired * 105n) / 100n;
  
  console.log(`💵 USDC máximo (con 5% slippage): ${ethers.formatUnits(maxUsdcWithSlippage, 6)} USDC`);
  
  const investTx = await investmentController.invest(
    TOKENS_TO_BUY,
    maxUsdcWithSlippage
  );
  
  console.log("\n⏳ Esperando confirmación en blockchain...");
  const receipt = await investTx.wait();
  
  console.log("\n🎊🎊🎊 ¡INVERSIÓN EXITOSA! 🎊🎊🎊");
  console.log("═══════════════════════════════════════════════════");
  console.log(`📜 Transaction: ${investTx.hash}`);
  console.log(`⛽ Gas usado: ${receipt?.gasUsed.toString()}`);
  console.log(`🔗 Ver en PolygonScan: https://polygonscan.com/tx/${investTx.hash}`);

  // Step 3: Verify results
  console.log("\n📊 VERIFICACIÓN POST-INVERSIÓN");
  console.log("─────────────────────────────────────────────────");
  
  const usdcBalanceAfter = await usdc.balanceOf(investor.address);
  const tokenBalanceAfter = await securityToken.balanceOf(investor.address);
  
  const usdcSpent = usdcBalance - usdcBalanceAfter;
  const tokensReceived = tokenBalanceAfter - tokenBalanceBefore;
  
  console.log(`💵 USDC gastado: ${ethers.formatUnits(usdcSpent, 6)} USDC`);
  console.log(`🪙 Tokens recibidos: ${tokensReceived.toString()} token(s)`);
  console.log(`💰 Balance USDC final: ${ethers.formatUnits(usdcBalanceAfter, 6)} USDC`);
  console.log(`🎯 Balance tokens final: ${tokenBalanceAfter.toString()} token(s)`);

  // Campaign stats
  console.log("\n📈 ESTADÍSTICAS DE LA CAMPAÑA");
  console.log("─────────────────────────────────────────────────");
  const issued = await investmentController.issued();
  const totalSupply = await securityToken.totalSupply();
  const hardCap = await investmentController.hardCap();
  
  console.log(`💰 Total emitido: ${issued.toString()} tokens`);
  console.log(`🪙 Supply actual: ${totalSupply.toString()} tokens`);
  console.log(`🎯 Hard cap: ${hardCap.toString()} tokens`);
  console.log(`📊 Progreso: ${issued.toString()}/${hardCap.toString()} tokens (${(Number(issued) * 100 / Number(hardCap)).toFixed(1)}%)`);

  console.log("\n✨ ¡PRIMERA INVERSIÓN COMPLETADA CON ÉXITO!");
  console.log("═══════════════════════════════════════════════════\n");
  
  console.log("🎯 PRÓXIMOS PASOS:");
  console.log("1. ✅ Ver tus tokens en el dashboard");
  console.log("2. ✅ Actualizar página de billetera");
  console.log("3. ✅ Verificar en PolygonScan");
  console.log("4. 🎬 ¡Listo para el demo del congreso!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error en la inversión:", error);
    process.exit(1);
  });
