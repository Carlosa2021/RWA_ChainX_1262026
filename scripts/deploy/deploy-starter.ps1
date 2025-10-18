# 🟦 DEPLOY PLAN STARTER
# =====================

Write-Host "🟦 Desplegando Plan STARTER..." -ForegroundColor Blue

$currentDir = Get-Location
$expectedDir = "C:\Users\User\Desktop\RWA-InmoToken"

if ($currentDir.Path -ne $expectedDir) {
    Set-Location $expectedDir
}

try {
    node scripts\deploy\auto-deploy.js --plan starter
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Plan STARTER desplegado exitosamente" -ForegroundColor Green
        Write-Host "📁 Ubicación: C:\Users\User\Desktop\chainx-rwa-starter" -ForegroundColor White
    } else {
        Write-Host "❌ Error en deploy STARTER" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}