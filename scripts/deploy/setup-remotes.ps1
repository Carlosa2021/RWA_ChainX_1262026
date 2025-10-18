# 🔧 CONFIGURACIÓN DE REPOSITORIOS REMOTOS
# ========================================

# Este script configura automáticamente los repositorios remotos
# para cada plan después del primer deploy

Write-Host "🔧 Configurando repositorios remotos..." -ForegroundColor Cyan

# Configuración de repositorios (EDITAR ESTAS URLs)
$repos = @{
    "starter" = @{
        path = "C:\Users\User\Desktop\chainx-rwa-starter"
        remote = "https://github.com/Carlosa2021/chainx-rwa-starter-template.git"
        name = "STARTER"
        color = "Blue"
    }
    "pro" = @{
        path = "C:\Users\User\Desktop\chainx-rwa-pro"
        remote = "https://github.com/Carlosa2021/chainx-rwa-pro-template.git"
        name = "PRO"
        color = "Green"
    }
    "enterprise" = @{
        path = "C:\Users\User\Desktop\chainx-rwa-enterprise"
        remote = "https://github.com/Carlosa2021/chainx-rwa-enterprise-template.git"
        name = "ENTERPRISE"
        color = "Magenta"
    }
}

function Setup-Repository {
    param($config)
    
    Write-Host ""
    Write-Host "🔧 Configurando repositorio $($config.name)..." -ForegroundColor $config.color
    
    if (-not (Test-Path $config.path)) {
        Write-Host "❌ Directorio no encontrado: $($config.path)" -ForegroundColor Red
        Write-Host "   Ejecuta primero el deploy: .\deploy-all.ps1" -ForegroundColor Yellow
        return $false
    }
    
    Set-Location $config.path
    
    try {
        # Verificar si ya tiene remote
        $existingRemote = git remote get-url origin 2>$null
        
        if ($existingRemote) {
            Write-Host "ℹ️  Remote ya configurado: $existingRemote" -ForegroundColor Yellow
            
            # Preguntar si quiere reconfigurar
            $response = Read-Host "¿Reconfigurar remote? (y/N)"
            if ($response -ne "y" -and $response -ne "Y") {
                Write-Host "⏭️  Saltando reconfiguración" -ForegroundColor Gray
                return $true
            }
            
            git remote remove origin
        }
        
        # Configurar nuevo remote
        Write-Host "📡 Configurando remote: $($config.remote)" -ForegroundColor White
        git remote add origin $config.remote
        
        # Verificar configuración
        $newRemote = git remote get-url origin
        if ($newRemote -eq $config.remote) {
            Write-Host "✅ Remote configurado correctamente" -ForegroundColor Green
            
            # Intentar push inicial
            Write-Host "📤 Intentando push inicial..." -ForegroundColor White
            $pushResult = git push -u origin main 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Push inicial exitoso" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Push inicial falló (normal si el repo remoto no existe aún)" -ForegroundColor Yellow
                Write-Host "   Error: $pushResult" -ForegroundColor Gray
                Write-Host "   📝 Crea el repositorio en GitHub primero" -ForegroundColor Yellow
            }
            
            return $true
        } else {
            Write-Host "❌ Error configurando remote" -ForegroundColor Red
            return $false
        }
        
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Configurar todos los repositorios
$successCount = 0

foreach ($repo in $repos.GetEnumerator()) {
    if (Setup-Repository $repo.Value) {
        $successCount++
    }
}

# Volver al directorio original
Set-Location "C:\Users\User\Desktop\RWA-InmoToken"

Write-Host ""
Write-Host "📊 RESUMEN DE CONFIGURACIÓN" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host "✅ Repositorios configurados: $successCount/$($repos.Count)" -ForegroundColor Green

if ($successCount -eq $repos.Count) {
    Write-Host ""
    Write-Host "🎉 ¡CONFIGURACIÓN COMPLETADA!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Flujo de deploy futuro:" -ForegroundColor White
    Write-Host "  1. Hacer cambios en RWA-InmoToken" -ForegroundColor White
    Write-Host "  2. Ejecutar: .\scripts\deploy\deploy-all.ps1" -ForegroundColor White
    Write-Host "  3. Los cambios se pushean automáticamente" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "⚠️  Algunos repositorios necesitan configuración manual" -ForegroundColor Yellow
    Write-Host "📝 Verifica que los repositorios remotos existan en GitHub" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")