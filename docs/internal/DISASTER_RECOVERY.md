# ChainX Disaster Recovery

**CLASSIFICATION: INTERNAL USE ONLY — DO NOT DISTRIBUTE**

| Field            | Value                                                           |
| ---------------- | --------------------------------------------------------------- |
| Document Title   | ChainX Disaster Recovery                                        |
| Version          | 1.0.0                                                           |
| Creation Date    | 2026-07-17                                                      |
| Author           | ChainX Technical Owner                                          |
| Purpose          | Recover the ChainX platform after catastrophic events           |
| Classification   | Internal Use Only                                               |
| Related Document | See `CHAINX_MASTER_ASSETS.md` for asset locations and inventory |

> This document contains no secrets. Where secrets are referenced, only their
> storage location is described. All asset locations, provider accounts, and
> recovery sources are held in `CHAINX_MASTER_ASSETS.md`.

---

## 1. Recovery Philosophy

- Assume any single device, account, or provider can fail without warning.
- Recovery is forward-only: restore from verified backups and reissue secrets;
  never rewrite history or reuse a compromised credential.
- Secrets are never stored in this document, in the repository, or in backups in
  plaintext. They are recreated from the vault (see `CHAINX_MASTER_ASSETS.md`).
- Every recovery ends with explicit verification (Section 6) before returning to
  normal operations.

---

## 2. Recovery Priorities

Restore assets in the following order of importance:

| Priority | Asset       | Rationale                                        |
| -------- | ----------- | ------------------------------------------------ |
| 1        | Source code | Irreplaceable if not backed up; basis of rebuild |
| 2        | Backups     | Enable all other recovery                        |
| 3        | Credentials | Required to access every provider                |
| 4        | Database    | Off-chain application data                       |
| 5        | DNS         | Restores addressability of services              |
| 6        | Hosting     | Restores the running application                 |
| 7        | Contracts   | On-chain, durable, but must be re-referenced     |
| 8        | Brand       | Trademark and identity assets                    |

For the authoritative location of each asset, see `CHAINX_MASTER_ASSETS.md`,
Section "Master Asset Inventory".

---

## 3. Incident Classification

| Level    | Definition                                                 | Example                             | Response                                        |
| -------- | ---------------------------------------------------------- | ----------------------------------- | ----------------------------------------------- |
| Low      | No service impact; minor local issue                       | Single local file lost              | Restore at next convenience                     |
| Medium   | Limited impact; workaround available                       | Laptop lost, backups intact         | Recover within the day                          |
| High     | Significant impact; production degraded                    | Database corruption, hosting outage | Immediate structured recovery                   |
| Critical | Full outage or confirmed compromise of credentials or code | GitHub compromise, domain hijack    | Immediate incident response; rotate all secrets |

---

## 4. Recovery Scenarios

The scenarios below map to the step-by-step procedures in Section 5.

- Laptop lost
- SSD failure
- GitHub compromised
- Domain compromise
- Database corruption
- API key compromise
- Thirdweb unavailable
- Vercel unavailable
- Complete workstation replacement

---

## 5. Recovery Procedures

Never expose secrets during any procedure. Recreate them from the vault.

### 5.1 Laptop Lost

- [ ] Revoke the device's SSH keys and PATs in GitHub.
- [ ] Revoke active sessions in Vercel, Thirdweb, and OpenAI.
- [ ] Rotate any secret that may have been cached on the device.
- [ ] Confirm no unpushed commits are lost (compare against `origin/main`).
- [ ] Provision a replacement workstation (Section 5.9).

### 5.2 SSD Failure

- [ ] Stop using the affected drive immediately.
- [ ] Restore source code from GitHub or the external encrypted SSD.
- [ ] Verify repository integrity: `git fsck --full`.
- [ ] Recreate `.env.local` from the vault (no values stored in Git).
- [ ] Restore the database from backup if applicable (Section 5.5).

### 5.3 GitHub Compromised

- [ ] Change the account password; review and reset MFA devices.
- [ ] Revoke every PAT and any unrecognized SSH key.
- [ ] Review collaborators and remove unauthorized access.
- [ ] Inspect recent commits, tags, and releases for tampering.
- [ ] Re-enable branch protection and force-push restrictions if altered.
- [ ] Rotate any secret that may have been exposed via the repository or CI.

### 5.4 Domain Compromise

- [ ] Contact the registrar and lock the domain (see `CHAINX_MASTER_ASSETS.md`).
- [ ] Reset registrar account credentials and enable MFA.
- [ ] Review and correct DNS records to the known-good configuration.
- [ ] Reissue SSL certificates if integrity is in doubt.
- [ ] Verify domain resolution and certificate validity (Section 6).

### 5.5 Database Corruption

- [ ] Provision a new Postgres instance.
- [ ] Restore the most recent verified dump (`pg_restore` or provider console).
- [ ] Update `DATABASE_URL` in the vault, Vercel, and `.env.local`.
- [ ] Run any pending migrations.
- [ ] Validate connectivity and data integrity.

### 5.6 API Key Compromise

- [ ] Revoke the affected key immediately in the provider dashboard.
- [ ] Issue a replacement and update the vault, Vercel, and `.env.local`.
- [ ] Review provider logs and billing for unauthorized usage.
- [ ] Redeploy and validate the affected feature.

### 5.7 Thirdweb Unavailable

- [ ] Confirm the outage via the Thirdweb status page.
- [ ] Verify whether the impact is RPC, storage, or dashboard.
- [ ] For on-chain reads, confirm contract addresses resolve on a Polygon explorer.
- [ ] Communicate expected impact; wait for provider restoration.
- [ ] After restoration, validate wallet connect and contract calls (Section 6).

### 5.8 Vercel Unavailable

- [ ] Confirm the outage via the Vercel status page.
- [ ] Confirm the last known-good deployment is retained.
- [ ] Do not force redeploys during a provider incident.
- [ ] After restoration, verify the Production deployment and run validation.

### 5.9 Complete Workstation Replacement

- [ ] Install the toolchain: Git, Node.js, npm.
- [ ] Generate and register a new SSH key and passkey with GitHub.
- [ ] Clone the primary repository from GitHub.
- [ ] Restore `.env.local` from the vault.
- [ ] Run `npm ci` and `npm run build` to validate the environment.
- [ ] Re-authenticate the Vercel and Thirdweb CLIs.

---

## 6. Recovery Verification

Confirm recovery succeeded before resuming normal operations.

- [ ] Repository integrity verified (`git fsck --full`); `HEAD` matches `origin/main`.
- [ ] Application builds locally (`npm run build`).
- [ ] Production deployment is healthy and serves the expected commit.
- [ ] Authentication and wallet connect function.
- [ ] Dashboard loads on-chain data; contract addresses resolve on Polygon.
- [ ] Database connectivity and integrity confirmed (if applicable).
- [ ] DNS resolves and SSL certificate is valid (if applicable).
- [ ] All rotated secrets are active; all revoked secrets are confirmed inactive.

---

## 7. Lessons Learned — Incident Report Template

Complete after every High or Critical incident. Store with the review log.

```
Incident ID:        __________________________
Date / Time:        __________________________
Detected by:        __________________________
Classification:     Low / Medium / High / Critical
Affected assets:    __________________________
Summary:            __________________________

Timeline:
  - Detection:      __________________________
  - Containment:    __________________________
  - Recovery:       __________________________
  - Resolution:     __________________________

Root cause:         __________________________
Secrets rotated:    Yes / No  (list locations, not values)
Backups used:       __________________________
Verification:       __________________________

Corrective actions:
  1. ____________________________________________
  2. ____________________________________________

Preventive actions:
  1. ____________________________________________
  2. ____________________________________________

Owner / Sign-off:   __________________________
```

---

## 8. Revision History

| Version | Date       | Author                 | Summary                                 |
| ------- | ---------- | ---------------------- | --------------------------------------- |
| v1.0    | 2026-07-17 | ChainX Technical Owner | Creation of the disaster-recovery plan. |

---

**End of document. Internal Use Only.**
