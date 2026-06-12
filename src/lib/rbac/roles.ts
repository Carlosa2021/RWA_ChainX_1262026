// ─────────────────────────────────────────────────────────────────────────────
// ChainX® RWA Platform — RBAC: Roles
// ─────────────────────────────────────────────────────────────────────────────
// Centralized, strongly-typed Role model for institutional access control.
// Additive only — coexists with the existing licensing system (STARTER/BUSINESS/
// ENTERPRISE) and the existing Owner (AuthContext) detection. Nothing here
// modifies blockchain, thirdweb, KYC or business logic.
//
// FUTURE COMPATIBILITY (architecture only — do NOT implement here):
//   [AUDIT TRAIL]            Every role-scoped write action should emit an
//                            immutable { actor, role, action, target, ts } event.
//   [APPROVAL WORKFLOWS]     Roles will declare which actions require a second
//                            approver before they take effect.
//   [DUAL AUTHORIZATION]     Critical actions (forced transfer, payout release)
//                            will require two distinct PLATFORM_ADMIN / COMPLIANCE
//                            sign-offs.
//   [MICA REPORTING]         COMPLIANCE_OFFICER role will gate White Paper /
//                            participant report generation.
//   [MULTI-JURISDICTION]     Roles will be scoped per jurisdiction (e.g. an
//                            INVESTOR_RELATIONS limited to a country set).
// ─────────────────────────────────────────────────────────────────────────────

import type { PlanType } from '@/config/plans';

/** Institutional roles supported by the platform. */
export enum Role {
  /** Full access. Equivalent to the current Owner. */
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  /** Regulatory controls: investors, KYC, documents, compliance, analytics. */
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  /** Tokenized projects lifecycle. */
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  /** Investor communications and reporting. */
  INVESTOR_RELATIONS = 'INVESTOR_RELATIONS',
  /** View everything, modify nothing. */
  READ_ONLY = 'READ_ONLY',
}

/** Descriptive metadata for UI rendering (labels, descriptions). */
export interface RoleMeta {
  readonly role: Role;
  readonly label: string;
  readonly description: string;
}

export const ROLE_METADATA: Readonly<Record<Role, RoleMeta>> = {
  [Role.PLATFORM_ADMIN]: {
    role: Role.PLATFORM_ADMIN,
    label: 'Platform Admin',
    description: 'Full access to every module and critical action.',
  },
  [Role.COMPLIANCE_OFFICER]: {
    role: Role.COMPLIANCE_OFFICER,
    label: 'Compliance Officer',
    description: 'Regulatory controls: investors, KYC, documents, compliance, analytics.',
  },
  [Role.PROJECT_MANAGER]: {
    role: Role.PROJECT_MANAGER,
    label: 'Project Manager',
    description: 'Creates and edits tokenized projects. Views investors and documents.',
  },
  [Role.INVESTOR_RELATIONS]: {
    role: Role.INVESTOR_RELATIONS,
    label: 'Investor Relations',
    description: 'Manages investors, communications and reporting.',
  },
  [Role.READ_ONLY]: {
    role: Role.READ_ONLY,
    label: 'Read Only',
    description: 'Read access across the platform. No create, edit or delete.',
  },
};

/** All roles as an ordered list for table / select rendering. */
export const ALL_ROLES: readonly Role[] = [
  Role.PLATFORM_ADMIN,
  Role.COMPLIANCE_OFFICER,
  Role.PROJECT_MANAGER,
  Role.INVESTOR_RELATIONS,
  Role.READ_ONLY,
];

// ─── Plan ↔ Role availability ────────────────────────────────────────────────
// Coexists with existing plan gating. A role is only assignable if the active
// plan unlocks it. STARTER stays minimal; ENTERPRISE unlocks the full model.
export const ROLES_BY_PLAN: Readonly<Record<PlanType, readonly Role[]>> = {
  STARTER: [Role.PLATFORM_ADMIN],
  BUSINESS: [Role.PLATFORM_ADMIN, Role.PROJECT_MANAGER],
  ENTERPRISE: ALL_ROLES,
};

/** Returns the roles available for a given plan. */
export function rolesForPlan(plan: PlanType): readonly Role[] {
  return ROLES_BY_PLAN[plan];
}

/** Type guard: is `plan` allowed to use `role`? */
export function isRoleAvailableForPlan(role: Role, plan: PlanType): boolean {
  return ROLES_BY_PLAN[plan].includes(role);
}

/** Narrowing helper for untyped string input (e.g. mock data / future API). */
export function isRole(value: string): value is Role {
  return (ALL_ROLES as readonly string[]).includes(value);
}
