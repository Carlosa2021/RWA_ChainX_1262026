# 🟢 DEPLOY PLAN PRO
# ==================

Write-Host "🟢 Desplegando Plan PRO..." -ForegroundColor Green

$currentDir = Get-Location
$expectedDir = "C:\Users\User\Desktop\RWA-InmoToken"

if ($currentDir.Path -ne $expectedDir) {
    Set-Location $expectedDir
}

try {
    node scripts\deploy\auto-deploy.js --plan pro
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Plan PRO desplegado exitosamente" -ForegroundColor Green
        Write-Host "📁 Ubicación: C:\Users\User\Desktop\chainx-rwa-pro" -ForegroundColor White
    } else {
        Write-Host "❌ Error en deploy PRO" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}