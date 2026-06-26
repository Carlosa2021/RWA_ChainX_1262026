# ChainX® RWA Platform — Architecture

> **Baseline**: commit `f412281`, tag `v1.9.7-environment-hardening`, date 2026-06-26
> **Sprint**: 9.6C (Environment Hardening)

---

## Overview

ChainX is a **multi-tenant, white-label real estate tokenization platform**.

**Dual-stack architecture**:

- **Frontend**: Next.js 15.5.7, App Router, TypeScript, Tailwind CSS v4, thirdweb v5.115.2
- **Smart Contracts**: Solidity 0.8.20, ERC-3643 T-REX standard, Hardhat, Polygon Mainnet only
- **Database**: Neon Postgres 17 (serverless), accessed via `@vercel/postgres ^0.10.0`
- **Hosting**: Vercel (project `rwa-chain-x-1262026`, Node.js 24.x)

**Multi-tenancy model**:

- Each white-label client (tenant) has a dedicated hostname
- Tenant identity drives: branding, metadata, favicon, email headers
- All tenant resolution is **server-side** — no client-side tenant detection
- No middleware — tenant resolved in `RootLayout` via `headers().get('host')`

---

## Tenant Resolution Flow

```
Incoming HTTP request
  → headers().get('host')             [src/app/layout.tsx — server component]
  → resolveTenant(hostname)           [src/lib/tenants/resolveTenant.ts]
    → domainRepository.getDomain()    [src/lib/repositories/index.ts]
      → tenant_domains table (Neon)
    → tenantRepository.getTenantById(domain.tenantId)
      → tenants table (Neon)
    → fallback: getTenantById("chainx")
  → <TenantProvider tenant={config}>  [src/contexts/TenantContext.tsx]
```

**Port normalization**: `hostname.split(':')[0].toLowerCase()` applied in all `getDomain()` calls — handles `localhost:3004` transparently.

**Fallback chain**:

1. Domain record found → tenant found → serve tenant config
2. Domain record found → tenant missing → fallback to `chainx`
3. Domain record not found → fallback to `chainx`

---

## Provider Tree (Client)

Defined in `src/app/layout.tsx`:

```
ThirdwebProvider
  └─ ThemeProvider           [src/contexts/ThemeContext.tsx]
       └─ AuthProvider       [src/contexts/AuthContext.tsx]
            └─ EnterpriseProvider  [src/components/EnterpriseProvider.tsx]
                 └─ LicenseProvider     [src/contexts/LicenseContext.tsx]
                      └─ TenantProvider      [src/contexts/TenantContext.tsx]
                           └─ BrandingProvider    [src/contexts/BrandingContext.tsx]
                                └─ FaviconInjector
                                     └─ {children}
```

---

## Authentication & Authorization

### Authentication — thirdweb v5

All wallet authentication is handled by thirdweb v5 SDK. No custom auth server.

**Supported wallet types** (configured in `src/components/WalletConnect.tsx`):

- In-App Wallets: email, Google, Apple, Facebook, Passkeys
- External: MetaMask, Coinbase, Rainbow, WalletConnect

### Owner Detection (`AuthProvider`)

```typescript
// src/contexts/AuthContext.tsx
const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase();
const isOwner = !!address && !!OWNER_ADDRESS && address === OWNER_ADDRESS;
```

- `isOwner = true` → `Role.PLATFORM_ADMIN`
- `isOwner = false` → `Role.READ_ONLY`

**Missing `NEXT_PUBLIC_OWNER_ADDRESS`** → `isOwner` always `false` → Administration section hidden.

### KYC Verification

```typescript
// AuthProvider reads IdentityRegistry on-chain
await readContract({
  contract: getTw(IDENTITY_REGISTRY),
  method: 'function isVerified(address) view returns (bool)',
  params: [address],
});
// Fallback: isKYCVerified = isOwner (if no IDENTITY_REGISTRY configured)
```

### RBAC (`src/lib/rbac/`)

```
roles.ts         → Role enum: PLATFORM_ADMIN | TENANT_ADMIN | INVESTOR | READ_ONLY
permissions.ts   → Permission enum: SETTINGS_MANAGE | TENANTS_MANAGE | DOMAINS_MANAGE | ...
usePermissions   → maps Role → Set<Permission>
```

Sidebar visibility: `section.ownerOnly && !isOwner → hidden`. All administration routes require `Permission.SETTINGS_MANAGE`.

---

## License / Plan System (`LicenseContext`)

```
Priority 1: NEXT_PUBLIC_PLAN_TYPE  (e.g. "ENTERPRISE")
Priority 2: prefix of NEXT_PUBLIC_LICENSE_KEY
Priority 3: "STARTER" (safe default)
```

Tiers: `STARTER` | `PRO` | `ENTERPRISE`. Controls `FeatureGuard` and `UpgradeGate` component visibility.

---

## Branding Resolution

Branding fields merge in ascending priority (last wins):

```
1. Platform defaults          (hardcoded constants)
2. TenantConfig               (from Neon tenants table)
3. tenant_branding.config     (JSONB — visual overrides only)
4. localStorage               (BrandingContext, client-side)
```

**Structural fields** (`id`, `hostname`, `plan`) are never readable from `tenant_branding.config`.

---

## Persistence Layer

### Repository Abstraction (`src/lib/repositories/index.ts`)

```typescript
const usePostgres = Boolean(process.env.POSTGRES_URL);

export const tenantRepository: ITenantRepository = usePostgres
  ? new PostgresTenantRepository()
  : new MockTenantRepository();

export const domainRepository: IDomainRepository = usePostgres
  ? new PostgresDomainRepository()
  : new MockDomainRepository();
```

**Postgres mode** is active whenever `POSTGRES_URL` is set.
**Mock mode** (in-memory) is the fallback for environments without a DB connection.

### Database Schema (Neon)

Three tables, created by `src/lib/db/migrations/`:

| Table             | Purpose                                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tenants`         | Tenant registry: id, brand_name, brand_url, support_email, primary_color, secondary_color, plan, show_infra_notice                                                |
| `tenant_domains`  | Domain lifecycle: hostname, tenant_id, verified, verification_status, Vercel integration columns (vercel_domain_id, txt_name, txt_value, cname_name, cname_value) |
| `tenant_branding` | Visual overrides: tenant_id, config (JSONB), updated_at                                                                                                           |

---

## Domain Management

Domain lifecycle states: `pending` → `registering` → `registered` → `verified` | `failed`

**Registration flow** (`src/app/api/admin/domains/register/route.ts`):

1. `POST /api/vercel/domains` via `src/lib/vercel/domains.ts`
2. Update `tenant_domains.verification_status = 'registering'`
3. Retrieve TXT/CNAME/A-record values from Vercel API
4. Store DNS instructions in `tenant_domains`

**Verification flow** (`src/app/api/admin/domains/check/route.ts`):

1. `GET /api/vercel/domains/{hostname}` → check `verified` field
2. Update `tenant_domains.verified = true`, `verification_status = 'verified'` on success

---

## Blockchain Architecture

**Network**: Polygon Mainnet (chain ID 137) — production only. No testnets in main branch.

**ERC-3643 T-REX Suite** (`contracts/contracts/erc3643/`):

```
SecurityToken (ERC-20 + compliance hooks)
  ├─ IdentityRegistry
  │    ├─ IdentityRegistryStorage
  │    ├─ ClaimTopicsRegistry
  │    └─ TrustedIssuersRegistry
  └─ ModularCompliance (transfer rules)

InvestmentController (per-project)
  ├─ SecurityToken
  ├─ USDC (0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359)
  ├─ Chainlink EUR/USD oracle
  └─ Treasury wallet
```

**Investment flow** (2 transactions — mandatory ERC-20 approve pattern):

1. `quoteUSDC(tokens)` → Chainlink oracle → USDC amount with 0.5% slippage
2. `txApproveUSDC(maxUsdcExpected)` → user approves InvestmentController
3. `txInvest(tokens, maxUsdcExpected)` → USDC transferred, tokens issued

---

## thirdweb v5 Integration

**Central client** (`src/lib/thirdweb.ts`):

```typescript
export const client = createThirdwebClient({ clientId: NEXT_PUBLIC_THIRDWEB_CLIENT_ID });
export const chain = defineChain(137);
export const getTw = (address: string) => getContract({ client, address, chain });
```

**Products in use**:

- Connect SDK — multi-wallet auth
- In-App Wallets — email/social login
- Pay (PayEmbed) — fiat-to-crypto on-ramp
- Contracts — type-safe contract reads/writes
- RPC — reliable blockchain endpoints
- Storage — IPFS for project metadata

---

## Key Source Directories

```
src/
  app/            Next.js App Router pages and API routes
  components/     Shared React components
    admin/        Admin-specific: DomainActions, DomainStatusBadge, DnsInstructionsPanel, CopyField
  config/         plans.ts, image-helpers.ts, project-images.ts
  contexts/       AuthContext, LicenseContext, TenantContext, BrandingContext, ThemeContext
  hooks/          useProjects, useInvestment, usePermissions, usePlanConfig, ...
  lib/
    abis/         InvestmentController, ProjectRegistry ABIs
    db/           Neon client + migrations SQL
    domains/      resolveDomain, domain types, registry
    email/        Resend email templates
    rbac/         roles, permissions, usePermissions
    repositories/ ITenantRepository, IDomainRepository + Postgres/Mock implementations
    tenants/      resolveTenant, tenant types, registry
    vercel/       Vercel Domains API integration
  types/          Shared TypeScript types
contracts/
  contracts/      Solidity source (ERC-3643 + ChainX controllers)
  scripts/        Hardhat TypeScript deployment scripts
  deployments/    Deployed contract addresses (JSON)
```

---

_For deployment procedures see [DEPLOYMENT.md](DEPLOYMENT.md)._
_For infrastructure and environment details see [INFRASTRUCTURE.md](INFRASTRUCTURE.md)._
