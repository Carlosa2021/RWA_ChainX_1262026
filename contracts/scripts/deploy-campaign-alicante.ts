/**
 * Script para desplegar campaña completa: Test Alicante 2025 (ALC-001)
 * 
 * Este script hace TODO:
 * 1. Deploy SecurityToken ERC-3643
 * 2. Deploy InvestmentController
 * 3. Configurar compliance y roles
 * 4. Registrar en ProjectRegistry
 * 
 * Ejecutar: npx hardhat run scripts/deploy-campaign-alicante.ts --network polygon
 */

import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Desplegando campaña: Test Alicante 2025 (ALC-001)");
  console.log("━".repeat(60));

  const [deployer] = await ethers.getSigners();
  console.log("📝 Desplegando con cuenta:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL");
  console.log("━".repeat(60));

  // ============================================
  // CONFIGURACIÓN DE LA CAMPAÑA
  // ============================================
  const CAMPAIGN_CONFIG = {
    name: "Test Alicante 2025",
    symbol: "ALC-001",
    decimals: 0, // Tokens indivisibles
    totalTokens: 5,
    priceEurocents: 100, // €1 = 100 eurocents
    metadataURI: "ipfs://QmTestAlicante2025",
    
    // Direcciones de contratos existentes
    identityRegistry: "0x41391dd49fef214ccccefa3c0e7e5a8f7061b266",
    compliance: "0xdff331ec826b05fb22f3b2641addb22d89aeb894",
    projectRegistry: "0xd1d027675babfd30baf60acf4fc3cbdbf011562d",
    usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // USDC Polygon
    eurUsdFeed: "0x73366Fe0AA0Ded304479862808e02506FE556a98", // Chainlink EUR/USD Polygon
  };

  console.log("📊 Configuración:");
  console.log("   Nombre:", CAMPAIGN_CONFIG.name);
  console.log("   Símbolo:", CAMPAIGN_CONFIG.symbol);
  console.log("   Tokens:", CAMPAIGN_CONFIG.totalTokens);
  console.log("   Precio:", CAMPAIGN_CONFIG.priceEurocents / 100, "EUR");
  console.log("   Total:", (CAMPAIGN_CONFIG.totalTokens * CAMPAIGN_CONFIG.priceEurocents) / 100, "EUR");
  console.log("━".repeat(60));

  // ============================================
  // PASO 1: DEPLOY SECURITY TOKEN (ERC-3643)
  // ============================================
  console.log("\n📦 PASO 1: Desplegando SecurityToken...");
  
  const SecurityToken = await ethers.getContractFactory("SecurityToken");
  const securityToken = await SecurityToken.deploy(
    CAMPAIGN_CONFIG.name,              // string name
    CAMPAIGN_CONFIG.symbol,            // string symbol
    CAMPAIGN_CONFIG.decimals,          // uint8 decimals
    CAMPAIGN_CONFIG.identityRegistry,  // address identityRegistry
    CAMPAIGN_CONFIG.compliance,        // address compliance
    ""                                 // string tokenURI (vacío)
  );
  await securityToken.waitForDeployment();
  const tokenAddress = await securityToken.getAddress();
  
  console.log("   ✅ SecurityToken desplegado:", tokenAddress);
  console.log("   🔗 PolygonScan:", `https://polygonscan.com/address/${tokenAddress}`);

  // ============================================
  // PASO 2: DEPLOY INVESTMENT CONTROLLER
  // ============================================
  console.log("\n📦 PASO 2: Desplegando InvestmentController...");
  
  const InvestmentController = await ethers.getContractFactory("InvestmentController");
  const investmentController = await InvestmentController.deploy(
    tokenAddress,                      // address token3643
    CAMPAIGN_CONFIG.usdc,              // address usdc
    deployer.address,                  // address treasury (donde va el dinero)
    CAMPAIGN_CONFIG.eurUsdFeed,        // address eurUsdFeed (oráculo Chainlink)
    CAMPAIGN_CONFIG.priceEurocents,    // uint256 priceEuroCents
    CAMPAIGN_CONFIG.totalTokens        // uint256 hardCap
  );
  await investmentController.waitForDeployment();
  const controllerAddress = await investmentController.getAddress();
  
  console.log("   ✅ InvestmentController desplegado:", controllerAddress);
  console.log("   🔗 PolygonScan:", `https://polygonscan.com/address/${controllerAddress}`);

  // ============================================
  // PASO 3: TRANSFERIR OWNERSHIP AL CONTROLLER
  // ============================================
  console.log("\n⚙️ PASO 3: Configurando ownership...");
  
  // El InvestmentController necesita ser owner del SecurityToken
  // para poder llamar a issue() cuando alguien compre tokens
  console.log("   → Transfiriendo ownership del SecurityToken al InvestmentController...");
  const tx1 = await securityToken.transferOwnership(controllerAddress);
  await tx1.wait();
  console.log("   ✅ Ownership transferido exitosamente");
  
  // Verificar el nuevo owner
  const newOwner = await securityToken.owner();
  console.log("   📊 Nuevo owner del SecurityToken:", newOwner);
  console.log("   ✅ InvestmentController puede ahora mintear tokens cuando se compren");

  // ============================================
  // PASO 4: REGISTRAR EN PROJECT REGISTRY
  // ============================================
  console.log("\n📝 PASO 4: Registrando en ProjectRegistry...");
  
  const ProjectRegistry = await ethers.getContractAt("ProjectRegistry", CAMPAIGN_CONFIG.projectRegistry);
  
  const tx3 = await ProjectRegistry.registerProject(
    CAMPAIGN_CONFIG.name,
    tokenAddress,
    controllerAddress,
    CAMPAIGN_CONFIG.priceEurocents,
    ethers.parseUnits(CAMPAIGN_CONFIG.totalTokens.toString(), 18), // maxCap con 18 decimales
    CAMPAIGN_CONFIG.usdc,
    CAMPAIGN_CONFIG.metadataURI
  );
  await tx3.wait();
  
  console.log("   ✅ Proyecto registrado en ProjectRegistry");

  // ============================================
  // RESUMEN FINAL
  // ============================================
  console.log("\n" + "━".repeat(60));
  console.log("✅ ¡CAMPAÑA DESPLEGADA EXITOSAMENTE!");
  console.log("━".repeat(60));
  console.log("\n📋 RESUMEN:");
  console.log("   Nombre:", CAMPAIGN_CONFIG.name);
  console.log("   Símbolo:", CAMPAIGN_CONFIG.symbol);
  console.log("   Total tokens:", CAMPAIGN_CONFIG.totalTokens);
  console.log("   Precio por token:", CAMPAIGN_CONFIG.priceEurocents / 100, "EUR");
  console.log("   Valor total:", (CAMPAIGN_CONFIG.totalTokens * CAMPAIGN_CONFIG.priceEurocents) / 100, "EUR");
  console.log("\n📝 DIRECCIONES DE CONTRATOS:");
  console.log("   SecurityToken:", tokenAddress);
  console.log("   InvestmentController:", controllerAddress);
  console.log("   ProjectRegistry:", CAMPAIGN_CONFIG.projectRegistry);
  console.log("\n🔗 POLYGONSCAN:");
  console.log("   Token:", `https://polygonscan.com/address/${tokenAddress}`);
  console.log("   Controller:", `https://polygonscan.com/address/${controllerAddress}`);
  console.log("\n📱 PRÓXIMOS PASOS:");
  console.log("   1. Verifica los contratos en PolygonScan");
  console.log("   2. Recarga http://localhost:3000");
  console.log("   3. Deberías ver la campaña 'Test Alicante 2025'");
  console.log("   4. ¡Prueba a comprar un token con USDC!");
  console.log("━".repeat(60));

  // Guardar direcciones en archivo
  const addresses = {
    campaign: CAMPAIGN_CONFIG.name,
    symbol: CAMPAIGN_CONFIG.symbol,
    securityToken: tokenAddress,
    investmentController: controllerAddress,
    projectRegistry: CAMPAIGN_CONFIG.projectRegistry,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployments/alicante-2025.json',
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n💾 Direcciones guardadas en: deployments/alicante-2025.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
