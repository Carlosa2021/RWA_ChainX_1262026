# 🎯 GUÍA COMPLETA: ONBOARDING CLIENTE PLAN STARTER

## 📋 ÍNDICE
1. [Pre-requisitos](#pre-requisitos)
2. [Fase 1: Recopilación de Información](#fase-1-recopilación-de-información)
3. [Fase 2: Setup del Proyecto](#fase-2-setup-del-proyecto)
4. [Fase 3: Deployment de Contratos](#fase-3-deployment-de-contratos)
5. [Fase 4: Deployment en Vercel](#fase-4-deployment-en-vercel)
6. [Fase 5: Configuración DNS (Opcional)](#fase-5-configuración-dns-opcional)
7. [Fase 6: Entrega al Cliente](#fase-6-entrega-al-cliente)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 PRE-REQUISITOS

### Lo que necesitas tener listo:

✅ **Template Base**
- Repository: `chainx-rwa-starter-template` clonado
- Ubicación: `C:\Users\User\Desktop\chainx-rwa-starter-template`

✅ **Cuentas y Accesos**
- GitHub: Cuenta con permisos para crear repos
- Vercel: Cuenta conectada a GitHub
- Wallet: Con POL para deployment (~0.5 POL por cliente)

✅ **Información del Cliente**
- Nombre de la empresa
- **Wallet Address (Owner)** ← MUY IMPORTANTE
- Email de contacto
- Dominio personalizado (opcional)

---

## 📝 FASE 1: RECOPILACIÓN DE INFORMACIÓN

### 1.1 Checklist de Información del Cliente

Antes de empezar, asegúrate de tener:

```
Cliente: ___________________________________
Plan: STARTER (€49/mes)
Fecha: ___________________________________

DATOS TÉCNICOS:
□ Wallet Owner: 0x___________________________
□ Email: ___________________________________
□ Dominio deseado: _________________________
□ Nombre del proyecto: _____________________

VERIFICACIONES:
□ Cliente tiene MetaMask instalado
□ Wallet tiene fondos para transacciones (POL en Polygon)
□ Cliente entiende límites del plan: 3 proyectos, 50 inversores
□ Pago confirmado: €49/mes
```

### 1.2 Validar Wallet del Cliente

**IMPORTANTE:** La wallet del cliente será el **OWNER** de todos los contratos.

✅ **Cómo obtenerla:**
1. Pide al cliente que abra MetaMask
2. Que haga clic en la wallet
3. Que copie la dirección completa (0x...)
4. **Verifica que sea Polygon Mainnet** (no testnets)

⚠️ **ADVERTENCIA:** Una vez deployados los contratos con esta wallet, NO SE PUEDE CAMBIAR el owner fácilmente.

---

## 🚀 FASE 2: SETUP DEL PROYECTO

### 2.1 Ejecutar Script de Setup

Abre PowerShell en: `<PROJECT_ROOT>\scripts\deploy`

```powershell
# Ejemplo con cliente "Inmobiliaria Madrid"
.\setup-cliente-starter.ps1 `
  -ClientName "Inmobiliaria Madrid" `
  -OwnerWallet "0x1234567890123456789012345678901234567890" `
  -ClientEmail "contacto@inmomadrid.com" `
  -CustomDomain "inmomadrid.chainx.ch"
```

**Parámetros:**
- `-ClientName`: Nombre del cliente (puede tener espacios)
- `-OwnerWallet`: Dirección wallet del cliente (obligatorio)
- `-ClientEmail`: Email de contacto (opcional)
- `-CustomDomain`: Dominio personalizado (opcional)

### 2.2 Lo que hace el script automáticamente:

1. ✅ Crea directorio: `chainx-starter-inmobiliaria-madrid`
2. ✅ Clona el template base
3. ✅ Configura `.env.local` con todos los datos
4. ✅ Actualiza `package.json`
5. ✅ Inicializa Git
6. ✅ Crea README personalizado
7. ✅ Instala dependencias (`npm install`)

### 2.3 Verificar el Setup

```powershell
# Ir al directorio del cliente
cd C:\Users\User\Desktop\chainx-starter-inmobiliaria-madrid

# Ver el .env.local creado
cat .env.local

# Debería mostrar:
# NEXT_PUBLIC_THIRDWEB_CLIENT_ID=8e23c797a5775080df8bad49ce5719a4
# NEXT_PUBLIC_OWNER_WALLET=0x1234...
# NEXT_PUBLIC_PLAN=STARTER
# etc.
```

### 2.4 Crear Repositorio en GitHub

```powershell
# Crear repo en GitHub (manual o con CLI)
gh repo create chainx-starter-inmobiliaria-madrid --public --source=. --remote=origin

# O manualmente:
# 1. Ve a https://github.com/new
# 2. Nombre: chainx-starter-inmobiliaria-madrid
# 3. Public
# 4. No inicializar con README

# Conectar y push
git remote add origin https://github.com/Carlosa2021/chainx-starter-inmobiliaria-madrid.git
git branch -M main
git push -u origin main
```

✅ **Checkpoint:** Repo creado y pusheado a GitHub

---

## 🔐 FASE 3: DEPLOYMENT DE CONTRATOS

### 3.1 Preparación

**IMPORTANTE:** Necesitas tener POL en tu wallet para pagar el gas (~0.5 POL por deployment).

```powershell
# Verificar que tienes el .env en contracts con tu PRIVATE_KEY
cd <PROJECT_ROOT>\contracts
cat .env

# Debe contener:
# PRIVATE_KEY=tu_private_key_aqui
# POLYGONSCAN_API_KEY=tu_api_key (opcional, para verificación)
```

### 3.2 Ejecutar Deployment de Contratos

```powershell
cd <PROJECT_ROOT>\scripts\deploy

# Deploy contratos para el cliente
.\deploy-contracts-starter.ps1 `
  -ClientName "Inmobiliaria Madrid" `
  -OwnerWallet "0x1234567890123456789012345678901234567890" `
  -Network "polygon"
```

### 3.3 Proceso de Deployment

El script:
1. ✅ Verifica dependencias
2. ✅ Compila contratos
3. ✅ Crea script personalizado
4. ✅ Deploya 3 contratos:
   - **ProjectRegistry**: Registro de proyectos
   - **InvestmentController**: Control de inversiones
   - **PayoutDistributor**: Distribución de dividendos
5. ✅ Guarda addresses en JSON

### 3.4 Guardar las Addresses

Al finalizar verás algo como:

```
✅ DEPLOYMENT COMPLETADO
============================================

📋 DIRECCIONES DE CONTRATOS:
ProjectRegistry: 0xABCD1234...
InvestmentController: 0xEFGH5678...
PayoutDistributor: 0xIJKL9012...
```

**COPIA ESTAS ADDRESSES** - Las necesitarás en el siguiente paso.

✅ **Checkpoint:** Contratos deployados en Polygon Mainnet

---

## 🌐 FASE 4: DEPLOYMENT EN VERCEL

### 4.1 Actualizar .env.local del Cliente

```powershell
cd C:\Users\User\Desktop\chainx-starter-inmobiliaria-madrid

# Editar .env.local y agregar las addresses
code .env.local
```

Agregar al final:

```bash
# === DEPLOYED CONTRACTS ===
NEXT_PUBLIC_PROJECT_REGISTRY=0xABCD1234...
NEXT_PUBLIC_INVESTMENT_CONTROLLER=0xEFGH5678...
NEXT_PUBLIC_PAYOUT_DISTRIBUTOR=0xIJKL9012...
```

### 4.2 Commit y Push

```powershell
git add .env.local
git commit -m "feat: Add deployed contract addresses"
git push origin main
```

### 4.3 Conectar a Vercel

#### Opción A: Vercel CLI (Recomendado)

```powershell
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Login
vercel login

# Deploy
cd C:\Users\User\Desktop\chainx-starter-inmobiliaria-madrid
vercel --prod
```

#### Opción B: Dashboard Web

1. Ve a https://vercel.com
2. Click en **"Add New Project"**
3. Importa el repo: `chainx-starter-inmobiliaria-madrid`
4. Framework Preset: **Next.js**
5. **Environment Variables** (¡IMPORTANTE!):

```
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=8e23c797a5775080df8bad49ce5719a4
NEXT_PUBLIC_OWNER_WALLET=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_PLAN=STARTER
NEXT_PUBLIC_MAX_PROJECTS=3
NEXT_PUBLIC_MAX_INVESTORS=50
NEXT_PUBLIC_PROJECT_REGISTRY=0xABCD1234...
NEXT_PUBLIC_INVESTMENT_CONTROLLER=0xEFGH5678...
NEXT_PUBLIC_PAYOUT_DISTRIBUTOR=0xIJKL9012...
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_RPC_URL=https://polygon-rpc.com
```

6. Click **Deploy**
7. Espera 2-3 minutos

### 4.4 Verificar el Deployment

Una vez deployed, obtendrás una URL:
```
https://chainx-starter-inmobiliaria-madrid.vercel.app
```

**Verificar:**
- ✅ La página carga correctamente
- ✅ Se muestra "Plan: STARTER" en el dashboard
- ✅ El owner wallet es el correcto
- ✅ Los límites son: 3 proyectos, 50 inversores

✅ **Checkpoint:** Aplicación desplegada en Vercel

---

## 🌍 FASE 5: CONFIGURACIÓN DNS (Opcional)

Si el cliente quiere dominio personalizado: `inmomadrid.chainx.ch`

### 5.1 Configurar en Vercel

1. En Vercel Dashboard → Proyecto → **Settings** → **Domains**
2. Agregar: `inmomadrid.chainx.ch`
3. Vercel te dará un registro CNAME

### 5.2 Configurar en Hostinger (o tu DNS)

1. Ve a Hostinger → Zona DNS → `chainx.ch`
2. Agregar registro CNAME:
   - **Nombre**: `inmomadrid`
   - **Apunta a**: `cname.vercel-dns.com`
   - **TTL**: 3600

3. Espera 10-30 minutos para propagación

### 5.3 Verificar

```powershell
# Ver DNS
nslookup inmomadrid.chainx.ch

# Debería mostrar el CNAME de Vercel
```

✅ **Checkpoint:** Dominio personalizado configurado

---

## 📦 FASE 6: ENTREGA AL CLIENTE

### 6.1 Preparar Documentación

Crear documento para el cliente con:

```markdown
# 🎉 BIENVENIDO A CHAINX - PLAN STARTER

## 📋 TUS DATOS DE ACCESO

- **URL de tu plataforma**: https://inmomadrid.chainx.ch
- **Owner Wallet**: 0x1234...
- **Plan**: STARTER (€49/mes)
- **Capacidades**:
  - ✅ 3 proyectos inmobiliarios
  - ✅ 50 inversores máximo
  - ✅ Panel Admin completo
  - ✅ Gestión KYC
  - ✅ Distribución dividendos

## 🔐 CONTRATOS DEPLOYADOS

En Polygon Mainnet (Chain ID: 137)

- **ProjectRegistry**: 0xABCD...
- **InvestmentController**: 0xEFGH...
- **PayoutDistributor**: 0xIJKL...

Puedes verificarlos en: https://polygonscan.com

## 🚀 PRIMEROS PASOS

1. **Conecta tu wallet** (la que nos proporcionaste)
2. **Accede al Admin** → `/admin`
3. **Crea tu primer proyecto**
4. **Gestiona inversores** (aprobación KYC)

## 📞 SOPORTE

- Email: soporte@chainx.ch
- Documentación: https://docs.chainx.ch
- Response time: 24-48h
```

### 6.2 Sesión de Training (30 min)

**AGENDA:**

1. **Introducción (5 min)**
   - Mostrar dashboard
   - Explicar capacidades del plan

2. **Crear Proyecto (10 min)**
   - Ir a Admin → Crear Proyecto
   - Llenar formulario
   - Explicar tokenización

3. **Gestión de Inversores (10 min)**
   - Aprobar KYC
   - Ver inversiones
   - Distribución de dividendos

4. **Q&A (5 min)**

### 6.3 Checklist Final

```
□ URL de producción funcionando
□ Contratos verificados en PolygonScan
□ Dominio personalizado configurado (si aplica)
□ Documentación entregada al cliente
□ Sesión de training completada
□ Cliente puede acceder con su wallet
□ Proyecto de prueba creado
□ Soporte configurado
```

✅ **CLIENTE ONBOARDED** 🎉

---

## 🆘 TROUBLESHOOTING

### Problema 1: "No puedo conectar mi wallet"

**Solución:**
1. Verificar que el owner wallet en `.env.local` es correcto
2. Verificar que las variables están en Vercel
3. Redesplegar en Vercel si cambiaste variables

### Problema 2: "Error 401 de Thirdweb"

**Solución:**
1. Verificar `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` en Vercel
2. Debe ser: `8e23c797a5775080df8bad49ce5719a4`
3. Redesplegar

### Problema 3: "Los contratos no responden"

**Solución:**
1. Verificar en PolygonScan que están deployados
2. Verificar que las addresses en `.env.local` son correctas
3. Verificar que el cliente tiene POL para gas

### Problema 4: "Admin no carga / 404"

**Solución:**
1. Verificar que la página `src/app/admin/page.tsx` existe
2. Verificar que en `usePlanSystem.ts` STARTER tiene `adminPanel: true`
3. Limpiar cache: `npm run build` y redesplegar

### Problema 5: "Dominio personalizado no funciona"

**Solución:**
1. Esperar propagación DNS (hasta 48h, normalmente 30min)
2. Verificar CNAME en Hostinger: `nslookup`
3. Verificar en Vercel que el dominio está en "Ready"

---

## 📊 RESUMEN DE COSTOS

### Por Cliente STARTER:

| Concepto | Costo |
|----------|-------|
| Setup inicial | 30 min trabajo |
| Deployment contratos | ~0.3 POL (~$0.20) |
| Vercel hosting | $0 (plan hobby) |
| Dominio personalizado | $0 (subdominio) |
| **Total setup** | **< €5 en costos** |

### Ingresos:
- **€49/mes** por cliente
- Margen: **~90%** después de costos

---

## 🎯 TIEMPOS ESTIMADOS

| Fase | Tiempo |
|------|--------|
| Recopilación info | 10 min |
| Setup proyecto | 5 min |
| Deploy contratos | 10 min |
| Deploy Vercel | 15 min |
| DNS config | 5 min |
| Documentación | 10 min |
| Training cliente | 30 min |
| **TOTAL** | **~1.5 horas** |

Después del 2º-3º cliente: **< 1 hora por cliente**

---

## 📚 RECURSOS ADICIONALES

- **Template base**: `C:\Users\User\Desktop\chainx-rwa-starter-template`
- **Scripts**: `<PROJECT_ROOT>\scripts\deploy`
- **Contratos**: `<PROJECT_ROOT>\contracts`
- **Docs Thirdweb**: https://portal.thirdweb.com
- **Docs Vercel**: https://vercel.com/docs
- **PolygonScan**: https://polygonscan.com

---

**¿Dudas? Pregúntame lo que necesites!** 💪
