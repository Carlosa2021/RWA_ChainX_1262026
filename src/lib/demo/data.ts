// ─────────────────────────────────────────────────────────────────────────────
// ChainX® Demo Data — Sprint 11.0 Multi-Plan Demo Gateway
//
// Static, typed demo fixtures for a single coherent story: Meridian Capital AG.
// NO production records, NO real customer data, NO env, NO network calls.
//
// The same organisation is presented at different maturity levels per plan:
//   • starter    → reduced footprint (max 3 projects, smaller investor base)
//   • business   → full operating platform (5 projects, advanced tooling)
//   • enterprise → same org, higher governance / regulated maturity
// ─────────────────────────────────────────────────────────────────────────────

import { DemoPlan } from '@/lib/demo/plans';
import { DemoActionId } from '@/lib/demo/guards';

export interface DemoProject {
  name: string;
  symbol: string;
  location: string;
  status: 'Active' | 'In Review' | 'Closed' | 'Structuring';
  progress: number; // 0–100
  raised: string; // formatted EUR
  targetReturn: string;
  investors: number;
}

export interface DemoInvestor {
  name: string;
  country: string;
  kyc: 'Verified' | 'Pending' | 'Renewal';
  committed: string;
  projects: number;
}

export interface DemoActivity {
  actor: string;
  action: string;
  target: string;
  time: string;
}

export interface DemoAttentionItem {
  title: string;
  detail: string;
  severity: 'high' | 'medium' | 'low';
}

export interface DemoKpi {
  label: string;
  value: string;
  sub?: string;
}

export interface DemoTeamMember {
  name: string;
  role: string;
  email: string;
}

// ─── Organisation ────────────────────────────────────────────────────────────

export const MERIDIAN = {
  legalName: 'Meridian Capital AG',
  hq: 'Basel, Switzerland',
  domain: 'meridian-capital.ch',
  primaryColor: '#1e3a5f',
} as const;

// ─── Full project catalogue (Business / Enterprise) ──────────────────────────

const ALL_PROJECTS: DemoProject[] = [
  {
    name: 'Basel Riverside Offices',
    symbol: 'BROFFICE',
    location: 'Basel, CH',
    status: 'Active',
    progress: 80,
    raised: '€14.80M',
    targetReturn: '7.9%',
    investors: 168,
  },
  {
    name: 'Zurich Residential Portfolio',
    symbol: 'ZHRESID',
    location: 'Zurich, CH',
    status: 'Active',
    progress: 60,
    raised: '€7.32M',
    targetReturn: '6.4%',
    investors: 142,
  },
  {
    name: 'Madrid Prime Offices',
    symbol: 'MADRPRIME',
    location: 'Madrid, ES',
    status: 'In Review',
    progress: 16,
    raised: '€3.92M',
    targetReturn: '8.8%',
    investors: 74,
  },
  {
    name: 'Valencia Logistics Hub',
    symbol: 'VALHUB',
    location: 'Valencia, ES',
    status: 'Closed',
    progress: 100,
    raised: '€9.80M',
    targetReturn: '9.1%',
    investors: 196,
  },
  {
    name: 'Ibiza Luxury Villas',
    symbol: 'IBZVILLAS',
    location: 'Ibiza, ES',
    status: 'Structuring',
    progress: 0,
    raised: '€0.00M',
    targetReturn: '10.2%',
    investors: 0,
  },
];

// ─── Investors ───────────────────────────────────────────────────────────────

const ALL_INVESTORS: DemoInvestor[] = [
  {
    name: 'Helvetia Pension Fund',
    country: 'Switzerland',
    kyc: 'Verified',
    committed: '€4.20M',
    projects: 4,
  },
  {
    name: 'Delta Family Office',
    country: 'Germany',
    kyc: 'Verified',
    committed: '€2.85M',
    projects: 3,
  },
  {
    name: 'Nordic Wealth Partners',
    country: 'Sweden',
    kyc: 'Verified',
    committed: '€1.95M',
    projects: 2,
  },
  {
    name: 'Iberia Private Capital',
    country: 'Spain',
    kyc: 'Renewal',
    committed: '€1.40M',
    projects: 2,
  },
  {
    name: 'Alpine Asset Managers',
    country: 'Switzerland',
    kyc: 'Verified',
    committed: '€1.10M',
    projects: 3,
  },
  {
    name: 'Meridian Retail Investors',
    country: 'Multiple',
    kyc: 'Pending',
    committed: '€0.62M',
    projects: 1,
  },
];

// ─── Activity feed ───────────────────────────────────────────────────────────

const ALL_ACTIVITY: DemoActivity[] = [
  {
    actor: 'Claudia Reyes',
    action: 'approved KYC for',
    target: 'Delta Family Office',
    time: '2h ago',
  },
  {
    actor: 'Alexander Brandt',
    action: 'published distribution for',
    target: 'Valencia Logistics Hub',
    time: '5h ago',
  },
  {
    actor: 'Sophia Meier',
    action: 'invited 12 investors to',
    target: 'Basel Riverside Offices',
    time: '1d ago',
  },
  {
    actor: 'Marc Torres',
    action: 'updated structuring docs for',
    target: 'Ibiza Luxury Villas',
    time: '2d ago',
  },
  {
    actor: 'Dr. Heinrich Müller',
    action: 'opened offering for',
    target: 'Madrid Prime Offices',
    time: '3d ago',
  },
];

// ─── Attention panel ─────────────────────────────────────────────────────────

const ALL_ATTENTION: DemoAttentionItem[] = [
  {
    title: 'Zurich Residential — 2 KYC renewals',
    detail:
      'Two institutional investors require re-verification before the next allocation window.',
    severity: 'high',
  },
  {
    title: 'Valencia Logistics — Q2 distribution',
    detail: 'Quarterly distribution is staged and awaiting compliance sign-off.',
    severity: 'medium',
  },
  {
    title: 'Ibiza Villas — structuring documents',
    detail: 'Legal structuring pack is 60% complete for the upcoming offering.',
    severity: 'low',
  },
];

// ─── Team ────────────────────────────────────────────────────────────────────

export const MERIDIAN_TEAM: DemoTeamMember[] = [
  {
    name: 'Dr. Heinrich Müller',
    role: 'Chief Executive Officer',
    email: 'ceo@meridian-capital.ch',
  },
  { name: 'Claudia Reyes', role: 'Compliance Officer', email: 'compliance@meridian-capital.ch' },
  { name: 'Alexander Brandt', role: 'Chief Financial Officer', email: 'cfo@meridian-capital.ch' },
  { name: 'Sophia Meier', role: 'Investor Relations', email: 'ir@meridian-capital.ch' },
  { name: 'Marc Torres', role: 'Project Manager', email: 'projects@meridian-capital.ch' },
];

// ─── Per-plan dataset assembly ───────────────────────────────────────────────

export interface DemoDataset {
  org: typeof MERIDIAN;
  kpis: DemoKpi[];
  projects: DemoProject[];
  investors: DemoInvestor[];
  activity: DemoActivity[];
  attention: DemoAttentionItem[];
  team: DemoTeamMember[];
}

const STARTER_KPIS: DemoKpi[] = [
  { label: 'Active Projects', value: '2', sub: 'of 3 included' },
  { label: 'Capital Raised', value: '€22.1M', sub: 'across 2 offerings' },
  { label: 'Verified Investors', value: '310', sub: 'of 500 included' },
  { label: 'Avg Target Return', value: '7.2%', sub: 'weighted' },
];

const BUSINESS_KPIS: DemoKpi[] = [
  { label: 'Active Projects', value: '5', sub: 'unlimited' },
  { label: 'Capital Raised', value: '€35.84M', sub: 'across 5 offerings' },
  { label: 'Verified Investors', value: '580', sub: 'unlimited' },
  { label: 'Avg Target Return', value: '8.4%', sub: 'weighted' },
];

const ENTERPRISE_KPIS: DemoKpi[] = [
  { label: 'Active Projects', value: '5', sub: 'multi-jurisdiction' },
  { label: 'Capital Raised', value: '€35.84M', sub: 'MiCA-reported' },
  { label: 'Verified Investors', value: '580', sub: 'governed onboarding' },
  { label: 'Avg Target Return', value: '8.4%', sub: 'weighted' },
];

export function getDemoDataset(plan: DemoPlan): DemoDataset {
  if (plan === 'starter') {
    return {
      org: MERIDIAN,
      kpis: STARTER_KPIS,
      projects: ALL_PROJECTS.filter((p) => p.status !== 'Structuring').slice(0, 3),
      investors: ALL_INVESTORS.slice(0, 4),
      activity: ALL_ACTIVITY.slice(0, 3),
      attention: ALL_ATTENTION.slice(0, 2),
      team: MERIDIAN_TEAM.slice(0, 2),
    };
  }

  if (plan === 'enterprise') {
    return {
      org: MERIDIAN,
      kpis: ENTERPRISE_KPIS,
      projects: ALL_PROJECTS,
      investors: ALL_INVESTORS,
      activity: ALL_ACTIVITY,
      attention: ALL_ATTENTION,
      team: MERIDIAN_TEAM,
    };
  }

  // business
  return {
    org: MERIDIAN,
    kpis: BUSINESS_KPIS,
    projects: ALL_PROJECTS,
    investors: ALL_INVESTORS,
    activity: ALL_ACTIVITY,
    attention: ALL_ATTENTION,
    team: MERIDIAN_TEAM,
  };
}

// ─── Recommended next actions (dashboard) ────────────────────────────────────

export interface DemoNextAction {
  label: string;
  action: DemoActionId;
}

export const DEMO_NEXT_ACTIONS: Record<DemoPlan, DemoNextAction[]> = {
  starter: [
    { label: 'Complete KYC review for 3 pending investors', action: 'approveKyc' },
    { label: 'Publish the Basel Riverside Offices update note', action: 'executeDistribution' },
    { label: 'Invite investors to the next allocation window', action: 'createProject' },
  ],
  business: [
    { label: 'Approve Q2 distribution for Valencia Logistics Hub', action: 'executeDistribution' },
    { label: 'Review AI Copilot portfolio risk summary', action: 'approveKyc' },
    { label: 'Finalise white-label branding for the investor portal', action: 'saveBranding' },
  ],
  enterprise: [
    { label: 'Generate MiCA compliance report for Q2 offerings', action: 'generateApiKey' },
    { label: 'Route Madrid Prime Offices for governance approval', action: 'signDocument' },
    { label: 'Schedule digital signature ceremony for structuring docs', action: 'signDocument' },
  ],
};

// ─── Static chart datasets (no libraries, no fetching) ───────────────────────

export interface DemoSeriesPoint {
  label: string;
  value: number;
}

export interface DemoSegment {
  label: string;
  value: number;
  color: string;
}

/** Cumulative capital raised (€M) over the last 6 months. */
export const CAPITAL_RAISED_SERIES: DemoSeriesPoint[] = [
  { label: 'Jan', value: 8.2 },
  { label: 'Feb', value: 12.6 },
  { label: 'Mar', value: 17.1 },
  { label: 'Apr', value: 22.9 },
  { label: 'May', value: 29.4 },
  { label: 'Jun', value: 35.84 },
];

/** Cumulative verified investors over the last 6 months. */
export const INVESTOR_GROWTH_SERIES: DemoSeriesPoint[] = [
  { label: 'Jan', value: 210 },
  { label: 'Feb', value: 288 },
  { label: 'Mar', value: 356 },
  { label: 'Apr', value: 431 },
  { label: 'May', value: 512 },
  { label: 'Jun', value: 580 },
];

/** Monthly distributions to investors (€K). */
export const MONTHLY_DISTRIBUTIONS: DemoSeriesPoint[] = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 145 },
  { label: 'Mar', value: 138 },
  { label: 'Apr', value: 190 },
  { label: 'May', value: 210 },
  { label: 'Jun', value: 264 },
];

/** Portfolio allocation by asset type (%). */
export const PORTFOLIO_ALLOCATION: DemoSegment[] = [
  { label: 'Office', value: 52, color: '#1e3a5f' },
  { label: 'Residential', value: 20, color: '#2563eb' },
  { label: 'Logistics', value: 21, color: '#0891b2' },
  { label: 'Hospitality', value: 7, color: '#7c3aed' },
];

/** Investor jurisdiction distribution (%). */
export const JURISDICTION_DISTRIBUTION: DemoSegment[] = [
  { label: 'Switzerland', value: 61, color: '#1e3a5f' },
  { label: 'Spain', value: 27, color: '#2563eb' },
  { label: 'Germany', value: 7, color: '#0891b2' },
  { label: 'Other EU', value: 5, color: '#94a3b8' },
];

/** KYC status breakdown (investor counts). */
export const KYC_STATUS: DemoSegment[] = [
  { label: 'Verified', value: 542, color: '#059669' },
  { label: 'Renewal', value: 26, color: '#d97706' },
  { label: 'Pending', value: 12, color: '#64748b' },
];

/** Executive health indicators shown in the portfolio hero. */
export const PORTFOLIO_HEALTH = {
  status: 'Excellent',
  score: 94,
  badges: ['MiCA Ready', 'ERC-3643 Compliant', 'Infrastructure Operational'],
} as const;

// ─── Project detail fixtures (drill-down) ────────────────────────────────────

export interface DemoTimelinePhase {
  phase: string;
  date: string;
  done: boolean;
}

export interface DemoProjectDetail {
  summary: string;
  assetType: string;
  hardCap: string;
  minTicket: string;
  tokenPrice: string;
  totalTokens: string;
  timeline: DemoTimelinePhase[];
  documents: { name: string; date: string }[];
  activity: DemoActivity[];
  investorMix: DemoSegment[];
}

const DEFAULT_TIMELINE = (opts: {
  structuring: boolean;
  live: boolean;
  closed: boolean;
}): DemoTimelinePhase[] => [
  { phase: 'Asset onboarding & due diligence', date: 'Q4 2025', done: true },
  {
    phase: 'Legal structuring & SPV setup',
    date: 'Q1 2026',
    done: opts.structuring || opts.live || opts.closed,
  },
  { phase: 'Token issuance (ERC-3643)', date: 'Q1 2026', done: opts.live || opts.closed },
  { phase: 'Primary offering open', date: 'Q2 2026', done: opts.live || opts.closed },
  { phase: 'Offering fully subscribed', date: 'Q3 2026', done: opts.closed },
];

export const PROJECT_DETAILS: Record<string, DemoProjectDetail> = {
  BROFFICE: {
    summary:
      'Prime riverside office complex in Basel with long-term institutional tenants and strong ESG credentials. Fully permitted and income-producing.',
    assetType: 'Commercial Office',
    hardCap: '€18.50M',
    minTicket: '€25,000',
    tokenPrice: '€100.00',
    totalTokens: '185,000',
    timeline: DEFAULT_TIMELINE({ structuring: true, live: true, closed: false }),
    documents: [
      { name: 'Offering Memorandum.pdf', date: 'Jun 12' },
      { name: 'Independent Valuation Report.pdf', date: 'Jun 05' },
      { name: 'ESG Assessment.pdf', date: 'May 28' },
    ],
    activity: [
      {
        actor: 'Sophia Meier',
        action: 'invited 12 investors to',
        target: 'the offering',
        time: '1d ago',
      },
      {
        actor: 'Alexander Brandt',
        action: 'updated the cap table for',
        target: 'the SPV',
        time: '3d ago',
      },
    ],
    investorMix: [
      { label: 'Institutional', value: 58, color: '#1e3a5f' },
      { label: 'Family Office', value: 27, color: '#2563eb' },
      { label: 'Professional', value: 15, color: '#0891b2' },
    ],
  },
  ZHRESID: {
    summary:
      'Diversified residential portfolio across Zurich with high occupancy and stable rental yield. Positioned for steady income and inflation hedging.',
    assetType: 'Residential',
    hardCap: '€12.20M',
    minTicket: '€10,000',
    tokenPrice: '€50.00',
    totalTokens: '244,000',
    timeline: DEFAULT_TIMELINE({ structuring: true, live: true, closed: false }),
    documents: [
      { name: 'Subscription Agreement.pdf', date: 'Jun 09' },
      { name: 'Rent Roll & Occupancy.pdf', date: 'Jun 01' },
    ],
    activity: [
      {
        actor: 'Claudia Reyes',
        action: 'flagged 2 KYC renewals for',
        target: 'the portfolio',
        time: '4h ago',
      },
      {
        actor: 'Marc Torres',
        action: 'published a quarterly update for',
        target: 'investors',
        time: '2d ago',
      },
    ],
    investorMix: [
      { label: 'Institutional', value: 41, color: '#1e3a5f' },
      { label: 'Family Office', value: 34, color: '#2563eb' },
      { label: 'Professional', value: 25, color: '#0891b2' },
    ],
  },
  MADRPRIME: {
    summary:
      'Flagship prime office asset in central Madrid entering primary offering. High target return with strong location fundamentals and refurbishment upside.',
    assetType: 'Commercial Office',
    hardCap: '€24.50M',
    minTicket: '€50,000',
    tokenPrice: '€100.00',
    totalTokens: '245,000',
    timeline: DEFAULT_TIMELINE({ structuring: true, live: true, closed: false }),
    documents: [
      { name: 'Structuring Pack (Draft).pdf', date: 'May 24' },
      { name: 'Market Study — Madrid CBD.pdf', date: 'May 20' },
    ],
    activity: [
      {
        actor: 'Dr. Heinrich Müller',
        action: 'opened the offering for',
        target: 'the asset',
        time: '3d ago',
      },
    ],
    investorMix: [
      { label: 'Institutional', value: 62, color: '#1e3a5f' },
      { label: 'Family Office', value: 22, color: '#2563eb' },
      { label: 'Professional', value: 16, color: '#0891b2' },
    ],
  },
  VALHUB: {
    summary:
      'Fully subscribed logistics hub serving the Valencia corridor. Long leases to blue-chip tenants; entering the distribution phase.',
    assetType: 'Logistics',
    hardCap: '€9.80M',
    minTicket: '€10,000',
    tokenPrice: '€50.00',
    totalTokens: '196,000',
    timeline: DEFAULT_TIMELINE({ structuring: true, live: true, closed: true }),
    documents: [
      { name: 'Q1 Distribution Report.pdf', date: 'May 30' },
      { name: 'Lease Portfolio Summary.pdf', date: 'May 18' },
    ],
    activity: [
      {
        actor: 'Alexander Brandt',
        action: 'staged the Q2 distribution for',
        target: 'the hub',
        time: '5h ago',
      },
    ],
    investorMix: [
      { label: 'Institutional', value: 49, color: '#1e3a5f' },
      { label: 'Family Office', value: 29, color: '#2563eb' },
      { label: 'Professional', value: 22, color: '#0891b2' },
    ],
  },
  IBZVILLAS: {
    summary:
      'Luxury villa development in Ibiza in the structuring phase. Premium hospitality asset with a strong pre-launch pipeline of interested investors.',
    assetType: 'Hospitality',
    hardCap: '€6.50M',
    minTicket: '€50,000',
    tokenPrice: '€100.00',
    totalTokens: '65,000',
    timeline: DEFAULT_TIMELINE({ structuring: true, live: false, closed: false }),
    documents: [{ name: 'Structuring Pack (Draft).pdf', date: 'May 24' }],
    activity: [
      {
        actor: 'Marc Torres',
        action: 'updated structuring docs for',
        target: 'the development',
        time: '2d ago',
      },
    ],
    investorMix: [
      { label: 'Institutional', value: 35, color: '#1e3a5f' },
      { label: 'Family Office', value: 45, color: '#2563eb' },
      { label: 'Professional', value: 20, color: '#0891b2' },
    ],
  },
};

// ─── AI Copilot scripted conversation (fully simulated, no AI calls) ─────────

export interface DemoChatMessage {
  role: 'user' | 'assistant';
  text: string;
  bullets?: string[];
}

export const AI_SUGGESTED_PROMPTS: string[] = [
  'Show projects needing attention',
  'Generate quarterly investor report',
  'Explain MiCA compliance',
  'Summarize portfolio risk',
  'Show investors with expired KYC',
  'Generate executive dashboard',
];

export const AI_CONVERSATION: DemoChatMessage[] = [
  {
    role: 'user',
    text: 'Show projects needing attention',
  },
  {
    role: 'assistant',
    text: 'Three offerings currently require action across the Meridian portfolio:',
    bullets: [
      'Zurich Residential Portfolio — 2 institutional investors need KYC renewal before the next allocation window.',
      'Valencia Logistics Hub — Q2 distribution is staged and awaiting compliance sign-off.',
      'Ibiza Luxury Villas — structuring pack is 60% complete ahead of a Q3 launch.',
    ],
  },
  {
    role: 'user',
    text: 'Summarize portfolio risk',
  },
  {
    role: 'assistant',
    text: 'Overall risk profile is low-to-moderate with a portfolio health score of 94/100. Key observations:',
    bullets: [
      'Concentration is balanced: 52% office, 21% logistics, 20% residential, 7% hospitality.',
      'Geographic exposure is 61% Switzerland and 27% Spain — well within mandate limits.',
      'Liquidity is strong; the only near-term item is the pending Q2 distribution sign-off.',
    ],
  },
];
