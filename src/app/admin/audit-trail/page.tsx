'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChainX® RWA Platform — Enterprise Audit Trail
// ─────────────────────────────────────────────────────────────────────────────
// Additive, UI-only module. NO backend, NO database, NO real logging, NO API,
// NO blockchain, NO thirdweb. All data below is mock. Access is governed by the
// existing RBAC layer (Permission.AUDIT_VIEW / AUDIT_EXPORT).
//
// Access model (reuses src/lib/rbac):
//   PLATFORM_ADMIN      → full access (view + export)
//   COMPLIANCE_OFFICER  → read access (view)
//   READ_ONLY           → read access (view)
//   PROJECT_MANAGER     → no access
//   INVESTOR_RELATIONS  → no access
//
// FUTURE COMPATIBILITY (architecture only — do NOT implement here):
//   [REAL AUDIT EVENTS]   Replace MOCK_EVENTS with an append-only event source
//                         (operator DB / event bus). Shape: AuditEvent below.
//   [BLOCKCHAIN EVENTS]   Index on-chain logs (transfers, mints, freezes) and
//                         merge them into the same AuditEvent stream.
//   [ERC-3643 EVENTS]     Map IdentityRegistry / Compliance / Token events
//                         (verify, forcedTransfer, pause) into audit entries.
//   [MICA REPORTING]      Generate regulator-ready reports from filtered events
//                         (participant list, jurisdiction breakdown, KYC summary).
//   [DUAL AUTHORIZATION]  Critical actions should reference a second approver id
//                         in the payload (approvedBy) before result = success.
//   [APPROVAL WORKFLOWS]  Pending events (result = 'pending') route through an
//                         approval queue before becoming immutable.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

import { useMemo, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { usePermissions } from '@/lib/rbac/usePermissions';
import { Permission } from '@/lib/rbac/permissions';
import { toast } from 'sonner';
import {
  History,
  ShieldCheck,
  Settings as SettingsIcon,
  AlertTriangle,
  Activity,
  Download,
  FileText,
  FileSpreadsheet,
  Lock,
  X,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';

// ─── Types (also the future real-event shape) ─────────────────
type AuditResult = 'success' | 'warning' | 'error';
type AuditCategory = 'Compliance' | 'Projects' | 'Investors' | 'Documents' | 'Branding' | 'System';
type AuditRoleLabel =
  | 'Platform Admin'
  | 'Compliance Officer'
  | 'Project Manager'
  | 'Investor Relations'
  | 'System';

interface AuditEvent {
  id: string;
  timestamp: string; // display string (mock)
  isoDaysAgo: number; // for date-range filtering (mock)
  user: string;
  role: AuditRoleLabel;
  action: string;
  entity: string;
  category: AuditCategory;
  ip: string;
  result: AuditResult;
  description: string;
  payload: Record<string, unknown>;
}

// ─── Mock data ────────────────────────────────────────────────
const MOCK_EVENTS: readonly AuditEvent[] = [
  {
    id: 'EVT-2026-0612-001',
    timestamp: '12 Jun 2026 14:35',
    isoDaysAgo: 0,
    user: 'Carlos Bernal',
    role: 'Platform Admin',
    action: 'Published Project',
    entity: 'Torre Oficinas Madrid',
    category: 'Projects',
    ip: '185.34.xxx.xxx',
    result: 'success',
    description: 'Project moved from In Review to Open for Subscription.',
    payload: { projectId: 'P-2026-014', action: 'publish', performedBy: 'Carlos Bernal' },
  },
  {
    id: 'EVT-2026-0612-002',
    timestamp: '12 Jun 2026 12:10',
    isoDaysAgo: 0,
    user: 'Maria Keller',
    role: 'Compliance Officer',
    action: 'Approved Investor KYC',
    entity: 'Investor #245',
    category: 'Compliance',
    ip: '91.124.xxx.xxx',
    result: 'success',
    description: 'Identity verified against trusted issuer claim topics.',
    payload: { investorId: 245, action: 'kyc_approve', performedBy: 'Maria Keller' },
  },
  {
    id: 'EVT-2026-0611-003',
    timestamp: '11 Jun 2026 18:02',
    isoDaysAgo: 1,
    user: 'Thomas Weber',
    role: 'Platform Admin',
    action: 'Changed Branding Settings',
    entity: 'MadroOffice Capital',
    category: 'Branding',
    ip: '84.15.xxx.xxx',
    result: 'success',
    description: 'Updated primary color and investor portal display name.',
    payload: { tenant: 'madrooffice', action: 'branding_update', performedBy: 'Thomas Weber' },
  },
  {
    id: 'EVT-2026-0611-004',
    timestamp: '11 Jun 2026 09:41',
    isoDaysAgo: 1,
    user: 'Maria Keller',
    role: 'Compliance Officer',
    action: 'Rejected KYC Verification',
    entity: 'Investor #198',
    category: 'Compliance',
    ip: '91.124.xxx.xxx',
    result: 'warning',
    description: 'Submitted document failed authenticity checks. Investor notified.',
    payload: { investorId: 198, action: 'kyc_reject', reason: 'document_mismatch' },
  },
  {
    id: 'EVT-2026-0610-005',
    timestamp: '10 Jun 2026 16:03',
    isoDaysAgo: 2,
    user: 'System',
    role: 'System',
    action: 'Scheduled Distribution Report',
    entity: 'Monthly Distribution',
    category: 'System',
    ip: 'Internal',
    result: 'success',
    description: 'Automated monthly distribution report generated for all active offerings.',
    payload: { job: 'distribution_report', period: '2026-05', action: 'generate' },
  },
  {
    id: 'EVT-2026-0609-006',
    timestamp: '09 Jun 2026 11:27',
    isoDaysAgo: 3,
    user: 'Sergio Lluch',
    role: 'Investor Relations',
    action: 'Sent Investor Update',
    entity: 'Torre Oficinas Madrid',
    category: 'Investors',
    ip: '88.21.xxx.xxx',
    result: 'success',
    description: 'Quarterly performance update sent to 42 verified investors.',
    payload: { campaign: 'torre-oficinas', recipients: 42, action: 'broadcast' },
  },
  {
    id: 'EVT-2026-0608-007',
    timestamp: '08 Jun 2026 15:54',
    isoDaysAgo: 4,
    user: 'Thomas Weber',
    role: 'Platform Admin',
    action: 'Deleted Document',
    entity: 'Prospectus v1 (draft)',
    category: 'Documents',
    ip: '84.15.xxx.xxx',
    result: 'error',
    description: 'Draft prospectus removed before publication. Action is irreversible.',
    payload: { documentId: 'DOC-1182', action: 'delete', performedBy: 'Thomas Weber' },
  },
  {
    id: 'EVT-2026-0515-008',
    timestamp: '15 May 2026 10:18',
    isoDaysAgo: 28,
    user: 'Carlos Bernal',
    role: 'Platform Admin',
    action: 'Changed User Role',
    entity: 'compliance@madrooffice.com',
    category: 'System',
    ip: '185.34.xxx.xxx',
    result: 'success',
    description: 'User role updated to Compliance Officer.',
    payload: { user: 'compliance@madrooffice.com', from: 'READ_ONLY', to: 'COMPLIANCE_OFFICER' },
  },
];

// ─── Result badge ─────────────────────────────────────────────
const RESULT_STYLES: Record<AuditResult, { label: string; cls: string; icon: React.ElementType }> =
  {
    success: {
      label: 'Success',
      cls: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50',
      icon: CheckCircle2,
    },
    warning: {
      label: 'Warning',
      cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
      icon: AlertCircle,
    },
    error: {
      label: 'Error',
      cls: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
      icon: XCircle,
    },
  };

function ResultBadge({ result }: { result: AuditResult }) {
  const s = RESULT_STYLES[result];
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

function CategoryBadge({ category }: { category: AuditCategory }) {
  return (
    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
      {category}
    </span>
  );
}

// ─── KPI card (reuses dashboard KPI styling) ──────────────────
function KpiCard({
  label,
  value,
  icon: Icon,
  tone = 'blue',
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  tone?: 'blue' | 'green' | 'amber' | 'red';
}) {
  const tones: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <div className={`p-2 rounded-lg ${tones[tone]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

// ─── Filter select ────────────────────────────────────────────
const selectCls =
  'bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors';

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <select className={selectCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Detail drawer ────────────────────────────────────────────
function EventDrawer({ event, onClose }: { event: AuditEvent; onClose: () => void }) {
  const rows: Array<[string, React.ReactNode]> = [
    ['Event ID', event.id],
    ['Timestamp', event.timestamp],
    ['User', event.user],
    ['Role', event.role],
    ['Entity', event.entity],
    ['Action', event.action],
    ['Category', <CategoryBadge key="c" category={event.category} />],
    ['IP Address', event.ip],
    ['Result', <ResultBadge key="r" result={event.result} />],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Event Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <dl className="space-y-2.5">
            {rows.map(([k, v]) => (
              <div key={String(k)} className="flex items-start justify-between gap-4">
                <dt className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{k}</dt>
                <dd className="text-sm text-gray-900 dark:text-white text-right">{v}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{event.description}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">JSON Payload</p>
            <pre className="text-xs font-mono bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 overflow-x-auto text-gray-800 dark:text-gray-200">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Access-denied state ──────────────────────────────────────
function AuditDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 mb-5">
        <Lock className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        You don&apos;t have access to the Audit Trail
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
        Audit Trail is available to Platform Admins and Compliance Officers. Contact your platform
        administrator if you need access.
      </p>
    </div>
  );
}

// ─── Critical actions ─────────────────────────────────────────
const CRITICAL_ACTIONS: ReadonlyArray<{
  label: string;
  entity: string;
  result: AuditResult;
}> = [
  { label: 'Project Published', entity: 'Torre Oficinas Madrid', result: 'success' },
  { label: 'Branding Modified', entity: 'MadroOffice Capital', result: 'success' },
  { label: 'KYC Approved', entity: 'Investor #245', result: 'success' },
  { label: 'Role Changed', entity: 'compliance@madrooffice.com', result: 'success' },
  { label: 'Document Deleted', entity: 'Prospectus v1 (draft)', result: 'error' },
];

// ─── Filter option sets ───────────────────────────────────────
const DATE_OPTIONS = ['Today', '7 Days', '30 Days', '90 Days'] as const;
const USER_OPTIONS = [
  'All Users',
  'Platform Admin',
  'Compliance Officer',
  'Project Manager',
  'Investor Relations',
] as const;
const TYPE_OPTIONS = [
  'All',
  'Compliance',
  'Projects',
  'Investors',
  'Documents',
  'Branding',
  'System',
] as const;
const STATUS_OPTIONS = ['All', 'Success', 'Warning', 'Error'] as const;

const DAYS_BY_RANGE: Record<string, number> = {
  Today: 0,
  '7 Days': 7,
  '30 Days': 30,
  '90 Days': 90,
};

// ─── Page ─────────────────────────────────────────────────────
export default function AuditTrailPage() {
  const { can } = usePermissions();
  const canView = can(Permission.AUDIT_VIEW);
  const canExport = can(Permission.AUDIT_EXPORT);

  const [dateRange, setDateRange] = useState<string>('30 Days');
  const [userFilter, setUserFilter] = useState<string>('All Users');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selected, setSelected] = useState<AuditEvent | null>(null);

  const filtered = useMemo(() => {
    const maxDays = DAYS_BY_RANGE[dateRange] ?? 90;
    return MOCK_EVENTS.filter((e) => {
      if (e.isoDaysAgo > maxDays) return false;
      if (userFilter !== 'All Users' && e.role !== userFilter) return false;
      if (typeFilter !== 'All' && e.category !== typeFilter) return false;
      if (statusFilter !== 'All' && RESULT_STYLES[e.result].label !== statusFilter) return false;
      return true;
    });
  }, [dateRange, userFilter, typeFilter, statusFilter]);

  const handleExport = (kind: string) => {
    toast.success(`${kind} export generated.`);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl w-full mx-auto">
          {/* Title + exports */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Audit Trail
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor platform activity, compliance actions and administrative events.
                </p>
              </div>
            </div>

            {canExport && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport('CSV')}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={() => handleExport('PDF')}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" /> Export PDF
                </button>
                <button
                  onClick={() => handleExport('Audit Log')}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" /> Export Audit Log
                </button>
              </div>
            )}
          </div>

          {!canView ? (
            <AuditDenied />
          ) : (
            <>
              {/* KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard label="Total Events" value="2,345" icon={Activity} tone="blue" />
                <KpiCard label="Compliance Events" value="542" icon={ShieldCheck} tone="green" />
                <KpiCard
                  label="Administrative Actions"
                  value="389"
                  icon={SettingsIcon}
                  tone="blue"
                />
                <KpiCard label="Critical Actions" value="18" icon={AlertTriangle} tone="amber" />
              </div>

              {/* Filter bar */}
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  <FilterSelect
                    label="Date Range"
                    value={dateRange}
                    onChange={setDateRange}
                    options={DATE_OPTIONS}
                  />
                  <FilterSelect
                    label="User"
                    value={userFilter}
                    onChange={setUserFilter}
                    options={USER_OPTIONS}
                  />
                  <FilterSelect
                    label="Event Type"
                    value={typeFilter}
                    onChange={setTypeFilter}
                    options={TYPE_OPTIONS}
                  />
                  <FilterSelect
                    label="Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={STATUS_OPTIONS}
                  />
                </div>
              </div>

              {/* Audit table */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/60 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <th className="px-4 py-3">Date &amp; Time</th>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3">Entity</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">IP Address</th>
                        <th className="px-4 py-3">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filtered.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-4 py-10 text-center text-gray-500 dark:text-gray-500"
                          >
                            No events match the selected filters.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((e) => (
                          <tr
                            key={e.id}
                            onClick={() => setSelected(e)}
                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                          >
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap tabular-nums">
                              {e.timestamp}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              {e.user}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {e.role}
                            </td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                              {e.action}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {e.entity}
                            </td>
                            <td className="px-4 py-3">
                              <CategoryBadge category={e.category} />
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-500 font-mono text-xs whitespace-nowrap">
                              {e.ip}
                            </td>
                            <td className="px-4 py-3">
                              <ResultBadge result={e.result} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent critical actions */}
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Recent Critical Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CRITICAL_ACTIONS.map((c) => {
                    const s = RESULT_STYLES[c.result];
                    const Icon = s.icon;
                    return (
                      <div
                        key={c.label}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4"
                      >
                        <span className={`p-2 rounded-lg border ${s.cls} shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {c.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {c.entity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {selected && <EventDrawer event={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
