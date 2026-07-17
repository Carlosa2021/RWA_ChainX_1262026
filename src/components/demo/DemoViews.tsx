'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoViews — Sprint 11.0 Multi-Plan Demo Gateway
//
// Static, premium, plan-aware panels rendered inside the demo shell. Every
// write-like control routes through useDemoAction().simulate(...) and never
// reaches a real write path.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import {
  AlertTriangle,
  Activity,
  ChevronRight,
  ChevronLeft,
  Target,
  Lock,
  Plus,
  ShieldCheck,
  Download,
  Upload,
  Brain,
  Sparkles,
  ArrowLeftRight,
  Vault,
  Zap,
  Palette,
  FileSignature,
  Server,
  ScrollText,
  CheckSquare,
  CreditCard,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  Building2,
  MapPin,
  FileText,
  Check,
  Send,
  Mail,
  Smartphone,
  Monitor,
  Globe,
  BadgeCheck,
  Coins,
} from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';
import { useDemoGuide } from '@/contexts/DemoGuideContext';
import { useDemoAction } from '@/components/demo/DemoActionGuard';
import {
  getDemoDataset,
  DEMO_NEXT_ACTIONS,
  CAPITAL_RAISED_SERIES,
  INVESTOR_GROWTH_SERIES,
  MONTHLY_DISTRIBUTIONS,
  PORTFOLIO_ALLOCATION,
  JURISDICTION_DISTRIBUTION,
  KYC_STATUS,
  PORTFOLIO_HEALTH,
  PROJECT_DETAILS,
  AI_CONVERSATION,
  AI_SUGGESTED_PROMPTS,
  MERIDIAN,
  DemoProject,
} from '@/lib/demo/data';
import {
  AreaChart,
  BarChart,
  DonutChart,
  DistributionBars,
  ScoreGauge,
  Sparkline,
} from '@/components/demo/DemoCharts';
import { DemoView, unlockPlanLabel } from '@/lib/demo/navigation';
import { DemoActionId } from '@/lib/demo/guards';
import { DemoPlanFeatures } from '@/lib/demo/plans';
import { AnimatedNumber, Reveal } from '@/components/demo/DemoMotion';

// ─── Shared primitives ───────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</h3>;
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  );
}

function SimulatedButton({
  action,
  children,
  icon: Icon,
  variant = 'primary',
}: {
  action: DemoActionId;
  children: React.ReactNode;
  icon?: React.ElementType;
  variant?: 'primary' | 'secondary';
}) {
  const { simulate } = useDemoAction();
  const base =
    'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950';
  const styles =
    variant === 'primary'
      ? 'text-white bg-gray-900 hover:bg-gray-800 hover:shadow-md dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
      : 'text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 hover:shadow-sm dark:hover:bg-gray-800';
  return (
    <button onClick={() => simulate(action)} className={`${base} ${styles}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

function statusColor(status: string) {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400';
    case 'In Review':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
    case 'Closed':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    case 'Structuring':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
}

// ─── Premium primitives (Sprint 11.1) ────────────────────────────────────────

function Pill({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'positive' | 'brand' | 'light';
}) {
  const tones = {
    neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    positive: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    brand: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    light: 'bg-white/10 text-white',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function ExecLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
      {children}
    </p>
  );
}

function KpiCard({
  label,
  value,
  sub,
  trend,
  spark,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  spark?: number[];
}) {
  return (
    <Panel className="group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg dark:hover:border-gray-700">
      <div className="flex items-start justify-between">
        <ExecLabel>{label}</ExecLabel>
        {trend && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <AnimatedNumber value={value} />
      </p>
      <div className="mt-1 flex items-end justify-between">
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
        {spark && <Sparkline data={spark} className="h-7 w-16" />}
      </div>
    </Panel>
  );
}

function ChartCard({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Panel className="p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <SectionHeader>{title}</SectionHeader>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </Panel>
  );
}

// ─── Locked view (upgrade path) ──────────────────────────────────────────────

function LockedView({
  feature,
  title,
  description,
}: {
  feature: keyof DemoPlanFeatures;
  title: string;
  description: string;
}) {
  const planLabel = unlockPlanLabel(feature);
  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
            <Lock className="h-6 w-6" />
          </div>
          <div className="mt-4">
            <Pill tone="brand">
              <Sparkles className="h-3 w-3" />
              {planLabel} capability
            </Pill>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {description}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <a
              href="mailto:sales@chainx.ch?subject=Upgrade%20to%20ChainX%20Enterprise"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus-visible:ring-offset-gray-950"
            >
              Available in {planLabel}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="text-xs text-gray-400">Included in your licensed deployment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function DashboardView() {
  const { session } = useDemo();
  const { simulate } = useDemoAction();
  const data = getDemoDataset(session.plan);
  const nextActions = DEMO_NEXT_ACTIONS[session.plan];

  return (
    <div className="space-y-6">
      <PageTitle title="Executive Dashboard" subtitle={`${data.org.legalName} · ${data.org.hq}`} />

      {/* Portfolio hero — institutional executive summary */}
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-linear-to-br from-gray-900 via-gray-900 to-gray-950 p-6 text-white shadow-2xl ring-1 ring-white/5 sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl shadow-lg ring-1 ring-white/20"
                  style={{ backgroundColor: MERIDIAN.primaryColor }}
                >
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{data.org.legalName}</h3>
                  <p className="text-sm text-gray-400">
                    {data.org.hq} · Enterprise White-label Platform
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Portfolio Health · {PORTFOLIO_HEALTH.status}
                </span>
                {PORTFOLIO_HEALTH.badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-200 ring-1 ring-white/5"
                  >
                    <BadgeCheck className="h-3.5 w-3.5 text-blue-300" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl ring-1 ring-white/5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Assets Under Management
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                <AnimatedNumber value="€35.84M" />
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-gray-300">
                  <span className="font-semibold text-white">
                    <AnimatedNumber value="580" />
                  </span>{' '}
                  investors
                </span>
                <span className="text-gray-300">
                  <span className="font-semibold text-white">5</span> offerings
                </span>
                <span className="text-gray-300">
                  <span className="font-semibold text-white">
                    <AnimatedNumber value="8.4%" />
                  </span>{' '}
                  return
                </span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Premium KPI cards */}
      <Reveal delay={90} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Assets Under Management"
          value="€35.84M"
          sub="across 5 offerings"
          trend="22%"
          spark={CAPITAL_RAISED_SERIES.map((d) => d.value)}
        />
        <KpiCard
          label="Verified Investors"
          value="580"
          sub="unlimited"
          trend="13%"
          spark={INVESTOR_GROWTH_SERIES.map((d) => d.value)}
        />
        <KpiCard
          label="Avg Target Return"
          value="8.4%"
          sub="weighted"
          trend="0.6pp"
          spark={[7.6, 7.8, 8.0, 8.1, 8.3, 8.4]}
        />
        <KpiCard
          label="Monthly Distributions"
          value="€264K"
          sub="paid in June"
          trend="26%"
          spark={MONTHLY_DISTRIBUTIONS.map((d) => d.value)}
        />
      </Reveal>

      {/* Charts row */}
      <Reveal delay={150} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard
          title="Capital Raised"
          right={
            <Pill tone="positive">
              <TrendingUp className="h-3 w-3" /> €35.84M
            </Pill>
          }
        >
          <AreaChart data={CAPITAL_RAISED_SERIES} valuePrefix="€" valueSuffix="M" />
        </ChartCard>
        <ChartCard title="Investor Growth" right={<Pill tone="brand">+370 YTD</Pill>}>
          <BarChart data={INVESTOR_GROWTH_SERIES} color="#1e3a5f" />
        </ChartCard>
        <ChartCard title="Portfolio Allocation">
          <DonutChart data={PORTFOLIO_ALLOCATION} centerValue="€35.8M" centerLabel="AUM" />
        </ChartCard>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Requires attention */}
        <Panel className="p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <SectionHeader>Requires Attention</SectionHeader>
          </div>
          <div className="mt-4 space-y-3">
            {data.attention.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:border-gray-200 hover:bg-gray-50/60 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800/40"
              >
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    item.severity === 'high'
                      ? 'bg-red-500'
                      : item.severity === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Recommended next actions */}
        <Panel className="p-5">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" />
            <SectionHeader>Recommended Next Actions</SectionHeader>
          </div>
          <div className="mt-4 space-y-2">
            {nextActions.map((a) => (
              <button
                key={a.label}
                onClick={() => simulate(a.action)}
                className="group flex w-full items-center justify-between gap-2 rounded-xl border border-gray-100 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
              >
                <span className="text-sm text-gray-700 dark:text-gray-200">{a.label}</span>
                <ChevronRight
                  className="w-4 h-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {/* Recent activity */}
      <Panel className="p-5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-400" />
          <SectionHeader>Recent Activity</SectionHeader>
        </div>
        <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
          {data.activity.map((ev, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <span className="font-medium text-gray-900 dark:text-white">{ev.actor}</span>{' '}
                {ev.action}{' '}
                <span className="font-medium text-gray-900 dark:text-white">{ev.target}</span>
              </p>
              <span className="text-xs text-gray-400">{ev.time}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ─── Projects ────────────────────────────────────────────────────────────────

function ProjectsView() {
  const { session } = useDemo();
  const data = getDemoDataset(session.plan);
  const [selected, setSelected] = useState<DemoProject | null>(null);

  if (selected) {
    return <ProjectDetailView project={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <Reveal className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Projects" subtitle="Tokenized real estate offerings" />
        <SimulatedButton action="createProject" icon={Plus}>
          New Project
        </SimulatedButton>
      </div>
      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Progress</th>
                <th className="px-5 py-3 font-medium">Raised</th>
                <th className="px-5 py-3 font-medium">Target</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.projects.map((p) => (
                <tr
                  key={p.symbol}
                  onClick={() => setSelected(p)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected(p);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${p.name} investment overview`}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/60"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.symbol}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{p.location}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-1.5 rounded-full bg-gray-900 dark:bg-white"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                    {p.raised}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{p.targetReturn}</td>
                  <td className="px-5 py-3.5 text-right">
                    <ChevronRight
                      className="ml-auto h-4 w-4 text-gray-300 dark:text-gray-600"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <p className="text-xs text-gray-400">
        Select a project to open the full investment overview.
      </p>
    </Reveal>
  );
}

// ─── Project detail (drill-down) ─────────────────────────────────────────────

function ProjectDetailView({ project, onBack }: { project: DemoProject; onBack: () => void }) {
  const detail = PROJECT_DETAILS[project.symbol];

  return (
    <Reveal className="space-y-6">
      <button
        onClick={onBack}
        className="group inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:text-white dark:focus-visible:ring-offset-gray-950"
      >
        <ChevronLeft
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back to projects
      </button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(project.status)}`}
            >
              {project.status}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {project.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Coins className="h-3.5 w-3.5" />
              {project.symbol}
            </span>
            {detail && <span>{detail.assetType}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SimulatedButton action="signDocument" icon={FileSignature} variant="secondary">
            Sign Documents
          </SimulatedButton>
          <SimulatedButton action="executeDistribution" icon={Send}>
            Distribute
          </SimulatedButton>
        </div>
      </div>

      {/* Investment summary KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ['Hard Cap', detail?.hardCap ?? project.raised],
          ['Capital Raised', project.raised],
          ['Target Return', project.targetReturn],
          ['Investors', String(project.investors)],
        ].map(([label, value]) => (
          <Panel key={label} className="p-5">
            <ExecLabel>{label}</ExecLabel>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{value}</p>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Overview + funding */}
        <div className="space-y-6 lg:col-span-2">
          <Panel className="p-5">
            <SectionHeader>Overview</SectionHeader>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {detail?.summary ??
                'A tokenized real estate offering issued under the ERC-3643 security-token standard with built-in compliance controls.'}
            </p>
            {detail && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Token Price', detail.tokenPrice],
                  ['Total Tokens', detail.totalTokens],
                  ['Min Ticket', detail.minTicket],
                  ['Standard', 'ERC-3643'],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                  >
                    <p className="text-[11px] text-gray-400">{k}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between">
              <SectionHeader>Funding Progress</SectionHeader>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {project.progress}%
              </span>
            </div>
            <div className="mt-4 h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-3 rounded-full bg-linear-to-r from-blue-600 to-cyan-500"
                style={{ width: `${Math.max(project.progress, 2)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>{project.raised} raised</span>
              <span>{detail?.hardCap ?? '—'} hard cap</span>
            </div>
          </Panel>

          {/* Timeline */}
          {detail && (
            <Panel className="p-5">
              <SectionHeader>Property Timeline</SectionHeader>
              <div className="mt-4 space-y-4">
                {detail.timeline.map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          t.done
                            ? 'bg-emerald-500 text-white'
                            : 'border border-gray-300 bg-white text-gray-300 dark:border-gray-700 dark:bg-gray-900'
                        }`}
                      >
                        {t.done ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        )}
                      </span>
                      {i < detail.timeline.length - 1 && (
                        <span className="my-0.5 h-6 w-px bg-gray-200 dark:bg-gray-800" />
                      )}
                    </div>
                    <div className="pb-1">
                      <p
                        className={`text-sm font-medium ${t.done ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
                      >
                        {t.phase}
                      </p>
                      <p className="text-xs text-gray-400">{t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {detail && (
            <Panel className="p-5">
              {project.investors === 0 ? (
                <>
                  <SectionHeader>Target Investor Profile</SectionHeader>
                  <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-4 text-center dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Investor allocation not available yet
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Investor composition will appear after the offering opens and subscriptions
                      begin.
                    </p>
                  </div>
                  <p className="mt-4 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Target profile
                  </p>
                  <DonutChart data={detail.investorMix} size={116} thickness={14} />
                </>
              ) : (
                <>
                  <SectionHeader>Investor Distribution</SectionHeader>
                  <div className="mt-4">
                    <DonutChart data={detail.investorMix} size={116} thickness={14} />
                  </div>
                </>
              )}
            </Panel>
          )}

          {detail && (
            <Panel className="p-5">
              <SectionHeader>Latest Documents</SectionHeader>
              <div className="mt-3 space-y-1">
                {detail.documents.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {d.name}
                    </span>
                    <span className="text-xs text-gray-400">{d.date}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {detail && (
            <Panel className="p-5">
              <SectionHeader>Recent Activity</SectionHeader>
              <div className="mt-3 space-y-3">
                {detail.activity.map((ev, i) => (
                  <div key={i} className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-white">{ev.actor}</span>{' '}
                    {ev.action} {ev.target}
                    <span className="ml-1 text-xs text-gray-400">· {ev.time}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </Reveal>
  );
}

// ─── Investors ───────────────────────────────────────────────────────────────

function InvestorsView() {
  const { session } = useDemo();
  const data = getDemoDataset(session.plan);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Investors" subtitle="Verified investor base" />
        <SimulatedButton action="approveKyc" icon={ShieldCheck} variant="secondary">
          Approve KYC
        </SimulatedButton>
      </div>
      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Investor</th>
                <th className="px-5 py-3 font-medium">Country</th>
                <th className="px-5 py-3 font-medium">KYC</th>
                <th className="px-5 py-3 font-medium">Committed</th>
                <th className="px-5 py-3 font-medium">Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.investors.map((inv) => (
                <tr key={inv.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                    {inv.name}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{inv.country}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        inv.kyc === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : inv.kyc === 'Renewal'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {inv.kyc}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                    {inv.committed}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{inv.projects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ─── Documents ───────────────────────────────────────────────────────────────

const DOCS = [
  { name: 'Basel Riverside — Offering Memorandum.pdf', size: '2.4 MB', date: 'Jun 12' },
  { name: 'Zurich Residential — Subscription Agreement.pdf', size: '1.1 MB', date: 'Jun 09' },
  { name: 'Valencia Logistics — Q1 Distribution Report.pdf', size: '820 KB', date: 'May 30' },
  { name: 'Madrid Prime — Structuring Pack (Draft).pdf', size: '3.6 MB', date: 'May 24' },
];

function DocumentsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Documents" subtitle="Offering & compliance documents" />
        <SimulatedButton action="createProject" icon={Upload} variant="secondary">
          Upload Document
        </SimulatedButton>
      </div>
      <Panel className="divide-y divide-gray-100 dark:divide-gray-800">
        {DOCS.map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{d.name}</p>
              <p className="text-xs text-gray-400">
                {d.size} · {d.date}
              </p>
            </div>
            <SimulatedButton action="signDocument" variant="secondary" icon={FileSignature}>
              Sign
            </SimulatedButton>
          </div>
        ))}
      </Panel>
    </div>
  );
}

// ─── Analytics ───────────────────────────────────────────────────────────────

function AnalyticsView() {
  const { session } = useDemo();
  const data = getDemoDataset(session.plan);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Analytics" subtitle="Executive portfolio intelligence" />
        <SimulatedButton action="generateApiKey" icon={Download} variant="secondary">
          Export CSV
        </SimulatedButton>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Capital Deployed"
          value="€35.84M"
          sub="6-month trend"
          trend="22%"
          spark={CAPITAL_RAISED_SERIES.map((d) => d.value)}
        />
        <KpiCard
          label="Investor Growth"
          value="580"
          sub="verified"
          trend="13%"
          spark={INVESTOR_GROWTH_SERIES.map((d) => d.value)}
        />
        <KpiCard
          label="Distributions"
          value="€1.07M"
          sub="H1 2026"
          trend="26%"
          spark={MONTHLY_DISTRIBUTIONS.map((d) => d.value)}
        />
        <KpiCard
          label="Weighted Return"
          value="8.4%"
          sub="net of fees"
          trend="0.6pp"
          spark={[7.6, 7.8, 8.0, 8.1, 8.3, 8.4]}
        />
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Capital Deployment"
          right={
            <Pill tone="positive">
              <TrendingUp className="h-3 w-3" /> €35.84M
            </Pill>
          }
        >
          <AreaChart
            data={CAPITAL_RAISED_SERIES}
            stroke="#059669"
            fillFrom="rgba(5,150,105,0.18)"
            fillTo="rgba(5,150,105,0)"
            valuePrefix="€"
            valueSuffix="M"
          />
        </ChartCard>
        <ChartCard title="Monthly Distributions" right={<Pill tone="brand">€264K in June</Pill>}>
          <BarChart data={MONTHLY_DISTRIBUTIONS} color="#2563eb" valuePrefix="€" valueSuffix="K" />
        </ChartCard>
      </div>

      {/* Composition charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Portfolio Allocation">
          <DonutChart data={PORTFOLIO_ALLOCATION} centerValue="€35.8M" centerLabel="AUM" />
        </ChartCard>
        <ChartCard title="Jurisdiction Distribution">
          <DistributionBars data={JURISDICTION_DISTRIBUTION} />
        </ChartCard>
        <ChartCard title="KYC Status">
          <DonutChart data={KYC_STATUS} centerValue="580" centerLabel="investors" />
        </ChartCard>
      </div>

      {/* Capital by project + compliance score */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="p-5 lg:col-span-2">
          <SectionHeader>Capital Raised by Project</SectionHeader>
          <div className="mt-4 space-y-3">
            {data.projects.map((p) => (
              <div key={p.symbol} className="flex items-center gap-3">
                <span className="w-44 shrink-0 text-sm text-gray-600 dark:text-gray-300">
                  {p.name}
                </span>
                <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-2 rounded-full bg-linear-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400"
                    style={{ width: `${Math.max(p.progress, 4)}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm font-medium text-gray-900 dark:text-white">
                  {p.raised}
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="flex flex-col items-center justify-center p-5">
          <SectionHeader>Compliance Score</SectionHeader>
          <div className="mt-4">
            <ScoreGauge score={PORTFOLIO_HEALTH.score} label="MiCA · ERC-3643" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ─── AI Copilot ──────────────────────────────────────────────────────────────

function AICopilotView() {
  const [draft, setDraft] = useState('');
  const guide = useDemoGuide();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle title="AI Copilot" subtitle="Institutional portfolio intelligence" />
        <Pill tone="brand">
          <Sparkles className="h-3 w-3" />
          Institutional AI · Grounded on portfolio data
        </Pill>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chat transcript */}
        <Panel className="flex min-h-[560px] flex-col overflow-hidden lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 dark:border-gray-800">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
              <Brain className="h-4 w-4" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">ChainX Copilot</p>
              <p className="flex items-center gap-1 text-[11px] text-gray-400">
                <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                Online · Portfolio · Compliance · Reporting
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {AI_CONVERSATION.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-gray-900 px-4 py-2.5 text-sm text-white dark:bg-white dark:text-gray-900">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 text-white">
                    <Brain className="h-3.5 w-3.5" />
                  </span>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/40">
                    <p className="text-sm text-gray-700 dark:text-gray-200">{m.text}</p>
                    {m.bullets && (
                      <ul className="mt-2.5 space-y-1.5">
                        {m.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            )}
            {/* Idle typing affordance — purely decorative, no pending request */}
            <div className="flex gap-3" aria-hidden="true">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 text-white">
                <Brain className="h-3.5 w-3.5" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/40">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
              </div>
            </div>
          </div>

          {/* Composer (simulated — no network) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDraft('');
            }}
            className="border-t border-gray-100 p-3 dark:border-gray-800"
          >
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 transition-all focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500/30 dark:border-gray-800 dark:focus-within:border-gray-600">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask the Copilot about your portfolio…"
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              />
              <button
                type="submit"
                aria-label="Send message to the Copilot"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:focus-visible:ring-offset-gray-950"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[11px] text-gray-400">
              Demo preview · Illustrative output generated from static demo portfolio data. Not
              investment, legal or regulatory advice.
            </p>
          </form>
        </Panel>

        {/* Suggested prompts + capabilities */}
        <div className="space-y-6">
          <Panel className="p-5">
            <SectionHeader>Suggested Prompts</SectionHeader>
            <div className="mt-4 space-y-2">
              {AI_SUGGESTED_PROMPTS.map((q, i) => {
                const actionId = `ai-prompt-${i}`;
                const done = guide.isGuideActive && guide.isActionComplete(actionId);
                return (
                  <button
                    key={q}
                    onClick={() => {
                      setDraft(q);
                      if (guide.isGuideActive) guide.markActionComplete(actionId);
                    }}
                    className="group flex w-full items-center justify-between gap-2 rounded-xl border border-gray-100 p-3 text-left text-sm text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800/60 dark:focus-visible:ring-offset-gray-950"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {done && (
                        <Check
                          className="h-4 w-4 shrink-0 text-emerald-500"
                          aria-label="Prompt shown"
                        />
                      )}
                      <span className="truncate">{q}</span>
                    </span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </Panel>
          <Panel className="p-5">
            <SectionHeader>Capabilities</SectionHeader>
            <div className="mt-3 space-y-2">
              {[
                'Portfolio risk & concentration analysis',
                'Investor reporting & communications',
                'MiCA & ERC-3643 compliance guidance',
                'Executive summaries on demand',
              ].map((c) => (
                <div
                  key={c}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  {c}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ─── Branding ────────────────────────────────────────────────────────────────

function BrandingView() {
  const brandColor = MERIDIAN.primaryColor;
  const palette = [brandColor, '#2563eb', '#0891b2', '#7c3aed', '#059669'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Branding" subtitle="White-label investor portal configurator" />
        <SimulatedButton action="saveBranding" icon={Palette}>
          Save Branding
        </SimulatedButton>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Configurator */}
        <div className="space-y-6 lg:col-span-2">
          <Panel className="p-5">
            <SectionHeader>Identity</SectionHeader>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: brandColor }}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Logo</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    meridian-logo.svg
                  </p>
                </div>
                <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800">
                  <span
                    className="h-4 w-4 rounded-sm"
                    style={{ backgroundColor: brandColor }}
                    title="Favicon"
                  />
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Platform name</label>
                <div className="mt-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-800/40 dark:text-white">
                  {MERIDIAN.legalName}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Custom domain</label>
                <div className="mt-1 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-800/40 dark:text-white">
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    portal.{MERIDIAN.domain}
                  </span>
                  <SimulatedButton action="registerDomain" variant="secondary">
                    Verify
                  </SimulatedButton>
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <SectionHeader>Portal Colors</SectionHeader>
            <div className="mt-4 flex items-center gap-2">
              {palette.map((c, i) => (
                <span
                  key={c}
                  className={`h-9 w-9 cursor-pointer rounded-lg shadow-sm transition-transform duration-200 hover:scale-110 ${i === 0 ? 'ring-2 ring-gray-900 ring-offset-2 dark:ring-white dark:ring-offset-gray-900' : ''}`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">Primary · {brandColor}</p>
          </Panel>

          <Panel className="p-5">
            <SectionHeader>Email Branding</SectionHeader>
            <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
              <div
                className="flex items-center gap-2 px-4 py-2.5 text-white"
                style={{ backgroundColor: brandColor }}
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm font-semibold">{MERIDIAN.legalName}</span>
              </div>
              <div className="space-y-1 bg-white p-4 dark:bg-gray-900">
                <p className="text-sm text-gray-700 dark:text-gray-200">Dear investor,</p>
                <p className="text-xs text-gray-500">
                  Your Q2 distribution statement is now available in your portal.
                </p>
                <p className="pt-1 text-[11px] text-gray-400">ir@{MERIDIAN.domain}</p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Previews */}
        <div className="space-y-6 lg:col-span-3">
          <Panel className="p-5">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-gray-400" />
              <SectionHeader>Desktop Portal Preview</SectionHeader>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-shadow duration-200 hover:shadow-lg dark:border-gray-800">
              <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-800 dark:bg-gray-800">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] text-gray-400 dark:bg-gray-900">
                  <Lock className="h-2.5 w-2.5" />
                  portal.{MERIDIAN.domain}
                </span>
              </div>
              <div className="px-5 py-3 text-white" style={{ backgroundColor: brandColor }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{MERIDIAN.legalName}</span>
                  <span className="text-xs opacity-80">Investor Portal</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 bg-white p-5 dark:bg-gray-900">
                {[
                  ['AUM', '€35.84M'],
                  ['Investors', '580'],
                  ['Return', '8.4%'],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                  >
                    <p className="text-[10px] text-gray-400">{k}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{v}</p>
                  </div>
                ))}
                <div className="col-span-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Basel Riverside Offices
                  </p>
                  <p className="text-xs text-gray-500">Target return 7.9% · 80% funded</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: '80%', backgroundColor: brandColor }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-gray-400" />
              <SectionHeader>Mobile Preview</SectionHeader>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="relative w-56 overflow-hidden rounded-[1.75rem] border-4 border-gray-900 shadow-xl transition-shadow duration-200 hover:shadow-2xl dark:border-gray-700">
                <div className="absolute left-1/2 top-1.5 z-10 h-1 w-16 -translate-x-1/2 rounded-full bg-white/40" />
                <div className="px-4 py-3 text-white" style={{ backgroundColor: brandColor }}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="text-xs font-semibold">{MERIDIAN.legalName}</span>
                  </div>
                </div>
                <div className="space-y-2 bg-white p-3 dark:bg-gray-900">
                  <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800/60">
                    <p className="text-[10px] text-gray-400">Assets Under Management</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">€35.84M</p>
                  </div>
                  {['Basel Riverside Offices', 'Zurich Residential'].map((n) => (
                    <div
                      key={n}
                      className="rounded-lg border border-gray-100 p-2.5 dark:border-gray-800"
                    >
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{n}</p>
                      <div className="mt-1.5 h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-1 rounded-full"
                          style={{ width: '70%', backgroundColor: brandColor }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    className="w-full rounded-lg py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    Invest
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ─── Users & Roles ───────────────────────────────────────────────────────────

function UsersView() {
  const { session } = useDemo();
  const data = getDemoDataset(session.plan);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Users & Roles" subtitle="Team access management" />
        <SimulatedButton action="changeUserRole" icon={Plus} variant="secondary">
          Invite User
        </SimulatedButton>
      </div>
      <Panel className="divide-y divide-gray-100 dark:divide-gray-800">
        {data.team.map((m) => (
          <div
            key={m.email}
            className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</p>
              <p className="text-xs text-gray-400">{m.email}</p>
            </div>
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
              {m.role}
            </span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

// ─── API & Webhooks ──────────────────────────────────────────────────────────

function ApiView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="API & Webhooks" subtitle="Programmatic integrations" />
        <SimulatedButton action="generateApiKey" icon={Zap}>
          Generate API Key
        </SimulatedButton>
      </div>
      <Panel className="p-5">
        <SectionHeader>API Keys</SectionHeader>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 p-3 font-mono text-sm text-gray-600 dark:text-gray-300">
          <span>ck_live_••••••••••••••••3f9a</span>
          <span className="text-xs text-gray-400">Read / Write</span>
        </div>
      </Panel>
      <Panel className="p-5">
        <div className="flex items-center justify-between">
          <SectionHeader>Webhook Endpoints</SectionHeader>
          <SimulatedButton action="sendWebhook" variant="secondary">
            Send Test Event
          </SimulatedButton>
        </div>
        <div className="mt-4 space-y-2">
          {['investor.verified', 'offering.subscribed', 'distribution.executed'].map((ev) => (
            <div
              key={ev}
              className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 p-3"
            >
              <span className="text-sm text-gray-700 dark:text-gray-200">{ev}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">Active</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ─── Compliance / Approvals / Audit ──────────────────────────────────────────

function ComplianceView() {
  return (
    <div className="space-y-6">
      <PageTitle title="Compliance Reports" subtitle="Regulatory reporting" />
      <Panel className="divide-y divide-gray-100 dark:divide-gray-800">
        {[
          { name: 'Q2 Offering Summary', jur: 'Switzerland · MiCA', status: 'Ready' },
          { name: 'Investor Jurisdiction Breakdown', jur: 'EU', status: 'Ready' },
          { name: 'AML Screening Report', jur: 'Global', status: 'In Progress' },
        ].map((r) => (
          <div key={r.name} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</p>
              <p className="text-xs text-gray-400">{r.jur}</p>
            </div>
            <SimulatedButton action="generateApiKey" variant="secondary" icon={Download}>
              Export
            </SimulatedButton>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function ApprovalsView() {
  return (
    <div className="space-y-6">
      <PageTitle title="Approvals" subtitle="Governance workflow" />
      <Panel className="divide-y divide-gray-100 dark:divide-gray-800">
        {[
          { item: 'Madrid Prime Offices — open offering', by: 'Dr. Heinrich Müller' },
          { item: 'Valencia Logistics — Q2 distribution', by: 'Alexander Brandt' },
          { item: 'Delta Family Office — allocation increase', by: 'Sophia Meier' },
        ].map((a) => (
          <div key={a.item} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{a.item}</p>
              <p className="text-xs text-gray-400">Requested by {a.by}</p>
            </div>
            <div className="flex items-center gap-2">
              <SimulatedButton action="executeDistribution" variant="secondary">
                Approve
              </SimulatedButton>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function AuditTrailView() {
  const { session } = useDemo();
  const data = getDemoDataset(session.plan);
  return (
    <div className="space-y-6">
      <PageTitle title="Audit Trail" subtitle="Immutable action log" />
      <Panel className="divide-y divide-gray-100 dark:divide-gray-800">
        {data.activity.map((ev, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              <span className="font-medium text-gray-900 dark:text-white">{ev.actor}</span>{' '}
              {ev.action}{' '}
              <span className="font-medium text-gray-900 dark:text-white">{ev.target}</span>
            </p>
            <span className="text-xs text-gray-400">{ev.time}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

// ─── Simple placeholder-style operational views ──────────────────────────────

function KpiPlaceholder({
  title,
  subtitle,
  icon: Icon,
  action,
  actionLabel,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  action: DemoActionId;
  actionLabel: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title={title} subtitle={subtitle} />
        <SimulatedButton action={action} icon={Icon}>
          {actionLabel}
        </SimulatedButton>
      </div>
      <Panel className="p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
          <Icon className="w-6 h-6" />
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Interactive {title.toLowerCase()} module. In your licensed environment this operates with
          your own wallets, KYC provider and infrastructure.
        </p>
      </Panel>
    </div>
  );
}

// ─── View router ─────────────────────────────────────────────────────────────

export function DemoViewRenderer({ view }: { view: DemoView }) {
  const { config } = useDemo();
  const f = config.features;

  switch (view) {
    case 'dashboard':
      return <DashboardView />;
    case 'projects':
      return f.projects ? (
        <ProjectsView />
      ) : (
        <LockedView
          feature="projects"
          title="Projects"
          description="Manage tokenized real estate offerings end to end."
        />
      );
    case 'investors':
      return f.investors ? (
        <InvestorsView />
      ) : (
        <LockedView
          feature="investors"
          title="Investors"
          description="Manage your verified investor base and allocations."
        />
      );
    case 'documents':
      return f.documents ? (
        <DocumentsView />
      ) : (
        <LockedView
          feature="documents"
          title="Documents"
          description="Offering and compliance document management."
        />
      );
    case 'analytics':
      return f.advancedAnalytics ? (
        <AnalyticsView />
      ) : (
        <LockedView
          feature="advancedAnalytics"
          title="Advanced Analytics"
          description="Portfolio-wide performance analytics and exports."
        />
      );
    case 'aiCopilot':
      return f.aiCopilot ? (
        <AICopilotView />
      ) : (
        <LockedView
          feature="aiCopilot"
          title="AI Copilot"
          description="Institutional portfolio intelligence and drafting."
        />
      );
    case 'branding':
      return f.fullBranding ? (
        <BrandingView />
      ) : (
        <LockedView
          feature="fullBranding"
          title="White-Label Branding"
          description="Fully brand the investor portal with your identity and domain."
        />
      );
    case 'users':
      return f.usersAndRoles ? (
        <UsersView />
      ) : (
        <LockedView
          feature="usersAndRoles"
          title="Users & Roles"
          description="Multi-user team access with role-based controls."
        />
      );
    case 'api':
      return f.api ? (
        <ApiView />
      ) : (
        <LockedView
          feature="api"
          title="API & Webhooks"
          description="Programmatic access and event webhooks for automation."
        />
      );
    case 'compliance':
      return f.complianceReports ? (
        <ComplianceView />
      ) : (
        <LockedView
          feature="complianceReports"
          title="Compliance Reports"
          description="Operational regulatory reporting and exports."
        />
      );
    case 'approvals':
      return f.approvals ? (
        <ApprovalsView />
      ) : (
        <LockedView
          feature="approvals"
          title="Approvals"
          description="Governance approval workflows for critical actions."
        />
      );
    case 'auditTrail':
      return f.auditTrail ? (
        <AuditTrailView />
      ) : (
        <LockedView
          feature="auditTrail"
          title="Audit Trail"
          description="Immutable log of every critical action."
        />
      );
    case 'payments':
      return f.payments ? (
        <KpiPlaceholder
          title="Pay"
          subtitle="Fiat on-ramp & distributions"
          icon={CreditCard}
          action="executeDistribution"
          actionLabel="New Distribution"
        />
      ) : (
        <LockedView
          feature="payments"
          title="Pay"
          description="Fiat on-ramp and investor distributions."
        />
      );
    case 'withdrawals':
      return f.payments ? (
        <KpiPlaceholder
          title="Withdrawals"
          subtitle="Investor withdrawals"
          icon={TrendingDown}
          action="withdrawFunds"
          actionLabel="Process Withdrawal"
        />
      ) : (
        <LockedView
          feature="payments"
          title="Withdrawals"
          description="Manage investor withdrawal requests."
        />
      );
    case 'bridge':
      return f.bridge ? (
        <KpiPlaceholder
          title="Bridge"
          subtitle="Cross-chain asset transfers"
          icon={ArrowLeftRight}
          action="bridgeAssets"
          actionLabel="Bridge Assets"
        />
      ) : (
        <LockedView
          feature="bridge"
          title="Bridge"
          description="Cross-chain asset transfers for multi-network operations."
        />
      );
    case 'vault':
      return f.vault ? (
        <KpiPlaceholder
          title="Vault"
          subtitle="Secure custody controls"
          icon={Vault}
          action="connectVault"
          actionLabel="Connect Vault"
        />
      ) : (
        <LockedView
          feature="vault"
          title="Vault"
          description="Institutional secure custody with dedicated controls."
        />
      );
    case 'mica':
      return f.micaReporting ? (
        <KpiPlaceholder
          title="MiCA Reporting"
          subtitle="Advanced regulatory reporting"
          icon={ScrollText}
          action="generateApiKey"
          actionLabel="Generate Report"
        />
      ) : (
        <LockedView
          feature="micaReporting"
          title="Advanced MiCA Reporting"
          description="Advanced MiCA white-paper and regulatory reporting."
        />
      );
    case 'signature':
      return f.digitalSignature ? (
        <KpiPlaceholder
          title="Digital Signature"
          subtitle="Qualified electronic signatures"
          icon={FileSignature}
          action="signDocument"
          actionLabel="Start Signing"
        />
      ) : (
        <LockedView
          feature="digitalSignature"
          title="Digital Signature"
          description="Qualified electronic signatures for offering documents."
        />
      );
    case 'infrastructure':
      return f.dedicatedInfrastructure ? (
        <KpiPlaceholder
          title="Dedicated Infrastructure"
          subtitle="Isolated, high-availability deployment"
          icon={Server}
          action="connectVault"
          actionLabel="View Nodes"
        />
      ) : (
        <LockedView
          feature="dedicatedInfrastructure"
          title="Dedicated Infrastructure"
          description="Isolated infrastructure with dedicated support and SLA."
        />
      );
    case 'kyc':
      return (
        <KpiPlaceholder
          title="KYC Verification"
          subtitle="Investor onboarding"
          icon={ShieldCheck}
          action="approveKyc"
          actionLabel="Review Queue"
        />
      );
    case 'issuer':
      return (
        <KpiPlaceholder
          title="Issuer Setup"
          subtitle="Configure your issuing entity"
          icon={CheckSquare}
          action="createProject"
          actionLabel="Deploy Token"
        />
      );
    case 'wallet':
      return <WalletPreviewView />;
    case 'account':
      return <AccountView />;
    default:
      return <DashboardView />;
  }
}

// ─── Wallet preview & account (no real wallet) ───────────────────────────────

function WalletPreviewView() {
  return (
    <div className="space-y-6">
      <PageTitle title="Wallet Preview" subtitle="Simulated treasury overview" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <p className="text-xs text-gray-500">Treasury Balance</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">€35.84M</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-xs text-gray-500">Tokens Issued</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">4.12M</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-xs text-gray-500">Active Wallets</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">580</p>
        </Panel>
      </div>
      <Panel className="p-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This is a simulated treasury view. No wallet is connected and no real balances are shown.
          In your licensed environment this reflects your own on-chain wallets.
        </p>
      </Panel>
    </div>
  );
}

function AccountView() {
  const { config } = useDemo();
  return (
    <div className="space-y-6">
      <PageTitle title="Account" subtitle="Demo session details" />
      <Panel className="p-5 space-y-3">
        {[
          ['Organisation', 'Meridian Capital AG'],
          ['Plan', config.label],
          ['Role', 'Client Admin (demo)'],
          ['Mode', 'View-only · No wallet required'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{k}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{v}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}
