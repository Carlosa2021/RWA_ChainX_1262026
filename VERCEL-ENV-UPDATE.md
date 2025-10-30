# 🔴 ACTUALIZAR VERCEL - URGENTE

## ⚠️ PROBLEMA RESUELTO:
El ProjectRegistry viejo (`0x4c679C4...`) tenía **6 proyectos mock** registrados en blockchain.

## ✅ SOLUCIÓN:
Desplegamos un **ProjectRegistry NUEVO y LIMPIO**: `0xEf1a4c26BC8a9a0a1477dA08056e406BDf00D560`

---

## 📋 PASOS PARA ACTUALIZAR VERCEL:

### 1. Ve a Vercel Dashboard:
```
https://vercel.com/carlosa2021s-projects/rwa-inmo-token/settings/environment-variables
```

### 2. Busca la variable:
```
NEXT_PUBLIC_PROJECT_REGISTRY
```

### 3. CAMBIA el valor de:
```
❌ VIEJO: 0x4c679C461354E96a8E2c1C233529daF0cc0CBDE1
```

A:
```
✅ NUEVO: 0xEf1a4c26BC8a9a0a1477dA08056e406BDf00D560
```

### 4. **IMPORTANTE**: Marca las 3 checkboxes:
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. Click "Save"

### 6. **REDEPLOY**:
Ve a: https://vercel.com/carlosa2021s-projects/rwa-inmo-token
- Click en los 3 puntos (...) del último deployment
- Click "Redeploy"
- ✅ Confirma

---

## ✅ RESULTADO ESPERADO:

Después de 2-3 minutos en **https://rwa.chainx.ch**:

```
Dashboard: 0 proyectos (limpio)
```

**SIN proyectos mock** (Madrid, Barcelona, Valencia, Test Campaign).

---

## 📊 PARA REGISTRAR PROYECTO ALZIRA:

Si quieres volver a registrar el proyecto Alzira:

```bash
cd C:\Users\User\Desktop\RWA-InmoToken\contracts
npx hardhat run scripts/register-alzira.ts --network polygon
```

(Necesitarás crear ese script primero)

---

## 🔍 VERIFICACIÓN:

Después del redeploy, abre consola del navegador en rwa.chainx.ch:

```
Debería mostrar:
📊 Total projects in registry: 0
```

✅ **Dashboard limpio = Producción correcta**
