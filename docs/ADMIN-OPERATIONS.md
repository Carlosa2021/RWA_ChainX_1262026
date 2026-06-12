# ChainX® — Admin & Operations Guide

> Day-to-day operation of the ChainX® platform for operators. Covers the admin
> areas, governance controls and routine workflows. For initial setup, see
> [CLIENT-ONBOARDING.md](./CLIENT-ONBOARDING.md).

---

## Admin areas

All admin areas are role-gated. Visibility depends on your permissions.

| Area               | Route                 | Purpose                                    |
| ------------------ | --------------------- | ------------------------------------------ |
| Admin Panel        | `/admin`              | Platform settings overview                 |
| Users              | `/admin/users`        | Manage users and roles (RBAC)              |
| Branding           | `/settings/branding`  | White-label investor portal                |
| Audit Trail        | `/admin/audit-trail`  | Activity log of platform actions           |
| Compliance Reports | `/compliance/reports` | MiCA-oriented reporting center             |
| Approvals          | `/admin/approvals`    | Dual-authorization approval workflows      |
| Billing            | `/admin/pagos`        | Subscription / billing                     |
| Projects           | `/onboarding/*`       | Offerings, investors, documents, analytics |

---

## Managing users & roles

Access control is permission-based. Assign each team member a role rather than
individual permissions.

- Add or update users at **Users** (`/admin/users`).
- Roles available depend on your tier.
- The full role → permission matrix is in
  [ENTERPRISE-FEATURES.md](../ENTERPRISE-FEATURES.md).

Principle of least privilege: grant the narrowest role that lets a person do
their job. Use **Read-Only** for auditors and observers.

---

## Projects & offerings

- Create and configure offerings under **Projects → Issuer Setup**.
- Each project is on-chain with its own investment controller.
- Manage investors, documents and analytics under the **Projects** section.
- Keep portal display metadata (images, location, description) up to date.

---

## Investor lifecycle

1. **Connect** — investor connects a wallet.
2. **Verify** — Compliance Officer reviews KYC; identity registered on-chain.
3. **Invest** — USDC quote → approve USDC → invest (single confirmed tx).
4. **Hold/transfer** — transfers stay identity-gated by ERC-3643 compliance.

Non-compliant transfers fail automatically on-chain — no manual checks needed.

---

## Governance controls

### Audit Trail (`/admin/audit-trail`)

Chronological record of platform actions with filters and exportable views.
Use it for internal review and to support regulatory inquiries.

### Compliance Reporting (`/compliance/reports`)

MiCA-oriented reporting surface: participant and jurisdiction breakdowns, KYC
summaries and exportable reports for your compliance team.

### Approval Workflows (`/admin/approvals`)

Four-Eyes Principle: critical actions are proposed by one user and approved by a
distinct authorized user before execution. Typical categories: project
publication, KYC approval, branding changes, role changes, document approval,
compliance export.

- Reviewers (Platform Admin / Compliance Officer) can approve, reject or request
  changes.
- Other roles see requests read-only.

Details and future integration points: [ENTERPRISE-FEATURES.md](../ENTERPRISE-FEATURES.md).

---

## Routine operations checklist

**Daily**

- [ ] Review pending approvals
- [ ] Review pending KYC submissions

**Weekly**

- [ ] Review audit trail for anomalies
- [ ] Confirm user roles still reflect responsibilities

**Per offering**

- [ ] Verify project metadata in the portal
- [ ] Confirm compliance sign-off before publication

---

## Security practices

- Protect the admin wallet; never share private keys.
- Use distinct accounts/roles for proposing vs. approving critical actions.
- Keep least-privilege role assignments.
- Review the audit trail regularly.

---

## Support

- Platform overview: [PLATFORM-OVERVIEW.md](./PLATFORM-OVERVIEW.md)
- Onboarding: [CLIENT-ONBOARDING.md](./CLIENT-ONBOARDING.md)
- Security policy: [../SECURITY.md](../SECURITY.md)
- Commercial / licensing: **business@chainx.ch**

---

© 2026 Carlos Bernal. ChainX® registered trademark (N° 830657, Swissreg).
