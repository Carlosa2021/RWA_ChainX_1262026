# ChainX Customer Deployment Checklist

**CLASSIFICATION: INTERNAL USE ONLY — DO NOT DISTRIBUTE**

| Field             | Value                                            |
| ----------------- | ------------------------------------------------ |
| Document Title    | ChainX Customer Deployment Checklist             |
| Version           | 1.0.0                                            |
| Creation Date     | 2026-07-17                                       |
| Author            | ChainX Technical Owner                           |
| Purpose           | Define the complete customer deployment workflow |
| Classification    | Internal Use Only                                |
| Related Documents | `CHAINX_MASTER_ASSETS.md`, `RELEASE_RUNBOOK.md`  |

> This document contains no secrets. Where secrets are referenced, only their
> storage location is described. For asset locations and environment-variable
> definitions, see `CHAINX_MASTER_ASSETS.md`. For the release mechanics, see
> `RELEASE_RUNBOOK.md`.

---

## Purpose

This checklist defines the end-to-end workflow for deploying ChainX for a customer,
from qualification through go-live and support handover. ChainX provides
technology only; the customer manages their own investors, funds, and local
compliance.

---

## 1. Customer Qualification

- [ ] Customer use case and target jurisdiction identified.
- [ ] Required product tier determined (Starter / Pro / Enterprise).
- [ ] Delivery model determined (see `CHAINX_MASTER_ASSETS.md`, Commercial Models).
- [ ] Customer confirms responsibility for their local regulatory compliance.
- [ ] Customer confirms they manage their own investors and funds.

---

## 2. Commercial Approval

- [ ] Applicable plan and delivery model approved.
- [ ] License terms accepted (Apache 2.0 + ChainX® additional terms).
- [ ] Trademark usage terms acknowledged.
- [ ] Contract / order signed and recorded.
- [ ] Internal approval to proceed granted.

---

## 3. Technical Preparation

- [ ] Correct tier repository identified (see `CHAINX_MASTER_ASSETS.md`).
- [ ] Customer's admin wallet address obtained (public address only).
- [ ] Target chain confirmed (Polygon Mainnet, chain ID 137).
- [ ] Deployment environment (Vercel project) prepared.
- [ ] Toolchain and dependencies verified per `RELEASE_RUNBOOK.md`.

---

## 4. Domain

- [ ] Customer domain or subdomain confirmed.
- [ ] DNS provider and records prepared (see `CHAINX_MASTER_ASSETS.md`, Domains).
- [ ] Domain added to the Vercel project.
- [ ] SSL certificate issued and validated.
- [ ] Domain resolution verified end to end.

---

## 5. Environment Variables

Values are never recorded here. Configure variables per scope as defined in
`CHAINX_MASTER_ASSETS.md`, Section "Environment Variables".

- [ ] All required variables identified for this customer.
- [ ] Public `NEXT_PUBLIC_*` values set in the correct scopes.
- [ ] Server secrets stored in the vault and injected into Vercel.
- [ ] `NEXT_PUBLIC_OWNER_ADDRESS` set to the customer's admin wallet.
- [ ] Contract addresses set for the customer's deployment.
- [ ] No secret values committed to source control.

---

## 6. Thirdweb

- [ ] Thirdweb client configured (see `CHAINX_MASTER_ASSETS.md`, Thirdweb).
- [ ] Client ID set; secret key stored in the vault only.
- [ ] Wallet providers configured for the customer.
- [ ] Contract interactions validated against the customer's addresses.

---

## 7. Database

Applicable only if the customer deployment uses the optional database.

- [ ] Provider and instance provisioned.
- [ ] `DATABASE_URL` stored in the vault and injected into Vercel.
- [ ] Migrations applied.
- [ ] Backup schedule enabled (see `CHAINX_MASTER_ASSETS.md`, Backups).
- [ ] Connectivity validated.

---

## 8. Branding

- [ ] Customer branding assets received.
- [ ] Logo, colors, and identity applied per white-label configuration.
- [ ] Trademark and attribution requirements respected.
- [ ] Branding reviewed and approved by the customer.

---

## 9. Testing

- [ ] Homepage loads correctly.
- [ ] Authentication and wallet connect function.
- [ ] Investment flow validated end to end (approve + invest).
- [ ] Dashboard renders on-chain data.
- [ ] Responsive layout verified on mobile and desktop.
- [ ] Logs and browser console are clean.

---

## 10. Production Deployment

- [ ] Release performed per `RELEASE_RUNBOOK.md`.
- [ ] Deployment promoted to Production in Vercel.
- [ ] Production commit hash matches the intended release.
- [ ] Environment variables confirmed for Production scope.

---

## 11. Customer Acceptance

- [ ] Customer walkthrough completed.
- [ ] Acceptance criteria reviewed against the agreement.
- [ ] Outstanding items logged and triaged.
- [ ] Customer sign-off recorded.

---

## 12. Go-live

- [ ] Domain live and serving the customer deployment.
- [ ] Monitoring and logging confirmed active.
- [ ] Rollback path confirmed available (see `RELEASE_RUNBOOK.md`).
- [ ] Go-live approved and recorded.

---

## 13. Post-deployment Verification

- [ ] Homepage, authentication, and dashboard verified in Production.
- [ ] Investment flow verified in Production.
- [ ] SSL certificate valid; domain resolves correctly.
- [ ] No build or runtime errors in logs.
- [ ] Backups verified for any customer-specific data.

---

## 14. Support Handover

- [ ] Support scope and channels agreed with the customer.
- [ ] Escalation and recovery contacts recorded (see `CHAINX_MASTER_ASSETS.md`).
- [ ] Customer responsibilities (compliance, investors, funds) reconfirmed.
- [ ] Relevant operational documentation shared as agreed.
- [ ] Handover recorded and acknowledged.

---

## 15. Deployment Checklist (Printable)

```
[ ] Customer qualified
[ ] Commercial approval complete
[ ] Technical preparation complete
[ ] Domain configured and SSL valid
[ ] Environment variables set (secrets in vault)
[ ] Thirdweb configured
[ ] Database provisioned (if used)
[ ] Branding applied and approved
[ ] Testing passed
[ ] Production deployment complete
[ ] Customer acceptance signed off
[ ] Go-live approved
[ ] Post-deployment verification passed
[ ] Support handover complete
```

---

## 16. Revision History

| Version | Date       | Author                 | Summary                                        |
| ------- | ---------- | ---------------------- | ---------------------------------------------- |
| v1.0    | 2026-07-17 | ChainX Technical Owner | Creation of the customer deployment checklist. |

---

**End of document. Internal Use Only.**
