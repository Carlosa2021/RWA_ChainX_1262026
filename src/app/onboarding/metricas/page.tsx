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
  2400000, 4800000, 7200000, 9800000, 13500000, 17200000, 21400000, 25100000, 28700000, 31900000,
  34200000, 35840000,
];
const investorGrowth = [28, 54, 89, 134, 198, 245, 312, 378, 442, 510, 552, 580];
const apyPerf = [8.1, 8.2, 8.1, 8.3, 8.4, 8.2, 8.5, 8.4, 8.3, 8.6, 8.5, 8.4];
const conversionRate = [48, 52, 55, 58, 61, 59, 64, 67, 65, 69, 71, 71];

const distributionHistory = [
  {
    date: 'Q2 2026',
    amount: '€198,500',
    investors: 580,
    campaign: 'All offerings',
    status: 'scheduled',
  },
  {
    date: 'Q1 2026',
    amount: '€184,200',
    investors: 540,
    campaign: 'Basel Riverside + Valencia Hub',
    status: 'completed',
  },
  {
    date: 'Q4 2025',
    amount: '€156,800',
    investors: 412,
    campaign: 'Basel Riverside + Valencia Hub',
    status: 'completed',
  },
  {
    date: 'Q3 2025',
    amount: '€89,400',
    investors: 198,
    campaign: 'Valencia Hub',
    status: 'completed',
  },
];

const campaignMetrics = [
  {
    name: 'Basel Riverside Offices',
    raised: 14800000,
    target: 18500000,
    investors: 84,
    apy: 8.2,
    distributed: 892400,
    convRate: 71,
  },
  {
    name: 'Zurich Residential Portfolio',
    raised: 7320000,
    target: 12200000,
    investors: 156,
    apy: 6.8,
    distributed: 248880,
    convRate: 68,
  },
  {
    name: 'Madrid Prime Offices',
    raised: 3920000,
    target: 24500000,
    investors: 28,
    apy: 7.5,
    distributed: 73500,
    convRate: 41,
  },
  {
    name: 'Valencia Logistics Hub',
    raised: 9800000,
    target: 9800000,
    investors: 312,
    apy: 9.1,
    distributed: 1424200,
    convRate: 89,
  },
];

export default function MetricasPage() {
  const [period, setPeriod] = useState<Period>('30d');

  const periods: { id: Period; label: string }[] = [
    { id: '7d', label: '7 days' },
    { id: '30d', label: '30 days' },
    { id: '90d', label: '90 days' },
    { id: '1y', label: '1 year' },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Analytics & Reporting"
          subtitle="Meridian Capital AG · Portfolio performance, asset distributions and MiCA compliance reporting"
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Executive Portfolio Narrative */}
          <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/60 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-1 self-stretch bg-gray-900 dark:bg-white rounded-full shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Portfolio Performance Summary · Q2 2026
                </p>
                <p className="text-gray-900 dark:text-white font-semibold text-base leading-relaxed">
                  Meridian Capital AG has raised €35.84M across 5 tokenized offerings over 10 months
                  — growing from 28 to 580 verified investors across 8 jurisdictions. Average target
                  return is 8.4% p.a. Q1 2026 distributions of €184,200 were processed successfully
                  to 540 investors. Q2 distribution of €198,500 is ready pending sign-off.
                </p>
              </div>
              <div className="hidden md:flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">€629,300</p>
                  <p className="text-xs text-gray-500">Total distributed</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-500">8.4%</p>
                  <p className="text-xs text-gray-500">Avg. return</p>
                </div>
              </div>
            </div>
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
              <Download className="w-3.5 h-3.5" /> Export MiCA Report
            </button>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              label="Capital Raised"
              value="€35,840,000"
              sub="Total committed across 5 offerings"
              trend="+€1.64M this period"
              trendPositive
              chartValues={investmentHistory}
              color="purple"
              icon={DollarSign}
            />
            <KPICard
              label="Verified Participants"
              value="580"
              sub="Identity verified (KYC) · ERC-3643"
              trend="+23 new"
              trendPositive
              chartValues={investorGrowth}
              color="blue"
              icon={Users}
            />
            <KPICard
              label="Avg. Target Return (p.a.)"
              value="8.4%"
              sub="Issuer projection · not guaranteed"
              trend="+0.1% vs prior period"
              trendPositive
              chartValues={apyPerf}
              color="green"
              icon={TrendingUp}
            />
            <KPICard
              label="Conversion Rate"
              value="71%"
              sub="Sessions → subscriptions"
              trend="+2% vs prior period"
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
                        {c.distributed.toLocaleString('en-GB')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        €{c.raised.toLocaleString('en-GB')}
                      </p>
                      <p className="text-xs text-gray-500">
                        of €{c.target.toLocaleString('en-GB')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Capital Raised</span>
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
                        value: `€${Math.round(c.raised / (c.investors || 1)).toLocaleString('en-GB')}`,
                        color: 'text-blue-400',
                      },
                      {
                        label: 'Distributed',
                        value: `€${c.distributed.toLocaleString('en-GB')}`,
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
                { label: 'EU Investors', value: '100%', status: 'ok' },
                { label: 'KYC Completed', value: '95.8%', status: 'ok' },
                { label: 'Docs Up-to-Date', value: '83.3%', status: 'warning' },
                { label: 'Whitepaper Published', value: 'Yes', status: 'ok' },
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
