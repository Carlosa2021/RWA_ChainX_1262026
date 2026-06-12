// ─────────────────────────────────────────────────────────────────────────────
// ChainX® RWA Platform — RBAC: Permissions
// ─────────────────────────────────────────────────────────────────────────────
// Strongly-typed permission catalogue + the role → permission matrix.
// Permissions are resource:action pairs. UI guards check permissions, never
// roles directly, so future roles can be added without touching call sites.
//
// FUTURE COMPATIBILITY (architecture only — do NOT implement here):
//   [APPROVAL WORKFLOWS]  *_APPROVE permissions will optionally route through a
//                         pending-approval queue before taking effect.
//   [DUAL AUTHORIZATION]  COMPLIANCE_APPROVE / forced-transfer style actions will
//                         require two distinct authorised signers.
//   [AUDIT TRAIL]         Each permission-gated mutation should emit an immutable
//                         audit event.
// ─────────────────────────────────────────────────────────────────────────────

import { Role } from './roles';

/** Granular capabilities. Format: RESOURCE_ACTION. */
export enum Permission {
  // ── Branding ───────────────────────────────────────────────
  BRANDING_VIEW = 'branding:view',
  BRANDING_MANAGE = 'branding:manage',

  // ── Billing / Financial settings ───────────────────────────
  BILLING_VIEW = 'billing:view',
  BILLING_MANAGE = 'billing:manage',

  // ── User & Role management (RBAC) ──────────────────────────
  USERS_VIEW = 'users:view',
  USERS_MANAGE = 'users:manage',

  // ── Projects ───────────────────────────────────────────────
  PROJECTS_VIEW = 'projects:view',
  PROJECTS_CREATE = 'projects:create',
  PROJECTS_EDIT = 'projects:edit',

  // ── Investors ──────────────────────────────────────────────
  INVESTORS_VIEW = 'investors:view',
  INVESTORS_MANAGE = 'investors:manage',

  // ── Documents ──────────────────────────────────────────────
  DOCUMENTS_VIEW = 'documents:view',
  DOCUMENTS_MANAGE = 'documents:manage',

  // ── Analytics ──────────────────────────────────────────────
  ANALYTICS_VIEW = 'analytics:view',

  // ── Compliance ─────────────────────────────────────────────
  COMPLIANCE_VIEW = 'compliance:view',
  COMPLIANCE_APPROVE = 'compliance:approve',

  // ── KYC ────────────────────────────────────────────────────
  KYC_VIEW = 'kyc:view',
  KYC_APPROVE = 'kyc:approve',

  // ── Investor communications ────────────────────────────────
  COMMUNICATIONS_MANAGE = 'communications:manage',

  // ── Reporting ──────────────────────────────────────────────
  REPORTING_VIEW = 'reporting:view',

  // ── Platform settings ──────────────────────────────────────
  SETTINGS_MANAGE = 'settings:manage',
}

/** Every permission — used for PLATFORM_ADMIN and READ_ONLY derivation. */
export const ALL_PERMISSIONS: readonly Permission[] = Object.values(Permission);

/** Read-only subset: every `*:view` capability, no mutations. */
const VIEW_ONLY_PERMISSIONS: readonly Permission[] = ALL_PERMISSIONS.filter((p) =>
  p.endsWith(':view')
);

// ─── Role → Permission matrix ────────────────────────────────────────────────
export const ROLE_PERMISSIONS: Readonly<Record<Role, readonly Permission[]>> = {
  // Full access — every capability.
  [Role.PLATFORM_ADMIN]: ALL_PERMISSIONS,

  // Regulatory controls. Read-only on projects. No billing, no branding.
  [Role.COMPLIANCE_OFFICER]: [
    Permission.INVESTORS_VIEW,
    Permission.INVESTORS_MANAGE,
    Permission.KYC_VIEW,
    Permission.KYC_APPROVE,
    Permission.DOCUMENTS_VIEW,
    Permission.DOCUMENTS_MANAGE,
    Permission.COMPLIANCE_VIEW,
    Permission.COMPLIANCE_APPROVE,
    Permission.ANALYTICS_VIEW,
    Permission.REPORTING_VIEW,
    Permission.PROJECTS_VIEW, // read-only
  ],

  // Project lifecycle. No billing, branding, compliance approvals or KYC approval.
  [Role.PROJECT_MANAGER]: [
    Permission.PROJECTS_VIEW,
    Permission.PROJECTS_CREATE,
    Permission.PROJECTS_EDIT,
    Permission.INVESTORS_VIEW,
    Permission.DOCUMENTS_VIEW,
  ],

  // Investor-facing. Read-only on projects. No compliance, branding or billing.
  [Role.INVESTOR_RELATIONS]: [
    Permission.INVESTORS_VIEW,
    Permission.INVESTORS_MANAGE,
    Permission.COMMUNICATIONS_MANAGE,
    Permission.REPORTING_VIEW,
    Permission.PROJECTS_VIEW, // read-only
  ],

  // View everything, modify nothing.
  [Role.READ_ONLY]: VIEW_ONLY_PERMISSIONS,
};

/** Does `role` hold `permission`? */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/** Does `role` hold every permission in `permissions`? */
export function roleHasAll(role: Role, permissions: readonly Permission[]): boolean {
  return permissions.every((p) => roleHasPermission(role, p));
}

/** Does `role` hold at least one permission in `permissions`? */
export function roleHasAny(role: Role, permissions: readonly Permission[]): boolean {
  return permissions.some((p) => roleHasPermission(role, p));
}
