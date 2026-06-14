# ChainX® RWA Platform — Architecture v1.8.0

> **Baseline**: commit `48401b3`, tag `v1.8.0-write-layer`, date 2026-06-14
> **Sprint**: 8C (Write Layer + Atomic Provisioning)

---

## Overview

ChainX is a multi-tenant, white-label real estate tokenization platform.

**Dual-stack architecture**:

- Frontend: Next.js 15 App Router (TypeScript, Tailwind CSS v4, thirdweb v5)
- Smart contracts: Solidity 0.8.20, ERC-3643, Hardhat (Polygon Mainnet only)

**Multi-tenancy model**:

- Each white-label client (tenant) gets a dedicated hostname
- Tenant identity drives: branding, metadata, favicon, email headers
- All tenant resolution is server-side — no client-side tenant detection

---

## Tenant Resolution Flow

```
Incoming HTTP request
  → headers().get('host')            [layout.tsx, server component]
  → resolveTenant(hostname)          [src/lib/tenants/resolveTenant.ts]
    → domainRepository.getDomain()   [src/lib/repositories/index.ts]
      → DomainRow (hostname, tenant_id, verified, ...)
    → tenantRepository.getTenantById(domain.tenantId)
      → TenantConfig (id, hostname, brandName, primaryColor, ...)
    → fallback: getTenantById("chainx")
  → <TenantContext.Provider value={tenant}>
```

**Port normalization**: `hostname.split(':')[0].toLowerCase()` applied in all repository `getDomain()` calls — handles `localhost:3004` transparently.

**Fallback chain**:

1. Domain record found → tenant found → serve tenant config
2. Domain record found → tenant missing → fallback to `chainx`
3. Domain record not found → fallback to `chainx`

---

## Branding Resolution Flow

Branding fields merge in ascending priority (last wins):

```
LOWEST  →  HIGHEST
─────────────────────────────────────────────────────
1. Platform defaults            (hardcoded in components)
2. TenantConfig                 (from repository / DB)
   ├─ tenants.brand_name
   ├─ tenants.primary_color
   └─ ...
3. tenant_branding.config JSONB (visual overrides only)
4. localStorage                 (BrandingContext, client-side)
```

**Structural fields** (`id`, `hostname`) are locked to the authoritative DB columns.
They are never readable from `tenant_branding.config` — enforced in `rowToTenantConfig()`.

**Visual-only branding fields** (permitted in `tenant_branding.config`):
`brandName`, `brandUrl`, `supportEmail`, `primaryColor`, `secondaryColor`,
`faviconUrl`, `showInfraNotice`

**Extended fields** (BrandingContext only, not in DB schema):
`logoUrl`, `tagline`

---

## Persistence Layer

### Repository Interfaces

Defined in `src/lib/repositories/types.ts`:

```
ITenantRepository
  getTenantById(id)             → TenantConfig | undefined
  getTenantByHostname(hostname) → TenantConfig | undefined
  listTenants()                 → TenantConfig[]
  createTenant(config)          → void
  updateTenant(id, updates)     → TenantConfig | undefined
  saveTenant(config)            → void
  saveBranding(tenantId, config) → void

IDomainRepository
  getDomain(hostname)           → TenantDomain | undefined
  listDomains()                 → TenantDomain[]
  createDomain(domain)          → void
  updateDomain(hostname, updates) → TenantDomain | undefined
  saveDomain(domain)            → void
```

### Mock Repositories (POSTGRES_URL absent)

- `MockTenantRepository` — backed by `src/lib/tenants/registry.ts` (static map)
- `MockDomainRepository` — backed by `src/lib/domains/registry.ts` (static map)
- Write methods are `async` no-ops — safe to call but perform no IO
- Port normalization in `getDomain()` handles dev ports transparently

### Postgres Repositories (POSTGRES_URL present)

- `PostgresTenantRepository` — `@vercel/postgres` tagged template `sql`
- `PostgresDomainRepository` — same, parameterized queries only
- Singleton client from `src/lib/db/client.ts`
- Transactions use `createClient()` directly (singleton `sql` does not support `BEGIN/COMMIT`)

### Repository Switching

```typescript
// src/lib/repositories/index.ts
const usePostgres = Boolean(process.env.POSTGRES_URL);

export const tenantRepository = usePostgres
  ? new PostgresTenantRepository()
  : new MockTenantRepository();

export const domainRepository = usePostgres
  ? new PostgresDomainRepository()
  : new MockDomainRepository();
```

**POSTGRES_URL present**: all reads/writes go to Vercel Postgres.
**POSTGRES_URL absent**: all reads serve static registries; all writes are no-ops. Zero errors.

---

## Database Schema (v1.8.0)

Migration file: `src/lib/db/migrations/001_initial.sql`

```sql
tenants
  id TEXT PK                -- e.g. "chainx", "alzira"
  brand_name TEXT NOT NULL
  brand_url TEXT NOT NULL
  support_email TEXT NOT NULL
  primary_color TEXT DEFAULT '#2563EB'
  secondary_color TEXT DEFAULT '#0B1220'
  favicon_url TEXT nullable
  show_infra_notice BOOLEAN DEFAULT true
  plan TEXT DEFAULT 'starter'  -- starter | pro | enterprise
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ

tenant_domains
  hostname TEXT PK              -- e.g. "invest.alzira.com"
  tenant_id TEXT FK → tenants.id ON DELETE CASCADE
  verified BOOLEAN DEFAULT false
  verification_status TEXT CHECK (pending|verified|failed)
  created_at TIMESTAMPTZ

tenant_branding
  tenant_id TEXT PK FK → tenants.id ON DELETE CASCADE
  config JSONB DEFAULT '{}'     -- visual-only overrides
  updated_at TIMESTAMPTZ
```

Indexes: `idx_tenant_domains_tenant_id ON tenant_domains(tenant_id)`

---

## Provisioning Flow

### Recommended: `POST /api/admin/tenants/provision`

Atomically creates tenant + initial domain in one transaction. Eliminates orphan-tenant risk.

```
1. Parse JSON body
2. RBAC: callerAddress === NEXT_PUBLIC_OWNER_ADDRESS  → 403 if fail
3. Validate ALL fields upfront                        → 400 if fail
4. Mock mode gate: if !POSTGRES_URL → { success: true, mode: 'mock' }
5. Duplicate checks (pre-transaction):
   - getTenantById(id)      → 409 if exists
   - getDomain(hostname)    → 409 if exists
6. createClient() → connect()
   BEGIN
     INSERT INTO tenants (...)
     INSERT INTO tenant_domains (...)
   COMMIT
   finally: client.end()
7. Best-effort: tenantRepository.saveBranding()
   → brandingPersisted: true/false in response
   → failure does NOT rollback tenant/domain
8. Return: { success: true, tenantId, hostname, brandingPersisted }
```

**Transaction scope**: tenant + domain (atomic).
**Branding scope**: best-effort, post-commit, non-atomic.

### Maintenance: Individual Routes

Use these for updates to existing tenants — not for initial creation.

| Route                      | Purpose                             |
| -------------------------- | ----------------------------------- |
| `POST /api/admin/tenants`  | Create tenant only (no domain)      |
| `POST /api/admin/domains`  | Register domain for existing tenant |
| `POST /api/admin/branding` | Persist visual branding JSONB       |

All four routes share the same RBAC pattern: `ownerAddress === NEXT_PUBLIC_OWNER_ADDRESS`.

---

## RBAC Model

```
Role: PLATFORM_ADMIN
  → wallet address === NEXT_PUBLIC_OWNER_ADDRESS (env var)
  → full admin access: tenant create, domain register, branding, KYC approve

Role: COMPLIANCE_OFFICER  (defined, not wired to routes yet)
Role: INVESTOR_RELATIONS  (defined, not wired to routes yet)
Role: INVESTOR            (defined, not wired to routes yet)
```

Files: `src/lib/rbac/roles.ts`, `src/lib/rbac/permissions.ts`, `src/lib/rbac/usePermissions.ts`

---

## Static Registries (Mock Seed Data)

Both registries are used only when `POSTGRES_URL` is absent.

`src/lib/tenants/registry.ts` — 3 tenants: `chainx`, `alzira`, `fundx`
`src/lib/domains/registry.ts` — 3 domains: `app.chainx.ch`, `invest.alzira.com`, `portal.fundx.io`

These are **intentional mock artifacts**. They remain until Sprint 9 introduces
a full DB-seeding workflow that replaces the need for static fallback data.

---

## Rollback Strategy

### v1.8.0 → v1.7.0

```bash
git checkout v1.7.0-postgres-persistence
```

What changes:

- Removes: 4 admin API routes (`/api/admin/tenants`, `/api/admin/domains`, `/api/admin/branding`, `/api/admin/tenants/provision`)
- Removes: write methods from ITenantRepository / IDomainRepository interfaces
- Removes: write implementations from all 4 repository classes
- Removes: branding persistence call in `/settings/branding`

What is preserved at v1.7.0:

- All read operations (getTenantById, getDomain, listTenants, etc.)
- Postgres read layer (both repositories)
- Repository abstraction layer
- Static mock registries
- All frontend pages

### v1.7.0 → v1.6.0

```bash
git checkout v1.6.0-persistence-abstraction
```

Removes Postgres repositories entirely. All data served from static registries.

### Emergency rollback (Vercel)

In Vercel dashboard → Deployments → redeploy any previous successful build.
No database rollback needed — schema is additive (`IF NOT EXISTS`).

---

## Environment Variables

### Required for all deployments

```
NEXT_PUBLIC_THIRDWEB_CLIENT_ID   thirdweb client ID (public)
NEXT_PUBLIC_OWNER_ADDRESS        admin wallet — per-client (public)
NEXT_PUBLIC_CHAIN_ID             137 (Polygon Mainnet)
NEXT_PUBLIC_PLAN_TYPE            STARTER | PRO | ENTERPRISE
```

### Required for Postgres persistence

```
POSTGRES_URL                     Vercel Postgres pooled URL (private)
POSTGRES_URL_NON_POOLING         Vercel Postgres direct URL (for db:seed)
```

**Security**: `POSTGRES_URL` is server-side only. Never prefix with `NEXT_PUBLIC_`.

### Optional

```
THIRDWEB_SECRET_KEY              server-side thirdweb operations
RESEND_API_KEY                   email notifications
CHAINX_ADMIN_EMAIL               admin notification target
NEXT_PUBLIC_PROJECT_REGISTRY     on-chain project registry address
NEXT_PUBLIC_USDC                 USDC contract on Polygon
```

### Not in .env.example (tech debt)

`POSTGRES_URL` and `POSTGRES_URL_NON_POOLING` are used in code but absent from `.env.example`. Should be added before Sprint 9.

---

## Future Sprint Boundaries

### Sprint 9 — Domain Verification

Planned scope:

- Vercel Domains API integration (`POST /v10/domains`)
- DNS TXT record generation for tenant domain verification
- `POST /api/admin/domains/verify` route
- Automatic `verification_status` update: `pending → verified | failed`
- Webhook or polling strategy for verification state

Not in Sprint 9:

- Multi-approver workflows
- Audit trail persistence
- Investor portal customization per-tenant

### Sprint 10 — Audit Trail + Admin UI

Planned scope:

- Immutable audit log: `{ actor, role, action, target, timestamp }` per admin write
- Admin UI for tenant management (list, create, provision)
- Admin UI for domain management (list, verify, delete)
- Dual-authorization for critical operations (forced transfer, payout)

---

## Key File Map

| File                                               | Purpose                          |
| -------------------------------------------------- | -------------------------------- |
| `src/lib/repositories/types.ts`                    | Repository contracts             |
| `src/lib/repositories/index.ts`                    | Singleton export + env switching |
| `src/lib/repositories/TenantRepository.ts`         | Mock implementation              |
| `src/lib/repositories/DomainRepository.ts`         | Mock implementation              |
| `src/lib/repositories/PostgresTenantRepository.ts` | Postgres implementation          |
| `src/lib/repositories/PostgresDomainRepository.ts` | Postgres implementation          |
| `src/lib/tenants/resolveTenant.ts`                 | Server-side tenant resolution    |
| `src/lib/domains/resolveDomain.ts`                 | Server-side domain lookup        |
| `src/lib/tenants/types.ts`                         | TenantConfig interface           |
| `src/lib/domains/types.ts`                         | TenantDomain interface           |
| `src/lib/tenants/registry.ts`                      | Static mock tenant data          |
| `src/lib/domains/registry.ts`                      | Static mock domain data          |
| `src/lib/db/client.ts`                             | @vercel/postgres singleton       |
| `src/lib/db/migrations/001_initial.sql`            | DB schema                        |
| `src/app/api/admin/tenants/provision/route.ts`     | Atomic provisioning              |
| `src/app/api/admin/tenants/route.ts`               | Create tenant (maintenance)      |
| `src/app/api/admin/domains/route.ts`               | Register domain (maintenance)    |
| `src/app/api/admin/branding/route.ts`              | Persist branding JSONB           |
| `src/app/layout.tsx`                               | Server-side tenant injection     |
| `src/contexts/TenantContext.tsx`                   | Client-side tenant access        |
| `src/contexts/BrandingContext.tsx`                 | Client-side branding overrides   |
| `src/lib/rbac/roles.ts`                            | Role definitions                 |
| `src/lib/rbac/permissions.ts`                      | Permission map                   |
