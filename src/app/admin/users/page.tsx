'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChainX® RWA Platform — User & Role Management (RBAC Admin)
// ─────────────────────────────────────────────────────────────────────────────
// Enterprise-only, additive page. UI + mock data only — no backend, no API,
// no blockchain, no thirdweb. Demonstrates the RBAC foundation: a users table
// and a role-assignment modal. Persisted state is local React state only.
//
// FUTURE COMPATIBILITY (architecture only — do NOT implement here):
//   [OPERATOR DB]         Replace mock users with an operator-managed users API.
//   [AUDIT TRAIL]         Role change / enable / disable must emit audit events.
//   [APPROVAL WORKFLOWS]  Sensitive role grants (PLATFORM_ADMIN) may require a
//                         second approver before taking effect.
//   [DUAL AUTHORIZATION]  Disabling a PLATFORM_ADMIN may require dual sign-off.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useLicense } from '@/contexts/LicenseContext';
import { PLANS } from '@/config/plans';
import { Role, ROLE_METADATA, ALL_ROLES } from '@/lib/rbac/roles';
import { usePermissions } from '@/lib/rbac/usePermissions';
import { toast } from 'sonner';
import {
  Users as UsersIcon,
  Lock,
  ArrowRight,
  ShieldCheck,
  X,
  Check,
  Ban,
  Power,
  MoreHorizontal,
} from 'lucide-react';

// ─── Mock data ────────────────────────────────────────────────
type UserStatus = 'active' | 'disabled' | 'invited';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  lastLogin: string;
}

const INITIAL_USERS: readonly PlatformUser[] = [
  {
    id: 'u_1',
    name: 'Alicia Romero',
    email: 'alicia@madrooffice.com',
    role: Role.PLATFORM_ADMIN,
    status: 'active',
    lastLogin: '2026-06-12 09:14',
  },
  {
    id: 'u_2',
    name: 'Daniel Vega',
    email: 'compliance@madrooffice.com',
    role: Role.COMPLIANCE_OFFICER,
    status: 'active',
    lastLogin: '2026-06-11 18:02',
  },
  {
    id: 'u_3',
    name: 'Marta Ibáñez',
    email: 'projects@madrooffice.com',
    role: Role.PROJECT_MANAGER,
    status: 'active',
    lastLogin: '2026-06-12 08:41',
  },
  {
    id: 'u_4',
    name: 'Sergio Lluch',
    email: 'ir@madrooffice.com',
    role: Role.INVESTOR_RELATIONS,
    status: 'invited',
    lastLogin: '—',
  },
  {
    id: 'u_5',
    name: 'Auditor Externo',
    email: 'audit@external-firm.com',
    role: Role.READ_ONLY,
    status: 'disabled',
    lastLogin: '2026-05-28 11:30',
  },
];

// ─── Status badge ──────────────────────────────────────────────
const STATUS_STYLES: Record<UserStatus, { label: string; cls: string }> = {
  active: {
    label: 'Active',
    cls: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50',
  },
  invited: {
    label: 'Invited',
    cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  },
  disabled: {
    label: 'Disabled',
    cls: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 border-gray-200 dark:border-gray-700',
  },
};

function StatusBadge({ status }: { status: UserStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

function RoleBadge({ role }: { role: Role }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
      <ShieldCheck className="w-3 h-3" />
      {ROLE_METADATA[role].label}
    </span>
  );
}

// ─── Role assignment modal ─────────────────────────────────────
function RoleModal({
  user,
  onClose,
  onChangeRole,
  onToggleStatus,
  isRoleAvailable,
}: {
  user: PlatformUser;
  onClose: () => void;
  onChangeRole: (role: Role) => void;
  onToggleStatus: () => void;
  isRoleAvailable: (role: Role) => boolean;
}) {
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);
  const isDisabled = user.status === 'disabled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Manage User</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {user.name} · {user.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role selector */}
        <div className="p-5 space-y-2">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Assign Role</p>
          {ALL_ROLES.map((role) => {
            const available = isRoleAvailable(role);
            const active = selectedRole === role;
            return (
              <button
                key={role}
                disabled={!available}
                onClick={() => setSelectedRole(role)}
                className={`w-full flex items-start gap-3 text-left rounded-xl border px-3 py-2.5 transition-colors ${
                  active
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                } ${!available ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    active ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-white" />}
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {ROLE_METADATA[role].label}
                    </span>
                    {!available && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Lock className="w-3 h-3" /> Enterprise
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {ROLE_METADATA[role].description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 p-5 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onToggleStatus}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDisabled
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
            }`}
          >
            {isDisabled ? <Power className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
            {isDisabled ? 'Enable User' : 'Disable User'}
          </button>
          <button
            onClick={() => onChangeRole(selectedRole)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium transition-colors"
          >
            <Check className="w-4 h-4" /> Change Role
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Enterprise-locked state ───────────────────────────────────
function UsersLocked() {
  const enterprise = PLANS.ENTERPRISE;
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 mb-5">
        <Lock className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        User &amp; Role Management is an Enterprise feature
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
        Role-based access control lets you grant scoped permissions to compliance officers, project
        managers, investor relations and external auditors.
      </p>
      <a
        href="https://chainx.ch/#pricing"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium transition-colors"
      >
        Upgrade to {enterprise.name}
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function UsersPage() {
  const { hasFeature } = useLicense();
  const { isRoleAvailable } = usePermissions();
  const unlocked = hasFeature('institutionalTools'); // ENTERPRISE-only flag

  const [users, setUsers] = useState<PlatformUser[]>(() => [...INITIAL_USERS]);
  const [editing, setEditing] = useState<PlatformUser | null>(null);

  const handleChangeRole = (role: Role) => {
    if (!editing) return;
    setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, role } : u)));
    toast.success(`Role updated to ${ROLE_METADATA[role].label} for ${editing.name}.`);
    setEditing(null);
  };

  const handleToggleStatus = () => {
    if (!editing) return;
    const nextStatus: UserStatus = editing.status === 'disabled' ? 'active' : 'disabled';
    setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, status: nextStatus } : u)));
    toast.success(
      nextStatus === 'disabled'
        ? `${editing.name} has been disabled.`
        : `${editing.name} has been enabled.`
    );
    setEditing(null);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl w-full mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                User &amp; Role Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Assign institutional roles and control access to platform modules.
              </p>
            </div>
          </div>

          {!unlocked ? (
            <UsersLocked />
          ) : (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/60 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Last Login</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {u.name}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                        <td className="px-4 py-3">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={u.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-500 tabular-nums">
                          {u.lastLogin}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setEditing(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {editing && (
        <RoleModal
          user={editing}
          onClose={() => setEditing(null)}
          onChangeRole={handleChangeRole}
          onToggleStatus={handleToggleStatus}
          isRoleAvailable={isRoleAvailable}
        />
      )}
    </div>
  );
}
