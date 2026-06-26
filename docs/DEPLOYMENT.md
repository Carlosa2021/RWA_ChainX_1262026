# ChainX® RWA Platform — Deployment Guide

> **Baseline**: v1.9.7-environment-hardening, date 2026-06-26

---

## Local Development Workflow

### Prerequisites

- Node.js 24.x
- Project cloned from `https://github.com/Carlosa2021/RWA_ChainX_1262026.git`
- `.env.local` populated (see Environment Synchronization section)
- Running from an exFAT SSD — see constraints below

### Install Dependencies

```bash
# exFAT SSD constraint: always use these flags
npm install --no-bin-links --ignore-scripts
```

### Start Development Server

```bash
# Enterprise tier (full features) — port 3004
node node_modules/next/dist/bin/next dev --turbopack --port 3004

# Or via npm script (configured in package.json)
npm run dev
```

> All Next.js and toolchain binaries must be invoked via `node node_modules/...`
> because exFAT does not support Unix symlinks. Standard `next dev` will fail.

### Kill the Dev Server

```bash
# Linux (exFAT SSD)
fuser -k 3004/tcp

# Do NOT use: lsof -ti:3004 | xargs kill (lsof may not work on exFAT)
```

### exFAT SSD Constraints Summary

| Constraint                  | Workaround                                   |
| --------------------------- | -------------------------------------------- |
| Symlinks broken             | Use `node node_modules/...` for all binaries |
| npm install                 | Always add `--no-bin-links --ignore-scripts` |
| Global npm prefix is `/usr` | Use `sudo npm install -g <package>` or `npx` |
| Port kill                   | Use `fuser -k {port}/tcp`                    |

---

## Git Workflow

### Daily Development Cycle

```bash
# 1. Verify clean state before starting
git status

# 2. Work on changes (no feature branches currently)

# 3. Stage specific files only — never git add -A blindly
git add src/path/to/file.tsx

# 4. Commit with conventional commit format
git commit -m "feat(scope): description"

# 5. Push to remote main
git push origin HEAD:main
```

### Conventional Commit Format

```
type(scope): description

Types: feat | fix | chore | refactor | docs | test | style
Scope: admin | auth | domains | tenants | contracts | ui | dev | db
```

### Files That Must Never Be Committed

- `.env.local` and all `.env.local.*` variants — covered by `.env*` rule in `.gitignore`
- `.vercel/` — covered by `.vercel` rule
- `.vercel_old/` — covered by `.vercel_old/` rule (added in v1.9.7)
- `node_modules/`

---

## Tagging Workflow

Every stable feature set must be tagged **after** pushing the commit:

```bash
# 1. Create annotated tag (always annotated, never lightweight)
git tag -a v{X.Y.Z}-{slug} -m "Sprint {ID} - {Description}"

# 2. Push tag separately
git push origin v{X.Y.Z}-{slug}

# 3. Verify on remote
git ls-remote --tags origin | grep v{X.Y.Z}
```

**Tag naming**: `v{MAJOR}.{MINOR}.{PATCH}-{kebab-case-description}`

Tags are **permanent**. Never delete or force-push a tag that has been pushed to remote.

---

## Production Deployment

### Automatic (CI/CD — normal workflow)

Production deploys automatically on every push to `main`:

```
git push origin HEAD:main
  → GitHub webhook → Vercel Build → https://app.chainx.ch
```

No manual action required. Build takes approximately 2-3 minutes.

### Build Configuration (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### TypeScript Build Errors

`next.config.ts` has `typescript.ignoreBuildErrors: true`. This is a temporary workaround. Type errors do not block Vercel builds but should be resolved progressively.

---

## Vercel CLI Workflow

> The Vercel CLI is **not required** for production deployments (CI/CD handles this).
> It is useful for environment variable management and local debugging.

### Install CLI

```bash
# Global install (requires sudo on this system)
sudo npm install -g vercel

# Or use npx (no install — uses npm cache)
npx vercel@latest <command>
```

### Link Project (if .vercel/project.json is missing)

```bash
# Option A: CLI (interactive)
vercel link
# Select: carlosa2021s-projects → rwa-chain-x-1262026

# Option B: Manual reconstruction (non-interactive)
# Extract projectId and orgId from .vercel/repo.json and write project.json directly
node -e "
const repo = require('./.vercel/repo.json');
const project = repo.projects.find(p => p.name === 'rwa-chain-x-1262026');
const fs = require('fs');
fs.writeFileSync('.vercel/project.json', JSON.stringify({ projectId: project.id, orgId: project.orgId }, null, 2));
"
```

### Read-Only CLI Commands (safe)

```bash
vercel whoami                    # Check auth
vercel project ls                # List projects
vercel env ls                    # List all env vars
vercel env ls production         # Filter by environment
```

---

## Environment Synchronization

### ⚠️ CRITICAL — Before Running `vercel env pull`

`vercel env pull` overwrites `.env.local` with the variables from the **Development** environment in Vercel.

**Current state of Development environment in Vercel**:

- Contains: all Neon/Postgres variables
- Does NOT contain: `NEXT_PUBLIC_OWNER_ADDRESS`, `NEXT_PUBLIC_PLAN_TYPE`, `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`

**Effect of running `vercel env pull` without preparation**:

- `NEXT_PUBLIC_OWNER_ADDRESS` → removed from `.env.local` → Owner mode broken
- `NEXT_PUBLIC_PLAN_TYPE` → removed from `.env.local` → Plan defaults to STARTER
- `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` → removed from `.env.local` → Wallet connection broken

### Safe Procedure for `vercel env pull`

1. In the Vercel dashboard, add to the **Development** environment:
   - `NEXT_PUBLIC_OWNER_ADDRESS`
   - `NEXT_PUBLIC_PLAN_TYPE`
   - `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
   - `THIRDWEB_SECRET_KEY`
2. Back up current `.env.local`:
   ```bash
   cp .env.local .env.local.backup-$(date +%Y%m%d)
   ```
3. Pull env vars:
   ```bash
   vercel env pull .env.local
   ```
4. Verify critical vars are present:
   ```bash
   grep "NEXT_PUBLIC_OWNER_ADDRESS\|NEXT_PUBLIC_PLAN_TYPE\|NEXT_PUBLIC_THIRDWEB_CLIENT_ID" .env.local
   ```

> **Lesson learned (Sprint 9.6C)**: Never execute `vercel env pull` until the Development
> environment in Vercel contains every variable required by the application.
> The Development environment is what `vercel env pull` pulls from by default.
> Variables that are Production/Preview-only are silently omitted and, if `.env.local`
> is overwritten, those variables are lost from the local environment.

### Manual `.env.local` Setup (alternative to `vercel env pull`)

Copy values directly from the Vercel dashboard:

1. Go to `vercel.com` → Project `rwa-chain-x-1262026` → Settings → Environment Variables
2. Copy each encrypted value (requires clicking "Reveal")
3. Add to `.env.local` in the format `KEY=value`

---

## Rollback Procedure

### Rollback to a Previous Tag

```bash
# 1. Identify the target tag
git tag --sort=-creatordate | head -5

# 2. Check out the target commit (detached HEAD — read-only inspection)
git checkout v{X.Y.Z}-{slug}

# 3. To deploy the old version: create a new branch from the tag, push
git checkout -b hotfix/rollback-to-v{X.Y.Z}
git push origin hotfix/rollback-to-v{X.Y.Z}:main
# This triggers Vercel CI/CD to deploy the old code
```

### Rollback Database Schema

There are no automated rollback scripts. To undo a migration:

1. Write the inverse SQL manually
2. Run against `POSTGRES_URL_NON_POOLING` using the Neon console or `psql`
3. Do NOT re-run migration files (they use `IF NOT EXISTS` — re-running is safe but a no-op)

---

## Smart Contract Deployment

> Production contract deployments use the **thirdweb CLI**, not Hardhat directly.

```bash
cd contracts
npx thirdweb deploy -k $THIRDWEB_SECRET_KEY
```

The CLI opens a browser interface for:

- Contract selection
- Wallet connection
- Gas estimation
- On-chain confirmation

After deployment:

1. Copy contract addresses from the thirdweb dashboard
2. Update environment variables in Vercel (`NEXT_PUBLIC_PROJECT_REGISTRY`, etc.)
3. Trigger a new production deploy

**Network**: Polygon Mainnet (chain ID 137) only. Testnets are not used in the main branch.
