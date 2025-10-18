# 🔧 CONFIGURACIÓN AUTOMÁTICA DE REPOSITORIOS REMOTOS
# ==================================================

Write-Host "🔧 Configurando repositorios remotos para deploy automatizado..." -ForegroundColor Cyan
Write-Host ""

# URLs de los repositorios (VERIFICAR QUE SEAN CORRECTAS)
$repos = @{
    "STARTER" = @{
        path = "C:\Users\User\Desktop\chainx-rwa-starter"
        url = "https://github.com/Carlosa2021/chainx-rwa-starter.git"
        color = "Blue"
    }
    "PRO" = @{
        path = "C:\Users\User\Desktop\chainx-rwa-pro" 
        url = "https://github.com/Carlosa2021/chainx-rwa-pro.git"
        color = "Green"
    }
    "ENTERPRISE" = @{
        path = "C:\Users\User\Desktop\chainx-rwa-enterprise"
        url = "https://github.com/Carlosa2021/chainx-rwa-enterprise.git"
        color = "Magenta"
    }
}

$successCount = 0

foreach ($planName in $repos.Keys) {
    $repo = $repos[$planName]
    Write-Host "🔧 Configurando $planName..." -ForegroundColor $repo.color
    
    if (Test-Path $repo.path) {
        Set-Location $repo.path
        
        # Verificar si ya tiene remote configurado
        $currentRemote = git remote get-url origin 2>$null
        
        if ($currentRemote) {
            Write-Host "  ℹ️  Remote ya configurado: $currentRemote" -ForegroundColor Yellow
        } else {
            # Configurar remote
            git remote add origin $repo.url
            Write-Host "  ✅ Remote configurado: $($repo.url)" -ForegroundColor Green
        }
        
        # Intentar push inicial
        Write-Host "  📤 Intentando push inicial..." -ForegroundColor White
        $pushOutput = git push -u origin main 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Push exitoso!" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  ⚠️  Push falló (posible problema de autenticación)" -ForegroundColor Yellow
            Write-Host "     $pushOutput" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ❌ Directorio no encontrado: $($repo.path)" -ForegroundColor Red
        Write-Host "     Ejecuta primero: node scripts\deploy\auto-deploy.js" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Volver al directorio principal
Set-Location "C:\Users\User\Desktop\RWA-InmoToken"

Write-Host "📊 RESUMEN DE CONFIGURACIÓN" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host "✅ Repositorios configurados: $successCount/$($repos.Count)" -ForegroundColor Green

if ($successCount -eq $repos.Count) {
    Write-Host ""
    Write-Host "🎉 ¡CONFIGURACIÓN COMPLETADA!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Flujo futuro:" -ForegroundColor White
    Write-Host "  1. Hacer cambios en RWA-InmoToken" -ForegroundColor White
    Write-Host "  2. Ejecutar: node scripts\deploy\auto-deploy.js" -ForegroundColor White
    Write-Host "  3. Los cambios se pushean automáticamente ✨" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "⚠️  Algunos repositorios necesitan configuración manual" -ForegroundColor Yellow
    Write-Host "📝 Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "  - Configurar autenticación Git (ssh-keygen o token)" -ForegroundColor White
    Write-Host "  - Verificar que los repositorios existan en GitHub" -ForegroundColor White
    Write-Host "  - Configurar permisos de escritura" -ForegroundColor White
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")