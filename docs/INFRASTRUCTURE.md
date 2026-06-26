# ChainX® RWA Platform — Infrastructure

> **Baseline**: commit `f412281`, tag `v1.9.7-environment-hardening`, date 2026-06-26

---

## Git Strategy

### Repository

| Property              | Value                                                   |
| --------------------- | ------------------------------------------------------- |
| Remote                | `https://github.com/Carlosa2021/RWA_ChainX_1262026.git` |
| Primary branch        | `main` (remote)                                         |
| Local tracking branch | `master`                                                |
| Push command          | `git push origin HEAD:main`                             |

### Branch Strategy

The project currently operates on a **single-branch model**:

- `main` — production-ready code only
- No feature branches in active use (single-developer workflow)
- Future multi-developer work should adopt: `main` (protected) + feature branches + PRs

### Release Strategy (Semantic Versioning)

```
v{MAJOR}.{MINOR}.{PATCH}-{slug}
```

- **MAJOR**: breaking changes to the platform architecture
- **MINOR**: new features or sprints
- **PATCH**: fixes within a sprint (e.g. v1.2.1)
- **slug**: kebab-case sprint description

Releases are **annotated Git tags** pushed to `origin`.

### Tag Strategy

Every production-ready feature set receives an annotated tag:

```bash
git tag -a v{version}-{slug} -m "Sprint {X.Y} - {Description}"
git push origin v{version}-{slug}
```

Tags are never deleted or force-pushed.

---

## Version History

| Tag                               | Commit  | Sprint | Description                          |
| --------------------------------- | ------- | ------ | ------------------------------------ |
| v1.0.0-enterprise-demo            | c94a757 | 1      | Enterprise demo, exFAT symlink fix   |
| v1.1.0-email-foundation           | 10e14c5 | 2      | Resend email API routes              |
| v1.2.0-white-label-visual         | dd13482 | 6.1    | BrandingContext + visual white-label |
| v1.2.1-footer-white-label-fix     | b23ebe5 | 6.1    | Footer URL + tagline dynamic         |
| v1.3.0-white-label-phase2         | 446459d | 6.2    | Custom domain experience             |
| v1.4.0-tenant-foundation          | 2dae69f | 7.1    | Tenant foundation layer              |
| v1.5.0-custom-domains-foundation  | 06f0836 | 7.2    | Custom domain foundation             |
| v1.6.0-persistence-abstraction    | 1e5e0bc | 8A     | Repository abstraction layer         |
| v1.7.0-postgres-persistence       | 5d37bf1 | 8B     | Postgres-backed repositories         |
| v1.8.0-write-layer                | 48401b3 | 8C     | Admin write layer + provisioning     |
| v1.9.0-model-alignment            | fb6dcb6 | 9.1    | Plan and branding model alignment    |
| v1.9.1-domain-model-extension     | 7637b98 | 9.2    | Domain model Vercel columns          |
| v1.9.2-vercel-domain-registration | 50ce68e | 9.3    | Vercel domain registration API       |
| v1.9.3-domain-verification        | 3977303 | 9.4    | Domain verification check            |
| v1.9.4-admin-read-layer           | b55e81d | 9.5    | Tenant and domain read layer         |
| v1.9.5-domain-actions             | 2c7a6f9 | 9.6A   | Domain lifecycle actions + DNS panel |
| v1.9.6-tenant-provisioning-wizard | 8a71ca8 | 9.6B   | 3-step tenant provisioning wizard    |
| v1.9.7-environment-hardening      | f412281 | 9.6C   | Environment hardening + Vercel CLI   |

---

## Vercel

### Project

| Property         | Value                   |
| ---------------- | ----------------------- |
| Project name     | `rwa-chain-x-1262026`   |
| Production URL   | `https://app.chainx.ch` |
| Framework        | Next.js                 |
| Node.js version  | 24.x                    |
| Build command    | `npm run build`         |
| Output directory | `.next`                 |
| Team             | `carlosa2021s-projects` |

### CI/CD

Deploys trigger automatically on push to `main` via GitHub integration. The Vercel CLI is **not required** for production deployments.

### Local CLI State

| File                   | Status                                                    |
| ---------------------- | --------------------------------------------------------- |
| `.vercel/project.json` | Present — `projectId` + `orgId` for `rwa-chain-x-1262026` |
| `.vercel/repo.json`    | Present — GitHub remote link                              |
| `.vercel/README.txt`   | Present — Vercel standard notice                          |
| `.vercel_old/`         | Present — legacy artifact (ignored by Git)                |

CLI available via `npx vercel@latest` (cached). Not installed globally.
Auth token active for user `carlosa2021`.

### Security Headers (vercel.json)

Applied to all routes:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Neon Database

### Connection

| Property         | Value                      |
| ---------------- | -------------------------- |
| Provider         | Neon Serverless Postgres   |
| Postgres version | 17.10                      |
| Client library   | `@vercel/postgres ^0.10.0` |
| Pooler URL       | `POSTGRES_URL`             |
| Direct URL       | `POSTGRES_URL_NON_POOLING` |

### Schema State (as of v1.9.7)

| Table             | Rows | Notes                        |
| ----------------- | ---- | ---------------------------- |
| `tenants`         | 3    | chainx, alzira, fundx        |
| `tenant_domains`  | 3    | Seeded                       |
| `tenant_branding` | 0    | No branding overrides seeded |

### Migration Files

| File                                           | Description                                                                              |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/lib/db/migrations/001_initial.sql`        | Creates `tenants`, `tenant_domains`, `tenant_branding` (IF NOT EXISTS)                   |
| `src/lib/db/migrations/002_vercel_domains.sql` | Adds Vercel integration columns to `tenant_domains`, expands `verification_status` CHECK |

### Critical Constraint — Shared Database

**Local and production share the same Neon instance.** There is no staging database. Any local write operation (migration, seed, manual INSERT) directly affects production data.

This is the **highest priority infrastructure risk** as of v1.9.7. See Sprint 9.6D recommendation.

---

## Environment Variables

### Variable Inventory

| Variable                         | Present Locally | Present in Vercel | Vercel Environments | Purpose                                  |
| -------------------------------- | --------------- | ----------------- | ------------------- | ---------------------------------------- |
| `POSTGRES_URL`                   | ✓               | ✓                 | All                 | DB pooler — activates Postgres mode      |
| `POSTGRES_URL_NON_POOLING`       | ✓               | ✓                 | All                 | DB direct — migrations, seed             |
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | ✓               | ✓                 | Prod, Preview       | thirdweb client auth                     |
| `THIRDWEB_SECRET_KEY`            | ✓               | ✓                 | Prod, Preview       | thirdweb server-side                     |
| `NEXT_PUBLIC_OWNER_ADDRESS`      | ✓               | ✓                 | Prod, Preview       | Owner wallet → admin access              |
| `NEXT_PUBLIC_PLAN_TYPE`          | ✓               | ✓                 | Prod, Preview       | License tier                             |
| `RESEND_API_KEY`                 | ✓               | ✓                 | Prod, Preview       | Email delivery                           |
| `NEXT_PUBLIC_CHAIN_ID`           | —               | ✓                 | Prod, Preview       | Blockchain chain ID (default: 137)       |
| `NEXT_PUBLIC_PROJECT_REGISTRY`   | —               | ✓                 | Prod, Preview       | On-chain project registry                |
| `NEXT_PUBLIC_IDENTITY_REGISTRY`  | —               | ✓                 | Prod, Preview       | On-chain KYC registry                    |
| `NEXT_PUBLIC_COMPLIANCE`         | —               | ✓                 | Prod, Preview       | On-chain compliance contract             |
| `NEXT_PUBLIC_USDC`               | —               | ✓                 | Prod, Preview       | USDC contract address                    |
| `NEXT_PUBLIC_EUR_USD_FEED`       | —               | ✓                 | Prod, Preview       | Chainlink EUR/USD oracle                 |
| `NEXT_PUBLIC_LICENSE_KEY`        | —               | ✓                 | Prod, Preview       | License key (redundant if PLAN_TYPE set) |
| `CHAINX_ADMIN_EMAIL`             | —               | ✓                 | Prod, Preview       | Admin notification email                 |
| `RESEND_FROM_EMAIL`              | —               | ✓                 | Prod, Preview       | Email from address                       |

### Variable Classification

**Critical for admin UI**:

- `NEXT_PUBLIC_OWNER_ADDRESS` — missing → `isOwner = false` → Administration hidden
- `NEXT_PUBLIC_PLAN_TYPE` — missing → defaults to STARTER → Enterprise features locked
- `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` — missing → wallet connection broken

**Missing locally (blockchain features)**:

- `NEXT_PUBLIC_CHAIN_ID`, `NEXT_PUBLIC_PROJECT_REGISTRY`, `NEXT_PUBLIC_IDENTITY_REGISTRY`, `NEXT_PUBLIC_USDC`, `NEXT_PUBLIC_EUR_USD_FEED`, `NEXT_PUBLIC_COMPLIANCE`
- Impact: investment flow unavailable locally. Admin UI unaffected.

---

## Runtime Architecture

### Local Development

| Property          | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Command           | `node node_modules/next/dist/bin/next dev --turbopack --port 3004` |
| Port              | 3004 (Enterprise)                                                  |
| npm scripts       | All via `node node_modules/...` (exFAT SSD — no symlinks)          |
| npm install flags | `--no-bin-links --ignore-scripts`                                  |

### exFAT SSD Constraint

The project runs from an exFAT-formatted portable SSD. exFAT does not support Unix symlinks. This affects:

- All `node_modules/.bin/` symlinks are broken
- All Next.js and npm binaries must be invoked via `node node_modules/...`
- Kill port: `fuser -k 3004/tcp` (not `lsof -ti:3004`)
- Global npm prefix: `/usr` (requires `sudo` for global installs)

---

## Known Infrastructure Limitations

| #   | Limitation                                         | Risk                                       | Resolution                           |
| --- | -------------------------------------------------- | ------------------------------------------ | ------------------------------------ |
| 1   | Local + production share Neon DB                   | **High** — local writes affect production  | Sprint 9.6D: isolated dev DB         |
| 2   | Vercel CLI not installed globally                  | Low                                        | `sudo npm install -g vercel`         |
| 3   | 9 blockchain env vars missing locally              | Low — admin UI unaffected                  | Copy from Vercel dashboard           |
| 4   | `NEXT_PUBLIC_OWNER_ADDRESS` only in Prod/Preview   | Medium — `vercel env pull` would remove it | Add to Development env in Vercel     |
| 5   | `tenant_branding` table empty                      | Low — defaults apply                       | Seed branding rows if needed         |
| 6   | thirdweb `^5.108.15` declared, `5.115.2` installed | Low — semver compatible                    | Pin to `5.115.2` in package.json     |
| 7   | Single-branch Git workflow                         | Low for solo dev                           | Adopt feature branches for team work |
