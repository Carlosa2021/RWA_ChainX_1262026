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
    purple: 'text-purple-400 bg-purple-900/30 border-purple-700/30',
    green: 'text-green-400 bg-green-900/30 border-green-700/30',
    blue: 'text-blue-400 bg-blue-900/30 border-blue-700/30',
    amber: 'text-amber-400 bg-amber-900/30 border-amber-700/30',
  };
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <div className={`p-2 rounded-lg border ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs text-green-400">{trend}</span>
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
    name: 'Torre Oficinas Madrid Centro',
    location: 'Madrid, España',
    totalValue: '2.500.000',
    raised: '1.875.000',
    raisedPct: 75,
    investors: 42,
    apy: '7.5',
    status: 'active' as const,
    tokenSymbol: 'MADROFFICE',
    deadline: '2026-09-30',
  },
  {
    id: 2,
    name: 'Residencial Costa Brava',
    location: 'Girona, España',
    totalValue: '1.200.000',
    raised: '360.000',
    raisedPct: 30,
    investors: 18,
    apy: '6.2',
    status: 'active' as const,
    tokenSymbol: 'CBRAVA',
    deadline: '2026-10-15',
  },
  {
    id: 3,
    name: 'Centro Comercial Valencia',
    location: 'Valencia, España',
    totalValue: '5.000.000',
    raised: '0',
    raisedPct: 0,
    investors: 0,
    apy: '8.1',
    status: 'draft' as const,
    tokenSymbol: 'VALCOM',
    deadline: '2026-12-01',
  },
];

const mockActivity = [
  {
    type: 'investment',
    text: 'Nueva inversión de €2.500 en Torre Oficinas',
    time: 'Hace 12 min',
    icon: DollarSign,
  },
  {
    type: 'kyc',
    text: 'Inversor 0x3f4a...verificado por KYC',
    time: 'Hace 45 min',
    icon: CheckCircle2,
  },
  {
    type: 'investment',
    text: 'Nueva inversión de €500 en Residencial Costa Brava',
    time: 'Hace 1h 20min',
    icon: DollarSign,
  },
  { type: 'kyc', text: 'KYC rechazado: documento expirado', time: 'Hace 2h', icon: AlertCircle },
  {
    type: 'system',
    text: 'Distribución trimestral enviada a 60 inversores',
    time: 'Hace 3h',
    icon: Zap,
  },
];

// ─── Main Component ───────────────────────────────────────────
export default function OnboardingDashboardPage() {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Projects Management"
          subtitle="Digital securities issuance and lifecycle · ERC-3643 compliant"
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats — 🟡 DEMO DATA (replace with real blockchain reads in production) */}
          {/* PHASE 2 INSERTION POINT: replace mock values with useProjects() + useVerifiedWallets() */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* DEMO badge — visible indicator that data is illustrative */}
            <div className="col-span-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 w-fit">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Demo Data
              </span>
              <span className="text-xs text-gray-600">
                · Sample values for illustration. No live data displayed.
              </span>
            </div>
            <StatCard
              label="Active Projects"
              value="2"
              sub="1 in structuring"
              icon={Building2}
              color="blue"
            />
            <StatCard
              label="Capital Raised"
              value="€2.235.000"
              sub="Across 3 projects"
              icon={DollarSign}
              trend="+12% this month"
              color="green"
            />
            <StatCard
              label="Verified Investors"
              value="60"
              sub="Identity verified (KYC)"
              icon={Users}
              trend="+8 this week"
              color="blue"
            />
            <StatCard
              label="Avg. Target Return"
              value="7.1% p.a."
              sub="Issuer projection · not guaranteed"
              icon={TrendingUp}
              color="amber"
            />
          </div>

          {/* Campaigns table */}
          <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div>
                <h2 className="font-semibold text-white">Projects</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Digital securities on Polygon Mainnet · ERC-3643
                </p>
              </div>
              <Link
                href="/onboarding"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> New Project
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
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
                <tbody className="divide-y divide-gray-800/60">
                  {mockCampaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">{c.name}</p>
                          <p className="text-xs text-gray-500">
                            {c.location} · {c.tokenSymbol}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-white">€{c.raised}</span>
                            <span className="text-xs text-gray-500">{c.raisedPct}%</span>
                          </div>
                          <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${c.raisedPct}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">de €{c.totalValue}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{c.investors}</td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-sm text-gray-300 font-medium">{c.apy}% p.a.</span>
                          <p className="text-xs text-gray-600">issuer projection</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(c.deadline).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-500 hover:text-purple-400 hover:bg-gray-800 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-gray-800 rounded-lg transition-colors">
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
          <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Actividad reciente</h2>
            <div className="space-y-3">
              {mockActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                      act.type === 'investment'
                        ? 'bg-green-900/30 text-green-400'
                        : act.type === 'kyc'
                          ? 'bg-purple-900/30 text-purple-400'
                          : 'bg-blue-900/30 text-blue-400'
                    }`}
                  >
                    <act.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">{act.text}</p>
                    <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
