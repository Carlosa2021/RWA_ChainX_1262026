# ChainX Release Runbook

**CLASSIFICATION: INTERNAL USE ONLY — DO NOT DISTRIBUTE**

| Field            | Value                                                           |
| ---------------- | --------------------------------------------------------------- |
| Document Title   | ChainX Release Runbook                                          |
| Version          | 1.0.0                                                           |
| Creation Date    | 2026-07-17                                                      |
| Author           | ChainX Technical Owner                                          |
| Purpose          | Define the exact procedure for performing a production release  |
| Classification   | Internal Use Only                                               |
| Related Document | See `CHAINX_MASTER_ASSETS.md` for asset locations and inventory |

> This runbook contains no secrets. Where secrets are referenced, only their
> storage location is described. For all asset locations, repositories, and
> environment-variable definitions, refer to `CHAINX_MASTER_ASSETS.md`.

---

## 1. Purpose

This document describes how a production release of the ChainX platform is
performed, verified, and, if necessary, rolled back. It is the single operational
reference for the release process. It complements, and does not duplicate, the
inventory held in `CHAINX_MASTER_ASSETS.md`.

---

## 2. Release Philosophy

- **Small releases.** Ship narrow, well-understood changes. Smaller releases are
  easier to verify and to roll back.
- **Atomic commits.** Each commit represents one logical change with a clear
  message. Avoid mixing unrelated changes in a single commit.
- **Tag strategy.** Every production release is marked with an annotated semantic
  version tag (`vMAJOR.MINOR.PATCH`). Tags are immutable reference points for
  rollback and audit.
- **Rollback philosophy.** Recovery is always forward-only. Roll back by deploying
  a previously tagged, known-good release — never by rewriting history.

---

## 3. Pre-release Checklist

- [ ] `git status` is clean or contains only the intended changes.
- [ ] Working tree contains no stray or unintended files.
- [ ] The active branch is the intended release branch (`main`).
- [ ] Backups are current and verified (see `CHAINX_MASTER_ASSETS.md`, Backups).
- [ ] All changes for this release have been reviewed.
- [ ] Documentation is updated to reflect the change.
- [ ] The target version number is confirmed and agreed.
- [ ] The environment (Node.js, npm) matches the supported toolchain.
- [ ] Dependencies are installed and consistent with the lockfile.

---

## 4. Build Verification

Run the following locally before releasing. Do not proceed if any step fails.

```bash
npm install
npm run lint
npm run build
```

- [ ] `npm install` completes without errors.
- [ ] `npm run lint` passes with no new errors.
- [ ] `npm run build` completes successfully.
- [ ] TypeScript reports no type errors.
- [ ] Manual smoke test of the primary flows passes locally.

---

## 5. Git Procedure

No force push. No history rewriting. No amending of published commits.

```bash
git status
git add <explicit/paths>       # stage only intended files, never "git add ."
git diff --cached --stat       # review exactly what is staged
git commit -m "type(scope): summary"
git tag -a vMAJOR.MINOR.PATCH -m "Release vMAJOR.MINOR.PATCH"
git push origin HEAD:main
git push origin vMAJOR.MINOR.PATCH
git rev-parse HEAD
git rev-parse origin/main
```

- [ ] Only intended files are staged.
- [ ] Staged changes reviewed with `git diff --cached`.
- [ ] Commit created with a clear, conventional message.
- [ ] Annotated tag created for the release.
- [ ] Commit and tag pushed without force.
- [ ] `HEAD` equals `origin/main` after push.

---

## 6. Deployment

- The commit is pushed to the `main` branch on GitHub.
- Vercel observes the push and automatically builds and deploys.
- Expected flow: push to `main` → Vercel build → Production deployment.
- Deployment verification: confirm the new deployment is marked Production in the
  Vercel dashboard and that the commit hash matches the released commit.

No manual deployment command is required. Do not trigger deployments outside the
standard GitHub → Vercel integration.

---

## 7. Post-release Validation

- [ ] Homepage loads correctly.
- [ ] Authentication (wallet connect / login) works.
- [ ] Demonstration / walkthrough path functions as expected.
- [ ] Dashboard renders and loads on-chain data.
- [ ] Responsive layout verified on mobile and desktop widths.
- [ ] Deployment logs show no build or runtime errors.
- [ ] Browser console shows no unexpected errors.

---

## 8. Rollback Procedure

Rollback is forward-only. Never rewrite or delete history.

Option A — Redeploy a known-good tag:

```bash
git fetch --all --tags
git checkout vLAST_GOOD
# Trigger a redeploy of this ref via the standard Vercel integration
```

Option B — Promote a previous deployment:

- In the Vercel dashboard, open the Deployments list.
- Identify the last known-good Production deployment.
- Promote it to Production ("Rollback" / "Promote to Production").

- [ ] Confirm the restored version loads and passes Section 7 validation.
- [ ] Record the rollback and its cause in the revision history / review log.

---

## 9. Release Checklist (Printable)

```
[ ] Working tree clean / only intended changes
[ ] Correct branch (main)
[ ] Backups verified
[ ] Changes reviewed
[ ] Documentation updated
[ ] Version confirmed
[ ] npm install OK
[ ] npm run lint OK
[ ] npm run build OK
[ ] TypeScript OK
[ ] Manual smoke test OK
[ ] Staged only intended files
[ ] Reviewed staged diff
[ ] Committed with clear message
[ ] Annotated tag created
[ ] Pushed without force
[ ] HEAD == origin/main
[ ] Vercel deployment is Production
[ ] Homepage OK
[ ] Authentication OK
[ ] Dashboard OK
[ ] Responsive OK
[ ] Logs clean
[ ] Console clean
```

---

## 10. Revision History

| Version | Date       | Author                 | Summary                          |
| ------- | ---------- | ---------------------- | -------------------------------- |
| v1.0    | 2026-07-17 | ChainX Technical Owner | Creation of the release runbook. |

---

**End of document. Internal Use Only.**
