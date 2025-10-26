# ============================================
# SCRIPT: Setup Cliente Plan STARTER
# Descripción: Automatiza el onboarding de un nuevo cliente STARTER
# ============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$ClientName,
    
    [Parameter(Mandatory=$true)]
    [string]$OwnerWallet,
    
    [Parameter(Mandatory=$false)]
    [string]$CustomDomain = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ClientEmail = ""
)

Write-Host "🚀 INICIANDO SETUP CLIENTE PLAN STARTER" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$ClientNameClean = $ClientName -replace '\s+', '-' -replace '[^a-zA-Z0-9-]', '' | ForEach-Object { $_.ToLower() }
$RepoName = "chainx-starter-$ClientNameClean"
$BaseTemplate = "C:\Users\User\Desktop\chainx-rwa-starter-template"
$ClientPath = "C:\Users\User\Desktop\$RepoName"

Write-Host "📝 INFORMACIÓN DEL CLIENTE:" -ForegroundColor Yellow
Write-Host "   Nombre: $ClientName" -ForegroundColor White
Write-Host "   Repo: $RepoName" -ForegroundColor White
Write-Host "   Owner Wallet: $OwnerWallet" -ForegroundColor White
Write-Host "   Dominio: $(if($CustomDomain){"$CustomDomain"}else{"Vercel auto"})" -ForegroundColor White
Write-Host ""

# PASO 1: Clonar template
Write-Host "📦 PASO 1: Clonando template..." -ForegroundColor Green
if (Test-Path $ClientPath) {
    Write-Host "⚠️  El directorio ya existe. Eliminando..." -ForegroundColor Yellow
    Remove-Item -Path $ClientPath -Recurse -Force
}

Copy-Item -Path $BaseTemplate -Destination $ClientPath -Recurse -Force
Write-Host "✅ Template clonado" -ForegroundColor Green
Write-Host ""

# PASO 2: Configurar .env
Write-Host "⚙️  PASO 2: Configurando variables de entorno..." -ForegroundColor Green
Set-Location $ClientPath

$envContent = @"
# ============================================
# CONFIGURACIÓN CLIENTE: $ClientName
# Plan: STARTER
# Generado: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ============================================

# === THIRDWEB CONFIGURATION ===
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=8e23c797a5775080df8bad49ce5719a4

# === OWNER WALLET ===
NEXT_PUBLIC_OWNER_WALLET=$OwnerWallet

# === PLAN CONFIGURATION ===
NEXT_PUBLIC_PLAN=STARTER
NEXT_PUBLIC_MAX_PROJECTS=3
NEXT_PUBLIC_MAX_INVESTORS=50

# === CLIENT INFO ===
CLIENT_NAME=$ClientName
CLIENT_EMAIL=$ClientEmail
$(if($CustomDomain){"CUSTOM_DOMAIN=$CustomDomain"}else{"# CUSTOM_DOMAIN=pendiente"})

# === BLOCKCHAIN (Polygon Mainnet) ===
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_RPC_URL=https://polygon-rpc.com

# === CONTRACTS (Se deployarán después) ===
# NEXT_PUBLIC_PROJECT_REGISTRY=pendiente
# NEXT_PUBLIC_INVESTMENT_CONTROLLER=pendiente
# NEXT_PUBLIC_PAYOUT_DISTRIBUTOR=pendiente
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8 -Force
Write-Host "✅ Archivo .env.local creado" -ForegroundColor Green
Write-Host ""

# PASO 3: Actualizar package.json
Write-Host "📦 PASO 3: Actualizando package.json..." -ForegroundColor Green
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$packageJson.name = $RepoName
$packageJson.description = "ChainX RWA Platform - Plan STARTER para $ClientName"
$packageJson | ConvertTo-Json -Depth 10 | Out-File "package.json" -Encoding UTF8 -Force
Write-Host "✅ package.json actualizado" -ForegroundColor Green
Write-Host ""

# PASO 4: Inicializar Git
Write-Host "🔧 PASO 4: Inicializando repositorio Git..." -ForegroundColor Green
if (Test-Path ".git") {
    Remove-Item -Path ".git" -Recurse -Force
}
git init
git add .
git commit -m "feat: Initial setup for $ClientName - Plan STARTER"
Write-Host "✅ Repositorio Git inicializado" -ForegroundColor Green
Write-Host ""

# PASO 5: Crear README personalizado
Write-Host "📄 PASO 5: Creando README del cliente..." -ForegroundColor Green
$readmeContent = @"
# 🏢 $ClientName - ChainX RWA Platform

## 📋 Información del Cliente

- **Plan**: STARTER (€49/mes)
- **Owner Wallet**: ``$OwnerWallet``
- **Fecha Setup**: $(Get-Date -Format "yyyy-MM-dd")
$(if($CustomDomain){@"

- **Dominio**: https://$CustomDomain
"@}else{@"

- **Dominio**: Pendiente de configuración
"@})

## 🎯 Capacidades del Plan STARTER

✅ **3 proyectos inmobiliarios**
✅ **50 inversores máximo**
✅ **Panel de administración completo**
✅ **Gestión KYC básica**
✅ **Distribución de dividendos**
✅ **Smart contracts ERC-3643**
✅ **Soporte técnico estándar**

## 🚀 Deployment

### Local Development
\`\`\`bash
npm install
npm run dev
\`\`\`

### Vercel Production
- Conectado a: [Pendiente]
- Variables de entorno configuradas: ✅

## 📞 Soporte

Para cualquier duda o problema técnico:
- **Email**: soporte@chainx.ch
- **Documentación**: https://docs.chainx.ch
- **Owner Wallet**: $OwnerWallet

---

**Powered by ChainX** | Real World Assets Platform
"@

$readmeContent | Out-File -FilePath "README.md" -Encoding UTF8 -Force
Write-Host "✅ README.md creado" -ForegroundColor Green
Write-Host ""

# PASO 6: Instalar dependencias
Write-Host "📦 PASO 6: Instalando dependencias..." -ForegroundColor Green
npm install
Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
Write-Host ""

# RESUMEN FINAL
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📂 UBICACIÓN:" -ForegroundColor Yellow
Write-Host "   $ClientPath" -ForegroundColor White
Write-Host ""
Write-Host "🔄 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "   1️⃣  Crear repositorio en GitHub: $RepoName" -ForegroundColor White
Write-Host "   2️⃣  Push inicial: git remote add origin https://github.com/Carlosa2021/$RepoName.git" -ForegroundColor White
Write-Host "   3️⃣  Deploy en Vercel (conectar repo)" -ForegroundColor White
Write-Host "   4️⃣  Deploy smart contracts (ver script deploy-contracts-starter.ps1)" -ForegroundColor White
Write-Host ""
Write-Host "📋 ARCHIVO GENERADO:" -ForegroundColor Yellow
Write-Host "   .env.local - Variables de entorno configuradas" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "   - Verifica que el Owner Wallet sea correcto: $OwnerWallet" -ForegroundColor White
Write-Host "   - No compartas el .env.local (ya está en .gitignore)" -ForegroundColor White
Write-Host ""
