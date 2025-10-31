# 🔧 Variables de Entorno para Vercel

## 📋 Copia estas variables en Vercel Dashboard

**URL**: https://vercel.com/carlosa2021s-projects/rwa-inmo-token/settings/environment-variables

---

## ✅ Variables a Agregar (una por una)

### 0. Backend API URL (OPCIONAL - para KYC/Admin)
```
Name: NEXT_PUBLIC_API_URL
Value: https://tu-backend-api.com
Environments: ☑ Production ☑ Preview ☑ Development
```
**Nota**: Si no tienes backend, omite esta variable. El sistema funcionará en modo offline para KYC.

### 1. Project Registry (CRÍTICO)
```
Name: NEXT_PUBLIC_PROJECT_REGISTRY
Value: 0xd1d027675babfd30baf60acf4fc3cbdbf011562d
Environments: ☑ Production ☑ Preview ☑ Development
```

### 2. Project Token Factory
```
Name: NEXT_PUBLIC_PROJECT_FACTORY
Value: 0x02ac9e3473abc7daea0899f5725f94abc89d8f69
Environments: ☑ Production ☑ Preview ☑ Development
```

### 3. Identity Registry (para KYC)
```
Name: NEXT_PUBLIC_IDENTITY_REGISTRY
Value: 0x41391dd49fef214ccccefa3c0e7e5a8f7061b266
Environments: ☑ Production ☑ Preview ☑ Development
```

### 4. Identity Registry Storage
```
Name: NEXT_PUBLIC_IDENTITY_REGISTRY_STORAGE
Value: 0x869a0e897f0a71d7b8034d44832921a4a1ded14f
Environments: ☑ Production ☑ Preview ☑ Development
```

### 5. Compliance Module
```
Name: NEXT_PUBLIC_COMPLIANCE
Value: 0xdff331ec826b05fb22f3b2641addb22d89aeb894
Environments: ☑ Production ☑ Preview ☑ Development
```

### 6. Claim Topics Registry
```
Name: NEXT_PUBLIC_CLAIM_TOPICS_REGISTRY
Value: 0xe94cb3fe19c042c3f0daed36b62a628c0efd7894
Environments: ☑ Production ☑ Preview ☑ Development
```

### 7. Trusted Issuers Registry
```
Name: NEXT_PUBLIC_TRUSTED_ISSUERS_REGISTRY
Value: 0x5e912cbec598f0a506986f673a1b10054fd106f9
Environments: ☑ Production ☑ Preview ☑ Development
```

---

## 🚀 Después de agregar las variables

1. Vercel te preguntará: **"Redeploy to apply changes?"**
2. Haz clic en **"Redeploy"**
3. Espera 2-3 minutos para que complete el build
4. ✅ El deployment debería completarse exitosamente
5. 🌐 Tu dApp estará disponible en: **https://dapp.chainx.ch**

---

## 🔍 Verificación Post-Deploy

Una vez deployado, verifica:

- ✅ La página carga sin errores
- ✅ Los proyectos aparecen en la lista (si los has creado)
- ✅ Puedes conectar tu wallet
- ✅ El botón KYC funciona
- ✅ Links a PolygonScan funcionan

---

## 📝 Notas

- **Ya tienes configuradas**: `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` y `NEXT_PUBLIC_OWNER_ADDRESS` ✅
- **Valores por defecto**: USDC y EUR/USD Feed ya están en el código
- **Red**: Polygon Mainnet (Chain ID: 137)

---

## ⚠️ Variables ya existentes (NO duplicar)

Estas ya están en Vercel:
- ✅ `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
- ✅ `NEXT_PUBLIC_OWNER_ADDRESS`

Solo agrega las nuevas de arriba.
