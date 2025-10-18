# 🟣 DEPLOY PLAN ENTERPRISE
# =========================

Write-Host "🟣 Desplegando Plan ENTERPRISE..." -ForegroundColor Magenta

$currentDir = Get-Location
$expectedDir = "C:\Users\User\Desktop\RWA-InmoToken"

if ($currentDir.Path -ne $expectedDir) {
    Set-Location $expectedDir
}

try {
    node scripts\deploy\auto-deploy.js --plan enterprise
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Plan ENTERPRISE desplegado exitosamente" -ForegroundColor Green
        Write-Host "📁 Ubicación: C:\Users\User\Desktop\chainx-rwa-enterprise" -ForegroundColor White
    } else {
        Write-Host "❌ Error en deploy ENTERPRISE" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}