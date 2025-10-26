# 🚀 GUÍA RÁPIDA: DEPLOYMENT DE CONTRATOS PARA CLIENTES

## 🎯 CONCEPTO CLAVE

```
┌─────────────────────────────────────────────────────┐
│  TU WALLET (con POL) → Paga Gas Fees                │
│         ↓                                            │
│  HARDHAT DEPLOY → Crea Contratos                    │
│         ↓                                            │
│  OWNER = CLIENTE → Cliente es dueño absoluto        │
└─────────────────────────────────────────────────────┘
```

**❌ NO USES THIRDWEB para deployar contratos**  
**✅ USA HARDHAT (ya configurado)**

---

## ⚡ DEPLOYMENT EN 3 PASOS

### **PASO 1: Verificar que tienes POL**

```powershell
# Tu wallet de deployment debe tener ~1 POL
# Wallet configurada en: contracts/.env
# PRIVATE_KEY=5c2b8ea4... ✅ Ya configurada
```

**Verificar balance:**
1. Ir a: https://polygonscan.com/address/[TU_WALLET]
2. Ver que tienes > 0.5 POL

---

### **PASO 2: Ejecutar Script de Deployment**

```powershell
cd C:\Users\User\Desktop\RWA-InmoToken\scripts\deploy

.\deploy-contracts-starter.ps1 `
  -ClientName "Nombre del Cliente" `
  -OwnerWallet "0x[WALLET_DEL_CLIENTE]" `
  -Network "polygon"
```

**Ejemplo real:**
```powershell
.\deploy-contracts-starter.ps1 `
  -ClientName "Inmobiliaria Madrid" `
  -OwnerWallet "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" `
  -Network "polygon"
```

---

### **PASO 3: Copiar las Addresses**

El script mostrará:

```
✅ DEPLOYMENT COMPLETADO
============================================

📋 DIRECCIONES DE CONTRATOS:
ProjectRegistry: 0x1234567890AbcdEF1234567890AbcdEF12345678
InvestmentController: 0xAbcdEF1234567890AbcdEF1234567890AbcdEF12
PayoutDistributor: 0x567890AbcdEF1234567890AbcdEF1234567890Ab
```

**COPIAR ESTAS 3 ADDRESSES** ← Muy importante

---

## 📝 USAR LAS ADDRESSES EN EL PROYECTO DEL CLIENTE

### En `.env.local` del cliente:

```bash
# === DEPLOYED CONTRACTS ===
NEXT_PUBLIC_PROJECT_REGISTRY=0x1234567890AbcdEF1234567890AbcdEF12345678
NEXT_PUBLIC_INVESTMENT_CONTROLLER=0xAbcdEF1234567890AbcdEF1234567890AbcdEF12
NEXT_PUBLIC_PAYOUT_DISTRIBUTOR=0x567890AbcdEF1234567890AbcdEF1234567890Ab
```

### En Vercel (Environment Variables):

Agregar las mismas 3 variables:
- `NEXT_PUBLIC_PROJECT_REGISTRY`
- `NEXT_PUBLIC_INVESTMENT_CONTROLLER`
- `NEXT_PUBLIC_PAYOUT_DISTRIBUTOR`

---

## 🔍 VERIFICAR DEPLOYMENT

### 1. En PolygonScan:

```
https://polygonscan.com/address/0x1234... (ProjectRegistry)
```

Verificar:
- ✅ Contrato existe
- ✅ "Contract Creator" es tu wallet
- ✅ "Owner" (en Read Contract) es la wallet del cliente

### 2. En la Plataforma del Cliente:

1. Cliente conecta su wallet
2. Va a `/admin`
3. Puede crear proyectos ← Si funciona, deployment OK

---

## 🎯 ¿PARA QUÉ ES CADA CONTRATO?

| Contrato | Función | Lo usa el cliente para... |
|----------|---------|---------------------------|
| **ProjectRegistry** | Registro de proyectos | Crear y listar proyectos inmobiliarios |
| **InvestmentController** | Control de inversiones | Gestionar inversiones de usuarios |
| **PayoutDistributor** | Distribución de dividendos | Distribuir ganancias a inversores |

---

## 💰 COSTOS DE DEPLOYMENT

| Item | Costo | Quién paga |
|------|-------|------------|
| Gas fees deployment | ~0.3-0.5 POL | TÚ (tu wallet) |
| Verificación en PolygonScan | Gratis | - |
| Uso posterior | Variable | CLIENTE |

**Total que pagas por cliente: < €0.30**

---

## ❓ FAQ RÁPIDO

### ¿Puedo reutilizar contratos entre clientes?
**NO.** Cada cliente = 3 contratos nuevos y únicos.

### ¿El cliente puede cambiar el owner después?
**SÍ**, el cliente puede transferir ownership a otra wallet si lo desea.

### ¿Qué pasa si me equivoco en la wallet del cliente?
**PROBLEMA.** Por eso debes verificar 3 veces la wallet antes de deployar.

### ¿Puedo usar testnet primero?
**SÍ**, para practicar usa Polygon Amoy (testnet):
```powershell
-Network "amoy"
```
Pero para clientes reales: **siempre mainnet (polygon)**.

### ¿Necesito Thirdweb account para esto?
**NO.** Thirdweb solo se usa en el frontend, no para deployment.

---

## 🛠️ TROUBLESHOOTING

### Error: "Insufficient funds"
**Solución:** Necesitas más POL en tu wallet de deployment.

### Error: "Network polygon not configured"
**Solución:** Verificar `contracts/hardhat.config.ts` tiene configuración de polygon.

### Error: "Private key not found"
**Solución:** Verificar que `contracts/.env` tiene `PRIVATE_KEY=...`

### Los contratos no aparecen en PolygonScan
**Solución:** Esperar 1-2 minutos para indexación. Luego refrescar.

---

## 📋 CHECKLIST PRE-DEPLOYMENT

Antes de deployar para un cliente:

- [ ] Verificaste la wallet del cliente (0x...) 3 veces
- [ ] Tienes POL en tu wallet de deployment
- [ ] `contracts/.env` tiene tu PRIVATE_KEY
- [ ] Cliente está al tanto que se va a deployar
- [ ] Tienes papel/doc para anotar las addresses

---

## 🎬 WORKFLOW COMPLETO

```
1. Cliente te contrata Plan STARTER
   ↓
2. Cliente te da su wallet address
   ↓
3. Verificas que tiene POL para usar la plataforma (5-10 POL)
   ↓
4. TÚ deployás contratos con Hardhat (owner = cliente)
   ↓
5. Copias las 3 addresses
   ↓
6. Configuras .env.local del cliente
   ↓
7. Deployás frontend en Vercel
   ↓
8. Cliente conecta wallet y puede usar su plataforma
```

---

## 📞 SI TIENES DUDAS

1. **Revisa:** `FAQ-ONBOARDING-CLIENTES.md`
2. **Prueba primero:** Hacer deployment en testnet (amoy)
3. **Verifica todo:** Usa PolygonScan para confirmar

---

## 🔥 COMANDO RÁPIDO PARA COPIAR

```powershell
cd C:\Users\User\Desktop\RWA-InmoToken\scripts\deploy; .\deploy-contracts-starter.ps1 -ClientName "NOMBRE" -OwnerWallet "0xWALLET" -Network "polygon"
```

Reemplazar:
- `NOMBRE` → Nombre del cliente
- `0xWALLET` → Wallet del cliente

---

**¡Eso es todo! Deployar contratos es así de simple.** 🚀

**Siguiente paso:** Ver `GUIA-ONBOARDING-CLIENTE-STARTER.md` para el proceso completo de onboarding.
