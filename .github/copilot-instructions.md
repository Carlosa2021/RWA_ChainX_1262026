# ChainX® RWA Platform - AI Agent Instructions

## � Business Model & Mission

**ChainX® is a B2B technology provider for real estate tokenization**. We offer white-label blockchain infrastructure to property developers/funds - NOT a retail investment platform.

### 🔑 Key Principles
1. **Technology-Only**: We provide the platform, clients manage their investors
2. **No Custody**: We DON'T handle third-party funds or token custody
3. **Regulatory Neutral**: Clients are responsible for their local compliance
4. **White Label Ready**: Full customization for client branding
5. **Production First**: NO test/demo code in main branch - only production-ready features

### 📦 Product Tiers (3 Repositories)
```
Parent Repo (this one) → ENTERPRISE (full features)
  ├─> chainx-rwa-starter    → STARTER tier
  ├─> chainx-rwa-pro         → PRO tier  
  └─> chainx-rwa-enterprise  → ENTERPRISE tier (copy of parent)
```

**Revenue Model**: SaaS licensing (€49/month to €4,999/month) based on feature access

### 🛡️ Legal Framework
- **Trademark**: ChainX® (N° 830657, Switzerland)
- **License**: Apache 2.0 + ChainX® additional terms
- **Compliance**: ERC-3643 (MiCA ready) - clients handle local regulations
- **Nice Classification**: Covers blockchain, Web3, crypto, tokenization

## 🏗️ Architecture Overview

**Dual-stack blockchain platform**: Next.js 15 frontend + Hardhat Solidity contracts for **ERC-3643 compliant real estate tokenization**.

### Critical Components
- **Frontend**: `src/` - Next.js 15 + TypeScript + Tailwind CSS + thirdweb SDK v5 (ALL products)
- **Smart Contracts**: `contracts/` - ERC-3643 token standard (10+ Solidity contracts)
- **Deployment Scripts**: `contracts/scripts/` - Hardhat TypeScript deployment automation
- **APIs**: `api/` - Optional Express backend for KYC/admin operations (client-managed)

### Multi-Tier SaaS Architecture
Projects are **100% on-chain**. All projects come from blockchain via `ProjectRegistry` contract:
- `src/hooks/useProjects.ts` - Reads projects from `NEXT_PUBLIC_PROJECT_REGISTRY`
- `contracts/contracts/ProjectRegistry.sol` - On-chain registry of all tokenized properties
- `contracts/scripts/deploy-full-platform.ts` - Factory pattern for new project deployment

**IMPORTANT**: Always deploy and test on **Polygon Mainnet** - NO testnets in production branch.

## 🔐 Authentication & Authorization

### Client-Specific Owner Address
```typescript
// src/contexts/AuthContext.tsx
const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase()
```
- **Owner Address**: MUST be configured per client deployment (their admin wallet)
- **NO Demo Mode in Production**: Remove `NEXT_PUBLIC_DEMO_MODE` - only for internal testing
- **Production Rule**: Only verified owner addresses have admin access

### Multi-Wallet Support (thirdweb v5)
**ALL thirdweb wallet products integrated**:
```typescript
import { createWallet } from "thirdweb/wallets";
// In-App Wallets: email, Google, Apple, Facebook, Passkeys
// External Wallets: MetaMask, Coinbase, Rainbow, WalletConnect
// Enterprise: Custom auth systems via thirdweb Auth
```

### thirdweb Products in Use
1. **Connect SDK** - Multi-wallet authentication
2. **In-App Wallets** - Email/social login (no seed phrases)
3. **Pay** - Fiat-to-crypto on-ramp (credit cards → USDC)
4. **Contracts** - Type-safe contract interactions
5. **RPC** - Reliable blockchain RPC endpoints
6. **Storage** - IPFS for project metadata/images
7. **Auth** (optional) - JWT-based authentication for APIs

## 💰 Investment Flow (Critical Path)

Investment requires **2 transactions** due to ERC-20 approve pattern:

1. **Quote USDC** → `src/lib/invest.ts::quoteUSDC(tokens)` calls `InvestmentController.quoteUSDC()`
   - Chainlink EUR/USD oracle converts EUR price → USDC amount (6 decimals)
   - Frontend adds 0.5% slippage buffer

2. **Approve USDC** → `txApproveUSDC(maxUsdcExpected)` 
   - User approves `InvestmentController` to spend USDC
   - Check existing allowance first: `getUSDCAllowance(wallet)`

3. **Invest** → `txInvest(tokens, maxUsdcExpected)`
   - Transfers USDC to treasury
   - Issues ERC-3643 security tokens to investor
   - Only works if investor is KYC verified in `IdentityRegistry`

**Never suggest single-step investment** - the approve pattern is mandatory for ERC-20 security.

## 🔧 Smart Contract System

### ERC-3643 Token Standard (T-REX)
Core compliance architecture in `contracts/contracts/erc3643/`:

```
SecurityToken (ERC-20 + compliance hooks)
  ├─> IdentityRegistry (who can hold tokens)
  │    ├─> IdentityRegistryStorage
  │    ├─> ClaimTopicsRegistry (KYC requirements)
  │    └─> TrustedIssuersRegistry (KYC providers)
  └─> Compliance (transfer rules: countries, lockups)
```

**Critical**: Transfers auto-fail if sender/receiver not verified or violate compliance rules. NO manual checks needed.

### Investment Architecture
```
InvestmentController (per-project)
  ├─> SecurityToken (issues tokens)
  ├─> USDC (payment token)
  ├─> Chainlink EUR/USD (price oracle)
  └─> Treasury (receives funds)
```

Each project has its own `InvestmentController` instance. Projects are deployed via:
```typescript
// contracts/scripts/deploy-full-platform.ts
await factory.createProject(name, symbol, priceEuroCents, hardCap, tokenURI)
```

## 🎨 Frontend Patterns

### thirdweb v5 SDK Usage
Always use typed contract calls:

```typescript
// src/lib/thirdweb.ts - Central client config
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
export const client = createThirdwebClient({ clientId: "..." });
export const chain = defineChain(137); // Polygon
export const getTw = (address) => getContract({ client, address, chain });

// Reading contracts
import { readContract } from "thirdweb";
const result = await readContract({
  contract: getTw(contractAddress),
  method: "function myFunction(uint256) view returns (uint256)",
  params: [value],
});

// Writing contracts
import { prepareContractCall, useSendTransaction } from "thirdweb";
const tx = prepareContractCall({
  contract: getTw(contractAddress),
  method: "function myFunction(uint256)",
  params: [value],
});
const { mutate: sendTx } = useSendTransaction();
sendTx(tx);
```

### Project Display Pattern
Projects fetch from blockchain but display uses local metadata:
- Blockchain: `name, securityToken, investmentController, isActive`
- Local UI: `location, image, description` (stored in `src/hooks/useProjects.ts::loadProjects`)

To add new project:
1. Deploy via `deploy-full-platform.ts` or admin UI
2. Add display metadata in `useProjects.ts::loadProjects()` matching by `name`

### Context Providers (Nested Structure)
```tsx
// src/app/layout.tsx
ThirdwebProvider > ThemeProvider > AuthProvider > EnterpriseProvider > LicenseProvider
```
- `AuthProvider`: Owner detection + KYC status
- `ThemeProvider`: Dark/light mode (persisted in localStorage)
- `LicenseProvider`: SaaS tier features (STARTER/PRO/ENTERPRISE)
- `EnterpriseProvider`: Feature flags for enterprise clients

## 🚀 Development Workflows

### Production Deployment (Polygon Mainnet ONLY)
```powershell
# ✅ MÉTODO OFICIAL: thirdweb CLI (SIEMPRE usar este)
cd contracts
npx thirdweb deploy -k YOUR_THIRDWEB_SECRET_KEY

# El CLI abre navegador con interfaz de deployment
# Selecciona contratos, conecta wallet, confirma en Polygon Mainnet
```

**CRÍTICO**: 
- **NUNCA uses** `npx hardhat run scripts/deploy-*.ts` directamente
- **SIEMPRE usa** thirdweb CLI - maneja gas, confirmaciones y verificación automáticamente
- Ver guía completa: `contracts/DEPLOYMENT-THIRDWEB.md`

### Local Development
```powershell
# Frontend (Enterprise = port 3004, Pro = 3001, Starter = 3000)
npm run dev              # Enterprise (full features)
npm run dev:pro          # Pro tier features only
npm run dev:starter      # Starter tier features only

# Backend API (optional, client-managed)
cd api && npm run dev

# Contract testing (use Polygon fork)
cd contracts
npx hardhat node --fork https://polygon-rpc.com
```

### Contract Deployment (Polygon Mainnet)
```powershell
# ✅ Método oficial con thirdweb CLI
cd contracts
npx thirdweb deploy -k $env:THIRDWEB_SECRET_KEY

# Selecciona contratos en el CLI (espacio para marcar, enter confirmar)
# Se abre navegador con interfaz de deployment
# Conecta wallet y confirma transacciones
# Copia addresses del dashboard de thirdweb
# Actualiza .env.local con nuevas addresses
```

**Gas Management**: thirdweb CLI maneja automáticamente gas price óptimo. Si falla, aumenta `gasPrice` en `hardhat.config.ts`.

**Documentación completa**: `contracts/DEPLOYMENT-THIRDWEB.md`

### Environment Variables (Production)
```bash
# thirdweb (REQUIRED - from paid account)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=...
THIRDWEB_SECRET_KEY=...

# Client-specific (MUST configure per deployment)
NEXT_PUBLIC_OWNER_ADDRESS=0x...  # Client's admin wallet

# Contract addresses (from mainnet deployment)
NEXT_PUBLIC_PROJECT_REGISTRY=0x...
NEXT_PUBLIC_PROJECT_FACTORY=0x...
NEXT_PUBLIC_IDENTITY_REGISTRY=0x...
NEXT_PUBLIC_USDC=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359  # Polygon USDC

# Chain configuration
NEXT_PUBLIC_CHAIN_ID=137  # Polygon Mainnet ONLY

# ❌ NEVER include in production:
# NEXT_PUBLIC_DEMO_MODE - Remove completely
# Test wallet keys - Client manages their own
```

Missing `NEXT_PUBLIC_PROJECT_REGISTRY`? App loads with empty projects list (not an error).

### Repository Structure for Multi-Tier
```bash
# Parent repo (this one) = ENTERPRISE (all features)
# Copy to tier-specific repos:
# - chainx-rwa-starter    → Remove pro/enterprise features
# - chainx-rwa-pro        → Remove enterprise-only features  
# - chainx-rwa-enterprise → Full copy of parent
```

## 📝 Project-Specific Conventions

### Naming Conventions
- Smart contracts: PascalCase (`SecurityToken.sol`)
- Components: PascalCase (`WalletConnect.tsx`)
- Hooks: camelCase with `use` prefix (`useProjects.ts`)
- Utilities: camelCase (`invest.ts`)

### Error Handling Pattern
```typescript
// Always log + rethrow for debugging
try {
  const result = await contract.call();
  console.log('✅ Success:', result);
  return result;
} catch (error) {
  console.error('❌ Error:', error);
  throw error; // Let UI handle with toast
}
```

### Toast Notifications (Sonner)
```typescript
import { toast } from "sonner";
toast.success("Inversión exitosa");
toast.error("Error en la transacción");
toast.loading("Procesando...", { id: "invest" });
toast.success("¡Listo!", { id: "invest" }); // Updates loading toast
```

## 🔒 Security & Compliance

### Never Commit Secrets
- `.env.local` is gitignored
- Use `.env.example` for templates
- Private keys ONLY in local environment

### Regulatory Compliance (ERC-3643)
- **KYC Required**: Users must be registered in `IdentityRegistry` before investing
- **Transfer Restrictions**: Only verified investors can receive tokens
- **Forced Transfers**: Owner can recover tokens from non-compliant wallets
- **Pause/Freeze**: Emergency controls in `SecurityToken`

Admin KYC approval flow:
```typescript
// contracts/scripts/approve-user-simple.ts
await identityRegistry.registerIdentity(wallet, identity, country);
```

## 🎯 Common Tasks

### Add New Project
1. Deploy: `npx hardhat run scripts/deploy-full-platform.ts --network polygon`
2. Update `src/hooks/useProjects.ts::loadProjects()` with UI metadata
3. Add images to `public/images/projects/<project-slug>/`

### Add New Payment Method (thirdweb)
See `src/app/payments/page.tsx` for PayEmbed integration examples.

### Modify Compliance Rules
```typescript
// contracts/contracts/erc3643/compliance/Compliance.sol
function allowCountry(uint16 country) external onlyOwner
function setMaxInvestmentPerWallet(uint256 max) external onlyOwner
```

### Debug Transaction Failures
1. Check `console.log` in browser (extensive logging throughout)
2. Verify wallet has USDC balance: `src/lib/invest.ts::getUSDCBalance()`
3. Check allowance: `getUSDCAllowance()`
4. Verify KYC: `identityRegistry.isVerified(wallet)` in Hardhat console

## 📦 Dependencies & Versions

- **Next.js**: 15.5.4 (App Router, Turbopack)
- **React**: 19.1.0
- **thirdweb**: ^5.108.15 (NOT v4 - APIs changed significantly)
- **Solidity**: 0.8.20 (via Hardhat)
- **Hardhat**: Latest with `@nomicfoundation/hardhat-toolbox`

### thirdweb v5 Breaking Changes
If migrating old code:
- `useContract()` → `getContract()` + `readContract()` / `prepareContractCall()`
- `useContractWrite()` → `useSendTransaction()` with `prepareContractCall()`
- `ConnectWallet` → Custom `WalletConnect` with `createWallet()`

## 🌐 Deployment & Production

### Vercel Deployment
1. Connect GitHub repo to Vercel
2. Set environment variables (especially `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`)
3. Deploy automatically on push to `main`

### Multi-Port Development (SaaS Tiers)
```powershell
npm run dev:starter   # Port 3000 (limited features)
npm run dev:pro       # Port 3001 (more features)
npm run dev:enterprise # Port 3004 (all features)
```
Controlled by `src/contexts/LicenseContext.tsx` reading `.env` files.

## 🚨 Critical "Gotchas"

1. **Decimal Confusion**: USDC uses 6 decimals, tokens use 0 decimals (whole units only)
2. **Async Loading**: Always check `isLoading` before accessing `projects` array
3. **Chain Mismatch**: thirdweb client uses `NEXT_PUBLIC_CHAIN_ID` (default 137 = Polygon)
4. **Owner Address**: MUST be from environment variable - update for each client deployment
5. **Demo Mode**: Remove completely from production - only for internal testing

---

**For questions**: See `README.md`, `PROYECTO-COMPLETO.md`, `PRODUCTION-CLEANUP-CHECKLIST.md` or deployment guides in root directory.

