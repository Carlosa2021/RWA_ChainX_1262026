# ChainX® — Platform Overview

> White-label digital securities infrastructure for real-world asset (RWA)
> tokenization. ChainX® is a **B2B technology provider**: you operate the
> platform under your own brand; you manage your investors and your local
> regulatory compliance. ChainX® does not take custody of funds or tokens.

---

## What ChainX® is

ChainX® is a production blockchain infrastructure for tokenizing real estate and
other real-world assets as **ERC-3643 (T-REX) compliant security tokens** on
Polygon. It ships with an institutional admin layer, investor portal,
compliance tooling and governance controls — ready to deploy under your brand.

| Capability              | Description                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| Security token standard | ERC-3643 (T-REX) — compliant transfers, identity-gated holders                                 |
| Settlement asset        | USDC on Polygon (6 decimals)                                                                   |
| Pricing oracle          | Chainlink EUR/USD for fiat-denominated offerings                                               |
| Wallets                 | Email / social login (in-app wallets) and external wallets (MetaMask, Coinbase, WalletConnect) |
| On-ramp                 | Fiat-to-crypto purchase (card → USDC)                                                          |
| Governance              | RBAC, audit trail, MiCA-oriented reporting, dual-authorization approvals                       |
| Branding                | Full white-label customization of the investor portal                                          |

---

## Product tiers

| Tier           | Audience                       | Summary                                                      |
| -------------- | ------------------------------ | ------------------------------------------------------------ |
| **STARTER**    | Initial setup, single offering | Core tokenization + investor portal                          |
| **PRO**        | Medium-scale operations        | Adds project management, advanced analytics                  |
| **ENTERPRISE** | Institutional funds            | Full governance layer, RBAC, white-label, unlimited capacity |

Feature availability per tier is enforced in-app via the licensing layer. The
institutional governance modules (RBAC, Audit Trail, Compliance Reporting,
Approval Workflows) are documented in
[ENTERPRISE-FEATURES.md](../ENTERPRISE-FEATURES.md).

---

## Roles & responsibilities

| ChainX® (technology provider)             | You (operator / client)                           |
| ----------------------------------------- | ------------------------------------------------- |
| Platform, smart contracts, infrastructure | Investor relationships and onboarding             |
| Software updates and security             | Local regulatory compliance (KYC/AML, MiCA, etc.) |
| White-label tooling                       | Branding decisions and content                    |
| Documentation and support                 | Treasury, funds and token custody                 |

ChainX® is **regulatory-neutral**: you are responsible for compliance in your
jurisdiction.

---

## Architecture at a glance

- **Frontend**: Next.js 15 (App Router) + thirdweb v5 — investor portal + admin.
- **Smart contracts**: ERC-3643 suite (`SecurityToken`, `IdentityRegistry`,
  `Compliance`, `InvestmentController`, `ProjectRegistry`).
- **Network**: Polygon Mainnet.
- **Projects**: fully on-chain via `ProjectRegistry`; each offering has its own
  `InvestmentController`.

---

## How investing works (high level)

1. Investor connects a wallet (email/social or external).
2. Investor completes KYC; identity is registered in `IdentityRegistry`.
3. Investor receives a USDC quote for the desired token amount.
4. Investor approves USDC spend, then invests in a single confirmed transaction.
5. Compliant ERC-3643 tokens are issued; transfers remain identity-gated.

Only KYC-verified investors can hold or receive tokens — enforced on-chain.

---

## Next steps

- New operators: see [CLIENT-ONBOARDING.md](./CLIENT-ONBOARDING.md).
- Day-to-day administration: see [ADMIN-OPERATIONS.md](./ADMIN-OPERATIONS.md).
- Governance & RBAC detail: see [ENTERPRISE-FEATURES.md](../ENTERPRISE-FEATURES.md).

---

© 2026 Carlos Bernal. ChainX® registered trademark (N° 830657, Swissreg).
