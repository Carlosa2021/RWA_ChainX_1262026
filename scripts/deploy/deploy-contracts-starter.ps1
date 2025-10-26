# ============================================
# SCRIPT: Deploy Contratos Plan STARTER
# Descripción: Deploya los smart contracts para un cliente STARTER
# ============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$ClientName,
    
    [Parameter(Mandatory=$true)]
    [string]$OwnerWallet,
    
    [Parameter(Mandatory=$false)]
    [string]$Network = "polygon"
)

Write-Host "🚀 DEPLOYING SMART CONTRACTS - PLAN STARTER" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$ClientNameClean = $ClientName -replace '\s+', '-' -replace '[^a-zA-Z0-9-]', '' | ForEach-Object { $_.ToLower() }
$ClientPath = "C:\Users\User\Desktop\chainx-starter-$ClientNameClean"
$ContractsPath = "C:\Users\User\Desktop\RWA-InmoToken\contracts"

Write-Host "📝 INFORMACIÓN DEL DEPLOYMENT:" -ForegroundColor Yellow
Write-Host "   Cliente: $ClientName" -ForegroundColor White
Write-Host "   Owner: $OwnerWallet" -ForegroundColor White
Write-Host "   Network: $Network (Chain ID: 137)" -ForegroundColor White
Write-Host ""

# Verificar que existe el proyecto del cliente
if (-not (Test-Path $ClientPath)) {
    Write-Host "❌ ERROR: No se encuentra el proyecto del cliente" -ForegroundColor Red
    Write-Host "   Ejecuta primero: setup-cliente-starter.ps1" -ForegroundColor Yellow
    exit 1
}

# Ir al directorio de contratos
Set-Location $ContractsPath
Write-Host "📂 Ubicación: $ContractsPath" -ForegroundColor Gray
Write-Host ""

# PASO 1: Verificar dependencias
Write-Host "🔍 PASO 1: Verificando dependencias..." -ForegroundColor Green
if (-not (Test-Path "node_modules")) {
    Write-Host "   Instalando dependencias..." -ForegroundColor Yellow
    npm install
}
Write-Host "✅ Dependencias verificadas" -ForegroundColor Green
Write-Host ""

# PASO 2: Compilar contratos
Write-Host "🔨 PASO 2: Compilando contratos..." -ForegroundColor Green
npx hardhat compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: Falló la compilación" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Contratos compilados" -ForegroundColor Green
Write-Host ""

# PASO 3: Crear script de deployment personalizado
Write-Host "📝 PASO 3: Creando script de deployment..." -ForegroundColor Green

$deployScript = @"
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying contracts for: $ClientName");
  console.log("Owner Wallet:", "$OwnerWallet");
  console.log("");

  // 1. Deploy ProjectRegistry
  console.log("📦 Deploying ProjectRegistry...");
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const projectRegistry = await ProjectRegistry.deploy("$OwnerWallet");
  await projectRegistry.waitForDeployment();
  const projectRegistryAddress = await projectRegistry.getAddress();
  console.log("✅ ProjectRegistry deployed:", projectRegistryAddress);
  console.log("");

  // 2. Deploy InvestmentController
  console.log("📦 Deploying InvestmentController...");
  const InvestmentController = await ethers.getContractFactory("InvestmentController");
  const investmentController = await InvestmentController.deploy(
    projectRegistryAddress,
    "$OwnerWallet"
  );
  await investmentController.waitForDeployment();
  const investmentControllerAddress = await investmentController.getAddress();
  console.log("✅ InvestmentController deployed:", investmentControllerAddress);
  console.log("");

  // 3. Deploy PayoutDistributor
  console.log("📦 Deploying PayoutDistributor...");
  const PayoutDistributor = await ethers.getContractFactory("PayoutDistributor");
  const payoutDistributor = await PayoutDistributor.deploy(
    projectRegistryAddress,
    "$OwnerWallet"
  );
  await payoutDistributor.waitForDeployment();
  const payoutDistributorAddress = await payoutDistributor.getAddress();
  console.log("✅ PayoutDistributor deployed:", payoutDistributorAddress);
  console.log("");

  // RESUMEN
  console.log("============================================");
  console.log("✅ DEPLOYMENT COMPLETADO");
  console.log("============================================");
  console.log("");
  console.log("📋 DIRECCIONES DE CONTRATOS:");
  console.log("ProjectRegistry:", projectRegistryAddress);
  console.log("InvestmentController:", investmentControllerAddress);
  console.log("PayoutDistributor:", payoutDistributorAddress);
  console.log("");
  console.log("⚠️  IMPORTANTE:");
  console.log("1. Guarda estas direcciones en el .env.local del cliente");
  console.log("2. Actualiza las variables en Vercel");
  console.log("3. Verifica en PolygonScan que se deployaron correctamente");
  console.log("");

  // Guardar en archivo JSON
  const deployment = {
    client: "$ClientName",
    owner: "$OwnerWallet",
    network: "$Network",
    chainId: 137,
    timestamp: new Date().toISOString(),
    contracts: {
      ProjectRegistry: projectRegistryAddress,
      InvestmentController: investmentControllerAddress,
      PayoutDistributor: payoutDistributorAddress
    }
  };

  const fs = require("fs");
  const deploymentPath = ``deployments/$ClientNameClean-deployment.json``;
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log(``💾 Deployment guardado en: ``, deploymentPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
"@

$scriptPath = "scripts\deploy-client-$ClientNameClean.ts"
$deployScript | Out-File -FilePath $scriptPath -Encoding UTF8 -Force
Write-Host "✅ Script de deployment creado: $scriptPath" -ForegroundColor Green
Write-Host ""

# PASO 4: Ejecutar deployment
Write-Host "🚀 PASO 4: Ejecutando deployment en $Network..." -ForegroundColor Green
Write-Host "⚠️  ASEGÚRATE DE TENER:" -ForegroundColor Yellow
Write-Host "   - POL en la wallet para gas fees (~0.5 POL)" -ForegroundColor White
Write-Host "   - Private key configurada en .env" -ForegroundColor White
Write-Host ""
Write-Host "Presiona ENTER para continuar o CTRL+C para cancelar..." -ForegroundColor Yellow
Read-Host

npx hardhat run $scriptPath --network $Network

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "✅ DEPLOYMENT COMPLETADO EXITOSAMENTE" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔄 PRÓXIMOS PASOS:" -ForegroundColor Yellow
    Write-Host "   1️⃣  Copia las direcciones de contratos" -ForegroundColor White
    Write-Host "   2️⃣  Actualiza .env.local del cliente" -ForegroundColor White
    Write-Host "   3️⃣  Actualiza variables en Vercel" -ForegroundColor White
    Write-Host "   4️⃣  Verifica en PolygonScan" -ForegroundColor White
    Write-Host ""
    Write-Host "📂 Deployment guardado en:" -ForegroundColor Yellow
    Write-Host "   deployments/$ClientNameClean-deployment.json" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ ERROR EN EL DEPLOYMENT" -ForegroundColor Red
    Write-Host "Revisa los logs para más detalles" -ForegroundColor Yellow
}
