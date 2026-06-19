'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChainX® RWA Platform — Tenant Management (Sprint 9.5)
// ─────────────────────────────────────────────────────────────────────────────
// Read-only list of all platform tenants (white-label clients).
// Data fetched from GET /api/admin/tenants.
//
// Sprint 9.5 scope: READ ONLY — no create, edit, or delete actions.
// Sprint 9.6 will add: provisioning wizard, domain management actions.
// Sprint 9.7 will add: branding editor per tenant.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import type { TenantConfig } from '@/lib/tenants/types';
import { Building2, Search, Loader2, AlertCircle, Globe, Mail, ExternalLink } from 'lucide-react';

// ─── Plan badge ───────────────────────────────────────────────────────────────

const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  starter: {
    label: 'Starter',
    cls: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
  },
  pro: {
    label: 'Pro',
    cls: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
  },
  enterprise: {
    label: 'Enterprise',
    cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  },
};

function PlanBadge({ plan }: { plan: string }) {
  const b = PLAN_BADGE[plan] ?? PLAN_BADGE.starter;
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border ${b.cls}`}
    >
      {b.label}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TenantsPage() {
  const { address, isOwner } = useAuth();
  const router = useRouter();

  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // ── Fetch tenants ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!address || !isOwner) return;

    const fetchTenants = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/tenants?ownerAddress=${encodeURIComponent(address)}`);
        const data = (await res.json()) as {
          success: boolean;
          tenants?: TenantConfig[];
          error?: string;
        };
        if (!data.success) {
          setError(data.error ?? 'Failed to load tenants.');
        } else {
          setTenants(data.tenants ?? []);
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void fetchTenants();
  }, [address, isOwner]);

  // ── Client-side search filter ───────────────────────────────────────────────
  const filtered = tenants.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.brandName.toLowerCase().includes(q) ||
      t.supportEmail.toLowerCase().includes(q) ||
      t.hostname.toLowerCase().includes(q)
    );
  });

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (!isOwner) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Access Denied</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This page requires Platform Admin access.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tenant Management
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
              All white-label client portals registered on this platform.
            </p>
          </div>

          {/* Search bar */}
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenants…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Content area */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 max-w-lg">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {search ? 'No tenants match your search.' : 'No tenants provisioned yet.'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Tenant
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Plan
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Hostname
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Brand Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Support Email
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filtered.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"
                      onClick={() => router.push(`/admin/tenants/${tenant.id}`)}
                    >
                      {/* Tenant ID */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          {tenant.id}
                        </span>
                      </td>

                      {/* Plan */}
                      <td className="px-4 py-3">
                        <PlanBadge plan={tenant.plan} />
                      </td>

                      {/* Hostname */}
                      <td className="px-4 py-3">
                        {tenant.hostname ? (
                          <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                            <Globe className="w-3.5 h-3.5 shrink-0" />
                            {tenant.hostname}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-600">—</span>
                        )}
                      </td>

                      {/* Brand Name */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {tenant.brandName}
                        </span>
                        {tenant.tagline && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-[200px]">
                            {tenant.tagline}
                          </p>
                        )}
                      </td>

                      {/* Support Email */}
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          {tenant.supportEmail}
                        </span>
                      </td>

                      {/* View link */}
                      <td className="px-4 py-3 text-right">
                        <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-600 inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer count */}
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {filtered.length} tenant{filtered.length !== 1 ? 's' : ''}
                  {search ? ` matching "${search}"` : ' total'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
