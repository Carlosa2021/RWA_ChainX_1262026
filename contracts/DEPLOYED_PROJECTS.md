# 🏠 Proyectos Inmobiliarios Desplegados en Polygon

**Fecha de despliegue:** 11 de octubre de 2025  
**Red:** Polygon Mainnet (Chain ID: 137)  
**Wallet deployer:** 0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca  
**Gas usado:** ~0.1 POL (antes MATIC)

---

## 📋 Contratos Principales

| Contrato | Address |
|----------|---------|
| **ProjectRegistry** | `0xd1D027675baBFD30bAf60aCF4Fc3CBdBf011562d` |
| **IdentityRegistry** | `0x41391dD49FeF214CCcCEfA3c0e7e5a8f7061B266` |
| **Compliance** | `0xdFF331EC826B05FB22F3B2641aDdB22d89aeb894` |
| **USDC** | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` |
| **EUR/USD Feed** | `0x73366Fe0AA0Ded304479862808e02506FE556a98` |

---

## 🏢 PROYECTO 1: Apartamento Madrid Centro

**Datos del inmueble:**
- 📍 Ubicación: Madrid, Calle Gran Vía 28
- 📐 Tamaño: 85 m²
- 💰 Valor total: €250,000
- 🪙 Precio por token: €500
- 🔢 Total tokens: 500
- 📈 ROI: 7.5% anual
- ⏱️ Duración: 24 meses
- 📝 Descripción: Apartamento renovado en pleno centro de Madrid, zona Gran Vía. Alta demanda turística y profesional.

**Contratos:**
- **SecurityToken (INMO-MAD-001):** `0xC5c789A12Fb5259f57Da713D909dBC797c029671`
- **InvestmentController:** `0x7c895D20A0e2c58752227Ba5E65eeF025fC459a3`
- **Metadata URI:** `ipfs://QmApartamentoMadrid`

---

## 🏠 PROYECTO 2: Casa Barcelona Eixample

**Datos del inmueble:**
- 📍 Ubicación: Barcelona, Passeig de Gràcia 92
- 📐 Tamaño: 120 m²
- 💰 Valor total: €450,000
- 🪙 Precio por token: €750
- 🔢 Total tokens: 600
- 📈 ROI: 6.8% anual
- ⏱️ Duración: 36 meses
- 📝 Descripción: Casa modernista en Eixample, zona premium de Barcelona. Ideal para alquiler de lujo.

**Contratos:**
- **SecurityToken (INMO-BCN-002):** `0xe6cd52c37d82d33AEbAE7a9bB8f7fED62321b5AF`
- **InvestmentController:** `0x0Db68a742a787D542C6428CAD252d9d9038Ee92b`
- **Metadata URI:** `ipfs://QmCasaBarcelona`

---

## 🏬 PROYECTO 3: Local Comercial Valencia

**Datos del inmueble:**
- 📍 Ubicación: Valencia, Avenida del Puerto 15
- 📐 Tamaño: 200 m²
- 💰 Valor total: €180,000
- 🪙 Precio por token: €300
- 🔢 Total tokens: 600
- 📈 ROI: 8.2% anual
- ⏱️ Duración: 18 meses
- 📝 Descripción: Local comercial en zona turística de Valencia, cerca del puerto. Alto tráfico peatonal.

**Contratos:**
- **SecurityToken (INMO-VLC-003):** `0x714E408cda94d0160a34310C2601871B1e7B16Fb`
- **InvestmentController:** `0xF8F7EB8E9541763349b5dfBfD97D28D326e0429A`
- **Metadata URI:** `ipfs://QmLocalValencia`

---

## 🔍 Verificar en Blockchain

Puedes ver todos los proyectos ejecutando:
```solidity
ProjectRegistry.getAllProjects()
```

O visitar en PolygonScan:
- [ProjectRegistry](https://polygonscan.com/address/0xd1D027675baBFD30bAf60aCF4Fc3CBdBf011562d)

---

## ⚙️ Configuración Técnica

**Arquitectura:**
- Cada proyecto tiene su propio **SecurityToken** (ERC-3643 compliant)
- Cada proyecto tiene su propio **InvestmentController** que:
  - Gestiona inversiones en USDC
  - Convierte EUR → USD usando Chainlink price feed
  - Emite tokens ERC-3643 solo a inversores verificados (KYC)
  - Respeta el hardcap (máximo de tokens)

**Flujo de inversión:**
1. Usuario completa KYC → aprobado en IdentityRegistry
2. Usuario aprueba USDC al InvestmentController
3. Usuario llama `invest(tokenAmount, maxUsdcExpected)`
4. InvestmentController:
   - Calcula precio en USDC usando feed EUR/USD
   - Transfiere USDC del usuario al treasury
   - Emite tokens ERC-3643 al usuario
5. Usuario recibe tokens representando propiedad fraccionada

**Seguridad:**
- Solo inversores verificados (KYC) pueden recibir tokens
- Cumplimiento con ERC-3643 (security token standard)
- Chainlink oracle para pricing
- Ownership de SecurityToken transferido a InvestmentController
- Treasury recibe todos los USDC

---

## 📊 Estado Actual

✅ **3 proyectos desplegados y registrados**  
✅ **Contratos verificados y operativos**  
✅ **Listo para pruebas de inversión**  

**Próximos pasos:**
1. Actualizar frontend para mostrar proyectos reales desde blockchain
2. Probar inversión con 5 USDC
3. Agregar imágenes profesionales de los inmuebles
4. Preparar demo para congreso (finales octubre)
