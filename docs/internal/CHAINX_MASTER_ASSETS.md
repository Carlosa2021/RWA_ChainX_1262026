# ChainX Master Assets

**CLASSIFICATION: INTERNAL USE ONLY — DO NOT DISTRIBUTE**

This document is an internal Disaster Recovery, Infrastructure and Asset Inventory
reference. It is not customer documentation and must never be shared outside the
authorized administration team. It contains no secrets; it describes only where
secrets are stored and how to recover the platform.

---

## 1. Document Information

| Field          | Value                                                 |
| -------------- | ----------------------------------------------------- |
| Document Title | ChainX Master Assets                                  |
| Version        | 1.0.0                                                 |
| Creation Date  | 2026-07-17                                            |
| Last Reviewed  | 2026-07-17                                            |
| Author         | ChainX Technical Owner                                |
| Purpose        | Disaster recovery, infrastructure and asset inventory |
| Classification | Internal Use Only                                     |
| Distribution   | Authorized administrators only                        |
| Review Cadence | Quarterly                                             |

> This document must never contain passwords, API keys, secret keys, private keys,
> mnemonic phrases, recovery codes, or wallet secrets. It only records **where**
> those items are stored and **how** to recover access to them.

---

## 2. System Overview

ChainX is a B2B white-label blockchain infrastructure platform for real estate
tokenization. The platform is a dual-stack architecture composed of a web frontend
and on-chain smart contracts, with optional supporting services.

High-level components:

| Layer           | Technology              | Role                                  |
| --------------- | ----------------------- | ------------------------------------- |
| Frontend        | Next.js 15 (App Router) | Web application and admin UI          |
| Language        | TypeScript              | Type-safe application code            |
| Styling         | Tailwind CSS            | Design system and layout              |
| Web3 SDK        | Thirdweb SDK v5         | Wallet auth, contract calls, storage  |
| AI              | OpenAI                  | AI-assisted features (optional)       |
| Database        | Postgres                | Off-chain application data (optional) |
| Hosting (app)   | Vercel                  | Frontend build and delivery           |
| Hosting (infra) | Hostinger               | Domains and supporting services       |
| Source Control  | GitHub                  | Repositories and release management   |
| Blockchain      | Polygon Mainnet         | ERC-3643 tokenization contracts       |

Architectural principles:

- The platform is technology-only. Clients manage their own investors and funds.
- No third-party custody is provided by ChainX.
- Projects are on-chain and read from an on-chain registry contract.
- Compliance is enforced at the smart-contract layer (ERC-3643 / T-REX).

Implementation details are intentionally omitted here. See `docs/ARCHITECTURE.md`
and `docs/INFRASTRUCTURE.md` for engineering-level detail.

---

## 3. Domains

Placeholders below must be completed by the Technical Owner and reviewed quarterly.

### 3.1 chainx.ch (Primary)

| Field            | Value                          |
| ---------------- | ------------------------------ |
| Purpose          | Primary production application |
| DNS Provider     | _(to be completed)_            |
| Hosting Provider | _(to be completed)_            |
| SSL Provider     | _(to be completed)_            |
| Registrar        | _(to be completed)_            |
| Auto-renew       | _(to be completed)_            |
| Notes            | _(to be completed)_            |

### 3.2 landing.chainx.ch (Marketing / Landing)

| Field            | Value                           |
| ---------------- | ------------------------------- |
| Purpose          | Public landing / marketing site |
| DNS Provider     | _(to be completed)_             |
| Hosting Provider | _(to be completed)_             |
| SSL Provider     | _(to be completed)_             |
| Notes            | _(to be completed)_             |

### 3.3 Future Subdomains

| Subdomain              | Purpose      | DNS Provider | Hosting | SSL     | Notes   |
| ---------------------- | ------------ | ------------ | ------- | ------- | ------- |
| app.chainx.ch          | _(reserved)_ | _(tbd)_      | _(tbd)_ | _(tbd)_ | _(tbd)_ |
| api.chainx.ch          | _(reserved)_ | _(tbd)_      | _(tbd)_ | _(tbd)_ | _(tbd)_ |
| docs.chainx.ch         | _(reserved)_ | _(tbd)_      | _(tbd)_ | _(tbd)_ | _(tbd)_ |
| _(add rows as needed)_ |              |              |         |         |         |

---

## 4. Source Code

| Field              | Value                                        |
| ------------------ | -------------------------------------------- |
| Primary Repository | _(GitHub org/repo — to be completed)_        |
| Default Branch     | `main`                                       |
| Release Strategy   | Tag-based releases from `main`               |
| Tag Convention     | `vMAJOR.MINOR.PATCH` (semantic versioning)   |
| Branch Protection  | Required on `main` (reviews + status checks) |
| Force Push Policy  | Disabled on protected branches               |
| Deploy Trigger     | Push / merge to `main` triggers Vercel build |

### 4.1 Product Tier Repositories

| Tier                | Repository           | Notes                            |
| ------------------- | -------------------- | -------------------------------- |
| Enterprise (parent) | _(to be completed)_  | Full feature set                 |
| Pro                 | `chainx-rwa-pro`     | Enterprise-only features removed |
| Starter             | `chainx-rwa-starter` | Pro/Enterprise features removed  |

### 4.2 Backup Locations

- Primary: GitHub (origin).
- Secondary: Local working SSD clone.
- Tertiary: External encrypted SSD mirror (periodic `git bundle` or full clone).
- See Section 11 for the 3-2-1 backup strategy.

---

## 5. Environment Variables

> Values are never recorded in this document. The tables below list variable names,
> purpose, whether the variable is required, where the authoritative copy is stored,
> and in which deployment scopes the variable is configured. No values appear here.
>
> Legend for scope columns: **Yes** = set in that scope, **No** = not set,
> **Opt** = optional / feature-dependent.

The `Stored in` column indicates the authoritative source of truth. Public
`NEXT_PUBLIC_*` values are non-sensitive and may live in `.env.local` and Vercel;
server secrets must only ever be stored in the secret manager / vault and injected
into Vercel and local `.env.local` at provisioning time.

### 5.1 Thirdweb

| Name                             | Purpose                    | Required | Stored in            | Development | Preview | Production |
| -------------------------------- | -------------------------- | -------- | -------------------- | ----------- | ------- | ---------- |
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | Thirdweb client identifier | Yes      | `.env.local`, Vercel | Yes         | Yes     | Yes        |
| `THIRDWEB_SECRET_KEY`            | Thirdweb server secret     | Yes      | Vault, Vercel        | Yes         | Yes     | Yes        |

### 5.2 Database

| Name           | Purpose                    | Required | Stored in     | Development | Preview | Production |
| -------------- | -------------------------- | -------- | ------------- | ----------- | ------- | ---------- |
| `DATABASE_URL` | Postgres connection string | Opt      | Vault, Vercel | Opt         | Opt     | Opt        |

### 5.3 Authentication

| Name                        | Purpose                             | Required | Stored in            | Development | Preview | Production |
| --------------------------- | ----------------------------------- | -------- | -------------------- | ----------- | ------- | ---------- |
| `NEXT_PUBLIC_OWNER_ADDRESS` | Client admin wallet (owner) address | Yes      | `.env.local`, Vercel | Yes         | Yes     | Yes        |

### 5.4 OpenAI

| Name             | Purpose               | Required | Stored in     | Development | Preview | Production |
| ---------------- | --------------------- | -------- | ------------- | ----------- | ------- | ---------- |
| `OPENAI_API_KEY` | OpenAI server API key | Opt      | Vault, Vercel | Opt         | Opt     | Opt        |

### 5.5 Stripe

> Only applicable if Stripe billing is enabled. Thirdweb Pay is the default
> on-ramp; complete this group only when Stripe is provisioned.

| Name                                 | Purpose                       | Required | Stored in            | Development | Preview | Production |
| ------------------------------------ | ----------------------------- | -------- | -------------------- | ----------- | ------- | ---------- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key        | Opt      | `.env.local`, Vercel | Opt         | Opt     | Opt        |
| `STRIPE_SECRET_KEY`                  | Stripe server secret key      | Opt      | Vault, Vercel        | Opt         | Opt     | Opt        |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret | Opt      | Vault, Vercel        | Opt         | Opt     | Opt        |

### 5.6 Application

| Name                  | Purpose                          | Required | Stored in            | Development | Preview | Production |
| --------------------- | -------------------------------- | -------- | -------------------- | ----------- | ------- | ---------- |
| `NEXT_PUBLIC_APP_URL` | Canonical public application URL | Opt      | `.env.local`, Vercel | Opt         | Opt     | Opt        |

### 5.7 Blockchain

| Name                            | Purpose                              | Required | Stored in            | Development | Preview | Production |
| ------------------------------- | ------------------------------------ | -------- | -------------------- | ----------- | ------- | ---------- |
| `NEXT_PUBLIC_CHAIN_ID`          | Target chain (Polygon = 137)         | Yes      | `.env.local`, Vercel | Yes         | Yes     | Yes        |
| `NEXT_PUBLIC_PROJECT_REGISTRY`  | On-chain project registry address    | Yes      | `.env.local`, Vercel | Yes         | Yes     | Yes        |
| `NEXT_PUBLIC_PROJECT_FACTORY`   | On-chain project factory address     | Opt      | `.env.local`, Vercel | Opt         | Opt     | Opt        |
| `NEXT_PUBLIC_IDENTITY_REGISTRY` | ERC-3643 identity registry address   | Yes      | `.env.local`, Vercel | Yes         | Yes     | Yes        |
| `NEXT_PUBLIC_USDC`              | Payment token address (Polygon USDC) | Yes      | `.env.local`, Vercel | Yes         | Yes     | Yes        |

### 5.8 Infrastructure

| Name                | Purpose                                    | Required | Stored in        | Development | Preview | Production |
| ------------------- | ------------------------------------------ | -------- | ---------------- | ----------- | ------- | ---------- |
| _(to be completed)_ | Provider-injected infrastructure variables | Opt      | Provider / Vault | Opt         | Opt     | Opt        |

Add rows as new variables are introduced. Keep every group synchronized with
`.env.example`.

### 5.9 Deployment Scopes

| Scope       | Location                                    | Notes                  |
| ----------- | ------------------------------------------- | ---------------------- |
| Development | `.env.local` (local, gitignored)            | Never committed        |
| Preview     | Vercel → Environment Variables → Preview    | Per-branch deployments |
| Production  | Vercel → Environment Variables → Production | Live application       |

### 5.10 Backup Guidance

- Store the authoritative copy of every secret in a dedicated secret manager or an
  encrypted password vault, not in plain files.
- Keep an encrypted backup of `.env.local` templates (names only, no values) on
  the external encrypted SSD.
- Recreate `.env.local` from the vault when provisioning a new workstation.
- Rotate any secret suspected of exposure immediately (see Section 12).

---

## 6. Thirdweb

Thirdweb provides wallet authentication, contract interaction, storage, and RPC.

| Asset         | Where to find it                              | Notes                        |
| ------------- | --------------------------------------------- | ---------------------------- |
| Client ID     | Thirdweb Dashboard → Project → Settings       | Public value                 |
| Secret Key    | Thirdweb Dashboard → Project → API Keys       | Secret — store in vault only |
| Engine        | Thirdweb Dashboard → Engine (if used)         | Server-side tx infra         |
| Contracts     | Thirdweb Dashboard → Contracts                | Deployed contract addresses  |
| Wallet Config | Thirdweb Dashboard → Connect / In-App Wallets | Supported wallet providers   |

Recovery notes:

- Access to the Thirdweb Dashboard is via the account owner login (see Section 10
  and Section 16 for the responsible person placeholder).
- Regenerating the Secret Key invalidates the old one; update Vercel and `.env.local`.
- Contract addresses are also recoverable from the Polygon block explorer and from
  the deployment records in the repository.

---

## 7. OpenAI

| Field              | Value / Location                                      |
| ------------------ | ----------------------------------------------------- |
| API Key Location   | Vault / secret manager; injected via `OPENAI_API_KEY` |
| Dashboard          | OpenAI Platform → API Keys                            |
| Billing            | OpenAI Platform → Billing                             |
| Projects / Orgs    | OpenAI Platform → Projects                            |
| Rate Limits        | OpenAI Platform → Limits                              |
| Responsible Person | _(placeholder — see Section 16)_                      |

Recovery notes:

- If a key is lost or leaked, revoke it in the OpenAI dashboard and issue a new one.
- Update the secret in the vault, Vercel, and local `.env.local`.
- Monitor billing to detect unexpected usage indicative of a leaked key.

---

## 8. Database

Postgres is optional and used only for off-chain application data.

| Field              | Value / Location                                    |
| ------------------ | --------------------------------------------------- |
| Provider           | _(to be completed)_                                 |
| Connection String  | Vault / secret manager; injected via `DATABASE_URL` |
| Region             | _(to be completed)_                                 |
| Responsible Person | _(placeholder — see Section 16)_                    |

### 8.1 Backup Procedure

- Enable automated provider-managed backups (daily minimum).
- Additionally, capture periodic logical dumps: `pg_dump` to an encrypted archive.
- Store dumps on the external encrypted SSD and a cloud location (3-2-1 rule).

### 8.2 Restore Procedure

- Provision a new Postgres instance.
- Restore from the most recent verified backup: `pg_restore` (or provider console).
- Update `DATABASE_URL` in the vault, Vercel, and `.env.local`.
- Validate application connectivity and run any pending migrations.

### 8.3 Migration Strategy

- Use versioned, forward-only migrations checked into the repository.
- Apply migrations as part of the deployment pipeline.
- Test migrations against a copy of production data before release.

---

## 9. Hosting

### 9.1 Vercel (Application)

| Field                 | Value / Location                          |
| --------------------- | ----------------------------------------- |
| Project               | _(to be completed)_                       |
| Team / Org            | _(to be completed)_                       |
| Environment Variables | Vercel → Settings → Environment Variables |
| Domains               | Vercel → Settings → Domains               |

### 9.2 Hostinger (Infrastructure)

| Field              | Value / Location                    |
| ------------------ | ----------------------------------- |
| Account            | _(to be completed)_                 |
| Services           | Domains / DNS / supporting services |
| Responsible Person | _(placeholder — see Section 16)_    |

### 9.3 Deployment Flow

- Push or merge to `main` in the primary repository.
- Vercel builds automatically and deploys to Production.
- Branch pushes create Preview deployments.

### 9.4 Rollback Procedure

- In Vercel, open the project's Deployments list.
- Identify the last known-good deployment.
- Promote it to Production ("Promote to Production" / "Rollback").
- Confirm environment variables match the intended release.

---

## 10. GitHub

| Field                  | Value / Location                                                   |
| ---------------------- | ------------------------------------------------------------------ |
| Organization / Account | _(to be completed)_                                                |
| Primary Repository     | _(to be completed)_                                                |
| Protected Branches     | `main` (reviews + status checks required)                          |
| Release Tags           | `vMAJOR.MINOR.PATCH`                                               |
| SSH Keys               | Local machine `~/.ssh`; registered in GitHub → Settings → SSH Keys |
| PAT Tokens             | Stored in vault; scoped minimally; rotated regularly               |
| MFA                    | Enabled (authenticator app + backup codes in vault)                |
| Passkeys               | Enabled where supported                                            |

### 10.1 Recovery Procedure

- Sign in using MFA. If the device is lost, use backup codes stored in the vault.
- If backup codes are lost, use GitHub account recovery for the account owner.
- Re-register SSH keys and passkeys from the new machine.
- Revoke any PATs or SSH keys associated with lost devices.
- Review the security log for unauthorized activity.

---

## 11. Backups

### 11.1 3-2-1 Strategy

- **3** copies of data (1 primary working copy + 2 independent backups).
- **2** different media types (for example local SSD and cloud storage).
- **1** copy stored off-site / off-line (external encrypted SSD kept separately).

The 3-2-1 rule is the minimum standard. No single failure — theft, corruption,
accidental deletion, or provider outage — may result in data loss.

### 11.2 Backup Matrix

| Target                   | Medium                  | Frequency      | Retention    | Encrypted        | Off-site                |
| ------------------------ | ----------------------- | -------------- | ------------ | ---------------- | ----------------------- |
| Local SSD (working copy) | Internal / portable SSD | Continuous     | N/A          | Optional         | No                      |
| GitHub repository        | Remote Git origin       | Every push     | Full history | Provider-managed | Yes                     |
| External encrypted SSD   | Encrypted SSD           | Weekly         | 12 weeks     | Yes              | Yes (stored separately) |
| Cloud backup             | Encrypted cloud storage | Daily / weekly | 90 days      | Yes              | Yes                     |

### 11.3 GitHub Repository as a Backup

- GitHub holds the authoritative copy of source code, tags, and release history.
- All work must be pushed regularly so no unbacked commits remain only on a laptop.
- Periodically create a full mirror for cold storage: `git bundle create <file> --all`.
- Store the bundle on the external encrypted SSD (source code without secrets).

### 11.4 Encrypted External SSD

- Use full-disk or volume-level encryption on the external SSD.
- The unlock passphrase is stored in the vault, never in this document.
- Keep the SSD physically separated from the primary workstation.
- Contents: Git bundles, encrypted `.env` templates (names only), encrypted
  database dumps, and a copy of the `docs/` folder.

### 11.5 What to Back Up

- Source code (Git repositories, all branches and tags).
- Environment variable templates (names only) and encrypted vault export.
- Database dumps (encrypted).
- Deployment records and on-chain contract addresses.
- This document and the `docs/` folder.

### 11.6 Retention Policy

| Data Class           | Retention          | Notes                           |
| -------------------- | ------------------ | ------------------------------- |
| Source code (Git)    | Indefinite         | Full history retained in GitHub |
| External SSD mirror  | 12 weeks (rolling) | Oldest weekly set overwritten   |
| Cloud backups        | 90 days (rolling)  | Daily/weekly rotation           |
| Database dumps       | 90 days            | Aligned with cloud retention    |
| Restore-test records | 24 months          | Kept in the review log          |

### 11.7 Verification Procedure

- Confirm each scheduled backup completes without error.
- Verify archive integrity (checksums) after each run.
- Confirm encryption is applied to all off-machine copies.
- Confirm the latest GitHub push matches the local `HEAD`.

### 11.8 Monthly Restore Test

- [ ] Select the most recent backup set.
- [ ] Restore source code to an isolated location and confirm it builds.
- [ ] Restore a database dump to a scratch instance and confirm integrity.
- [ ] Verify contract addresses resolve on Polygon.
- [ ] Record the test date and outcome in the review log.

---

## 12. Disaster Recovery

Never expose secrets during any recovery. Always recreate secrets from the vault.
Each checklist below is self-contained and actionable.

### 12.1 New Workstation

- [ ] Install the toolchain: Git, Node.js, npm.
- [ ] Generate and register a new SSH key and passkey with GitHub.
- [ ] Clone the primary repository from GitHub.
- [ ] Restore `.env.local` from the vault (no values are stored in Git).
- [ ] Run `npm ci` and `npm run build` to validate the environment.
- [ ] Re-authenticate the Vercel and Thirdweb CLIs.

### 12.2 Lost Laptop

- [ ] Revoke the lost device's SSH keys and PATs in GitHub.
- [ ] Revoke active sessions in Vercel, Thirdweb, and OpenAI.
- [ ] Rotate any secret that may have been cached locally.
- [ ] Confirm no unpushed commits are lost (check GitHub `HEAD`).
- [ ] Re-provision on a new workstation (Section 12.1).

### 12.3 GitHub Compromise

- [ ] Change the account password and review all MFA devices.
- [ ] Revoke every PAT and any unrecognized SSH key.
- [ ] Review collaborators and remove unauthorized access.
- [ ] Review recent commits, tags, and releases for tampering.
- [ ] Re-enable branch protection and force-push restrictions if altered.
- [ ] Review the security audit log for unauthorized activity.

### 12.4 Lost Authenticator

- [ ] Use backup codes (from the vault) to sign in to affected accounts.
- [ ] Re-enroll the authenticator app on a new device.
- [ ] Remove the lost authenticator from every account's security settings.
- [ ] Generate and store fresh backup codes in the vault.

### 12.5 Compromised API Key

- [ ] Revoke the key immediately in the provider dashboard.
- [ ] Issue a new key and update the vault, Vercel, and `.env.local`.
- [ ] Review provider logs and billing for unauthorized usage.
- [ ] Redeploy and validate the application.

### 12.6 Expired API Key

- [ ] Generate a replacement key in the provider dashboard.
- [ ] Update the vault, Vercel, and `.env.local`.
- [ ] Redeploy and validate the affected feature.

### 12.7 Database Restore

- [ ] Provision a new Postgres instance.
- [ ] Restore the most recent verified dump (`pg_restore` or provider console).
- [ ] Update `DATABASE_URL` in the vault, Vercel, and `.env.local`.
- [ ] Run any pending migrations.
- [ ] Validate application connectivity and data integrity.

### 12.8 Full Platform Rebuild

- [ ] Provision a new workstation (Section 12.1).
- [ ] Restore source code from GitHub or the external encrypted SSD.
- [ ] Verify repository integrity (`git fsck --full`).
- [ ] Recreate all secrets from the vault into Vercel and `.env.local`.
- [ ] Restore the database (Section 12.7) if applicable.
- [ ] Confirm on-chain contract addresses resolve on Polygon.
- [ ] Redeploy via Vercel and validate the full investment flow.

---

## 13. Security Checklist

### 13.1 Monthly

- [ ] Review provider billing (Thirdweb, OpenAI, Vercel, Hostinger).
- [ ] Review GitHub security log and active sessions.
- [ ] Confirm backups completed and verified.

### 13.2 Quarterly

- [ ] Rotate API keys and PATs.
- [ ] Run a restore test (Section 11.5).
- [ ] Run a dependency audit (`npm audit`).
- [ ] Review collaborators and access levels.
- [ ] Review DNS records and domain configuration.

### 13.3 Yearly

- [ ] Review domain registrations and renewals.
- [ ] Review SSL certificate coverage and renewal.
- [ ] Review all billing and vendor contracts.
- [ ] Full disaster-recovery rehearsal.
- [ ] Review and update this document.

---

## 14. Commercial Assets

Commercial prices are intentionally excluded from this document.

### 14.1 Asset Register

| Asset                 | Reference / Location                                        |
| --------------------- | ----------------------------------------------------------- |
| Registered Trademark  | ChainX® (N° 830657, Switzerland)                            |
| Nice Classification   | Blockchain, Web3, crypto, tokenization                      |
| Software License      | Apache 2.0 + ChainX® additional terms                       |
| Compliance Standard   | ERC-3643 (MiCA ready)                                       |
| Customer Repositories | Tier-specific repos (Starter / Pro / Enterprise)            |
| Source-Code Licenses  | See `LICENSE`, `NOTICE`, `ACUERDO-LICENCIA-SOFTWARE.md`     |
| SaaS Plans            | Starter / Pro / Enterprise (features only, no pricing here) |

### 14.2 Commercial Models

The following models define how ChainX is delivered to customers. Each represents
a distinct delivery and licensing arrangement. Prices are excluded by policy.

| Model                        | What it represents                                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| SaaS Subscription            | ChainX-operated, multi-tenant hosting. The customer subscribes and ChainX runs the infrastructure.    |
| Private Cloud                | A dedicated, single-tenant deployment operated in a cloud environment isolated for one customer.      |
| On-Premise                   | The customer hosts and operates the platform entirely within their own infrastructure.                |
| Source-Code License          | The customer receives licensed source code to build upon, subject to Apache 2.0 + ChainX® terms.      |
| Perpetual Enterprise License | A one-time, non-expiring enterprise entitlement to a defined version, typically with defined support. |

Notes:

- SaaS Subscription and Private Cloud are ChainX-operated; On-Premise is
  customer-operated.
- Source-Code License and Perpetual Enterprise License concern rights to the code,
  independent of who operates the hosting.
- All models remain subject to the trademark and license terms in Section 14.1.

---

## 15. Operational Checklist

### 15.1 Before Every Release

- [ ] Verify the target branch is `main` and up to date.
- [ ] Confirm the build passes locally and in CI.
- [ ] Confirm environment variables are set for Production.
- [ ] Run a dependency audit (`npm audit`).
- [ ] Create and push a semantic version tag.

### 15.2 Before Customer Onboarding

- [ ] Confirm `NEXT_PUBLIC_OWNER_ADDRESS` matches the client's admin wallet.
- [ ] Confirm contract addresses match the intended deployment.
- [ ] Confirm tier features match the client's plan.
- [ ] Confirm the domain, DNS, and SSL are configured.
- [ ] Confirm the client's environment variables are set in the correct scope.
- [ ] Validate the end-to-end investment flow on the target deployment.

### 15.3 Before Deleting Infrastructure

- [ ] Confirm a verified backup exists and passes a restore test.
- [ ] Confirm the resource is not referenced by any production deployment.
- [ ] Confirm DNS, domains, and certificates are not dependent on it.
- [ ] Confirm the action is reversible or explicitly approved.

### 15.4 Before Rotating Secrets

- [ ] Identify every location where the secret is consumed.
- [ ] Generate the new secret in the provider dashboard.
- [ ] Update the vault, then Vercel, then local `.env.local`.
- [ ] Redeploy and validate before revoking the old secret.
- [ ] Revoke the old secret and record the rotation date.

### 15.5 Before Transferring Code

- [ ] Confirm no secrets are present in the repository or history.
- [ ] Confirm the license and `NOTICE` files are intact.
- [ ] Confirm the correct tier features are included or removed.
- [ ] Confirm the recipient's access and permissions are correctly scoped.
- [ ] Record the transfer in the review log.

---

## 16. Recovery Contacts

Placeholders only. No personal data is stored in this document.

| Role                      | Contact Reference |
| ------------------------- | ----------------- |
| Technical Owner           | _(placeholder)_   |
| Domain Registrar          | _(placeholder)_   |
| Hosting Provider          | _(placeholder)_   |
| Cloud Provider            | _(placeholder)_   |
| Database Provider         | _(placeholder)_   |
| Blockchain / RPC Provider | _(placeholder)_   |
| Legal                     | _(placeholder)_   |
| Accounting                | _(placeholder)_   |

---

## 17. Master Asset Inventory

A consolidated register of all platform assets. No secrets appear here; the
`Recovery Location` column indicates where the asset or its access is recovered
from. Complete every placeholder and review quarterly.

### 17.1 Domains

| Asset             | Purpose                   | Owner               | Recovery Location | Status  | Notes               |
| ----------------- | ------------------------- | ------------------- | ----------------- | ------- | ------------------- |
| chainx.ch         | Primary production domain | _(to be completed)_ | Registrar account | Active  | _(to be completed)_ |
| landing.chainx.ch | Marketing / landing site  | _(to be completed)_ | DNS provider      | Planned | _(to be completed)_ |

### 17.2 Repositories

| Asset                | Purpose               | Owner               | Recovery Location | Status | Notes              |
| -------------------- | --------------------- | ------------------- | ----------------- | ------ | ------------------ |
| Enterprise (parent)  | Full-feature codebase | _(to be completed)_ | GitHub + SSD      | Active | Full feature set   |
| `chainx-rwa-pro`     | Pro tier codebase     | _(to be completed)_ | GitHub + SSD      | Active | Enterprise removed |
| `chainx-rwa-starter` | Starter tier codebase | _(to be completed)_ | GitHub + SSD      | Active | Pro/Ent removed    |

### 17.3 Hosting

| Asset  | Purpose             | Owner               | Recovery Location | Status | Notes               |
| ------ | ------------------- | ------------------- | ----------------- | ------ | ------------------- |
| Vercel | Application hosting | _(to be completed)_ | Vercel account    | Active | Auto-deploy on push |

### 17.4 Cloud

| Asset        | Purpose                   | Owner               | Recovery Location | Status | Notes               |
| ------------ | ------------------------- | ------------------- | ----------------- | ------ | ------------------- |
| Hostinger    | Domains / DNS / services  | _(to be completed)_ | Hostinger account | Active | _(to be completed)_ |
| Cloud backup | Off-site encrypted backup | _(to be completed)_ | Provider account  | Active | 90-day retention    |

### 17.5 Database

| Asset    | Purpose                    | Owner               | Recovery Location | Status   | Notes           |
| -------- | -------------------------- | ------------------- | ----------------- | -------- | --------------- |
| Postgres | Off-chain application data | _(to be completed)_ | Provider console  | Optional | Enabled if used |

### 17.6 Blockchain

| Asset              | Purpose                      | Owner               | Recovery Location       | Status | Notes         |
| ------------------ | ---------------------------- | ------------------- | ----------------------- | ------ | ------------- |
| Polygon Mainnet    | Production chain             | Network             | Public network          | Active | Chain ID 137  |
| Contract addresses | ERC-3643 suite + controllers | _(to be completed)_ | Repo records + explorer | Active | See Section 6 |

### 17.7 AI Providers

| Asset  | Purpose              | Owner               | Recovery Location | Status   | Notes        |
| ------ | -------------------- | ------------------- | ----------------- | -------- | ------------ |
| OpenAI | AI-assisted features | _(to be completed)_ | OpenAI platform   | Optional | Key in vault |

### 17.8 Payment Providers

| Asset        | Purpose                 | Owner               | Recovery Location  | Status   | Notes           |
| ------------ | ----------------------- | ------------------- | ------------------ | -------- | --------------- |
| Thirdweb Pay | Fiat-to-crypto on-ramp  | _(to be completed)_ | Thirdweb dashboard | Active   | Default on-ramp |
| Stripe       | Card billing (optional) | _(to be completed)_ | Stripe dashboard   | Optional | Only if enabled |

### 17.9 Documentation

| Asset          | Purpose                   | Owner               | Recovery Location | Status | Notes             |
| -------------- | ------------------------- | ------------------- | ----------------- | ------ | ----------------- |
| This document  | Master assets / recovery  | _(to be completed)_ | Repo + SSD        | Active | Internal only     |
| `docs/` folder | Engineering + client docs | _(to be completed)_ | GitHub + SSD      | Active | Versioned in repo |

### 17.10 Brand Assets

| Asset             | Purpose         | Owner               | Recovery Location  | Status | Notes                  |
| ----------------- | --------------- | ------------------- | ------------------ | ------ | ---------------------- |
| ChainX® trademark | Registered mark | _(to be completed)_ | Trademark registry | Active | N° 830657, Switzerland |
| Logo / brand kit  | Visual identity | _(to be completed)_ | Repo / brand store | Active | _(to be completed)_    |

---

## 18. Appendix — Useful Commands

No secrets appear in any command below. Never paste secrets on the command line.

### 18.1 Git

```bash
git status
git fetch --all --prune
git clone <repository-url>
git tag v1.0.0
git push origin v1.0.0
git fsck --full
git bundle create chainx-backup.bundle --all
```

### 18.2 Node / npm

```bash
node --version
npm --version
npm ci
npm run build
npm audit
```

### 18.3 Vercel

```bash
vercel --version
vercel link
vercel pull        # pulls project settings (secrets handled by Vercel)
vercel deploy
vercel rollback
```

### 18.4 Database (Postgres)

```bash
pg_dump "$DATABASE_URL" -F c -f backup.dump   # value injected from env, not shown
pg_restore -d "$DATABASE_URL" backup.dump
```

---

## 19. Document Revision History

| Version | Date       | Author                 | Summary                                  |
| ------- | ---------- | ---------------------- | ---------------------------------------- |
| v1.0    | 2026-07-17 | ChainX Technical Owner | Creation of operational master document. |

---

**End of document. Internal Use Only.**
