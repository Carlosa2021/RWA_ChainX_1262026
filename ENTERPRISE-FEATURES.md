# ChainX® — Enterprise Governance & Administration Layer

> Documentation of the institutional features added on top of the core platform.
> **All modules in this layer are UI + architecture only**: no backend, no
> database, no smart-contract changes, no blockchain/thirdweb/KYC modifications.
> Every screen runs on mock data and is governed by the RBAC layer. Each module
> documents its **future integration points** as in-code comments so the real
> backend can be wired in later without refactoring.

---

## Overview

This layer turns ChainX® from a tokenization product into an **institutional B2B
platform** comparable to Carta / Mercury / Linear in governance posture. It adds
five additive modules:

| #   | Module                                  | Route                 | Permission gate                     |
| --- | --------------------------------------- | --------------------- | ----------------------------------- |
| 1   | White Label Branding Panel              | `/settings/branding`  | `BRANDING_VIEW` / `BRANDING_MANAGE` |
| 2   | Enterprise RBAC foundation              | (cross-cutting)       | —                                   |
| 3   | Enterprise Audit Trail                  | `/admin/audit-trail`  | `AUDIT_VIEW` / `AUDIT_EXPORT`       |
| 4   | MiCA Compliance Reporting Center        | `/compliance/reports` | `COMPLIANCE_VIEW`                   |
| 5   | Dual Authorization & Approval Workflows | `/admin/approvals`    | `APPROVAL_VIEW` / `APPROVAL_MANAGE` |

**Design system (all modules):** institutional blue accent (`#2563EB`), no
gradients / crypto / DeFi aesthetics, fully theme-aware (light + dark), reusing
existing KPI cards, tables and side-drawer patterns. Notifications use `sonner`
toasts only.

---

## 1. Enterprise RBAC (foundation)

Centralised, strongly-typed access-control layer. **UI guards check permissions,
never roles directly**, so new roles can be added without touching call sites.

### Files

- `src/lib/rbac/roles.ts` — `Role` enum + metadata + plan availability.
- `src/lib/rbac/permissions.ts` — `Permission` catalogue + role→permission matrix.
- `src/lib/rbac/usePermissions.ts` — `usePermissions()` hook.

### Roles

| Role                 | Summary                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `PLATFORM_ADMIN`     | Full access — every permission.                                                                         |
| `COMPLIANCE_OFFICER` | Regulatory controls, KYC/compliance approvals, audit (read), approvals (review). Read-only on projects. |
| `PROJECT_MANAGER`    | Project lifecycle (view/create/edit), investors (read), documents (read).                               |
| `INVESTOR_RELATIONS` | Investor management + communications + reporting. Read-only on projects.                                |
| `READ_ONLY`          | Every `*:view` capability, no mutations.                                                                |

### Plan availability (`ROLES_BY_PLAN`)

- **STARTER** → `PLATFORM_ADMIN`
- **BUSINESS** → `+ PROJECT_MANAGER`
- **ENTERPRISE** → all roles

### Permission model

Permissions are `resource:action` strings (e.g. `audit:view`). Key helpers:

- `ALL_PERMISSIONS` — drives `PLATFORM_ADMIN` and `READ_ONLY` derivation.
- `VIEW_ONLY_PERMISSIONS` — every `*:view`, assigned to `READ_ONLY`.
- `roleHasPermission` / `roleHasAll` / `roleHasAny`.

### Hook usage

```ts
const { role, can, canAll, canAny, availableRoles } = usePermissions();
if (can(Permission.AUDIT_VIEW)) {
  /* render */
}
```

Owner wallet → `PLATFORM_ADMIN`, otherwise `READ_ONLY` (until a real user-role
store exists).

### Sidebar integration

`NavItem.requiredPermission?: Permission` (additive). Render filter:

```ts
if (item.ownerOnly && !isOwner) return false;
if (item.requiredPermission && !can(item.requiredPermission)) return false;
```

---

## 2. White Label Branding Panel — `/settings/branding`

Lets a tenant customise the investor-facing portal (display name, logo, primary
color) with a **live preview**. Gated by `BRANDING_VIEW`; mutations by
`BRANDING_MANAGE`. Plan-gated via `customBranding` (STARTER off, BUSINESS+ on).

- Live investor-portal preview reflecting branding changes.
- Theme-aware, institutional layout.
- **Future:** persist branding per tenant; resolve at render via a tenant config
  source.

---

## 3. Enterprise Audit Trail — `/admin/audit-trail`

Immutable-style activity log surface. Gated by `AUDIT_VIEW`; export by
`AUDIT_EXPORT`.

- KPI cards, category/result filters, event table.
- Event detail side-drawer (`EventDrawer`).
- Result badges (success / warning / error), category badges.
- Critical-actions grid; export buttons (CSV/PDF) gated by `AUDIT_EXPORT`.
- **Future integration points (in-file):** real append-only event source,
  on-chain event indexing, ERC-3643 event mapping, MiCA reporting, dual
  authorization references, approval-workflow routing for pending events.

---

## 4. MiCA Compliance Reporting Center — `/compliance/reports`

Regulator-oriented reporting surface. Reuses `COMPLIANCE_VIEW` (no new
permission).

- KPI cards, horizontal bar breakdowns, section cards.
- Report detail drawer (`ReportDrawer`).
- Institutional badges and tables.
- **Future:** generate regulator-ready reports from a real filtered event source
  (participant list, jurisdiction breakdown, KYC summary).

---

## 5. Dual Authorization & Approval Workflows — `/admin/approvals`

UI implementation of the **Four-Eyes Principle**: one user proposes a critical
action, a distinct authorised user reviews/approves before execution. Gated by
`APPROVAL_VIEW`; approve/reject/request-changes actions by `APPROVAL_MANAGE`.

### Access model

| Role                                     | Access                                            |
| ---------------------------------------- | ------------------------------------------------- |
| `PLATFORM_ADMIN`                         | view + manage (via `ALL_PERMISSIONS`)             |
| `COMPLIANCE_OFFICER`                     | view + manage (explicit reviewer)                 |
| `READ_ONLY`                              | view only (inherits `approval:view` via `*:view`) |
| `PROJECT_MANAGER` / `INVESTOR_RELATIONS` | no access                                         |

### Screen

- **KPIs:** Pending Approvals, Approved Today, Rejected Requests, Critical Actions
  Awaiting Approval.
- **Four-Eyes governance card** explaining the principle.
- **Filters:** Status, Category, Priority, Date Range.
- **Requests table:** Request ID, Date, Requested By, Role, Action, Entity,
  Priority, Status.
- **Detail drawer:** full request metadata, description, reason, approval chain
  (Requested → Compliance Review → Final Approval), mock JSON payload, and
  Approve / Reject / Request Changes actions (only when `APPROVAL_MANAGE`).
- **Critical Actions Requiring Approval** panel.
- **Recent Approval Decisions** history table.
- **Access-denied** state when `APPROVAL_VIEW` is absent.

### Approval categories supported (UI)

Project Publication, KYC Approval, Branding Changes, Role Changes, Document
Approval, Compliance Export.

### Future integration points (in-file)

Real approval engine, dual-authorization execution (two distinct signers), Audit
Trail linkage, ERC-3643 administrative actions (pause / forced transfer / freeze),
token-pause approvals, forced-transfer approvals, MiCA escalation, multi-step
approval chains.

---

## RBAC permission matrix (current)

| Permission                            | PLATFORM_ADMIN | COMPLIANCE_OFFICER | PROJECT_MANAGER | INVESTOR_RELATIONS | READ_ONLY |
| ------------------------------------- | :------------: | :----------------: | :-------------: | :----------------: | :-------: |
| `branding:view` / `:manage`           |    ✅ / ✅     |         —          |        —        |         —          |   view    |
| `billing:view` / `:manage`            |    ✅ / ✅     |         —          |        —        |         —          |   view    |
| `users:view` / `:manage`              |    ✅ / ✅     |         —          |        —        |         —          |   view    |
| `projects:view` / `:create` / `:edit` |       ✅       |        view        |       ✅        |        view        |   view    |
| `investors:view` / `:manage`          |       ✅       |         ✅         |      view       |         ✅         |   view    |
| `documents:view` / `:manage`          |       ✅       |         ✅         |      view       |         —          |   view    |
| `analytics:view`                      |       ✅       |         ✅         |        —        |         —          |    ✅     |
| `compliance:view` / `:approve`        |       ✅       |         ✅         |        —        |         —          |   view    |
| `kyc:view` / `:approve`               |       ✅       |         ✅         |        —        |         —          |   view    |
| `communications:manage`               |       ✅       |         —          |        —        |         ✅         |     —     |
| `reporting:view`                      |       ✅       |         ✅         |        —        |         ✅         |    ✅     |
| `audit:view` / `:export`              |    ✅ / ✅     |        view        |        —        |         —          |   view    |
| `approval:view` / `:manage`           |    ✅ / ✅     |      ✅ / ✅       |        —        |         —          |   view    |
| `settings:manage`                     |       ✅       |         —          |        —        |         —          |     —     |

`view` = the role only holds the `*:view` variant.

---

## Constraints honoured across all modules

- ❌ No refactoring of existing business logic, onboarding, licensing.
- ❌ No new dependencies, no database, no backend, no API.
- ❌ No smart-contract / ERC-3643 / blockchain / thirdweb / wallet / KYC changes.
- ✅ Additive only: new files + additive `NavItem` / `Permission` fields.
- ✅ Mock data, theme-aware, institutional design system.
- ✅ Validated with the VS Code language server (`get_errors`) — zero errors.

---

© 2026 Carlos Bernal. ChainX® registered trademark (N° 830657, Swissreg).
