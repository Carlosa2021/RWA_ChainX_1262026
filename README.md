# 🏢 RWA InmoToken - Tokenización Inmobiliaria ERC-3643

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-GPL--3.0%20%2B%20MIT-green.svg) ![Solidity](https://img.shields.io/badge/solidity-0.8.20-orange.svg) ![thirdweb](https://img.shields.io/badge/thirdweb-SDK%20v5-purple.svg)

**Plataforma profesional de tokenización de inmuebles con ERC-3643 + MiCA compliance, powered by thirdweb SDK v5**

## 🎯 ¿Qué es RWA InmoToken?

Plataforma completa que permite invertir en inmuebles tokenizados con cumplimiento regulatorio total. Combina:
- ✅ **ERC-3643** (Security Tokens con KYC/AML on-chain)
- ⚖️ **MiCA Ready** (Regulación europea)
- 🚀 **thirdweb SDK v5** (TODOS los productos integrados)
- 💰 **Rendimientos 10%** anual con distribución automática

## ✨ Features Implementadas

### Smart Contracts
- 🔐 **SecurityToken ERC-3643** completo (pause, freeze, forced transfer)
- 👤 **IdentityRegistry** + Compliance modular
- 🏭 **ProjectTokenFactory** (deploy proyectos en 1 tx)
- 💸 **InvestmentController** con Chainlink EUR/USD
- 💰 **PayoutDistributor** para rentas proporcionales

### Frontend (Next.js 15 + TypeScript)
- 🌐 **Multi-wallet**: Email, Google, Apple, Facebook, Passkeys, MetaMask, Coinbase, Rainbow
- 📊 **Dashboard profesional** con stats en tiempo real
- 🎨 **UI brutal** con Tailwind CSS + gradientes
- 🔄 **Modal de inversión** con quote automático
- ⚡ **Type-safe** con hooks custom de thirdweb

## 🚀 Quick Start

### 1. Instalar

```bash
npm install
cd contracts && npm install && cd ..
```

### 2. Configurar .env

```env
# Frontend
NEXT_PUBLIC_TW_CLIENT_ID=tu_client_id
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_USDC=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
NEXT_PUBLIC_EUR_USD_FEED=0x73366Fe0AA0Ded304479862808e02506FE556a98

# Contracts (contracts/.env)
POLYGON_RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=tu_private_key
TREASURY=tu_wallet
```

### 3. Deploy Contratos

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy-full-platform.ts --network polygon-amoy
```

Guarda las direcciones en `.env`:

```env
NEXT_PUBLIC_IDENTITY_REGISTRY=0x...
NEXT_PUBLIC_COMPLIANCE=0x...
NEXT_PUBLIC_PROJECT_REGISTRY=0x...
NEXT_PUBLIC_PROJECT_FACTORY=0x...
```

### 4. Iniciar App

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 🎉

## 🏗️ Arquitectura

```
contracts/
├── erc3643/
│   ├── SecurityToken.sol              # ERC-3643 token
│   ├── IdentityRegistry.sol           # KYC/AML registry
│   ├── compliance/Compliance.sol      # Reglas de compliance
│   └── registry/                      # ClaimTopics + TrustedIssuers
├── InvestmentController.sol           # Lógica de inversión USDC
├── ProjectTokenFactory.sol            # Factory de proyectos
├── ProjectRegistry.sol                # Registro de proyectos
└── PayoutDistributor.sol              # Distribución de rentas

src/
├── app/page.tsx                       # Dashboard principal
├── components/WalletConnect.tsx       # Multi-wallet connector
├── hooks/
│   ├── useProjects.ts                 # Hook proyectos
│   └── useInvestment.ts               # Hook inversión
└── lib/
    ├── thirdweb.ts                    # Cliente thirdweb
    └── config.ts                      # Configuración
```

## 💎 Productos thirdweb Integrados

| Producto | Status | Uso |
|----------|--------|-----|
| **In-App Wallets** | ✅ | Email, Social, Passkeys |
| **Connect** | ✅ | MetaMask, Coinbase, Rainbow |
| **Transactions** | ✅ | prepareContractCall + useSendTransaction |
| **Contracts** | ✅ | getContract + useReadContract |
| **Payments** | 🚧 | Buy with fiat/crypto (próximamente) |
| **Engine** | 🚧 | Backend wallet + gasless (próximamente) |
| **Insight** | 🔮 | Analytics (futuro) |

## 📚 Uso

### Para Inversores

1. **Conectar wallet** (email, social o MetaMask)
2. **Completar KYC** (demo: pre-registrado)
3. **Seleccionar proyecto** (ej: Property Madrid Centro)
4. **Invertir**: Aprobar USDC + Invest
5. **Recibir tokens ERC-3643** en wallet
6. **Cobrar rentas** (10% anual, claim proporcional)

### Para Admins

**Crear proyecto:**
```solidity
factory.createProject(
  "Property Barcelona",
  "PBC",
  0,              // decimals (indivisible)
  100000,         // €1,000 por token
  20,             // 20 tokens
  USDC,
  TREASURY,
  "ipfs://...",
  EUR_USD_FEED
);
```

**Registrar inversor:**
```solidity
identityRegistry.registerIdentity(
  investorAddress,
  onchainIdContract,
  724  // España
);
```

**Distribuir rentas:**
```solidity
distributor.schedulePayout(5000e6); // €5,000 USDC
```

## 🛡️ Cumplimiento Regulatorio

### ERC-3643
- ✅ Identities on-chain (ONCHAINID)
- ✅ Compliance modular (países, lockups, limits)
- ✅ Transfer restrictions automáticas
- ✅ Forced transfers (recovery)

### MiCA (EU)
- ✅ White Paper (IPFS)
- ✅ Transparencia total on-chain
- ✅ KYC/AML obligatorio
- ✅ Custody con proveedores regulados

**Países permitidos:**
🇪🇸 España (724) | 🇺🇸 USA (840) | 🇩🇪 Alemania (276) | 🇬🇧 UK (826)

## 📊 Roadmap

- [x] **Fase 1 (MVP)**: Contratos + Frontend + Deploy ✅
- [ ] **Fase 2 (Producción)**: KYC real + Payments + Engine + Auditoría
- [ ] **Fase 3 (Scale)**: Multi-chain + P2P Market + DAO + Analytics
- [ ] **Fase 4 (Innovación)**: AI/ML + DeFi + Institucional

## 🧪 Testing

```bash
cd contracts
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat coverage
```

## 🌐 Deploy Mainnet

```bash
# 1. Actualizar .env con mainnet data
POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/...
PRIVATE_KEY=mainnet_key

# 2. Deploy
npx hardhat run scripts/deploy-full-platform.ts --network polygon

# 3. Verificar en Polygonscan
npx hardhat verify --network polygon 0xAddress "Constructor" "Args"

# 4. Actualizar frontend .env
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_PROJECT_REGISTRY=0x...

# 5. Build y deploy
npm run build
vercel --prod
```

## 🤝 Contribuir

```bash
git checkout -b feature/AmazingFeature
git commit -m 'feat: add amazing feature'
git push origin feature/AmazingFeature
# Abrir PR
```

## 📄 Licencias

- Contratos: **GPL-3.0**
- Frontend: **MIT**

## 🎉 Stack Tecnológico

- [thirdweb SDK v5](https://thirdweb.com) - Web3 platform
- [ERC-3643](https://erc3643.org) - Security Token Standard
- [Next.js 15](https://nextjs.org) - React framework
- [TypeScript](https://typescriptlang.org) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Hardhat](https://hardhat.org) - Smart contract development
- [Chainlink](https://chain.link) - EUR/USD price feeds
- [OpenZeppelin](https://openzeppelin.com) - Secure contracts

## 🆘 Soporte

- **Docs thirdweb**: [portal.thirdweb.com](https://portal.thirdweb.com)
- **ERC-3643**: [docs.erc3643.org](https://docs.erc3643.org)
- **Issues**: [github.com/tu-repo/issues](https://github.com/tu-repo/issues)

---

**🚀 ¿Listo para tokenizar inmuebles con cumplimiento regulatorio?**

Contáctanos para implementación enterprise, auditorías o consultoría.

*Hecho con ❤️ para el futuro de las inversiones inmobiliarias*
