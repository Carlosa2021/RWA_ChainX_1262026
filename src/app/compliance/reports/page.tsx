'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChainX® RWA Platform — MiCA Compliance Reporting Center
// ─────────────────────────────────────────────────────────────────────────────
// Additive, UI-only management dashboard. NO backend, NO database, NO report
// generation engine, NO PDF generation, NO real MiCA logic, NO blockchain, NO
// thirdweb. All data below is mock. Access is governed by the existing RBAC
// layer (Permission.COMPLIANCE_VIEW). This is an OPERATOR dashboard, not a
// regulator portal.
//
// Access model (reuses src/lib/rbac):
//   PLATFORM_ADMIN      → access (COMPLIANCE_VIEW via ALL_PERMISSIONS)
//   COMPLIANCE_OFFICER  → access (COMPLIANCE_VIEW granted explicitly)
//   READ_ONLY           → access (COMPLIANCE_VIEW inherited via *:view)
//   PROJECT_MANAGER     → no access
//   INVESTOR_RELATIONS  → no access
//
// FUTURE INTEGRATION POINTS (architecture only — do NOT implement here):
//   [REAL PDF GENERATION]     Replace export toasts with a server-side document
//                             renderer (e.g. operator report service).
//   [MICA EXPORT ENGINE]      Map the mock report rows to a MiCA white-paper /
//                             periodic-disclosure export pipeline.
//   [REGULATOR SUBMISSIONS]   Add a submission channel (NCA/ESMA) with status
//                             tracking; reports gain a 'submitted' state.
//   [ERC-3643 EVENT REPORTING]Aggregate Token/Compliance events (transfers,
//                             freezes, forced transfers) into offering reports.
//   [IDENTITY REGISTRY]       Source verified-investor counts from on-chain
//                             IdentityRegistry instead of mock KPIs.
//   [KYC PROVIDER]            Pull KYC coverage / expirations from the operator's
//                             KYC provider API.
//   [AUDIT TRAIL INTEGRATION] Build the "Audit Trail Summary" report from the
//                             real audit event stream (see /admin/audit-trail).
//   [MULTI-JURISDICTION]      Scope every report and KPI per jurisdiction set.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { usePermissions } from '@/lib/rbac/usePermissions';
import { Permission } from '@/lib/rbac/permissions';
import { toast } from 'sonner';
import {
  ClipboardCheck,
  ShieldCheck,
  Users,
  Building2,
  Gauge,
  FileWarning,
  AlertTriangle,
  Lock,
  X,
  FileText,
  FileSpreadsheet,
  FileArchive,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────
type ReportStatus = 'Ready' | 'Pending' | 'Draft';
type ReportFormat = 'PDF' | 'CSV' | 'ZIP';
type OfferingStatus = 'Compliant' | 'Review Required' | 'Pending Documentation';
type Severity = 'High' | 'Medium' | 'Low';
type ExpirationStatus = 'Valid' | 'Expiring' | 'Expired';

interface RegulatoryReport {
  id: string;
  name: string;
  category: string;
  generated: string;
  status: ReportStatus;
  format: ReportFormat;
  preparedBy: string;
  coveragePeriod: string;
  description: string;
  sections: readonly string[];
}

// ─── Mock data ────────────────────────────────────────────────
const REPORTS: readonly RegulatoryReport[] = [
  {
    id: 'RPT-2026-001',
    name: 'MiCA Annual Compliance Report',
    category: 'Regulatory',
    generated: '01 Jun 2026',
    status: 'Ready',
    format: 'PDF',
    preparedBy: 'Maria Keller',
    coveragePeriod: 'Jan 2026 – Dec 2026',
    description:
      'Consolidated annual compliance disclosure covering investor verification, offering status and document registry.',
    sections: [
      'Investor KYC Coverage',
      'Offering Status',
      'Document Registry',
      'Jurisdiction Exposure',
      'Audit Events',
    ],
  },
  {
    id: 'RPT-2026-002',
    name: 'Investor Verification Summary',
    category: 'Investors',
    generated: '08 Jun 2026',
    status: 'Ready',
    format: 'CSV',
    preparedBy: 'Maria Keller',
    coveragePeriod: 'Q2 2026',
    description: 'KYC coverage breakdown by status and jurisdiction for all active offerings.',
    sections: ['Investor KYC Coverage', 'Jurisdiction Exposure'],
  },
  {
    id: 'RPT-2026-003',
    name: 'Jurisdiction Exposure Report',
    category: 'Risk',
    generated: '05 Jun 2026',
    status: 'Pending',
    format: 'PDF',
    preparedBy: 'System',
    coveragePeriod: 'Q2 2026',
    description: 'Distribution of verified investors and committed capital across jurisdictions.',
    sections: ['Jurisdiction Exposure', 'Offering Status'],
  },
  {
    id: 'RPT-2026-004',
    name: 'Document Compliance Report',
    category: 'Documents',
    generated: '03 Jun 2026',
    status: 'Ready',
    format: 'PDF',
    preparedBy: 'Carlos Bernal',
    coveragePeriod: 'Q2 2026',
    description: 'Status of mandatory offering documents, including upcoming expirations.',
    sections: ['Document Registry', 'Offering Status'],
  },
  {
    id: 'RPT-2026-005',
    name: 'Offering Compliance Status',
    category: 'Projects',
    generated: '02 Jun 2026',
    status: 'Draft',
    format: 'PDF',
    preparedBy: 'Carlos Bernal',
    coveragePeriod: 'Q2 2026',
    description: 'Per-project compliance posture across all live and pending offerings.',
    sections: ['Offering Status', 'Document Registry', 'Investor KYC Coverage'],
  },
  {
    id: 'RPT-2026-006',
    name: 'Audit Trail Summary',
    category: 'Audit',
    generated: '01 Jun 2026',
    status: 'Ready',
    format: 'ZIP',
    preparedBy: 'System',
    coveragePeriod: 'May 2026',
    description: 'Summary of administrative and compliance events recorded in the audit trail.',
    sections: ['Audit Events'],
  },
];

const OFFERINGS: ReadonlyArray<{ name: string; status: OfferingStatus }> = [
  { name: 'Madrid Prime Offices', status: 'Compliant' },
  { name: 'Valencia Logistics Hub', status: 'Review Required' },
  { name: 'Ibiza Luxury Villas', status: 'Pending Documentation' },
];

const JURISDICTIONS: ReadonlyArray<{ country: string; pct: number }> = [
  { country: 'Spain', pct: 46 },
  { country: 'Germany', pct: 22 },
  { country: 'Switzerland', pct: 15 },
  { country: 'Portugal', pct: 11 },
  { country: 'France', pct: 6 },
];

const ISSUES: ReadonlyArray<{ label: string; severity: Severity }> = [
  { label: '3 Investors with expired KYC', severity: 'High' },
  { label: '2 Projects missing documentation', severity: 'Medium' },
  { label: '1 Offering pending review', severity: 'Low' },
];

const EXPIRATIONS: ReadonlyArray<{
  document: string;
  project: string;
  date: string;
  status: ExpirationStatus;
}> = [
  {
    document: 'Property Valuation Report',
    project: 'Madrid Prime Offices',
    date: '28 Jun 2026',
    status: 'Expiring',
  },
  {
    document: 'Legal Opinion',
    project: 'Valencia Logistics Hub',
    date: '04 Jul 2026',
    status: 'Expiring',
  },
  {
    document: 'Corporate Registry Extract',
    project: 'Basel Riverside Offices',
    date: '19 Jul 2026',
    status: 'Valid',
  },
  {
    document: 'KYC Provider Certificate',
    project: 'Platform-wide',
    date: '10 Jun 2026',
    status: 'Expired',
  },
];

const READINESS: ReadonlyArray<{ label: string; score: number }> = [
  { label: 'Investor Verification', score: 97 },
  { label: 'Documentation', score: 88 },
  { label: 'Project Compliance', score: 92 },
  { label: 'Jurisdiction Controls', score: 95 },
  { label: 'Audit Coverage', score: 98 },
];

// ─── Badge style maps ─────────────────────────────────────────
const REPORT_STATUS_STYLES: Record<ReportStatus, string> = {
  Ready:
    'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50',
  Pending:
    'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  Draft:
    'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
};

const OFFERING_STATUS_STYLES: Record<OfferingStatus, string> = {
  Compliant:
    'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50',
  'Review Required':
    'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  'Pending Documentation':
    'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
};

const SEVERITY_STYLES: Record<Severity, string> = {
  High: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
  Medium:
    'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  Low: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
};

const EXPIRATION_STYLES: Record<ExpirationStatus, { cls: string; icon: React.ElementType }> = {
  Valid: {
    cls: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50',
    icon: CheckCircle2,
  },
  Expiring: {
    cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    icon: Clock,
  },
  Expired: {
    cls: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
    icon: AlertCircle,
  },
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

// ─── Horizontal bar ───────────────────────────────────────────
function Bar({ pct, tone = 'blue' }: { pct: number; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  const tones: Record<string, string> = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    amber: 'bg-amber-500',
    red: 'bg-red-600',
  };
  return (
    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <div className={`h-full rounded-full ${tones[tone]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

// ─── Report detail drawer ─────────────────────────────────────
function ReportDrawer({ report, onClose }: { report: RegulatoryReport; onClose: () => void }) {
  const rows: Array<[string, React.ReactNode]> = [
    ['Report ID', report.id],
    ['Generated Date', report.generated],
    ['Prepared By', report.preparedBy],
    ['Category', report.category],
    [
      'Status',
      <Badge key="s" className={REPORT_STATUS_STYLES[report.status]}>
        {report.status}
      </Badge>,
    ],
    ['Coverage Period', report.coveragePeriod],
  ];
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{report.name}</h3>
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
            <p className="text-sm text-gray-700 dark:text-gray-300">{report.description}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Included Sections</p>
            <ul className="space-y-1.5">
              {report.sections.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => toast.success(`${report.name} export generated.`)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Access-denied state ──────────────────────────────────────
function ComplianceDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 mb-5">
        <Lock className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        You don&apos;t have access to Compliance Reports
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
        The Compliance Reporting Center is available to Platform Admins and Compliance Officers.
        Contact your platform administrator if you need access.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function ComplianceReportsPage() {
  const { can } = usePermissions();
  const canView = can(Permission.COMPLIANCE_VIEW);
  const [selected, setSelected] = useState<RegulatoryReport | null>(null);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl w-full mx-auto">
          {/* Header + exports */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Compliance Reporting Center
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                  Monitor regulatory readiness, investor verification coverage and compliance status
                  across all projects.
                </p>
              </div>
            </div>

            {canView && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toast.success('Compliance report generated.')}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
                >
                  <ClipboardCheck className="w-4 h-4" /> Generate Compliance Report
                </button>
                <button
                  onClick={() => toast.success('PDF export generated.')}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" /> Export PDF
                </button>
                <button
                  onClick={() => toast.success('CSV export generated.')}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={() => toast.success('Compliance pack generated.')}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-colors"
                >
                  <FileArchive className="w-4 h-4" /> Export Compliance Pack
                </button>
              </div>
            )}
          </div>

          {!canView ? (
            <ComplianceDenied />
          ) : (
            <>
              {/* KPI section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                <KpiCard label="Verified Investors" value="1,248" icon={Users} tone="blue" />
                <KpiCard label="KYC Coverage" value="97.4%" icon={ShieldCheck} tone="green" />
                <KpiCard label="Active Projects" value="14" icon={Building2} tone="blue" />
                <KpiCard label="Compliance Score" value="94 / 100" icon={Gauge} tone="green" />
                <KpiCard
                  label="Documents Expiring Soon"
                  value="8"
                  icon={FileWarning}
                  tone="amber"
                />
                <KpiCard label="Open Compliance Issues" value="3" icon={AlertTriangle} tone="red" />
              </div>

              {/* Compliance overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Investor verification coverage */}
                <SectionCard title="Investor Verification Coverage">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Verified</span>
                        <span className="font-medium text-gray-900 dark:text-white">97.4%</span>
                      </div>
                      <Bar pct={97.4} tone="green" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Pending</span>
                        <span className="font-medium text-gray-900 dark:text-white">2.0%</span>
                      </div>
                      <Bar pct={2} tone="amber" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Rejected</span>
                        <span className="font-medium text-gray-900 dark:text-white">0.6%</span>
                      </div>
                      <Bar pct={0.6} tone="red" />
                    </div>
                  </div>
                </SectionCard>

                {/* Offering compliance status */}
                <SectionCard title="Offering Compliance Status">
                  <ul className="space-y-3">
                    {OFFERINGS.map((o) => (
                      <li key={o.name} className="flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {o.name}
                        </span>
                        <Badge className={OFFERING_STATUS_STYLES[o.status]}>{o.status}</Badge>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                {/* Jurisdiction distribution */}
                <SectionCard title="Jurisdiction Distribution">
                  <div className="space-y-3">
                    {JURISDICTIONS.map((j) => (
                      <div key={j.country}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{j.country}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {j.pct}%
                          </span>
                        </div>
                        <Bar pct={j.pct} tone="blue" />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>

              {/* Regulatory reports table */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Regulatory Reports
                </h2>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/60 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          <th className="px-4 py-3">Report Name</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Generated</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Format</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {REPORTS.map((r) => (
                          <tr
                            key={r.id}
                            onClick={() => setSelected(r)}
                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              {r.name}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {r.category}
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap tabular-nums">
                              {r.generated}
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={REPORT_STATUS_STYLES[r.status]}>{r.status}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                {r.format}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  setSelected(r);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Issues + Readiness */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Open compliance issues */}
                <SectionCard title="Open Compliance Issues">
                  <ul className="space-y-3">
                    {ISSUES.map((i) => (
                      <li
                        key={i.label}
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2.5"
                      >
                        <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <AlertTriangle className="w-4 h-4 text-gray-400 shrink-0" />
                          {i.label}
                        </span>
                        <Badge className={SEVERITY_STYLES[i.severity]}>{i.severity}</Badge>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                {/* Regulatory readiness score */}
                <SectionCard title="Regulatory Readiness Score">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">94</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/ 100</span>
                  </div>
                  <div className="space-y-3">
                    {READINESS.map((r) => (
                      <div key={r.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{r.label}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {r.score}
                          </span>
                        </div>
                        <Bar
                          pct={r.score}
                          tone={r.score >= 90 ? 'green' : r.score >= 75 ? 'blue' : 'amber'}
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>

              {/* Document expiration panel */}
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Upcoming Document Expirations
                </h2>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/60 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          <th className="px-4 py-3">Document</th>
                          <th className="px-4 py-3">Project</th>
                          <th className="px-4 py-3">Expiration Date</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {EXPIRATIONS.map((e) => {
                          const s = EXPIRATION_STYLES[e.status];
                          const Icon = s.icon;
                          return (
                            <tr
                              key={e.document}
                              className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                {e.document}
                              </td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                {e.project}
                              </td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap tabular-nums">
                                {e.date}
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={s.cls}>
                                  <Icon className="w-3 h-3" />
                                  {e.status}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {selected && <ReportDrawer report={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
