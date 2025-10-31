# 🧹 PRODUCTION CLEANUP CHECKLIST

## ⚠️ CRITICAL: Remove ALL Test/Demo Code

This checklist ensures the codebase is 100% production-ready for B2B clients.

---

## 📋 Phase 1: Environment & Configuration

### ✅ .env Files
- [ ] Remove `NEXT_PUBLIC_DEMO_MODE` from all `.env` files
- [ ] Change `NEXT_PUBLIC_OWNER_ADDRESS` to `process.env.NEXT_PUBLIC_OWNER_ADDRESS`
- [ ] Verify all contract addresses are from Polygon Mainnet (not testnet)
- [ ] Remove any test wallet private keys
- [ ] Update `.env.example` to reflect production-only variables

**Files to check:**
- `.env.local`
- `.env.example`
- `.env.starter`
- `.env.pro`
- `.env.enterprise`

---

## 📋 Phase 2: Authentication & Authorization

### ✅ AuthContext.tsx
```typescript
// ❌ REMOVE hardcoded address:
const OWNER_ADDRESS = "0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca".toLowerCase();

// ✅ USE environment variable:
const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase();
```

- [ ] Remove hardcoded owner address in `src/contexts/AuthContext.tsx`
- [ ] Remove demo mode logic: `isKYCVerified = isOwner` (only for demo)
- [ ] Add proper KYC verification check from `IdentityRegistry` contract
- [ ] Remove any bypass logic for testing

**File:** `src/contexts/AuthContext.tsx`

---

## 📋 Phase 3: Frontend Components

### ✅ Remove Demo Components
- [ ] Delete `src/app/demo/` directory (if exists)
- [ ] Delete `src/components/EnvDebug.tsx` (or ensure it's never imported)
- [ ] Remove demo banners/warnings from UI
- [ ] Remove test project cards with fake data

### ✅ Admin Pages
- [ ] Review `src/app/admin/page.tsx` - remove test buttons
- [ ] Review `src/app/admin/pagos/page.tsx` - remove mock payout data
- [ ] Ensure KYC approval only works with real `IdentityRegistry` contract
- [ ] Remove any "fake success" toasts for testing

**Files to check:**
- `src/app/admin/**/*.tsx`
- `src/components/**/*.tsx`

---

## 📋 Phase 4: Smart Contract Scripts

### ✅ Deployment Scripts
- [ ] Keep only `deploy-full-platform.ts` (production script)
- [ ] Delete test scripts:
  - `deploy-demo-*.ts`
  - `deploy-test-*.ts`
  - `deploy-alzira-demo.ts`
  - Any script with "demo", "test", "sample" in name

### ✅ Test Data Scripts
- [ ] Delete `add-alzira-project.js` (hardcoded test project)
- [ ] Delete `add-real-projects.ts` (if contains test data)
- [ ] Keep only production deployment scripts

**Directory:** `contracts/scripts/`

**Action:**
```powershell
cd contracts\scripts
# List all demo/test scripts
Get-ChildItem -Filter "*demo*","*test*" | Remove-Item -Confirm
```

---

## 📋 Phase 5: Project Data

### ✅ useProjects.ts
Current issue: Projects are loaded from blockchain BUT display metadata is hardcoded.

**File:** `src/hooks/useProjects.ts`

- [ ] Remove hardcoded project metadata (lines ~80-150)
- [ ] Implement dynamic metadata loading from:
  - IPFS (via `tokenURI` in SecurityToken)
  - Backend API (client-managed)
  - Or keep minimal fallback (name only)

**Example cleanup:**
```typescript
// ❌ REMOVE hardcoded metadata
const projectsWithMetadata = blockchainProjects.map((p, i) => ({
  ...p,
  location: "Madrid, España",  // Hardcoded!
  image: "/images/...",         // Hardcoded!
  apy: "8.5%",                  // Hardcoded!
}));

// ✅ LOAD from IPFS or API
const metadata = await fetchFromIPFS(project.tokenURI);
```

---

## 📋 Phase 6: Test/Mock Contracts

### ✅ Remove Mock Contracts
- [ ] Delete `contracts/contracts/MockSecurityToken.sol`
- [ ] Delete any test helper contracts
- [ ] Keep only production ERC-3643 contracts

**Action:**
```powershell
cd contracts\contracts
Remove-Item MockSecurityToken.sol -Confirm
```

---

## 📋 Phase 7: Deployment Files

### ✅ Clean Deployment JSONs
- [ ] Review `contracts/deployments/*.json`
- [ ] Delete demo deployment files:
  - `demo-deployment.json`
  - `alicante-2025.json` (if test data)
  - `real-test-deployment.json`
- [ ] Keep only production mainnet deployments

**Files to check:**
- `contracts/deployments/*.json`

---

## 📋 Phase 8: Documentation

### ✅ Remove Demo References
- [ ] Update README.md - remove "demo mode" instructions
- [ ] Update DEPLOYMENT-GUIDE.md - remove test deployment steps
- [ ] Remove `DEMO-SCRIPT-CONGRESO.md` (if exists)
- [ ] Remove `GUIA-DEMO-30-OCT-2025.md`
- [ ] Keep only production documentation

**Files to update:**
- `README.md`
- `DEPLOYMENT-GUIDE.md`
- `DEPLOYMENT-CONTRATOS-GUIA-RAPIDA.md`

---

## 📋 Phase 9: API Backend (if used)

### ✅ api/ Directory
- [ ] Remove test endpoints in `api/server.js`
- [ ] Remove `api/kyc.json` test data
- [ ] Ensure all endpoints validate client authentication
- [ ] Add rate limiting for production

**Files to check:**
- `api/server.js`
- `api/database.js`
- `api/kyc.json`

---

## 📋 Phase 10: Hardhat Configuration

### ✅ hardhat.config.ts
- [ ] Remove testnet configurations (Mumbai, Sepolia, etc.)
- [ ] Keep ONLY Polygon Mainnet
- [ ] Verify RPC URL is production: `https://polygon-rpc.com`
- [ ] Remove test account private keys (use client's keys)

**File:** `contracts/hardhat.config.ts`

```typescript
// ❌ REMOVE testnets
networks: {
  mumbai: { ... },  // DELETE
  sepolia: { ... }, // DELETE
}

// ✅ KEEP ONLY MAINNET
networks: {
  polygon: {
    url: POLYGON_RPC_URL || "https://polygon-rpc.com",
    accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
  }
}
```

---

## 📋 Phase 11: Images & Assets

### ✅ Project Images
- [ ] Review `public/images/projects/` directory
- [ ] Delete test/demo project folders
- [ ] Keep only placeholder or client-specific images
- [ ] Ensure no copyrighted images without license

**Directory:** `public/images/projects/`

---

## 📋 Phase 12: Vercel Configuration

### ✅ vercel.json
- [ ] Remove demo route redirects
- [ ] Keep only production security headers
- [ ] Verify build command: `npm run build`

**File:** `vercel.json`

```json
// ❌ REMOVE demo redirects
{
  "source": "/demo",
  "destination": "/miami",
  "permanent": true
}

// ✅ KEEP ONLY security headers
```

---

## 📋 Phase 13: Package.json Scripts

### ✅ Clean Scripts
- [ ] Review `package.json` scripts
- [ ] Remove test/demo-specific scripts
- [ ] Ensure all scripts are production-ready

**File:** `package.json`

```json
// Keep these:
"dev": "next dev --turbopack --port 3004",
"build": "next build --turbopack",
"start": "next start",

// Review/remove if test-only:
"dev:starter", "dev:pro" // OK for multi-tier
```

---

## 📋 Phase 14: Git & GitHub

### ✅ Repository Cleanup
- [ ] Review `.gitignore` - ensure no secrets committed
- [ ] Remove test branches (keep only `main`)
- [ ] Clean commit history if contains test commits (optional)
- [ ] Update repository description on GitHub

**Action:**
```powershell
# Check for accidentally committed secrets
git log --all --full-history -- "*.env*"

# Review sensitive files
git log --all -- contracts/deployments/
```

---

## 📋 Phase 15: Final Verification

### ✅ Pre-Production Tests
- [ ] Deploy contracts to Polygon Mainnet (small test)
- [ ] Verify contract on PolygonScan
- [ ] Test investment flow with real USDC (small amount)
- [ ] Test KYC approval flow
- [ ] Test admin panel with real owner address
- [ ] Test all thirdweb integrations (Pay, Connect, etc.)

### ✅ Security Audit Checklist
- [ ] No private keys in code
- [ ] No demo mode bypasses
- [ ] All owner checks use environment variables
- [ ] All contracts verified on PolygonScan
- [ ] Rate limiting on API endpoints
- [ ] CORS configured for production domains only

---

## 🚀 POST-CLEANUP: Multi-Tier Repository Setup

After cleaning the parent repo, create tier-specific repos:

### Starter Tier
```powershell
# Copy parent repo
git clone https://github.com/Carlosa2021/RWA_ChainX.git chainx-rwa-starter

# Remove enterprise features
# - Advanced analytics
# - AI assistant
# - Multi-project support
# - Custom branding

# Update LicenseContext.tsx to enforce STARTER limits
```

### Pro Tier
```powershell
# Copy parent repo
git clone https://github.com/Carlosa2021/RWA_ChainX.git chainx-rwa-pro

# Remove enterprise-only features
# - White label customization
# - Dedicated support features
# - Advanced compliance tools

# Update LicenseContext.tsx to enforce PRO limits
```

### Enterprise Tier
```powershell
# Full copy of cleaned parent repo
# NO feature restrictions
```

---

## ✅ FINAL CHECKLIST

Before declaring "production-ready":

- [ ] All phases above completed
- [ ] No `DEMO_MODE` in codebase
- [ ] No hardcoded wallet addresses
- [ ] No test scripts in contracts/scripts/
- [ ] All contracts deployed to Polygon Mainnet
- [ ] All environment variables use `process.env`
- [ ] Documentation updated (no demo references)
- [ ] Test investment flow works (real USDC)
- [ ] Multi-tier repos created and tested
- [ ] Vercel deployments configured per tier

---

## 🎯 SUCCESS CRITERIA

✅ **Code is clean**: No test/demo code in main branch  
✅ **Mainnet only**: All contracts on Polygon Mainnet  
✅ **Client-ready**: Can be deployed for any B2B client  
✅ **Secure**: No secrets, no bypasses, proper auth  
✅ **Scalable**: Multi-tier architecture works  
✅ **Documented**: Clear instructions for deployment  

---

**Next Steps After Cleanup:**
1. Tag release: `git tag v1.0.0-production`
2. Create tier-specific repos
3. Deploy enterprise demo for sales
4. Onboard first B2B client 🚀
