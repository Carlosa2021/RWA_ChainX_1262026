'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChainX® RWA Platform — Tenant Detail (Sprint 9.5)
// ─────────────────────────────────────────────────────────────────────────────
// Read-only detail view for a single tenant.
// Tabs: Overview | Domains | Branding | Settings
//
// Data fetched from:
//   GET /api/admin/tenants/[id]  — tenant metadata
//   GET /api/admin/domains       — all domains (filtered client-side by tenantId)
//
// Sprint 9.5 scope: READ ONLY — no edit, no domain actions.
// Sprint 9.6 will add: domain management actions (register/check/add).
// Sprint 9.7 will add: branding editor.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import type { TenantConfig } from '@/lib/tenants/types';
import type { TenantDomain, DomainVerificationStatus } from '@/lib/domains/types';
import {
  Building2,
  Globe,
  Mail,
  Palette,
  Settings,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

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

// ─── Domain status badge ──────────────────────────────────────────────────────
const STATUS_STYLES: Record<
  DomainVerificationStatus,
  { label: string; cls: string; icon: React.ElementType }
> = {
  pending: {
    label: 'Pending',
    cls: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    icon: Clock,
  },
  registering: {
    label: 'Registering',
    cls: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50',
    icon: RefreshCw,
  },
  registered: {
    label: 'DNS Pending',
    cls: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
    icon: Globe,
  },
  verified: {
    label: 'Verified',
    cls: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50',
    icon: CheckCircle,
  },
  failed: {
    label: 'Failed',
    cls: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
    icon: XCircle,
  },
};

function DomainStatusBadge({ status }: { status: DomainVerificationStatus }) {
  const s = STATUS_STYLES[status];
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${s.cls}`}
    >
      <Icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}

// ─── Tab type ─────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'domains' | 'branding' | 'settings';

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TenantDetailPage() {
  const { address, isOwner } = useAuth();
  const router = useRouter();
  const params = useParams();
  const tenantId = typeof params.id === 'string' ? params.id : '';

  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [domains, setDomains] = useState<TenantDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // ── Fetch tenant + domains ──────────────────────────────────────────────────
  useEffect(() => {
    if (!address || !isOwner || !tenantId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tenantRes, domainsRes] = await Promise.all([
          fetch(
            `/api/admin/tenants/${encodeURIComponent(tenantId)}?ownerAddress=${encodeURIComponent(address)}`
          ),
          fetch(`/api/admin/domains?ownerAddress=${encodeURIComponent(address)}`),
        ]);

        const tenantData = (await tenantRes.json()) as {
          success: boolean;
          tenant?: TenantConfig;
          error?: string;
        };
        const domainsData = (await domainsRes.json()) as {
          success: boolean;
          domains?: TenantDomain[];
          error?: string;
        };

        if (!tenantData.success) {
          setError(tenantData.error ?? 'Tenant not found.');
          return;
        }
        setTenant(tenantData.tenant ?? null);

        // Filter domains to only those belonging to this tenant
        const tenantDomains = (domainsData.domains ?? []).filter((d) => d.tenantId === tenantId);
        setDomains(tenantDomains);
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [address, isOwner, tenantId]);

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
            </div>
          </main>
        </div>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {/* Back navigation */}
          <button
            onClick={() => router.push('/admin/tenants')}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Tenants
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 max-w-lg">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          ) : tenant ? (
            <>
              {/* Page heading */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-lg"
                  style={{ backgroundColor: tenant.primaryColor ?? '#2563EB' }}
                >
                  {tenant.brandName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tenant.brandName}
                    </h1>
                    <PlanBadge plan={tenant.plan} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                    {tenant.id}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-0.5 mb-6 border-b border-gray-200 dark:border-gray-800">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      activeTab === id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {id === 'domains' && domains.length > 0 && (
                      <span className="ml-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                        {domains.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab: Overview */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-3xl">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                      Identity
                    </h2>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Tenant ID</dt>
                        <dd className="text-sm font-mono text-gray-900 dark:text-white mt-0.5">
                          {tenant.id}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Plan</dt>
                        <dd className="mt-0.5">
                          <PlanBadge plan={tenant.plan} />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Brand URL</dt>
                        <dd className="text-sm text-gray-900 dark:text-white mt-0.5 break-all">
                          {tenant.brandUrl || '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Support Email</dt>
                        <dd className="flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {tenant.supportEmail}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                      Quick Stats
                    </h2>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Domains</dt>
                        <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
                          {domains.length} registered
                          {domains.filter((d) => d.verified).length > 0 && (
                            <span className="ml-2 text-green-600 dark:text-green-400">
                              ({domains.filter((d) => d.verified).length} verified)
                            </span>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Hostname</dt>
                        <dd className="text-sm text-gray-900 dark:text-white mt-0.5 font-mono">
                          {tenant.hostname || '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Infra Notice</dt>
                        <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
                          {tenant.showInfraNotice ? 'Shown' : 'Hidden'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {/* Tab: Domains */}
              {activeTab === 'domains' && (
                <div>
                  {domains.length === 0 ? (
                    <div className="text-center py-16">
                      <Globe className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No domains registered for this tenant.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden max-w-3xl">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Hostname
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Status
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Verified
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Last Checked
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {domains.map((domain) => (
                            <tr
                              key={domain.hostname}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                            >
                              <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                                {domain.hostname}
                              </td>
                              <td className="px-4 py-3">
                                <DomainStatusBadge status={domain.verificationStatus} />
                              </td>
                              <td className="px-4 py-3">
                                {domain.verified ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-gray-400" />
                                )}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                                {domain.lastCheckedAt
                                  ? new Date(domain.lastCheckedAt).toLocaleString()
                                  : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Branding */}
              {activeTab === 'branding' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-3xl">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                      Visual Identity
                    </h2>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Brand Name</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                          {tenant.brandName}
                        </dd>
                      </div>
                      {tenant.tagline && (
                        <div>
                          <dt className="text-xs text-gray-500 dark:text-gray-400">Tagline</dt>
                          <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
                            {tenant.tagline}
                          </dd>
                        </div>
                      )}
                      {tenant.logoUrl && (
                        <div>
                          <dt className="text-xs text-gray-500 dark:text-gray-400">Logo URL</dt>
                          <dd className="text-sm text-gray-900 dark:text-white mt-0.5 break-all">
                            {tenant.logoUrl}
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Colors</dt>
                        <dd className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 shrink-0"
                              style={{ backgroundColor: tenant.primaryColor }}
                            />
                            <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
                              {tenant.primaryColor}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 shrink-0"
                              style={{ backgroundColor: tenant.secondaryColor }}
                            />
                            <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
                              {tenant.secondaryColor}
                            </span>
                          </div>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                      Preview
                    </h2>
                    <div
                      className="rounded-xl p-4 text-white"
                      style={{ backgroundColor: tenant.primaryColor ?? '#2563EB' }}
                    >
                      <div className="text-sm font-bold mb-1">{tenant.brandName}</div>
                      {tenant.tagline && <div className="text-xs opacity-80">{tenant.tagline}</div>}
                      <div
                        className="mt-3 text-xs px-2 py-1 rounded-lg inline-block"
                        style={{ backgroundColor: tenant.secondaryColor ?? '#0B1220' }}
                      >
                        {tenant.supportEmail}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Settings */}
              {activeTab === 'settings' && (
                <div className="max-w-lg">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                      Technical Details
                    </h2>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Tenant Slug</dt>
                        <dd className="text-sm font-mono text-gray-900 dark:text-white mt-0.5">
                          {tenant.id}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">
                          Registered Hostname
                        </dt>
                        <dd className="text-sm font-mono text-gray-900 dark:text-white mt-0.5">
                          {tenant.hostname || '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Infra Notice</dt>
                        <dd className="text-sm text-gray-900 dark:text-white mt-0.5">
                          {tenant.showInfraNotice ? 'Visible' : 'Hidden'}
                        </dd>
                      </div>
                      {tenant.faviconUrl && (
                        <div>
                          <dt className="text-xs text-gray-500 dark:text-gray-400">Favicon URL</dt>
                          <dd className="text-sm text-gray-900 dark:text-white mt-0.5 break-all">
                            {tenant.faviconUrl}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}
