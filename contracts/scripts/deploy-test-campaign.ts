import { ethers } from "hardhat";

/**
 * Script para desplegar campaña de TESTING
 * - Supply: 5 tokens
 * - Precio: €1 por token (100 eurocents)
 * - Total: €5
 * - Para testing de inversión real
 */

// Addresses from .env
const IDENTITY_REGISTRY = "0x41391dD49FeF214CCcCEfA3c0e7e5a8f7061B266";
const COMPLIANCE = "0xdFF331EC826B05FB22F3B2641aDdB22d89aeb894";
const PROJECT_REGISTRY = "0xd1D027675baBFD30bAf60aCF4Fc3CBdBf011562d";
const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Polygon USDC
const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98"; // Chainlink EUR/USD
const TREASURY = "0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca"; // Owner wallet

// Campaña de testing
const TEST_CAMPAIGN = {
  name: "Test Campaign - Apartamento Testing",
  symbol: "INMO-TEST-001",
  location: "Madrid, Test Address",
  size: "50 m²",
  totalValue: ethers.parseUnits("5", 6), // 5 USDC (≈5 EUR)
  pricePerToken: 100, // 1 euro = 100 eurocents
  maxTokens: 5, // Solo 5 tokens para testing
  roi: "10% anual",
  duration: "12 meses",
  description: "Campaña de testing para validar inversión real con USDC. Supply limitado de 5 tokens a €1 cada uno.",
  metadataURI: "ipfs://QmTestCampaign"
};

async function main() {
  console.log("🧪 Iniciando despliegue de CAMPAÑA DE TESTING...\n");

  const [deployer] = await ethers.getSigners();
  console.log("👤 Desplegando con cuenta:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  console.log(`${"=".repeat(60)}`);
  console.log(`🧪 CAMPAÑA DE TESTING - SUPPLY LIMITADO`);
  console.log(`${"=".repeat(60)}`);
  
  try {
    // 1. Deploy SecurityToken
    console.log(`\n📝 Desplegando SecurityToken: ${TEST_CAMPAIGN.symbol}...`);
    const SecurityToken = await ethers.getContractFactory("SecurityToken");
    const securityToken = await SecurityToken.deploy(
      TEST_CAMPAIGN.name,        // _name
      TEST_CAMPAIGN.symbol,      // _symbol
      18,                        // _decimals (18 is standard)
      IDENTITY_REGISTRY,         // _identityRegistry
      COMPLIANCE,                // _compliance
      TEST_CAMPAIGN.metadataURI  // _tokenURI
    );
    await securityToken.waitForDeployment();
    const tokenAddress = await securityToken.getAddress();
    console.log(`✅ SecurityToken desplegado: ${tokenAddress}`);

    // 2. Deploy InvestmentController
    console.log(`\n📝 Desplegando InvestmentController...`);
    const InvestmentController = await ethers.getContractFactory("InvestmentController");
    const investmentController = await InvestmentController.deploy(
      tokenAddress,              // _token3643
      USDC,                      // _usdc
      TREASURY,                  // _treasury
      EUR_USD_FEED,              // _eurUsdFeed
      TEST_CAMPAIGN.pricePerToken, // _priceEuroCents (100 = €1)
      TEST_CAMPAIGN.maxTokens    // _hardCap (5 tokens)
    );
    await investmentController.waitForDeployment();
    const controllerAddress = await investmentController.getAddress();
    console.log(`✅ InvestmentController desplegado: ${controllerAddress}`);

    // 3. Transfer ownership of SecurityToken to InvestmentController
    console.log(`\n🔑 Transfiriendo ownership del SecurityToken al InvestmentController...`);
    const tx1 = await securityToken.transferOwnership(controllerAddress);
    await tx1.wait();
    console.log(`✅ Ownership transferido - InvestmentController puede emitir tokens`);

    // 4. Register project in ProjectRegistry
    console.log(`\n📋 Registrando campaña de testing en ProjectRegistry...`);
    const projectRegistry = await ethers.getContractAt("ProjectRegistry", PROJECT_REGISTRY);
    const tx2 = await projectRegistry.registerProject(
      TEST_CAMPAIGN.name,
      tokenAddress,
      controllerAddress,
      TEST_CAMPAIGN.pricePerToken,
      TEST_CAMPAIGN.totalValue,
      USDC,
      TEST_CAMPAIGN.metadataURI
    );
    await tx2.wait();
    console.log(`✅ Campaña registrada en ProjectRegistry`);

    // Summary
    console.log(`\n${"─".repeat(60)}`);
    console.log(`📊 RESUMEN - CAMPAÑA DE TESTING`);
    console.log(`${"─".repeat(60)}`);
    console.log(`🧪 Nombre:              ${TEST_CAMPAIGN.name}`);
    console.log(`📍 Ubicación:           ${TEST_CAMPAIGN.location}`);
    console.log(`📐 Tamaño:              ${TEST_CAMPAIGN.size}`);
    console.log(`💵 Valor total:         €5 (≈5 USDC)`);
    console.log(`🪙  Precio/token:        €${TEST_CAMPAIGN.pricePerToken / 100}`);
    console.log(`🔢 Total tokens:        ${TEST_CAMPAIGN.maxTokens} (SUPPLY LIMITADO)`);
    console.log(`📈 ROI:                 ${TEST_CAMPAIGN.roi}`);
    console.log(`⏱️  Duración:            ${TEST_CAMPAIGN.duration}`);
    console.log(`📝 Descripción:         ${TEST_CAMPAIGN.description}`);
    console.log(`\n🔗 CONTRATOS:`);
    console.log(`   SecurityToken:       ${tokenAddress}`);
    console.log(`   InvestmentController: ${controllerAddress}`);
    console.log(`${"─".repeat(60)}`);

    // Testing instructions
    console.log(`\n\n${"=".repeat(60)}`);
    console.log(`🎯 SIGUIENTE PASO: TESTING DE INVERSIÓN`);
    console.log(`${"=".repeat(60)}`);
    console.log(`\n📋 Instrucciones para testing:`);
    console.log(`\n1️⃣  Aprobar usuario en IdentityRegistry (KYC)`);
    console.log(`   - Usuario: ${deployer.address}`);
    console.log(`   - IdentityRegistry: ${IDENTITY_REGISTRY}`);
    console.log(`\n2️⃣  Obtener ~10 USDC en Polygon`);
    console.log(`   - Comprar en exchange (Binance, Coinbase)`);
    console.log(`   - O swap en Uniswap/QuickSwap`);
    console.log(`   - USDC address: ${USDC}`);
    console.log(`\n3️⃣  Aprobar USDC al InvestmentController`);
    console.log(`   - USDC.approve("${controllerAddress}", 10000000) // 10 USDC`);
    console.log(`\n4️⃣  Invertir (ejemplo: 2 tokens = ~€2)`);
    console.log(`   - InvestmentController.quoteUSDC(2e18) // Ver precio en USDC`);
    console.log(`   - InvestmentController.invest(2e18, maxUsdcExpected)`);
    console.log(`\n5️⃣  Verificar tokens recibidos`);
    console.log(`   - SecurityToken.balanceOf("${deployer.address}")`);
    console.log(`   - Dashboard: Ver balance actualizado`);
    console.log(`\n${"=".repeat(60)}\n`);

    // Contract addresses for .env
    console.log(`\n💾 Agregar a .env o config.ts:`);
    console.log(`NEXT_PUBLIC_TEST_SECURITY_TOKEN=${tokenAddress}`);
    console.log(`NEXT_PUBLIC_TEST_INVESTMENT_CONTROLLER=${controllerAddress}`);
    console.log(`\n✅ Campaña de testing lista para usar!`);

  } catch (error) {
    console.error(`❌ Error desplegando campaña de testing:`, error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
