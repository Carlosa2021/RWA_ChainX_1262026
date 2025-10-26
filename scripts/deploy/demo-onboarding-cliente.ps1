# ============================================
# EJEMPLO PRÁCTICO: Setup Cliente "Inmobiliaria Test"
# ============================================

Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 DEMO: ONBOARDING CLIENTE PLAN STARTER                   ║
║                                                              ║
║   Este script te mostrará el proceso completo paso a paso   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 ESCENARIO:" -ForegroundColor Yellow
Write-Host "   Cliente: Inmobiliaria Test S.L." -ForegroundColor White
Write-Host "   Plan: STARTER (€49/mes)" -ForegroundColor White
Write-Host "   Owner Wallet: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e (ejemplo)" -ForegroundColor White
Write-Host ""

$continue = Read-Host "¿Continuar con el demo? (Y/N)"
if ($continue -ne "Y" -and $continue -ne "y") {
    Write-Host "Demo cancelado" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASO 1: SETUP DEL PROYECTO" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ejecutando: setup-cliente-starter.ps1" -ForegroundColor Green
Write-Host ""
Write-Host "Comando:" -ForegroundColor Gray
Write-Host @"
.\setup-cliente-starter.ps1 \`
  -ClientName "Inmobiliaria Test" \`
  -OwnerWallet "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" \`
  -ClientEmail "contacto@inmotest.com" \`
  -CustomDomain "inmotest.chainx.ch"
"@ -ForegroundColor DarkGray

Write-Host ""
Write-Host "⏳ Esto tomará ~2 minutos..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Lo que está haciendo:" -ForegroundColor Yellow
Write-Host "  ✅ Clonando template..." -ForegroundColor White
Write-Host "  ✅ Configurando .env.local..." -ForegroundColor White
Write-Host "  ✅ Actualizando package.json..." -ForegroundColor White
Write-Host "  ✅ Inicializando Git..." -ForegroundColor White
Write-Host "  ✅ Instalando dependencias..." -ForegroundColor White
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASO 2: CREAR REPO EN GITHUB" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Opciones:" -ForegroundColor Yellow
Write-Host ""
Write-Host "A) Con GitHub CLI:" -ForegroundColor White
Write-Host @"
   cd C:\Users\User\Desktop\chainx-starter-inmobiliaria-test
   gh repo create chainx-starter-inmobiliaria-test --public --source=. --remote=origin
   git push -u origin main
"@ -ForegroundColor DarkGray

Write-Host ""
Write-Host "B) Manual:" -ForegroundColor White
Write-Host "   1. Ve a https://github.com/new" -ForegroundColor DarkGray
Write-Host "   2. Nombre: chainx-starter-inmobiliaria-test" -ForegroundColor DarkGray
Write-Host "   3. Public" -ForegroundColor DarkGray
Write-Host "   4. Ejecuta:" -ForegroundColor DarkGray
Write-Host @"
      git remote add origin https://github.com/Carlosa2021/chainx-starter-inmobiliaria-test.git
      git push -u origin main
"@ -ForegroundColor DarkGray

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASO 3: DEPLOY SMART CONTRACTS" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  REQUISITOS:" -ForegroundColor Red
Write-Host "   - Tener ~0.5 POL en tu wallet" -ForegroundColor White
Write-Host "   - Private key configurada en contracts/.env" -ForegroundColor White
Write-Host ""

Write-Host "Ejecutando: deploy-contracts-starter.ps1" -ForegroundColor Green
Write-Host ""
Write-Host "Comando:" -ForegroundColor Gray
Write-Host @"
.\deploy-contracts-starter.ps1 \`
  -ClientName "Inmobiliaria Test" \`
  -OwnerWallet "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" \`
  -Network "polygon"
"@ -ForegroundColor DarkGray

Write-Host ""
Write-Host "⏳ Deployment en Polygon Mainnet (~5 minutos)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Deployando contratos:" -ForegroundColor Yellow
Write-Host "  📦 ProjectRegistry..." -ForegroundColor White
Start-Sleep -Seconds 1
Write-Host "  📦 InvestmentController..." -ForegroundColor White
Start-Sleep -Seconds 1
Write-Host "  📦 PayoutDistributor..." -ForegroundColor White
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "✅ Contratos deployados (simulado)" -ForegroundColor Green
Write-Host ""
Write-Host "Addresses (EJEMPLO):" -ForegroundColor Yellow
Write-Host "  ProjectRegistry:       0x1234567890AbcdEF1234567890AbcdEF12345678" -ForegroundColor White
Write-Host "  InvestmentController:  0xAbcdEF1234567890AbcdEF1234567890AbcdEF12" -ForegroundColor White
Write-Host "  PayoutDistributor:     0x567890AbcdEF1234567890AbcdEF1234567890Ab" -ForegroundColor White

Write-Host ""
Write-Host "📋 GUARDA ESTAS ADDRESSES - Las necesitas para Vercel" -ForegroundColor Red

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASO 4: ACTUALIZAR .ENV CON CONTRACTS" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Editar: chainx-starter-inmobiliaria-test\.env.local" -ForegroundColor Green
Write-Host ""
Write-Host "Agregar al final:" -ForegroundColor Yellow
Write-Host @"
# === DEPLOYED CONTRACTS ===
NEXT_PUBLIC_PROJECT_REGISTRY=0x1234567890AbcdEF1234567890AbcdEF12345678
NEXT_PUBLIC_INVESTMENT_CONTROLLER=0xAbcdEF1234567890AbcdEF1234567890AbcdEF12
NEXT_PUBLIC_PAYOUT_DISTRIBUTOR=0x567890AbcdEF1234567890AbcdEF1234567890Ab
"@ -ForegroundColor DarkGray

Write-Host ""
Write-Host "Luego commit y push:" -ForegroundColor Yellow
Write-Host @"
git add .env.local
git commit -m "feat: Add deployed contract addresses"
git push origin main
"@ -ForegroundColor DarkGray

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASO 5: DEPLOY EN VERCEL" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Opción A - Vercel CLI:" -ForegroundColor Yellow
Write-Host @"
cd C:\Users\User\Desktop\chainx-starter-inmobiliaria-test
vercel --prod
"@ -ForegroundColor DarkGray

Write-Host ""
Write-Host "Opción B - Vercel Dashboard:" -ForegroundColor Yellow
Write-Host "  1. https://vercel.com → Add New Project" -ForegroundColor White
Write-Host "  2. Import: chainx-starter-inmobiliaria-test" -ForegroundColor White
Write-Host "  3. Framework: Next.js" -ForegroundColor White
Write-Host "  4. Environment Variables:" -ForegroundColor White
Write-Host ""
Write-Host "     NEXT_PUBLIC_THIRDWEB_CLIENT_ID=8e23c797a5775080df8bad49ce5719a4" -ForegroundColor DarkGray
Write-Host "     NEXT_PUBLIC_OWNER_WALLET=0x742d35Cc6634C0532925a3b844Bc454e4438f44e" -ForegroundColor DarkGray
Write-Host "     NEXT_PUBLIC_PLAN=STARTER" -ForegroundColor DarkGray
Write-Host "     NEXT_PUBLIC_MAX_PROJECTS=3" -ForegroundColor DarkGray
Write-Host "     NEXT_PUBLIC_MAX_INVESTORS=50" -ForegroundColor DarkGray
Write-Host "     NEXT_PUBLIC_PROJECT_REGISTRY=0x1234..." -ForegroundColor DarkGray
Write-Host "     NEXT_PUBLIC_INVESTMENT_CONTROLLER=0xAbcd..." -ForegroundColor DarkGray
Write-Host "     NEXT_PUBLIC_PAYOUT_DISTRIBUTOR=0x5678..." -ForegroundColor DarkGray
Write-Host "     NEXT_PUBLIC_CHAIN_ID=137" -ForegroundColor DarkGray
Write-Host "     NEXT_PUBLIC_RPC_URL=https://polygon-rpc.com" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  5. Deploy → Esperar 2-3 minutos" -ForegroundColor White

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASO 6: CONFIGURAR DNS (Opcional)" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "En Vercel:" -ForegroundColor Yellow
Write-Host "  Settings → Domains → Add: inmotest.chainx.ch" -ForegroundColor White
Write-Host ""
Write-Host "En Hostinger (DNS de chainx.ch):" -ForegroundColor Yellow
Write-Host "  Tipo: CNAME" -ForegroundColor White
Write-Host "  Nombre: inmotest" -ForegroundColor White
Write-Host "  Apunta a: cname.vercel-dns.com" -ForegroundColor White
Write-Host "  TTL: 3600" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Propagación: 10-30 minutos" -ForegroundColor Yellow

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASO 7: ENTREGA AL CLIENTE" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📧 Enviar al cliente:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Hola [Cliente]," -ForegroundColor White
Write-Host ""
Write-Host "¡Bienvenido a ChainX! Tu plataforma está lista:" -ForegroundColor White
Write-Host ""
Write-Host "🔗 URL: https://inmotest.chainx.ch" -ForegroundColor Cyan
Write-Host "💼 Plan: STARTER (€49/mes)" -ForegroundColor White
Write-Host "📊 Capacidad: 3 proyectos, 50 inversores" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Tu wallet owner:" -ForegroundColor White
Write-Host "   0x742d35Cc6634C0532925a3b844Bc454e4438f44e" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 Primeros pasos:" -ForegroundColor White
Write-Host "   1. Conecta tu wallet en la plataforma" -ForegroundColor Gray
Write-Host "   2. Ve a /admin" -ForegroundColor Gray
Write-Host "   3. Crea tu primer proyecto" -ForegroundColor Gray
Write-Host ""
Write-Host "📞 Soporte: soporte@chainx.ch" -ForegroundColor White
Write-Host ""
Write-Host "Saludos," -ForegroundColor White
Write-Host "Equipo ChainX" -ForegroundColor White

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ DEMO COMPLETADO" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 RECURSOS:" -ForegroundColor Yellow
Write-Host "   • Guía completa: GUIA-ONBOARDING-CLIENTE-STARTER.md" -ForegroundColor White
Write-Host "   • Script setup: scripts/deploy/setup-cliente-starter.ps1" -ForegroundColor White
Write-Host "   • Script contracts: scripts/deploy/deploy-contracts-starter.ps1" -ForegroundColor White
Write-Host ""

Write-Host "⏱️  TIEMPO ESTIMADO REAL: ~1.5 horas por cliente" -ForegroundColor Cyan
Write-Host "💰 COSTE: ~€5 (principalmente gas fees)" -ForegroundColor Cyan
Write-Host "📈 INGRESO: €49/mes por cliente" -ForegroundColor Green
Write-Host ""

Write-Host "¿Preguntas? ¡Pregúntame lo que necesites! 💪" -ForegroundColor Yellow
