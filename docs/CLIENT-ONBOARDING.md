# ChainX® — Client Onboarding Guide

> For operators adopting the ChainX® white-label infrastructure. This guide takes
> you from access to a live, branded tokenization platform. ChainX® provides the
> technology; you manage investors and local compliance.

---

## Onboarding at a glance

```
1. Access & environment      →  2. Branding & identity
        ↓                              ↓
3. Admin & roles (RBAC)      →  4. First project (offering)
        ↓                              ↓
5. Investor onboarding/KYC   →  6. Go live
```

---

## 1. Access & environment

You receive access to your deployment and an admin wallet address.

- **Admin wallet**: the wallet you control that holds platform admin rights. It
  maps to the `PLATFORM_ADMIN` role and is set per deployment.
- **Network**: Polygon Mainnet.
- **Settlement asset**: USDC (Polygon).

Required configuration (handled with your ChainX® contact during setup):

| Setting                     | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| Owner / admin wallet        | Grants platform administration                 |
| thirdweb client credentials | Wallet connectivity, on-ramp, storage          |
| Contract addresses          | Project registry / factory / identity registry |

> Never share private keys. ChainX® never requests them.

---

## 2. Branding & identity (white-label)

Customize the investor-facing portal so it reflects your brand.

- Open **Administration → Branding** (`/settings/branding`).
- Set display name, logo and primary color; preview updates live.
- Branding availability depends on your tier.

---

## 3. Admin & roles (RBAC)

Assign responsibilities using role-based access control. Roles map to
permissions, not individuals, so access stays consistent as your team grows.

| Role               | Typical user       | Access summary                                             |
| ------------------ | ------------------ | ---------------------------------------------------------- |
| Platform Admin     | Operator owner     | Full access                                                |
| Compliance Officer | Compliance/legal   | KYC & compliance approvals, audit (read), approval reviews |
| Project Manager    | Offering lead      | Create/edit projects, read investors/documents             |
| Investor Relations | IR team            | Investor management, communications, reporting             |
| Read-Only          | Auditors/observers | View everything, change nothing                            |

Manage users at **Administration → Users** (`/admin/users`). Full role/permission
matrix: [ENTERPRISE-FEATURES.md](../ENTERPRISE-FEATURES.md).

---

## 4. Create your first project (offering)

Each tokenized asset is an on-chain project with its own investment controller.

1. Go to **Projects → Issuer Setup** (`/onboarding`).
2. Define the offering (name, symbol, price, hard cap).
3. Deploy the project; it registers on-chain in the `ProjectRegistry`.
4. Add display metadata (location, images, description) so it appears in the
   investor portal.

Projects are 100% on-chain — the portal reads them from the registry.

---

## 5. Investor onboarding & KYC

Investors must be verified before they can hold tokens (enforced on-chain).

1. Investor connects a wallet (email/social or external).
2. Investor submits KYC; your Compliance Officer reviews it.
3. On approval, the investor's identity is registered in `IdentityRegistry`.
4. The investor can now invest (USDC quote → approve → invest).

You own the investor relationship and the KYC/AML decision per your jurisdiction.

---

## 6. Go live

Before opening an offering to investors:

- [ ] Branding configured and reviewed
- [ ] Admin users and roles assigned
- [ ] Project deployed and visible in the portal
- [ ] KYC review process in place
- [ ] Compliance sign-off (see Compliance & governance below)

For critical actions, the platform supports dual authorization — see
**Administration → Approvals** (`/admin/approvals`).

---

## Support

- Operations reference: [ADMIN-OPERATIONS.md](./ADMIN-OPERATIONS.md)
- Platform overview: [PLATFORM-OVERVIEW.md](./PLATFORM-OVERVIEW.md)
- Commercial / licensing: **business@chainx.ch**

---

© 2026 Carlos Bernal. ChainX® registered trademark (N° 830657, Swissreg).
