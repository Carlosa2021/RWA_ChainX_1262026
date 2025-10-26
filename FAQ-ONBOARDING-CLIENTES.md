# ❓ FAQ: ONBOARDING CLIENTES PLAN STARTER

## 🎯 PREGUNTAS FRECUENTES

### 1. ¿Qué wallet uso para deployar los contratos?

**Respuesta:** Usas **TU wallet** (la que tiene POL para gas).

**PERO IMPORTANTE:** Los contratos se transferirán al **cliente** automáticamente porque en el script de deployment especificas la wallet del cliente como `owner`.

```typescript
// Esto hace que el cliente sea el owner
const projectRegistry = await ProjectRegistry.deploy("WALLET_DEL_CLIENTE");
```

### 2. ¿El cliente necesita pagar gas para usar la plataforma?

**SÍ.** El cliente necesitará POL en Polygon para:
- ✅ Crear proyectos
- ✅ Aprobar inversores
- ✅ Distribuir dividendos
- ✅ Cualquier transacción on-chain

**Recomendación:** Avisar al cliente que tenga al menos **5-10 POL** en su wallet.

### 3. ¿Puedo cambiar el owner wallet después del deployment?

**NO fácilmente.** Los contratos ERC-3643 tienen el owner hardcodeado.

**Solución:**
- Si es urgente: Redesplegar contratos con nuevo owner
- Si hay tiempo: Implementar función `transferOwnership()` en los contratos

### 4. ¿Qué pasa si el cliente pierde acceso a su wallet?

**PROBLEMA GRAVE.** Sin la wallet owner, no pueden:
- ❌ Crear proyectos
- ❌ Gestionar KYC
- ❌ Distribuir dividendos

**Prevención:**
- Pide al cliente que **haga backup** de su seed phrase
- Considera usar **multi-sig wallet** para clientes enterprise

### 5. ¿Puedo usar testnet en lugar de mainnet?

**SÍ,** pero solo para demos/testing.

**Para producción:** SIEMPRE Polygon Mainnet.

**Configuración testnet (Mumbai - DEPRECADO, usa Amoy):**
```bash
NEXT_PUBLIC_CHAIN_ID=80002  # Polygon Amoy
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology
```

### 6. ¿Cuánto POL necesito para deployar contratos?

**Aproximadamente 0.3-0.5 POL** (~$0.20-0.30 USD).

Desglose:
- ProjectRegistry: ~0.1 POL
- InvestmentController: ~0.15 POL
- PayoutDistributor: ~0.15 POL

### 7. ¿Puedo reutilizar contratos entre clientes?

**NO RECOMENDADO.** Cada cliente debe tener:
- ✅ Sus propios contratos
- ✅ Su propia wallet owner
- ✅ Su propio deployment

**Razón:** Seguridad y aislamiento de datos.

### 8. ¿Qué hago si el deployment de Vercel falla?

**Checklist:**
1. ✅ Verificar variables de entorno en Vercel
2. ✅ Ver logs: Vercel Dashboard → Deployments → [deployment] → Logs
3. ✅ Errores comunes:
   - Client ID de Thirdweb incorrecto
   - Falta alguna variable NEXT_PUBLIC_*
   - Error de build (ejecutar `npm run build` localmente)

### 9. ¿Puedo tener múltiples clientes en el mismo repo?

**NO.** Cada cliente = 1 repositorio separado.

**Estructura:**
```
chainx-starter-cliente1/
chainx-starter-cliente2/
chainx-starter-cliente3/
```

### 10. ¿Cómo actualizo la plataforma de un cliente existente?

**Opción A: Pull cambios del template**
```powershell
cd chainx-starter-cliente1
git remote add template https://github.com/Carlosa2021/chainx-rwa-starter-template.git
git fetch template
git merge template/main
```

**Opción B: Manual**
- Copiar archivos actualizados del template
- Revisar cambios
- Commit y push

---

## 🔧 CASOS DE USO COMUNES

### CASO 1: Cliente quiere cambiar de STARTER a PRO

**Proceso:**
1. Cliente paga upgrade (€499/mes - €49/mes = €450/mes adicional)
2. Actualizar variables en `.env.local`:
   ```bash
   NEXT_PUBLIC_PLAN=PRO
   NEXT_PUBLIC_MAX_PROJECTS=25
   NEXT_PUBLIC_MAX_INVESTORS=500
   ```
3. Actualizar en Vercel → Environment Variables
4. Redesplegar: `vercel --prod`

**IMPORTANTE:** Los contratos NO cambian, solo los límites en frontend.

### CASO 2: Cliente alcanzó el límite de proyectos

**Opciones:**
1. **Upgrade a plan superior** (recomendado)
2. **Eliminar proyecto antiguo** para liberar espacio
3. **Contratar plan adicional** (no implementado aún)

### CASO 3: Cliente quiere marca blanca (white label)

**Implementación:**
1. Reemplazar logo: `public/images/logo.png`
2. Actualizar colores en `tailwind.config.ts`:
   ```typescript
   theme: {
     extend: {
       colors: {
         primary: '#TU_COLOR',
         secondary: '#TU_COLOR',
       }
     }
   }
   ```
3. Actualizar meta tags en `src/app/layout.tsx`
4. Commit y redesplegar

### CASO 4: Cliente necesita multi-idioma

**Solución:**
1. Instalar i18n: `npm install next-intl`
2. Configurar locales: `es`, `en`, `ca`
3. Crear archivos de traducción
4. Actualizar componentes

**Nota:** Esto requiere desarrollo adicional (no incluido en STARTER base).

### CASO 5: Cliente quiere API para integración externa

**Solución:**
1. Crear endpoints en `src/app/api/`
2. Implementar autenticación (API keys)
3. Documentar API con Swagger
4. Entregar docs al cliente

**Nota:** Feature de plan ENTERPRISE (€4,999/mes).

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### Error 1: "Cannot read properties of undefined (reading 'address')"

**Causa:** Wallet no conectada o owner wallet incorrecto.

**Solución:**
```bash
# Verificar en .env.local
NEXT_PUBLIC_OWNER_WALLET=0x... # ← Debe ser exacta, con 0x
```

### Error 2: "Transaction failed: insufficient funds"

**Causa:** Cliente no tiene POL para gas.

**Solución:**
```
1. Pedir al cliente que compre POL
2. Enviar POL a su wallet
3. Verificar en MetaMask: Red = Polygon Mainnet
```

### Error 3: "Contract not deployed at address"

**Causa:** Addresses de contratos incorrectas o en red equivocada.

**Solución:**
```bash
# Verificar en PolygonScan
https://polygonscan.com/address/0x[CONTRACT_ADDRESS]

# Verificar que las addresses en .env.local sean correctas
NEXT_PUBLIC_PROJECT_REGISTRY=0x...
```

### Error 4: "401 Unauthorized from Thirdweb"

**Causa:** Client ID incorrecto o no configurado.

**Solución:**
```bash
# En Vercel → Environment Variables
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=8e23c797a5775080df8bad49ce5719a4

# Redesplegar
vercel --prod
```

### Error 5: "Admin page returns 403 Forbidden"

**Causa:** Wallet conectada no es el owner.

**Solución:**
```typescript
// Verificar en src/app/admin/page.tsx
// Asegurarse que la verificación usa la wallet correcta

// O para demo mode:
// Comentar la verificación de owner (como hicimos)
```

### Error 6: "Build failed: Module not found"

**Causa:** Dependencia faltante o import incorrecto.

**Solución:**
```powershell
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar imports en archivos
# Debe ser relativo o absoluto correcto
```

### Error 7: "Vercel deployment stuck at 'Building'"

**Causa:** Timeout de build o error silencioso.

**Solución:**
```
1. Ir a Vercel Dashboard → Deployments
2. Ver logs completos
3. Si timeout: optimizar imports/build
4. Subir Next.js memory: vercel.json
   {
     "functions": {
       "app/**": {
         "memory": 3008
       }
     }
   }
```

---

## 📊 CHECKLIST DE VALIDACIÓN POST-DEPLOYMENT

Antes de entregar al cliente, verificar:

### Frontend
- [ ] Página principal carga correctamente
- [ ] Dashboard muestra "Plan: STARTER"
- [ ] Límites correctos: 3 proyectos, 50 inversores
- [ ] Logo y colores correctos (si white label)
- [ ] Wallet connect funciona
- [ ] Owner puede acceder a /admin

### Smart Contracts
- [ ] Contratos verificados en PolygonScan
- [ ] Owner wallet es la del cliente
- [ ] ProjectRegistry permite crear proyectos
- [ ] InvestmentController permite invertir
- [ ] PayoutDistributor permite distribuir

### Configuración
- [ ] Todas las variables NEXT_PUBLIC_* configuradas
- [ ] Dominio personalizado funcionando (si aplica)
- [ ] SSL certificate activo (Vercel auto)
- [ ] Environment variables en Vercel correctas

### Documentación
- [ ] README del cliente creado
- [ ] Direcciones de contratos documentadas
- [ ] Credenciales de acceso enviadas
- [ ] Guía de primeros pasos enviada

### Soporte
- [ ] Email de soporte configurado
- [ ] Canal de comunicación establecido
- [ ] SLA acordado (24-48h STARTER)

---

## 💡 TIPS PRO

### 1. Automatiza con Scripts
Ya tienes:
- ✅ `setup-cliente-starter.ps1`
- ✅ `deploy-contracts-starter.ps1`

**Crea más:**
- `update-cliente.ps1` - Actualizar plataforma
- `verify-deployment.ps1` - Validar deployment
- `backup-cliente.ps1` - Backup de datos

### 2. Template de Email
Guarda un template de email de bienvenida con placeholders:

```
Hola {CLIENTE_NOMBRE},

¡Bienvenido a ChainX!

URL: {URL}
Owner Wallet: {OWNER_WALLET}
Plan: STARTER

Contratos:
- ProjectRegistry: {CONTRACT_1}
- InvestmentController: {CONTRACT_2}
- PayoutDistributor: {CONTRACT_3}

...
```

### 3. Monitoring
Implementa:
- Sentry para errors
- Google Analytics para uso
- Uptime monitoring (UptimeRobot)

### 4. Backup Strategy
Cada mes:
- Backup de contratos (addresses)
- Backup de configuración
- Backup de datos de proyectos

### 5. Documentación Interna
Mantén un Excel/Notion con:
- Cliente | Wallet Owner | Deployment Date | URL | Contracts | Status

---

## 🚀 PRÓXIMOS PASOS

1. **Probar el proceso completo:**
   ```powershell
   cd C:\Users\User\Desktop\RWA-InmoToken\scripts\deploy
   .\demo-onboarding-cliente.ps1
   ```

2. **Hacer un deployment real de prueba** con datos ficticios

3. **Timing de todo el proceso** para saber cuánto tardas

4. **Documentar problemas** que encuentres

5. **Mejorar scripts** basado en experiencia

---

**¿Más dudas? ¡Pregunta sin problema!** 💪
