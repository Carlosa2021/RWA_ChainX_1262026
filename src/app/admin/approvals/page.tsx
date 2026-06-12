'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChainX® RWA Platform — Dual Authorization & Approval Workflows
// ─────────────────────────────────────────────────────────────────────────────
// Additive, UI-only governance foundation. NO backend, NO database, NO workflow
// engine, NO real approvals, NO execution, NO persistence, NO blockchain, NO
// thirdweb. All data below is mock. Implements the Four-Eyes Principle at the UI
// level: one user proposes, another reviews/approves. Access is governed by the
// existing RBAC layer (Permission.APPROVAL_VIEW / APPROVAL_MANAGE).
//
// Access model (reuses src/lib/rbac):
//   PLATFORM_ADMIN      → view + manage (APPROVAL_MANAGE via ALL_PERMISSIONS)
//   COMPLIANCE_OFFICER  → view + manage (granted explicitly — reviewer)
//   READ_ONLY           → view only (APPROVAL_VIEW inherited via *:view)
//   PROJECT_MANAGER     → no access
//   INVESTOR_RELATIONS  → no access
//
// FUTURE INTEGRATION POINTS (architecture only — do NOT implement here):
//   [REAL APPROVAL ENGINE]      Replace mock state with a server-side workflow
//                               engine that persists requests and decisions.
//   [DUAL AUTHORIZATION EXEC]   On final approval, trigger the real action only
//                               after two distinct authorised signers.
//   [AUDIT TRAIL LINKAGE]       Emit an audit event for every decision
//                               (approve / reject / changes) → /admin/audit-trail.
//   [ERC-3643 ADMIN ACTIONS]    Route administrative on-chain actions (pause,
//                               forced transfer, freeze) through this approval gate.
//   [TOKEN PAUSE APPROVALS]     Future approval category — display only for now.
//   [FORCED TRANSFER APPROVALS] Future approval category — display only for now.
//   [MICA ESCALATION]           Escalate high-risk requests to a compliance queue.
//   [MULTI-STEP CHAINS]         Configurable N-step approval chains per category.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

import { useMemo, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { usePermissions } from '@/lib/rbac/usePermissions';
import { Permission } from '@/lib/rbac/permissions';
import { toast } from 'sonner';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Lock,
  X,
  ArrowDown,
  Check,
  Ban,
  RefreshCw,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
type Priority = 'High' | 'Medium' | 'Low';
type ApprovalCategory = 'Projects' | 'Compliance' | 'Users' | 'Branding' | 'Documents';
type RoleLabel = 'Platform Admin' | 'Compliance Officer' | 'Project Manager' | 'Investor Relations';

interface ApprovalRequest {
  id: string;
  date: string;
  requestedBy: string;
  role: RoleLabel;
  action: string;
  entity: string;
  category: ApprovalCategory;
  priority: Priority;
  status: ApprovalStatus;
  isoDaysAgo: number;
  description: string;
  reason: string;
  chain: readonly string[];
  payload: Record<string, unknown>;
}

interface ApprovalDecision {
  date: string;
  approver: string;
  action: string;
  entity: string;
  decision: 'Approved' | 'Rejected' | 'Changes Requested';
}

// ─── Mock data ────────────────────────────────────────────────
const REQUESTS: readonly ApprovalRequest[] = [
  {
    id: 'APR-2026-001',
    date: '12 Jun 2026 14:35',
    requestedBy: 'Carlos Bernal',
    role: 'Platform Admin',
    action: 'Publish Project',
    entity: 'Torre Madrid Centro',
    category: 'Projects',
    priority: 'High',
    status: 'Pending',
    isoDaysAgo: 0,
    description: 'Request to move the offering from In Review to Open for Subscription.',
    reason: 'All documentation complete and KYC coverage above threshold.',
    chain: ['Requested', 'Compliance Review', 'Final Approval'],
    payload: { projectId: 'P-2026-014', action: 'publish', requestedBy: 'Carlos Bernal' },
  },
  {
    id: 'APR-2026-002',
    date: '12 Jun 2026 12:10',
    requestedBy: 'Maria Keller',
    role: 'Compliance Officer',
    action: 'Approve Investor KYC',
    entity: 'Investor #245',
    category: 'Compliance',
    priority: 'Medium',
    status: 'Approved',
    isoDaysAgo: 0,
    description: 'Identity verification approval for a new institutional investor.',
    reason: 'Documents validated against trusted issuer claim topics.',
    chain: ['Requested', 'Compliance Review', 'Final Approval'],
    payload: { investorId: 245, action: 'kyc_approve', requestedBy: 'Maria Keller' },
  },
  {
    id: 'APR-2026-003',
    date: '11 Jun 2026 18:02',
    requestedBy: 'Thomas Weber',
    role: 'Platform Admin',
    action: 'Modify Branding',
    entity: 'MadroOffice Capital',
    category: 'Branding',
    priority: 'Low',
    status: 'Rejected',
    isoDaysAgo: 1,
    description: 'Update investor portal primary color and display name.',
    reason: 'Rejected — proposed contrast ratio fails accessibility guidelines.',
    chain: ['Requested', 'Review', 'Final Approval'],
    payload: { tenant: 'madrooffice', action: 'branding_update', requestedBy: 'Thomas Weber' },
  },
  {
    id: 'APR-2026-004',
    date: '11 Jun 2026 09:41',
    requestedBy: 'Carlos Bernal',
    role: 'Platform Admin',
    action: 'Change User Role',
    entity: 'compliance@madrooffice.com',
    category: 'Users',
    priority: 'High',
    status: 'Pending',
    isoDaysAgo: 1,
    description: 'Promote user to Compliance Officer with approval permissions.',
    reason: 'New compliance hire requires reviewer access.',
    chain: ['Requested', 'Admin Review', 'Final Approval'],
    payload: { user: 'compliance@madrooffice.com', from: 'READ_ONLY', to: 'COMPLIANCE_OFFICER' },
  },
  {
    id: 'APR-2026-005',
    date: '10 Jun 2026 16:03',
    requestedBy: 'Maria Keller',
    role: 'Compliance Officer',
    action: 'Approve Compliance Export',
    entity: 'MiCA Annual Report',
    category: 'Compliance',
    priority: 'Medium',
    status: 'Pending',
    isoDaysAgo: 2,
    description: 'Authorize export of the annual MiCA compliance report.',
    reason: 'Quarterly regulatory reporting cycle.',
    chain: ['Requested', 'Compliance Review', 'Final Approval'],
    payload: { reportId: 'RPT-2026-001', action: 'export', requestedBy: 'Maria Keller' },
  },
  {
    id: 'APR-2026-006',
    date: '08 Jun 2026 15:54',
    requestedBy: 'Thomas Weber',
    role: 'Platform Admin',
    action: 'Delete Document',
    entity: 'Prospectus v1 (draft)',
    category: 'Documents',
    priority: 'High',
    status: 'Approved',
    isoDaysAgo: 4,
    description: 'Remove an outdated draft prospectus before publication.',
    reason: 'Superseded by version 2.',
    chain: ['Requested', 'Compliance Review', 'Final Approval'],
    payload: { documentId: 'DOC-1182', action: 'delete', requestedBy: 'Thomas Weber' },
  },
];

const DECISIONS: readonly ApprovalDecision[] = [
  {
    date: '12 Jun 2026 12:30',
    approver: 'Maria Keller',
    action: 'Approve Investor KYC',
    entity: 'Investor #245',
    decision: 'Approved',
  },
  {
    date: '11 Jun 2026 18:20',
    approver: 'Carlos Bernal',
    action: 'Modify Branding',
    entity: 'MadroOffice Capital',
    decision: 'Rejected',
  },
  {
    date: '10 Jun 2026 10:05',
    approver: 'Maria Keller',
    action: 'Publish Project',
    entity: 'Barcelona Logistics Hub',
    decision: 'Changes Requested',
  },
  {
    date: '08 Jun 2026 16:10',
    approver: 'Carlos Bernal',
    action: 'Delete Document',
    entity: 'Prospectus v1 (draft)',
    decision: 'Approved',
  },
];

const CRITICAL_ACTIONS: ReadonlyArray<{ label: string; priority: Priority }> = [
  { label: 'Publish Project', priority: 'High' },
  { label: 'Modify Branding', priority: 'Low' },
  { label: 'Approve Compliance Export', priority: 'Medium' },
  { label: 'Role Change', priority: 'High' },
  { label: 'Delete Document', priority: 'High' },
];

// ─── Style maps ───────────────────────────────────────────────
const STATUS_STYLES: Record<ApprovalStatus, { cls: string; icon: React.ElementType }> = {
  Pending: {
    cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    icon: Clock,
  },
  Approved: {
    cls: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50',
    icon: CheckCircle2,
  },
  Rejected: {
    cls: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
    icon: XCircle,
  },
};

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
  Medium:
    'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  Low: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
};

const DECISION_STYLES: Record<ApprovalDecision['decision'], string> = {
  Approved:
    'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50',
  Rejected:
    'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
  'Changes Requested':
    'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
};

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${className}`}
    >
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const s = STATUS_STYLES[status];
  const Icon = s.icon;
  return (
    <Badge className={s.cls}>
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
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
function ApprovalDrawer({
  request,
  canManage,
  onClose,
}: {
  request: ApprovalRequest;
  canManage: boolean;
  onClose: () => void;
}) {
  const rows: Array<[string, React.ReactNode]> = [
    ['Request ID', request.id],
    ['Date', request.date],
    ['Requested By', request.requestedBy],
    ['Role', request.role],
    ['Action', request.action],
    ['Entity', request.entity],
    [
      'Priority',
      <Badge key="p" className={PRIORITY_STYLES[request.priority]}>
        {request.priority}
      </Badge>,
    ],
    ['Status', <StatusBadge key="s" status={request.status} />],
  ];

  const act = (label: string) => toast.success(`${label} — ${request.id} (${request.action}).`);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{request.action}</h3>
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
            <p className="text-sm text-gray-700 dark:text-gray-300">{request.description}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reason</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{request.reason}</p>
          </div>

          {/* Approval chain */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Approval Chain</p>
            <div className="space-y-1.5">
              {request.chain.map((step, i) => (
                <div key={step}>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-3 py-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                  </div>
                  {i < request.chain.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* JSON payload */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payload</p>
            <pre className="text-xs font-mono bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 overflow-x-auto text-gray-800 dark:text-gray-200">
              {JSON.stringify(request.payload, null, 2)}
            </pre>
          </div>

          {/* Actions — only when can(APPROVAL_MANAGE) and request is pending */}
          {canManage && request.status === 'Pending' && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => act('Approved')}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                <Check className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => act('Rejected')}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium transition-colors"
              >
                <Ban className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => act('Changes requested')}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Request Changes
              </button>
            </div>
          )}
          {!canManage && (
            <p className="text-xs text-gray-500 dark:text-gray-500 pt-1">
              You have read-only access to approval requests.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Access-denied state ──────────────────────────────────────
function ApprovalsDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 mb-5">
        <Lock className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        You don&apos;t have access to Approval Workflows
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
        Approval Workflows are available to Platform Admins and Compliance Officers. Contact your
        platform administrator if you need access.
      </p>
    </div>
  );
}

// ─── Filter option sets ───────────────────────────────────────
const STATUS_OPTIONS = ['All', 'Pending', 'Approved', 'Rejected'] as const;
const CATEGORY_OPTIONS = [
  'All',
  'Projects',
  'Compliance',
  'Users',
  'Branding',
  'Documents',
] as const;
const PRIORITY_OPTIONS = ['All', 'High', 'Medium', 'Low'] as const;
const DATE_OPTIONS = ['Today', '7 Days', '30 Days', '90 Days'] as const;
const DAYS_BY_RANGE: Record<string, number> = {
  Today: 0,
  '7 Days': 7,
  '30 Days': 30,
  '90 Days': 90,
};

// ─── Page ─────────────────────────────────────────────────────
export default function ApprovalsPage() {
  const { can } = usePermissions();
  const canView = can(Permission.APPROVAL_VIEW);
  const canManage = can(Permission.APPROVAL_MANAGE);

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('30 Days');
  const [selected, setSelected] = useState<ApprovalRequest | null>(null);

  const filtered = useMemo(() => {
    const maxDays = DAYS_BY_RANGE[dateRange] ?? 90;
    return REQUESTS.filter((r) => {
      if (r.isoDaysAgo > maxDays) return false;
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;
      if (priorityFilter !== 'All' && r.priority !== priorityFilter) return false;
      return true;
    });
  }, [statusFilter, categoryFilter, priorityFilter, dateRange]);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl w-full mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Approval Workflows
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review, approve and monitor critical platform actions.
              </p>
            </div>
          </div>

          {!canView ? (
            <ApprovalsDenied />
          ) : (
            <>
              {/* KPI section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard label="Pending Approvals" value="18" icon={Clock} tone="amber" />
                <KpiCard label="Approved Today" value="42" icon={CheckCircle2} tone="green" />
                <KpiCard label="Rejected Requests" value="6" icon={XCircle} tone="red" />
                <KpiCard
                  label="Critical Actions Awaiting Approval"
                  value="3"
                  icon={AlertTriangle}
                  tone="blue"
                />
              </div>

              {/* Four-eyes governance card */}
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/40 rounded-xl p-5 mb-6 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Four-Eyes Principle
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    Critical actions require independent review before execution. This reduces
                    operational risk and supports institutional governance.
                  </p>
                </div>
              </div>

              {/* Filter bar */}
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  <FilterSelect
                    label="Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={STATUS_OPTIONS}
                  />
                  <FilterSelect
                    label="Category"
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    options={CATEGORY_OPTIONS}
                  />
                  <FilterSelect
                    label="Priority"
                    value={priorityFilter}
                    onChange={setPriorityFilter}
                    options={PRIORITY_OPTIONS}
                  />
                  <FilterSelect
                    label="Date Range"
                    value={dateRange}
                    onChange={setDateRange}
                    options={DATE_OPTIONS}
                  />
                </div>
              </div>

              {/* Approvals table */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/60 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <th className="px-4 py-3">Request ID</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Requested By</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3">Entity</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filtered.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-4 py-10 text-center text-gray-500 dark:text-gray-500"
                          >
                            No requests match the selected filters.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((r) => (
                          <tr
                            key={r.id}
                            onClick={() => setSelected(r)}
                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                          >
                            <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {r.id}
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap tabular-nums">
                              {r.date}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              {r.requestedBy}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {r.role}
                            </td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                              {r.action}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {r.entity}
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={PRIORITY_STYLES[r.priority]}>{r.priority}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={r.status} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Critical actions panel */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Critical Actions Requiring Approval
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CRITICAL_ACTIONS.map((c) => (
                    <div
                      key={c.label}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                        <AlertTriangle className="w-4 h-4 text-gray-400 shrink-0" />
                        {c.label}
                      </span>
                      <Badge className={PRIORITY_STYLES[c.priority]}>{c.priority}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval history */}
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Recent Approval Decisions
                </h2>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/60 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Approver</th>
                          <th className="px-4 py-3">Action</th>
                          <th className="px-4 py-3">Entity</th>
                          <th className="px-4 py-3">Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {DECISIONS.map((d) => (
                          <tr
                            key={`${d.date}-${d.entity}`}
                            className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                          >
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap tabular-nums">
                              {d.date}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              {d.approver}
                            </td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                              {d.action}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {d.entity}
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={DECISION_STYLES[d.decision]}>{d.decision}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {selected && (
        <ApprovalDrawer
          request={selected}
          canManage={canManage}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
