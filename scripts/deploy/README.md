# 🚀 SISTEMA DE DEPLOY AUTOMATIZADO - POWER MODE

Este sistema automatiza el deploy de cada plan SaaS a sus repositorios específicos.

## 📁 Estructura de Repositorios

```
RWA-ChainX/             # 🏠 Repositorio principal (desarrollo)
├── chainx-rwa-starter     # 🟦 Plan STARTER (€0/mes)
├── chainx-rwa-pro        # 🟢 Plan PRO (€29/mes)
└── chainx-rwa-enterprise # 🟣 Plan ENTERPRISE (€99/mes)
```

## 🎯 Funcionalidades por Plan

### STARTER (€0/mes)
- ✅ Dashboard básico
- ✅ 1 proyecto máximo
- ✅ 10 inversores máximo
- ❌ Panel de administración
- ❌ Analytics avanzados

### PRO (€29/mes)
- ✅ Dashboard básico
- ✅ Panel de administración
- ✅ Analytics avanzados
- ✅ Acceso API
- ✅ 5 proyectos máximo
- ✅ 100 inversores máximo
- ❌ White label

### ENTERPRISE (€99/mes)
- ✅ Todas las funcionalidades
- ✅ White label
- ✅ Branding personalizado
- ✅ Proyectos ilimitados
- ✅ Inversores ilimitados

## 🚀 Uso del Sistema

### Deploy Automático (Todos los planes)
```bash
cd scripts/deploy
node auto-deploy.js
```

### Deploy Individual
```bash
# Plan específico
node auto-deploy.js --plan starter
node auto-deploy.js --plan pro
node auto-deploy.js --plan enterprise
```

### Scripts de PowerShell
```powershell
# Deploy completo
.\deploy-all.ps1

# Deploy individual
.\deploy-starter.ps1
.\deploy-pro.ps1
.\deploy-enterprise.ps1
```

## ⚙️ Configuración

### 1. Configurar Repositorios Remotos
```bash
# En cada directorio de plan
git remote add origin https://github.com/usuario/chainx-rwa-starter.git
git remote add origin https://github.com/usuario/chainx-rwa-pro.git
git remote add origin https://github.com/usuario/chainx-rwa-enterprise.git
```

### 2. Variables de Entorno
Cada plan genera automáticamente su archivo `.env` con:
- Configuración específica del plan
- Límites de funcionalidades
- Puertos por defecto
- Variables de deployment

## 🔧 Flujo de Deploy

1. **Validación**: Verifica repositorios de destino
2. **Copia**: Copia código base desde RWA-ChainX
3. **Filtrado**: Remueve funcionalidades no disponibles en el plan
4. **Configuración**: Genera archivos específicos (.env, config/plan.ts)
5. **Build**: Compila y valida el proyecto
6. **Git**: Commit automático con timestamp
7. **Deploy**: Push a repositorio específico

## 🎨 Personalización

### Modificar Configuración de Plan
Editar `auto-deploy.js` sección `REPOS`:

```javascript
const REPOS = {
  starter: {
    maxProjects: 1,
    features: {
      adminPanel: false,
      // ... más configuraciones
    }
  }
  // ...
};
```

### Añadir Nuevos Archivos de Deploy
Modificar arrays `dirsToCopy` y `filesToCopy` en `copyBaseCode()`.

## 🔍 Troubleshooting

### Error: "No remote repository"
```bash
cd path/to/plan
git remote add origin <URL_DEL_REPOSITORIO>
```

### Error en Build
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

### Error de Permisos
```bash
# Windows PowerShell como administrador
Set-ExecutionPolicy RemoteSigned
```

## 📊 Estado del Sistema

- ✅ Script principal de deploy
- ✅ Filtrado automático de código
- ✅ Configuración por plan
- ✅ Build validation
- ⏳ Git push automation (requiere configuración manual de remotes)
- ⏳ Deploy hooks para CI/CD

## 🎯 Próximos Pasos

1. Configurar repositorios remotos en GitHub
2. Añadir hooks de CI/CD
3. Implementar deploy automático a Vercel/Netlify
4. Sistema de rollback automático
5. Monitoring de deploys
