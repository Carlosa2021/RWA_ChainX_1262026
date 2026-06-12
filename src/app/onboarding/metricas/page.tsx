'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Wallet,
  PieChart,
  Activity,
  Zap,
} from 'lucide-react';

type Period = '7d' | '30d' | '90d' | '1y';

function MiniChart({ values, color = 'blue' }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const h = 48;
  const w = 100;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  const colorMap: Record<string, string> = {
    purple: '#a855f7',
    green: '#22c55e',
    blue: '#3b82f6',
    amber: '#f59e0b',
  };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={colorMap[color] || colorMap.purple}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KPICard({
  label,
  value,
  trend,
  trendPositive,
  sub,
  chartValues,
  color = 'blue',
  icon: Icon,
}: {
  label: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
  sub?: string;
  chartValues?: number[];
  color?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <div
          className={`p-2 rounded-lg ${
            {
              purple: 'bg-blue-900/30 text-blue-400',
              green: 'bg-green-900/30 text-green-400',
              blue: 'bg-blue-900/30 text-blue-400',
              amber: 'bg-amber-900/30 text-amber-400',
            }[color] || 'bg-gray-800 text-gray-400'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-500 mb-2">{sub}</p>}
      {trend && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${trendPositive ? 'text-green-400' : 'text-red-400'}`}
        >
          {trendPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {trend}
        </div>
      )}
      {chartValues && (
        <div className="mt-3">
          <MiniChart values={chartValues} color={color} />
        </div>
      )}
    </div>
  );
}

const investmentHistory = [
  120000, 145000, 138000, 165000, 178000, 210000, 235000, 198000, 245000, 268000, 290000, 310000,
];
const investorGrowth = [8, 12, 15, 18, 22, 25, 28, 32, 38, 45, 52, 60];
const apyPerf = [6.8, 7.0, 7.1, 7.2, 7.0, 7.3, 7.4, 7.2, 7.5, 7.4, 7.6, 7.5];
const conversionRate = [38, 42, 45, 41, 48, 52, 49, 55, 58, 54, 61, 65];

const distributionHistory = [
  {
    date: 'Q1 2026',
    amount: '€18.750',
    investors: 42,
    campaign: 'Torre Oficinas',
    status: 'completed',
  },
  {
    date: 'Q4 2025',
    amount: '€15.200',
    investors: 38,
    campaign: 'Torre Oficinas',
    status: 'completed',
  },
  {
    date: 'Q3 2025',
    amount: '€12.400',
    investors: 31,
    campaign: 'Torre Oficinas',
    status: 'completed',
  },
  {
    date: 'Jun 2026',
    amount: '€3.720',
    investors: 18,
    campaign: 'Costa Brava',
    status: 'scheduled',
  },
];

const campaignMetrics = [
  {
    name: 'Torre Oficinas Madrid',
    raised: 1875000,
    target: 2500000,
    investors: 42,
    apy: 7.5,
    distributed: 46350,
    convRate: 65,
  },
  {
    name: 'Residencial Costa Brava',
    raised: 360000,
    target: 1200000,
    investors: 18,
    apy: 6.2,
    distributed: 3720,
    convRate: 41,
  },
];

export default function MetricasPage() {
  const [period, setPeriod] = useState<Period>('30d');

  const periods: { id: Period; label: string }[] = [
    { id: '7d', label: '7 días' },
    { id: '30d', label: '30 días' },
    { id: '90d', label: '90 días' },
    { id: '1y', label: '1 año' },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Analytics & Reporting"
          subtitle="Portfolio performance, asset distributions and MiCA compliance reporting"
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* DEMO badge — PHASE 2: replace mock data with blockchain event reads + InvestmentController */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-fit">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Demo Data
            </span>
            <span className="text-xs text-gray-600">
              · Sample metrics for illustration. No live data displayed.
            </span>
          </div>

          {/* Period selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    period === p.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/60 transition-colors">
              <Download className="w-3.5 h-3.5" /> Exportar informe MiCA
            </button>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              label="Capital Raised"
              value="€2.235.000"
              sub="Total committed"
              trend="+€87.000 this period"
              trendPositive
              chartValues={investmentHistory}
              color="purple"
              icon={DollarSign}
            />
            <KPICard
              label="Verified Participants"
              value="60"
              sub="Identity verified (KYC)"
              trend="+8 new"
              trendPositive
              chartValues={investorGrowth}
              color="blue"
              icon={Users}
            />
            <KPICard
              label="Avg. Target Return (p.a.)"
              value="7.1%"
              sub="Issuer projection · not guaranteed"
              trend="+0.3% vs prior period"
              trendPositive
              chartValues={apyPerf}
              color="green"
              icon={TrendingUp}
            />
            <KPICard
              label="Conversion Rate"
              value="65%"
              sub="Sessions → subscriptions"
              trend="+4% vs prior period"
              trendPositive
              chartValues={conversionRate}
              color="amber"
              icon={Activity}
            />
          </div>

          {/* Campaign performance */}
          <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/60 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Offering Performance</h2>
            </div>
            <div className="p-6 space-y-5">
              {campaignMetrics.map((c) => (
                <div key={c.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
                      <p className="text-xs text-gray-500">
                        {c.investors} participants · Target {c.apy}% p.a. · Distributed: €
                        {c.distributed.toLocaleString('es-ES')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        €{c.raised.toLocaleString('es-ES')}
                      </p>
                      <p className="text-xs text-gray-500">
                        de €{c.target.toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Recaudación</span>
                      <span>{Math.round((c.raised / c.target) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(c.raised / c.target) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Conversion', value: `${c.convRate}%`, color: 'text-amber-400' },
                      {
                        label: 'Avg. Ticket',
                        value: `€${Math.round(c.raised / (c.investors || 1)).toLocaleString('es-ES')}`,
                        color: 'text-blue-400',
                      },
                      {
                        label: 'Distributed',
                        value: `€${c.distributed.toLocaleString('es-ES')}`,
                        color: 'text-emerald-400',
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-2.5 text-center"
                      >
                        <p className={`text-sm font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution history */}
          <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/60 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500 dark:text-green-400" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Distribution History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    {['Period', 'Offering', 'Total Amount', 'Participants', 'Status'].map((h) => (
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
                  {distributionHistory.map((d, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-sm text-gray-900 dark:text-white">{d.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {d.campaign}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-sm font-semibold text-green-400">{d.amount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {d.investors}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                            d.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : 'bg-blue-950 text-blue-400 border-blue-800'
                          }`}
                        >
                          {d.status === 'completed' ? 'Completed' : 'Scheduled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MiCA compliance summary */}
          <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/60 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <h2 className="font-semibold text-gray-900 dark:text-white">
                MiCA Compliance Summary
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Inversores UE', value: '100%', status: 'ok' },
                { label: 'KYC completado', value: '93.3%', status: 'ok' },
                { label: 'Docs. actualizados', value: '85.7%', status: 'warning' },
                { label: 'Whitepaper publicado', value: 'Sí', status: 'ok' },
              ].map(({ label, value, status }) => (
                <div
                  key={label}
                  className={`rounded-xl p-3 border text-center ${
                    status === 'ok'
                      ? 'bg-green-900/10 border-green-700/30'
                      : 'bg-amber-900/10 border-amber-700/30'
                  }`}
                >
                  <p
                    className={`text-lg font-bold ${status === 'ok' ? 'text-green-400' : 'text-amber-400'}`}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
