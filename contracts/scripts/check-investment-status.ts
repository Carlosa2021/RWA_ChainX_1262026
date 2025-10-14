import { ethers } from "hardhat";

/**
 * Verificar dónde fueron los USDC de las inversiones
 */

const INVESTMENT_CONTROLLER = "0x27451f36790d945D5cDfa5e95d6b5764Ed2E6897";
const SECURITY_TOKEN = "0xA15b7BFdc26eEE1e4687D45cd2C9d6049956fd45";
const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
const USER_ADDRESS = "0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca";

async function main() {
  console.log("🔍 VERIFICANDO ESTADO POST-INVERSIÓN\n");
  console.log("═══════════════════════════════════════════════════\n");

  const [signer] = await ethers.getSigners();
  
  // Contracts
  const investmentController = await ethers.getContractAt("InvestmentController", INVESTMENT_CONTROLLER);
  const securityToken = await ethers.getContractAt("SecurityToken", SECURITY_TOKEN);
  const usdc = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", USDC_ADDRESS);

  console.log("📊 INVESTMENT CONTROLLER");
  console.log("─────────────────────────────────────────────────");
  
  // Treasury address (donde van los USDC)
  const treasury = await investmentController.treasury();
  console.log(`💰 Treasury (destino USDC): ${treasury}`);
  console.log(`   ${treasury === USER_ADDRESS ? "✅ Es tu wallet (eres el owner)" : "❌ Es otra dirección"}`);
  
  // Total issued
  const issued = await investmentController.issued();
  console.log(`\n🪙 Tokens emitidos: ${issued.toString()} (${Number(issued)} tokens)`);
  
  // Hard cap
  const hardCap = await investmentController.hardCap();
  console.log(`📊 Hard cap: ${hardCap.toString()} (${Number(hardCap)} tokens)`);
  console.log(`📈 Progreso: ${Number(issued)}/${Number(hardCap)} (${(Number(issued) * 100 / Number(hardCap)).toFixed(1)}%)`);

  console.log("\n💵 BALANCES USDC");
  console.log("─────────────────────────────────────────────────");
  
  // User USDC balance
  const userUsdcBalance = await usdc.balanceOf(USER_ADDRESS);
  console.log(`Tu balance: ${ethers.formatUnits(userUsdcBalance, 6)} USDC`);
  
  // Treasury USDC balance
  const treasuryUsdcBalance = await usdc.balanceOf(treasury);
  console.log(`Treasury balance: ${ethers.formatUnits(treasuryUsdcBalance, 6)} USDC`);

  console.log("\n🪙 BALANCES SECURITY TOKEN");
  console.log("─────────────────────────────────────────────────");
  
  // User token balance
  const userTokenBalance = await securityToken.balanceOf(USER_ADDRESS);
  console.log(`Tu balance: ${userTokenBalance.toString()} tokens`);
  
  // Token info
  const tokenName = await securityToken.name();
  const tokenSymbol = await securityToken.symbol();
  const totalSupply = await securityToken.totalSupply();
  
  console.log(`\n📄 Info del token:`);
  console.log(`   Nombre: ${tokenName}`);
  console.log(`   Símbolo: ${tokenSymbol}`);
  console.log(`   Total supply: ${totalSupply.toString()} tokens`);
  console.log(`   Contrato: ${SECURITY_TOKEN}`);

  console.log("\n✅ RESUMEN");
  console.log("─────────────────────────────────────────────────");
  console.log(`• Tienes ${userTokenBalance.toString()} tokens en tu wallet`);
  console.log(`• Gastaste ~${(Number(issued) * 1.16).toFixed(2)} USDC en total`);
  console.log(`• Los USDC están en: ${treasury}`);
  console.log(`• Campaña completada al ${(Number(issued) * 100 / Number(hardCap)).toFixed(1)}%`);
  
  console.log("\n🎯 PARA VER TUS TOKENS EN METAMASK:");
  console.log("─────────────────────────────────────────────────");
  console.log("1. Abre MetaMask");
  console.log("2. Ve a 'Tokens' → 'Import tokens'");
  console.log("3. Token Address: " + SECURITY_TOKEN);
  console.log("4. Debería aparecer automáticamente el nombre y símbolo");
  console.log("5. Confirmar");
  console.log("\n💡 También puedes verlos en PolygonScan:");
  console.log(`   https://polygonscan.com/token/${SECURITY_TOKEN}?a=${USER_ADDRESS}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
