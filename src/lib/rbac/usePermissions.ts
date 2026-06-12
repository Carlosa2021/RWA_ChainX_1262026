'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChainX® RWA Platform — RBAC: usePermissions hook
// ─────────────────────────────────────────────────────────────────────────────
// Read-only access layer for the UI. Resolves the active role and exposes
// permission checks. Additive only: it reuses the existing AuthContext (Owner)
// and LicenseContext (plan) — it does NOT introduce a new provider, alter routes,
// blockchain, thirdweb or KYC logic.
//
// Role resolution (current deployment model):
//   - Owner wallet  → PLATFORM_ADMIN  (preserves existing full-access behaviour)
//   - Everyone else → READ_ONLY       (safe default)
//
// FUTURE COMPATIBILITY (architecture only — do NOT implement here):
//   The active role will eventually come from a verified source:
//     [JWT CLAIM]   thirdweb Auth token role claim, or
//     [OPERATOR DB] an operator-managed users table (see /admin/users).
//   When that lands, only `resolveRole()` changes — every call site stays intact.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLicense } from '@/contexts/LicenseContext';
import { Role, rolesForPlan, isRoleAvailableForPlan } from './roles';
import {
  Permission,
  ROLE_PERMISSIONS,
  roleHasPermission,
  roleHasAll,
  roleHasAny,
} from './permissions';

export interface PermissionsApi {
  /** The active role for the current session. */
  readonly role: Role;
  /** Effective permissions granted to the active role. */
  readonly permissions: readonly Permission[];
  /** Roles assignable under the current plan. */
  readonly availableRoles: readonly Role[];
  /** True when the active role holds `permission`. */
  can: (permission: Permission) => boolean;
  /** True when the active role holds every listed permission. */
  canAll: (permissions: readonly Permission[]) => boolean;
  /** True when the active role holds at least one listed permission. */
  canAny: (permissions: readonly Permission[]) => boolean;
  /** True when `role` is assignable under the current plan. */
  isRoleAvailable: (role: Role) => boolean;
}

export function usePermissions(): PermissionsApi {
  const { isOwner } = useAuth();
  const { currentPlan } = useLicense();

  return useMemo<PermissionsApi>(() => {
    // Owner keeps full access (unchanged behaviour). Others default to read-only.
    const role: Role = isOwner ? Role.PLATFORM_ADMIN : Role.READ_ONLY;
    const permissions = ROLE_PERMISSIONS[role];
    const availableRoles = rolesForPlan(currentPlan);

    return {
      role,
      permissions,
      availableRoles,
      can: (permission) => roleHasPermission(role, permission),
      canAll: (perms) => roleHasAll(role, perms),
      canAny: (perms) => roleHasAny(role, perms),
      isRoleAvailable: (r) => isRoleAvailableForPlan(r, currentPlan),
    };
  }, [isOwner, currentPlan]);
}
