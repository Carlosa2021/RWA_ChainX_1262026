# 🚀 DEPLOY AUTOMATIZADO - TODOS LOS PLANES
# =========================================

Write-Host "🚀 INICIANDO DEPLOY AUTOMATIZADO POWER MODE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
$currentDir = Get-Location
$expectedDir = "C:\Users\User\Desktop\RWA-InmoToken"

if ($currentDir.Path -ne $expectedDir) {
    Write-Host "⚠️  Cambiando al directorio del proyecto..." -ForegroundColor Yellow
    Set-Location $expectedDir
}

# Verificar que el script de deploy existe
$deployScript = "scripts\deploy\auto-deploy.js"
if (-not (Test-Path $deployScript)) {
    Write-Host "❌ Script de deploy no encontrado: $deployScript" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Ejecutando deploy automatizado..." -ForegroundColor Green

try {
    # Ejecutar el script de deploy
    node $deployScript
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 ¡DEPLOY COMPLETADO EXITOSAMENTE!" -ForegroundColor Green
        Write-Host "====================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "📁 Repositorios actualizados:" -ForegroundColor White
        Write-Host "  🟦 STARTER  → C:\Users\User\Desktop\chainx-rwa-starter" -ForegroundColor Blue
        Write-Host "  🟢 PRO      → C:\Users\User\Desktop\chainx-rwa-pro" -ForegroundColor Green
        Write-Host "  🟣 ENTERPRISE → C:\Users\User\Desktop\chainx-rwa-enterprise" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "🔧 Próximos pasos:" -ForegroundColor Yellow
        Write-Host "  1. Configurar repositorios remotos (git remote add origin)" -ForegroundColor White
        Write-Host "  2. Hacer push manual: git push -u origin main" -ForegroundColor White
        Write-Host "  3. Configurar deploy automático en Vercel/Netlify" -ForegroundColor White
    } else {
        Write-Host "❌ Error durante el deploy" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error ejecutando deploy: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")