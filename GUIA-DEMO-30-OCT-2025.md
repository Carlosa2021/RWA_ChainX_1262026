# 🎯 DEMO LISTO PARA 30 OCTUBRE 2025

## ✅ CONTRATOS DESPLEGADOS (Polygon Mainnet)

### 📝 Direcciones:
```
ProjectRegistry:        0xD0A787C10E1050cB994297206A5B251C6Ca11861
InvestmentController:   0x9501a2FaAC3Fdad5E051917739e0a259AcA9b3F0
Demo Token (DEMO):      0x1161B090E6f221c921b8dbec7d2Fb7551a518570
Treasury (tu wallet):   0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca
```

### 🔗 Verificar en Polygonscan:
- [ProjectRegistry](https://polygonscan.com/address/0xD0A787C10E1050cB994297206A5B251C6Ca11861)
- [InvestmentController](https://polygonscan.com/address/0x9501a2FaAC3Fdad5E051917739e0a259AcA9b3F0)
- [Demo Token](https://polygonscan.com/address/0x1161B090E6f221c921b8dbec7d2Fb7551a518570)

---

## 🚀 PASOS PARA MAÑANA

### 1. **ANTES DEL DEMO** (10 min)

#### A. Reinicia el servidor:
```powershell
cd C:\Users\User\Desktop\RWA-InmoToken
npm run dev
```

El servidor arrancará en: **http://localhost:3004**

#### B. Verifica que los contratos se cargaron:
- Abre la consola del navegador (F12)
- Busca mensajes con las direcciones de los contratos
- Deberías ver: `0xD0A787C10E1050cB...`

#### C. Prepara tu wallet:
- **Tu wallet (Admin/Treasury)**: 0xA62F...21ca
- **Wallet del cliente**: 0xe24c...69FB (o la que uses)
- Ambas necesitan tener:
  - ✅ POL para gas (~0.1 POL es suficiente)
  - ✅ USDC para invertir (1.2 USDC aprox para comprar 1 token a 1 EUR)

---

### 2. **DURANTE EL DEMO** (20 min)

#### PARTE 1: Mostrar que ya hay un proyecto registrado (5 min)

1. **Conecta Metamask** con tu wallet de admin
2. **Ve a Dashboard**: http://localhost:3004
3. **Explica**:
   - "Ya tenemos un proyecto registrado en blockchain"
   - "Demo Property - 5 EUR total"
   - "5 tokens a 1 EUR cada uno"
   - "Los pagos se hacen en USDC (stablecoin)"

4. **Muestra Polygonscan**:
   ```
   https://polygonscan.com/address/0xD0A787C10E1050cB994297206A5B251C6Ca11861
   ```
   - "Aquí está nuestro registro de proyectos en blockchain"
   - "Es público, inmutable, y transparente"

#### PARTE 2: Proceso de Inversión (15 min)

1. **Cambia a wallet del cliente**:
   - Desconecta tu wallet
   - Conecta la wallet del cliente (0xe24c...69FB)

2. **Selecciona el proyecto**:
   - Click en "Demo Property"
   - Muestra los detalles

3. **Invierte 1 token** (aquí viene la magia):
   - Click en "Invertir"
   - Ingresa: **1** token
   - **🔥 METAMASK APARECERÁ**

4. **Primera transacción - Aprobar USDC** (si es primera vez):
   - Metamask pregunta: "¿Permitir que InvestmentController gaste tu USDC?"
   - **Explica**: "Esto es un permiso estándar de seguridad"
   - Click "Confirmar"
   - **Espera confirmación** (~3-5 segundos)

5. **Segunda transacción - Invertir**:
   - Metamask pregunta: "¿Confirmar inversión?"
   - Muestra el costo en USDC (aprox 1.08 USDC por 1 EUR)
   - **Explica**: "El precio se convierte de EUR a USDC en tiempo real usando Chainlink"
   - Click "Confirmar"
   - **Espera confirmación** (~3-5 segundos)

6. **¡Token recibido!**:
   - La pantalla mostrará: "Inversión exitosa"
   - Ve a "Mi Billetera"
   - **Muestra el token DEMO** en el balance

7. **Verifica en Polygonscan**:
   ```
   https://polygonscan.com/tx/[HASH_DE_LA_TRANSACCION]
   ```
   - "Aquí está la transacción verificada en blockchain"
   - "Es inmutable y pública"

#### PARTE 3: Mostrar los pagos recibidos (5 min)

1. **Vuelve a tu wallet de admin**
2. **Ve a Admin → Pagos**: http://localhost:3004/admin/pagos
3. **Muestra**:
   - "Aquí vemos todos los pagos recibidos"
   - "El USDC llegó directamente a nuestra treasury"
   - "Todo registrado en blockchain"

---

## 🎬 GUIÓN DE PRESENTACIÓN

### Introducción (2 min)
> "Hoy voy a mostrarles cómo funciona **ChainX**, nuestra plataforma de tokenización de activos del mundo real. Vamos a hacer una inversión REAL en blockchain, no es simulación."

### Explicar el proyecto (3 min)
> "Tenemos un proyecto demo: 5 tokens a 1 EUR cada uno. El proyecto está registrado en Polygon, una blockchain pública donde cualquiera puede verificar la información."

### Proceso de inversión (15 min)
> "Ahora voy a invertir en este proyecto. Voy a comprar 1 token por 1 EUR. El pago se hace en USDC, una stablecoin que vale 1 dólar. El precio se convierte automáticamente usando un oráculo de Chainlink que nos da el cambio EUR/USD en tiempo real."

> *[Metamask aparece]*
> "Ven aquí? Metamask me pide confirmación. Esto es la wallet del inversor pidiendo permiso para la transacción. Primero apruebo que el contrato pueda usar mi USDC..."

> *[Aprobar USDC]*
> "Y ahora confirmo la inversión..."

> *[Confirmar inversión]*
> "Listo! La transacción está en blockchain. En unos segundos veremos el token en mi billetera..."

> *[Mostrar token recibido]*
> "Aquí está! Ya soy dueño de 1 token de este proyecto. Esto está registrado en blockchain de forma inmutable."

### Transparencia (5 min)
> "Lo más importante: todo es verificable. Podemos ver la transacción en Polygonscan..."

> *[Abrir Polygonscan]*
> "Aquí está el registro público. Cualquier inversor puede verificar su inversión, ver el contrato, y confiar en que todo es transparente."

---

## 📊 DATOS TÉCNICOS PARA PREGUNTAS

### Costos:
- **Gas por inversión**: ~0.002-0.005 POL (~$0.001-0.003 USD)
- **Precio 1 EUR en USDC**: ~1.08 USDC (varía con el cambio)
- **Total por 1 token**: ~1.08 USDC + gas

### Tecnología:
- **Blockchain**: Polygon (Ethereum L2)
- **Tokens**: ERC-20 compatible
- **Oráculo**: Chainlink EUR/USD
- **Stablecoin**: USDC Circle oficial

### Seguridad:
- Contratos auditables públicamente
- Multisig para funciones administrativas (opcional, explicar roadmap)
- KYC integrado (mostrar formulario, explicar que está listo)

---

## ❓ RESPUESTAS PARA PREGUNTAS FRECUENTES

**"¿Esto es real o una demo?"**
> Es completamente real. Estamos en Polygon Mainnet. Si inviertes, gastas USDC real y recibes tokens reales.

**"¿Y el KYC?"**
> El formulario está listo. En producción, un verificador KYC (empresa certificada) revisa los documentos en 2-3 días y aprueba al inversor antes de que pueda invertir.

**"¿Qué pasa si hay problemas?"**
> Los contratos tienen funciones de pausa para emergencias. En el roadmap está agregar multisig para más seguridad.

**"¿Cuánto cuesta operar esto?"**
> El gas en Polygon es muy barato: ~$0.001-0.01 por transacción. Mil veces más barato que Ethereum.

**"¿Pueden crear más tokens de la nada?"**
> No. El supply está fijado en el contrato. Solo se pueden emitir los 5 tokens declarados. Todo es verificable en blockchain.

**"¿Qué diferencia hay con los planes Starter/Pro/Enterprise?"**
> - **Starter**: 3 proyectos, 50 inversores max, $99/mes
> - **Pro**: 10 proyectos, 200 inversores, $299/mes
> - **Enterprise**: Ilimitado, $999/mes + personalización

---

## 🔧 TROUBLESHOOTING

### Si no aparece Metamask:
1. Verifica que Metamask esté en **Polygon Mainnet** (Chain ID: 137)
2. Recarga la página (F5)
3. Revisa la consola (F12) para errores

### Si falla la aprobación de USDC:
- Verifica que tienes USDC suficiente
- Verifica que tienes POL para gas
- Prueba con un monto menor primero

### Si el proyecto no se muestra:
- Espera 10 segundos (puede tardar en cargar de blockchain)
- Recarga la página
- Verifica en consola que CONTRACT_REGISTRY tenga la dirección correcta

---

## ✅ CHECKLIST PRE-DEMO

- [ ] Servidor corriendo en localhost:3004
- [ ] Metamask instalado y configurado en Polygon
- [ ] Wallet admin con POL para gas
- [ ] Wallet cliente con POL + USDC (1.5 USDC mínimo)
- [ ] Ambas wallets guardadas y accesibles
- [ ] Navegador con consola abierta (F12)
- [ ] Polygonscan abierto en pestaña separada
- [ ] Este documento abierto para referencia

---

## 🎉 DESPUÉS DEL DEMO

### Siguiente paso con el cliente:
1. **Recoger feedback**: ¿Qué les pareció?
2. **Discutir personalización**: ¿Quieren su branding?
3. **Hablar del plan**: ¿Starter es suficiente o necesitan Pro/Enterprise?
4. **Roadmap**: KYC real, multisig, reportes, etc.

### Documentar:
- Captura de pantalla de la transacción exitosa
- Hash de transacción para ejemplo futuro
- Feedback del cliente

---

**Preparado por:** ChainX Development Team  
**Fecha:** 29 Octubre 2025  
**Válido para:** Demo 30 Octubre 2025  
**Contratos:** Polygon Mainnet (permanentes)
