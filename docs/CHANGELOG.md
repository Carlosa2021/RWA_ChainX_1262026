# ChainX® RWA Platform — Changelog

All notable changes to this project are documented in this file.

Format: `## [vX.Y.Z-slug] — YYYY-MM-DD`

---

## [v1.9.7-environment-hardening] — 2026-06-26

**Sprint 9.6C — Environment Hardening & Vercel CLI Recovery**

### Infrastructure

- Added `.vercel_old/` to `.gitignore` — legacy artifact from prior project link is now ignored
- Reconstructed `.vercel/project.json` from existing `repo.json` (project `rwa-chain-x-1262026`)
- Verified Vercel CLI authentication (`carlosa2021`) and project linkage via `npx vercel@latest`
- Documented 9 environment variables present in Vercel Production/Preview but absent locally
- Identified critical risk: Neon database is shared between local and production environments

### Documentation (new)

- `docs/ARCHITECTURE.md` — full system architecture for v1.9.7
- `docs/INFRASTRUCTURE.md` — Git strategy, Vercel, Neon, env vars, known limitations
- `docs/DEPLOYMENT.md` — local workflow, Git workflow, production deployment, rollback, env sync
- `docs/CHANGELOG.md` — this file

### Changed

- `.gitignore`: added `.vercel_old/` entry (1 line)

### No application code was modified in this sprint.

---

## [v1.9.6-tenant-provisioning-wizard] — 2026-06-25

**Sprint 9.6B — 3-Step Tenant Provisioning Wizard**

### Added

- `src/app/admin/tenants/new/page.tsx` — 3-step wizard: Tenant Identity → Domain → Branding
  - Step 1: tenantId, plan (starter/business/enterprise), brandName, brandUrl, supportEmail
  - Step 2: optional hostname (can be skipped)
  - Step 3: logoUrl, tagline, primaryColor, secondaryColor, showInfraNotice + live preview
- `src/app/admin/tenants/page.tsx` — added `+ New Tenant` button

### Changed

- `src/app/api/admin/tenants/provision/route.ts`:
  - hostname is now optional — domain INSERT is conditional on its presence
  - Added `VALID_PLANS` including `'business'`
  - Centralized `business → pro` plan mapping (`persistedPlan`)
  - Removed mandatory hostname validation
- `src/app/admin/tenants/[id]/page.tsx` — added `?tab=domains` redirect handling via `useSearchParams`

---

## [v1.9.5-domain-actions] — 2026-06-24

**Sprint 9.6A — Domain Lifecycle Actions & DNS Panel**

### Added

- `src/components/admin/DomainStatusBadge.tsx` — shared badge for 5 domain states (pending/registering/registered/verified/failed)
- `src/components/admin/CopyField.tsx` — labeled copy-to-clipboard field with 2s inline feedback
- `src/components/admin/DnsInstructionsPanel.tsx` — slide-over panel with TXT/CNAME/A-record blocks, verification trigger, backdrop overlay
- `src/components/admin/DomainActions.tsx` — row-level action buttons keyed to domain lifecycle status

### Changed

- `src/app/admin/domains/page.tsx` — integrated `DomainStatusBadge`, `DomainActions`, `DnsInstructionsPanel`
- `src/app/admin/tenants/[id]/page.tsx` — replaced local badge with shared component, added domain actions

---

## [v1.9.4-admin-read-layer] — 2026-06-22

**Sprint 9.5 — Tenant and Domain Read Layer**

### Added

- `src/app/admin/tenants/page.tsx` — tenant list with plan badges and domain counts
- `src/app/admin/tenants/[id]/page.tsx` — tenant detail with tabbed interface (Overview, Domains, Branding, Settings)
- `src/app/admin/domains/page.tsx` — domain list with verification status
- `src/app/api/admin/tenants/route.ts` — GET all tenants
- `src/app/api/admin/tenants/[id]/route.ts` — GET single tenant

---

## [v1.9.3-domain-verification] — 2026-06-21

**Sprint 9.4 — Domain Verification Check**

### Added

- `src/app/api/admin/domains/check/route.ts` — POST endpoint to check DNS verification with Vercel API
- Updates `tenant_domains.verified`, `verification_status`, `verified_at`, `last_checked_at`

---

## [v1.9.2-vercel-domain-registration] — 2026-06-21

**Sprint 9.3 — Vercel Domain Registration**

### Added

- `src/lib/vercel/domains.ts` — Vercel Domains API integration (register, check, delete)
- `src/app/api/admin/domains/register/route.ts` — POST endpoint to register domain with Vercel and store DNS instructions
- `src/app/api/admin/domains/route.ts` — GET/POST domain management

---

## [v1.9.1-domain-model-extension] — 2026-06-20

**Sprint 9.2 — Domain Model Vercel Columns**

### Added

- `src/lib/db/migrations/002_vercel_domains.sql` — adds Vercel integration columns to `tenant_domains`: `vercel_domain_id`, `txt_name`, `txt_value`, `cname_name`, `cname_value`, `verified_at`, `verification_error`, `last_checked_at`, `created_by`, `updated_at`; expands `verification_status` CHECK constraint to include `registering` and `failed`

### Changed

- `src/lib/repositories/types.ts` — `TenantDomain` extended with Vercel fields
- `src/lib/domains/types.ts` — `DomainVerificationStatus` type updated

---

## [v1.9.0-model-alignment] — 2026-06-19

**Sprint 9.1 — Plan and Branding Model Alignment**

### Changed

- `src/app/api/admin/tenants/provision/route.ts` — aligned `plan` field with Neon schema
- `src/lib/tenants/types.ts` — `TenantConfig.plan` aligned with DB enum values
- `src/lib/repositories/PostgresTenantRepository.ts` — `rowToTenantConfig()` improved structural field protection

---

## [v1.8.0-write-layer] — 2026-06-14

**Sprint 8C — Admin Write Layer & Atomic Provisioning**

### Added

- `src/app/api/admin/tenants/provision/route.ts` — atomic multi-table tenant provisioning (tenant + domain + branding in a single transaction)
- `src/app/api/admin/branding/route.ts` — POST/GET branding config per tenant
- `src/app/admin/page.tsx` — administration dashboard
- `src/app/admin/users/page.tsx`, `approvals/page.tsx`, `pagos/page.tsx`, `audit-trail/page.tsx`

---

## [v1.7.0-postgres-persistence] — 2026-06-13

**Sprint 8B — Postgres-Backed Repositories**

### Added

- `src/lib/repositories/PostgresTenantRepository.ts`
- `src/lib/repositories/PostgresDomainRepository.ts`
- `scripts/db-seed.mjs` — idempotent seed for 3 tenants and 3 domains

### Changed

- `src/lib/repositories/index.ts` — env-based Postgres/Mock switching via `Boolean(process.env.POSTGRES_URL)`

---

## [v1.6.0-persistence-abstraction] — 2026-06-12

**Sprint 8A — Repository Abstraction Layer**

### Added

- `src/lib/repositories/types.ts` — `ITenantRepository`, `IDomainRepository` interfaces
- `src/lib/repositories/TenantRepository.ts` — `MockTenantRepository` (in-memory)
- `src/lib/repositories/DomainRepository.ts` — `MockDomainRepository` (in-memory)
- `src/lib/db/migrations/001_initial.sql` — creates `tenants`, `tenant_domains`, `tenant_branding` tables

---

## [v1.5.0-custom-domains-foundation] — 2026-06-11

**Sprint 7.2 — Custom Domain Foundation**

### Added

- `src/lib/domains/resolveDomain.ts` — domain resolution logic
- `src/lib/domains/registry.ts` — static domain registry
- `src/lib/domains/types.ts` — domain type definitions
- `src/app/api/verify-domain/route.ts` — domain ownership verification endpoint

---

## [v1.4.0-tenant-foundation] — 2026-06-10

**Sprint 7.1 — Tenant Foundation**

### Added

- `src/contexts/TenantContext.tsx` — client-side tenant config provider
- `src/lib/tenants/resolveTenant.ts` — server-side tenant resolution from Host header
- `src/lib/tenants/types.ts` — `TenantConfig` type
- `src/lib/tenants/registry.ts` — static tenant registry (pre-DB)

### Changed

- `src/app/layout.tsx` — added server-side `resolveTenant` call, `TenantProvider`

---

## [v1.3.0-white-label-phase2] — 2026-06-09

**Sprint 6 Phase 2 — Custom Domain Experience**

### Added

- `src/components/SimpleHeader.tsx`, `SimplePropertyCard.tsx` — white-label UI variants
- `src/app/settings/branding/page.tsx` — branding settings page

### Changed

- `src/contexts/BrandingContext.tsx` — domain-aware branding resolution
- `src/components/Header.tsx` — white-label brand name + logo rendering

---

## [v1.2.1-footer-white-label-fix] — 2026-06-08

**Sprint 6.1 — Footer URL + Tagline Dynamic**

### Fixed

- Footer `brandUrl` and tagline now read from `BrandingContext` instead of hardcoded values

---

## [v1.2.0-white-label-visual] — 2026-06-07

**Sprint 6 Phase 1 — BrandingContext + Visual White-Label**

### Added

- `src/contexts/BrandingContext.tsx` — branding config with localStorage persistence + versioning (`STORAGE_VERSION`)
- `src/components/FaviconInjector.tsx` — dynamic favicon from branding config
- `src/components/PlanDisplay.tsx`, `SimplePlanDisplay.tsx` — plan badge components

---

## [v1.1.0-email-foundation] — 2026-06-05

**Sprint 2 — Resend Email Foundation**

### Added

- `src/app/api/kyc-notify/route.ts` — KYC notification email via Resend
- `src/app/api/onboarding-notify/route.ts` — onboarding notification email
- `src/app/api/contact/route.ts` — contact form handler
- `src/lib/email/templates.ts` — email template library

---

## [v1.0.1-domain-live] — 2026-06-01

**Fix: exFAT SSD symlink workaround**

### Fixed

- All npm scripts now use `node node_modules/...` absolute paths to bypass broken symlinks on exFAT SSD

---

## [v1.0.0-enterprise-demo] — 2026-06-01

**Sprint 1 — Enterprise Demo**

### Added

- Initial production-ready Next.js 15 + thirdweb v5 + ERC-3643 application
- `src/contexts/AuthContext.tsx` — owner wallet detection
- `src/contexts/LicenseContext.tsx` — STARTER/PRO/ENTERPRISE tier system
- `src/lib/rbac/` — role-based access control (PLATFORM_ADMIN, TENANT_ADMIN, INVESTOR, READ_ONLY)
- `src/components/Sidebar.tsx` — plan-gated navigation
- `src/components/WalletConnect.tsx` — multi-wallet support (MetaMask, Coinbase, In-App)
- `contracts/` — ERC-3643 T-REX suite + ChainX InvestmentController
- `src/hooks/useProjects.ts` — blockchain project loading from ProjectRegistry
- `src/lib/invest.ts` — 2-transaction investment flow (approve + invest)
- Vercel deployment, Polygon Mainnet configuration
