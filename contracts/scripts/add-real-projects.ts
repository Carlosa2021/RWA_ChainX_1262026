import { ethers } from "hardhat";

/**
 * Script para agregar 3 proyectos inmobiliarios reales
 * - Apartamento Madrid
 * - Casa Barcelona  
 * - Local comercial Valencia
 */

// Addresses from .env
const IDENTITY_REGISTRY = "0x41391dD49FeF214CCcCEfA3c0e7e5a8f7061B266";
const COMPLIANCE = "0xdFF331EC826B05FB22F3B2641aDdB22d89aeb894";
const PROJECT_REGISTRY = "0xd1D027675baBFD30bAf60aCF4Fc3CBdBf011562d";
const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Polygon USDC
const EUR_USD_FEED = "0x73366Fe0AA0Ded304479862808e02506FE556a98"; // Chainlink EUR/USD
const TREASURY = "0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca"; // Owner wallet

// Proyectos a crear
const PROJECTS = [
  {
    name: "Apartamento Madrid Centro",
    symbol: "INMO-MAD-001",
    location: "Madrid, Calle Gran Vía 28",
    size: "85 m²",
    totalValue: ethers.parseUnits("250000", 6), // 250,000 USDC
    pricePerToken: 50000, // 500 euros = 50,000 eurocents
    maxTokens: 500, // 500 tokens = 250,000 euros
    roi: "7.5% anual",
    duration: "24 meses",
    description: "Apartamento renovado en pleno centro de Madrid, zona Gran Vía. Alta demanda turística y profesional.",
    metadataURI: "ipfs://QmApartamentoMadrid" // Mock IPFS
  },
  {
    name: "Casa Barcelona Eixample",
    symbol: "INMO-BCN-002",
    location: "Barcelona, Passeig de Gràcia 92",
    size: "120 m²",
    totalValue: ethers.parseUnits("450000", 6), // 450,000 USDC
    pricePerToken: 75000, // 750 euros = 75,000 eurocents
    maxTokens: 600, // 600 tokens = 450,000 euros
    roi: "6.8% anual",
    duration: "36 meses",
    description: "Casa modernista en Eixample, zona premium de Barcelona. Ideal para alquiler de lujo.",
    metadataURI: "ipfs://QmCasaBarcelona" // Mock IPFS
  },
  {
    name: "Local Comercial Valencia",
    symbol: "INMO-VLC-003",
    location: "Valencia, Avenida del Puerto 15",
    size: "200 m²",
    totalValue: ethers.parseUnits("180000", 6), // 180,000 USDC
    pricePerToken: 30000, // 300 euros = 30,000 eurocents
    maxTokens: 600, // 600 tokens = 180,000 euros
    roi: "8.2% anual",
    duration: "18 meses",
    description: "Local comercial en zona turística de Valencia, cerca del puerto. Alto tráfico peatonal.",
    metadataURI: "ipfs://QmLocalValencia" // Mock IPFS
  }
];

async function main() {
  console.log("🏗️  Iniciando despliegue de 3 proyectos inmobiliarios reales...\n");

  const [deployer] = await ethers.getSigners();
  console.log("👤 Desplegando con cuenta:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC\n");

  // Get ProjectRegistry contract
  const projectRegistry = await ethers.getContractAt("ProjectRegistry", PROJECT_REGISTRY);
  console.log("📋 ProjectRegistry:", PROJECT_REGISTRY);

  // Deploy SecurityToken and InvestmentController for each project
  for (let i = 0; i < PROJECTS.length; i++) {
    const project = PROJECTS[i];
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🏠 PROYECTO ${i + 1}: ${project.name}`);
    console.log(`${"=".repeat(60)}`);
    
    try {
      // 1. Deploy SecurityToken
      console.log(`\n📝 Desplegando SecurityToken: ${project.symbol}...`);
      const SecurityToken = await ethers.getContractFactory("SecurityToken");
      const securityToken = await SecurityToken.deploy(
        project.name,        // _name
        project.symbol,      // _symbol
        18,                  // _decimals (18 is standard for ERC20)
        IDENTITY_REGISTRY,   // _identityRegistry
        COMPLIANCE,          // _compliance
        project.metadataURI  // _tokenURI
      );
      await securityToken.waitForDeployment();
      const tokenAddress = await securityToken.getAddress();
      console.log(`✅ SecurityToken desplegado: ${tokenAddress}`);

      // 2. Deploy InvestmentController
      console.log(`\n📝 Desplegando InvestmentController...`);
      const InvestmentController = await ethers.getContractFactory("InvestmentController");
      const investmentController = await InvestmentController.deploy(
        tokenAddress,        // _token3643
        USDC,                // _usdc
        TREASURY,            // _treasury
        EUR_USD_FEED,        // _eurUsdFeed
        project.pricePerToken, // _priceEuroCents
        project.maxTokens    // _hardCap (in tokens, not USDC)
      );
      await investmentController.waitForDeployment();
      const controllerAddress = await investmentController.getAddress();
      console.log(`✅ InvestmentController desplegado: ${controllerAddress}`);

      // 3. Transfer ownership of SecurityToken to InvestmentController so it can issue tokens
      console.log(`\n🔑 Transfiriendo ownership del SecurityToken al InvestmentController...`);
      const tx1 = await securityToken.transferOwnership(controllerAddress);
      await tx1.wait();
      console.log(`✅ Ownership transferido - InvestmentController puede emitir tokens`);

      // 4. Register project in ProjectRegistry
      console.log(`\n📋 Registrando proyecto en ProjectRegistry...`);
      const tx2 = await projectRegistry.registerProject(
        project.name,
        tokenAddress,
        controllerAddress,
        project.pricePerToken,
        project.totalValue,
        USDC,
        project.metadataURI
      );
      await tx2.wait();
      console.log(`✅ Proyecto registrado en ProjectRegistry`);

      // Summary
      console.log(`\n${"─".repeat(60)}`);
      console.log(`📊 RESUMEN - ${project.name}`);
      console.log(`${"─".repeat(60)}`);
      console.log(`🏢 Nombre:              ${project.name}`);
      console.log(`📍 Ubicación:           ${project.location}`);
      console.log(`📐 Tamaño:              ${project.size}`);
      console.log(`💵 Valor total:         ${ethers.formatUnits(project.totalValue, 6)} USDC (~${project.maxTokens * project.pricePerToken / 100} EUR)`);
      console.log(`🪙  Precio/token:        ${project.pricePerToken / 100} EUR (~${project.pricePerToken / 100} USDC)`);
      console.log(`🔢 Total tokens:        ${project.maxTokens}`);
      console.log(`📈 ROI:                 ${project.roi}`);
      console.log(`⏱️  Duración:            ${project.duration}`);
      console.log(`📝 Descripción:         ${project.description}`);
      console.log(`\n🔗 CONTRATOS:`);
      console.log(`   SecurityToken:       ${tokenAddress}`);
      console.log(`   InvestmentController: ${controllerAddress}`);
      console.log(`${"─".repeat(60)}`);

    } catch (error) {
      console.error(`❌ Error desplegando proyecto ${i + 1}:`, error);
      throw error;
    }
  }

  // Final summary
  console.log(`\n\n${"=".repeat(60)}`);
  console.log(`🎉 DESPLIEGUE COMPLETADO`);
  console.log(`${"=".repeat(60)}`);
  console.log(`\n✅ ${PROJECTS.length} proyectos inmobiliarios desplegados exitosamente`);
  console.log(`\n📋 Contratos principales:`);
  console.log(`   ProjectRegistry: ${PROJECT_REGISTRY}`);
  console.log(`   USDC:            ${USDC}`);
  console.log(`   IdentityRegistry: ${IDENTITY_REGISTRY}`);
  console.log(`   Compliance:      ${COMPLIANCE}`);
  
  console.log(`\n🔄 Próximos pasos:`);
  console.log(`   1. Verificar proyectos en ProjectRegistry.getAllProjects()`);
  console.log(`   2. Actualizar frontend para mostrar proyectos reales`);
  console.log(`   3. Probar inversión real con USDC`);
  console.log(`   4. Agregar imágenes profesionales a /public/projects/`);
  console.log(`\n${"=".repeat(60)}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
