'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import {
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Settings,
  BarChart3,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  Plus,
  AlertTriangle,
  Target,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  color = 'purple',
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: string;
  color?: 'purple' | 'green' | 'blue' | 'amber';
}) {
  const colors = {
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  };
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2 rounded-xl ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <ArrowUpRight className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          <span className="text-xs text-green-600 dark:text-green-400">{trend}</span>
        </div>
      )}
    </div>
  );
}

// ─── Campaign Status Badge ────────────────────────────────────
// Capital markets vocabulary (replaces generic "Activa/Borrador")
function StatusBadge({ status }: { status: 'active' | 'pending' | 'closed' | 'draft' }) {
  const map = {
    active: {
      label: 'Open for Subscription',
      cls: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    },
    pending: { label: 'In Review', cls: 'bg-amber-950 text-amber-400 border-amber-800' },
    closed: { label: 'Closed', cls: 'bg-gray-900 text-gray-500 border-gray-800' },
    draft: { label: 'In Structuring', cls: 'bg-gray-900 text-gray-400 border-gray-700' },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${cls}`}>{label}</span>
  );
}

// ─── Mock Data ───────────────────────────────────────────────
const mockCampaigns = [
  {
    id: 1,
    name: 'Basel Riverside Offices',
    location: 'Basel, Switzerland',
    totalValue: '18.500.000',
    raised: '14.800.000',
    raisedPct: 80,
    investors: 84,
    apy: '8.2',
    status: 'active' as const,
    tokenSymbol: 'BROFFICE',
    deadline: '2026-09-30',
  },
  {
    id: 2,
    name: 'Zurich Residential Portfolio',
    location: 'Zurich, Switzerland',
    totalValue: '12.200.000',
    raised: '7.320.000',
    raisedPct: 60,
    investors: 156,
    apy: '6.8',
    status: 'active' as const,
    tokenSymbol: 'ZHRESID',
    deadline: '2026-11-15',
  },
  {
    id: 3,
    name: 'Madrid Prime Offices',
    location: 'Madrid, Spain',
    totalValue: '24.500.000',
    raised: '3.920.000',
    raisedPct: 16,
    investors: 28,
    apy: '7.5',
    status: 'pending' as const,
    tokenSymbol: 'MADRPRIME',
    deadline: '2027-03-01',
  },
  {
    id: 4,
    name: 'Valencia Logistics Hub',
    location: 'Valencia, Spain',
    totalValue: '9.800.000',
    raised: '9.800.000',
    raisedPct: 100,
    investors: 312,
    apy: '9.1',
    status: 'closed' as const,
    tokenSymbol: 'VALHUB',
    deadline: '2025-12-15',
  },
  {
    id: 5,
    name: 'Ibiza Luxury Villas',
    location: 'Ibiza, Spain',
    totalValue: '6.500.000',
    raised: '0',
    raisedPct: 0,
    investors: 0,
    apy: '11.2',
    status: 'draft' as const,
    tokenSymbol: 'IBZVILLAS',
    deadline: '2026-12-31',
  },
];

const mockActivity = [
  {
    type: 'investment',
    text: 'New subscription €50,000 — Basel Riverside Offices · R. Zimmermann (CH)',
    time: '14 min ago',
    icon: DollarSign,
  },
  {
    type: 'kyc',
    text: 'Identity verified — Lars Petersen (DK) via Sumsub · wallet 0x1b2c...8c',
    time: '52 min ago',
    icon: CheckCircle2,
  },
  {
    type: 'investment',
    text: 'New subscription €25,000 — Zurich Residential Portfolio · C. Beaumont (FR)',
    time: '2h 08min ago',
    icon: DollarSign,
  },
  {
    type: 'system',
    text: 'Q1 2026 distribution processed · €142,500 across 2 offerings to 396 token holders',
    time: '6h ago',
    icon: Zap,
  },
  {
    type: 'kyc',
    text: 'KYC renewal required — H.-P. Vogt (CH) · expiry 30 Apr 2026',
    time: '1 day ago',
    icon: AlertCircle,
  },
  {
    type: 'document',
    text: 'RICS Valuation Report uploaded — Madrid Prime Offices (v2.0, 4.7 MB)',
    time: '2 days ago',
    icon: CheckCircle2,
  },
];

// ─── Main Component ───────────────────────────────────────────
export default function OnboardingDashboardPage() {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Projects Management"
          subtitle="Meridian Capital AG · Digital securities issuance and lifecycle · ERC-3643"
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats — 🟡 DEMO DATA (replace with real blockchain reads in production) */}
          {/* PHASE 2 INSERTION POINT: replace mock values with useProjects() + useVerifiedWallets() */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Executive Portfolio Summary */}
            <div className="col-span-full bg-gray-900 dark:bg-gray-950 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-8">
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                      Meridian Capital AG
                    </span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Q2 2026</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-900/40 border border-emerald-800/60 text-emerald-400 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />2 Active
                    </span>
                  </div>
                  <p className="text-white font-semibold text-lg leading-snug">
                    Portfolio performing above benchmark · €35.84M raised across 5 offerings
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">
                    580 verified investors · 8.1% avg. target return · Polygon Mainnet · ERC-3643
                  </p>
                </div>
                <div className="hidden md:block text-right shrink-0">
                  <p className="text-3xl font-bold text-white">68%</p>
                  <p className="text-xs text-gray-500 mt-0.5">Overall funded</p>
                  <div className="w-28 h-1.5 bg-gray-800 rounded-full mt-2 ml-auto">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>
            </div>
            <StatCard
              label="Active Projects"
              value="2"
              sub="1 in review · 1 in structuring"
              icon={Building2}
              color="blue"
            />
            <StatCard
              label="Capital Raised"
              value="€35,840,000"
              sub="Across 5 offerings · Basel, Zurich, Madrid"
              icon={DollarSign}
              trend="+€1.2M this month"
              color="green"
            />
            <StatCard
              label="Verified Investors"
              value="580"
              sub="Identity verified (KYC) · ERC-3643"
              icon={Users}
              trend="+23 this week"
              color="blue"
            />
            <StatCard
              label="Avg. Target Return"
              value="8.1% p.a."
              sub="Issuer projection · not guaranteed"
              icon={TrendingUp}
              color="amber"
            />
          </div>

          {/* Requires Attention */}
          <div className="bg-amber-950/10 dark:bg-amber-950/20 border border-amber-900/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-amber-400">Requires Attention</h2>
              <span className="ml-auto text-xs text-amber-600 font-medium">
                3 items · action required
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  text: 'KYC Expired — Hans-Peter Vogt (CH) · Token transfers suspended since 30 Apr 2026',
                  action: 'Renew KYC',
                  level: 'high',
                },
                {
                  text: 'Insurance Certificate expired — Madrid Prime Offices · Renewal overdue since 01 Jun 2026',
                  action: 'Upload',
                  level: 'high',
                },
                {
                  text: 'AML/KYC Annual Declaration 2026 — Missing · Required before Q3 distribution',
                  action: 'Upload',
                  level: 'medium',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-amber-950/10 border border-amber-900/20"
                >
                  <AlertCircle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      item.level === 'high' ? 'text-red-400' : 'text-amber-400'
                    }`}
                  />
                  <p className="text-xs text-gray-300 flex-1 leading-relaxed">{item.text}</p>
                  <button className="shrink-0 text-xs font-medium text-amber-400 hover:text-amber-300 border border-amber-900/50 hover:border-amber-700 px-2.5 py-1 rounded-lg transition-colors">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Campaigns table */}
          <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/60 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">Projects</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Digital securities on Polygon Mainnet · ERC-3643
                </p>
              </div>
              <Link
                href="/onboarding"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> New Project
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    {[
                      'Project',
                      'Capital Raised',
                      'Investors',
                      'Target Return',
                      'Status',
                      'Closing Date',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800/60">
                  {mockCampaigns.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {c.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {c.location} · {c.tokenSymbol}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-900 dark:text-white">
                              €{c.raised}
                            </span>
                            <span className="text-xs text-gray-500">{c.raisedPct}%</span>
                          </div>
                          <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-900 dark:bg-white rounded-full"
                              style={{ width: `${c.raisedPct}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">of €{c.totalValue}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {c.investors}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {c.apy}% p.a.
                          </span>
                          <p className="text-xs text-gray-600">issuer projection</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(c.deadline).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {mockActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                      act.type === 'investment'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : act.type === 'kyc'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : act.type === 'document'
                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <act.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{act.text}</p>
                    <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Actions */}
          <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/60 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recommended Next Actions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  title: 'Process Q2 2026 Distribution',
                  desc: '€198,500 ready for 580 token holders · Basel Riverside + Valencia Hub · Pending sign-off',
                  cta: 'Process Now',
                },
                {
                  title: 'Activate Madrid Prime Subscription',
                  desc: 'Legal opinion received · 2 compliance docs pending sign-off · €20.58M remaining target',
                  cta: 'Review',
                },
                {
                  title: 'Complete Ibiza Luxury Villas Onboarding',
                  desc: 'In structuring · RICS valuation required · Launch target Q4 2026 · 11.2% target return',
                  cta: 'Continue',
                },
              ].map((action, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {action.title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{action.desc}</p>
                  <button className="mt-3 text-xs font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors">
                    {action.cta} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
