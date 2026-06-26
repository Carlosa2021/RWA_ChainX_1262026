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
    id: 'EVT-2026-0618-001',
    timestamp: '18 Jun 2026 09:42',
    isoDaysAgo: 0,
    user: 'Dr. H. Müller',
    role: 'Platform Admin',
    action: 'Approved Project Prospectus',
    entity: 'Basel Riverside Offices',
    category: 'Projects',
    ip: '185.34.xxx.xxx',
    result: 'success',
    description:
      'Investment prospectus v2 reviewed and approved. Project moved to Open for Subscription.',
    payload: { projectId: 'BROFFICE', action: 'prospectus_approve', version: 2 },
  },
  {
    id: 'EVT-2026-0618-002',
    timestamp: '18 Jun 2026 08:15',
    isoDaysAgo: 0,
    user: 'Claudia Reyes',
    role: 'Compliance Officer',
    action: 'Approved Investor KYC',
    entity: 'Lars Petersen (DK)',
    category: 'Compliance',
    ip: '91.124.xxx.xxx',
    result: 'success',
    description:
      'Identity verified via Sumsub · Danish passport + proof of address · AML screening passed.',
    payload: { investorId: 'INV-0429', action: 'kyc_approve', provider: 'Sumsub' },
  },
  {
    id: 'EVT-2026-0617-003',
    timestamp: '17 Jun 2026 16:30',
    isoDaysAgo: 1,
    user: 'Claudia Reyes',
    role: 'Compliance Officer',
    action: 'Flagged KYC Expired',
    entity: 'Hans-Peter Vogt (CH)',
    category: 'Compliance',
    ip: '91.124.xxx.xxx',
    result: 'warning',
    description:
      'Investor KYC expired 30 Apr 2026. Token transfers suspended until re-verification.',
    payload: { investorId: 'INV-0011', action: 'kyc_expired', expiryDate: '2026-04-30' },
  },
  {
    id: 'EVT-2026-0617-004',
    timestamp: '17 Jun 2026 11:05',
    isoDaysAgo: 1,
    user: 'Marc Torres',
    role: 'Project Manager',
    action: 'Uploaded Legal Document',
    entity: 'Madrid Prime Offices',
    category: 'Documents',
    ip: '84.88.xxx.xxx',
    result: 'success',
    description:
      'Legal Opinion (Garrigües, v1) uploaded for regulatory review. Pending compliance sign-off.',
    payload: { docId: 'DOC-2026-042', action: 'upload', campaign: 'MADRPRIME' },
  },
  {
    id: 'EVT-2026-0616-005',
    timestamp: '16 Jun 2026 14:20',
    isoDaysAgo: 2,
    user: 'Claudia Reyes',
    role: 'Compliance Officer',
    action: 'Rejected KYC Document',
    entity: 'Yuki Tanaka (JP)',
    category: 'Compliance',
    ip: '91.124.xxx.xxx',
    result: 'error',
    description:
      'Passport scan expired — expiry date 2023-11-15. Investor notified; re-submission requested.',
    payload: { investorId: 'INV-0312', action: 'kyc_reject', reason: 'document_expired' },
  },
  {
    id: 'EVT-2026-0616-006',
    timestamp: '16 Jun 2026 10:00',
    isoDaysAgo: 2,
    user: 'Sophia Meier',
    role: 'Investor Relations',
    action: 'Sent Investor Update',
    entity: 'Basel Riverside Offices',
    category: 'Investors',
    ip: '193.22.xxx.xxx',
    result: 'success',
    description:
      'Q1 2026 performance report broadcast to 84 verified token holders. 99% delivery confirmed.',
    payload: { campaign: 'BROFFICE', recipients: 84, action: 'broadcast' },
  },
  {
    id: 'EVT-2026-0615-007',
    timestamp: '15 Jun 2026 18:45',
    isoDaysAgo: 3,
    user: 'Alexander Brandt',
    role: 'Platform Admin',
    action: 'Processed Distribution',
    entity: 'Valencia Logistics Hub',
    category: 'Projects',
    ip: '82.197.xxx.xxx',
    result: 'success',
    description:
      'Q2 2026 distribution €1,424,200 approved and queued for 312 token holders (VALHUB).',
    payload: {
      campaign: 'VALHUB',
      amount: 1424200,
      recipients: 312,
      action: 'distribution_approve',
    },
  },
  {
    id: 'EVT-2026-0614-008',
    timestamp: '14 Jun 2026 09:12',
    isoDaysAgo: 4,
    user: 'System',
    role: 'System',
    action: 'Generated MiCA Report',
    entity: 'Q1 2026 Compliance Report',
    category: 'System',
    ip: 'Internal',
    result: 'success',
    description:
      'Automated MiCA Art. 22 quarterly report generated. Exported PDF to secure document vault.',
    payload: { job: 'mica_report', period: '2026-Q1', action: 'generate' },
  },
  {
    id: 'EVT-2026-0613-009',
    timestamp: '13 Jun 2026 15:55',
    isoDaysAgo: 5,
    user: 'Dr. H. Müller',
    role: 'Platform Admin',
    action: 'Granted Agent Role',
    entity: 'IdentityRegistry (BROFFICE)',
    category: 'Compliance',
    ip: '185.34.xxx.xxx',
    result: 'success',
    description:
      'Sumsub agent address granted IdentityRegistry agent role for Basel Riverside Offices.',
    payload: {
      contract: 'IdentityRegistry',
      project: 'BROFFICE',
      action: 'grant_agent',
      agent: '0xSumsub',
    },
  },
  {
    id: 'EVT-2026-0611-010',
    timestamp: '11 Jun 2026 11:30',
    isoDaysAgo: 7,
    user: 'Marc Torres',
    role: 'Project Manager',
    action: 'Created Project',
    entity: 'Ibiza Luxury Villas',
    category: 'Projects',
    ip: '84.88.xxx.xxx',
    result: 'success',
    description:
      'New offering IBZVILLAS registered in ProjectRegistry (In Structuring). Launch target Q4 2026.',
    payload: { projectId: 'IBZVILLAS', status: 'draft', action: 'create' },
  },
  {
    id: 'EVT-2026-0610-011',
    timestamp: '10 Jun 2026 08:04',
    isoDaysAgo: 8,
    user: 'Marc Torres',
    role: 'Project Manager',
    action: 'Insurance Renewal Alert',
    entity: 'Madrid Prime Offices',
    category: 'Documents',
    ip: '84.88.xxx.xxx',
    result: 'warning',
    description:
      'Property Insurance Certificate expired 01 Jun 2026. Renewal required before token issuance.',
    payload: { docId: 'DOC-2025-018', action: 'renewal_alert', campaign: 'MADRPRIME' },
  },
  {
    id: 'EVT-2026-0601-012',
    timestamp: '01 Jun 2026 07:00',
    isoDaysAgo: 17,
    user: 'System',
    role: 'System',
    action: 'Updated Chainlink Price Feed',
    entity: 'EUR/USD Oracle',
    category: 'System',
    ip: 'Internal',
    result: 'success',
    description:
      'Chainlink EUR/USD rate refreshed (1 EUR = 1.0847 USD). InvestmentController quote cache cleared.',
    payload: {
      oracle: 'ChainlinkEURUSD',
      rate: 1.0847,
      action: 'price_update',
      chain: 'Polygon',
    },
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
  { label: 'Project Published', entity: 'Madrid Prime Offices', result: 'success' },
  { label: 'Branding Modified', entity: 'Meridian Capital AG', result: 'success' },
  { label: 'KYC Approved', entity: 'Investor #245', result: 'success' },
  { label: 'Role Changed', entity: 'compliance@meridian-capital.ch', result: 'success' },
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
