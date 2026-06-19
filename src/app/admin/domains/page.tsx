'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChainX® RWA Platform — Domain Management (Sprint 9.5)
// ─────────────────────────────────────────────────────────────────────────────
// Read-only global view of all domains across all tenants.
// Data fetched from GET /api/admin/domains.
//
// Sprint 9.5 scope: READ ONLY — no register, check DNS, or copy DNS actions.
// Sprint 9.6 will add: Register / Check DNS / Copy DNS actions.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import type { TenantDomain, DomainVerificationStatus } from '@/lib/domains/types';
import {
  Globe,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

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

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DomainsPage() {
  const { address, isOwner } = useAuth();
  const router = useRouter();

  const [domains, setDomains] = useState<TenantDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DomainVerificationStatus | 'all'>('all');

  // ── Fetch domains ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!address || !isOwner) return;

    const fetchDomains = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/domains?ownerAddress=${encodeURIComponent(address)}`);
        const data = (await res.json()) as {
          success: boolean;
          domains?: TenantDomain[];
          error?: string;
        };
        if (!data.success) {
          setError(data.error ?? 'Failed to load domains.');
        } else {
          setDomains(data.domains ?? []);
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void fetchDomains();
  }, [address, isOwner]);

  // ── Client-side filtering ───────────────────────────────────────────────────
  const filtered = domains.filter((d) => {
    if (statusFilter !== 'all' && d.verificationStatus !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return d.hostname.toLowerCase().includes(q) || d.tenantId.toLowerCase().includes(q);
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

  const STATUS_OPTIONS: { value: DomainVerificationStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'registering', label: 'Registering' },
    { value: 'registered', label: 'DNS Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'failed', label: 'Failed' },
  ];

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
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Domain Management
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
              All custom domains registered across all tenant portals.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search domains or tenants…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DomainVerificationStatus | 'all')}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
              <Globe className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {search || statusFilter !== 'all'
                  ? 'No domains match your filters.'
                  : 'No domains registered yet.'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Hostname
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Tenant
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
                  {filtered.map((domain) => (
                    <tr
                      key={domain.hostname}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"
                      onClick={() =>
                        router.push(`/admin/tenants/${encodeURIComponent(domain.tenantId)}`)
                      }
                    >
                      {/* Hostname */}
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                        {domain.hostname}
                      </td>

                      {/* Tenant */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          {domain.tenantId}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <DomainStatusBadge status={domain.verificationStatus} />
                      </td>

                      {/* Verified */}
                      <td className="px-4 py-3">
                        {domain.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </td>

                      {/* Last Checked */}
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                        {domain.lastCheckedAt
                          ? new Date(domain.lastCheckedAt).toLocaleString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer count */}
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {filtered.length} domain{filtered.length !== 1 ? 's' : ''}
                  {statusFilter !== 'all' || search ? ' matching filters' : ' total'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
