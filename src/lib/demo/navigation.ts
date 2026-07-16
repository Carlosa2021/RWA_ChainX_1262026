// ─────────────────────────────────────────────────────────────────────────────
// ChainX® Demo Navigation — Sprint 11.0 Multi-Plan Demo Gateway
//
// Central, typed navigation model per plan. Drives the demo shell sidebar via
// client-side VIEW switching (no real sub-routes → route count stays minimal).
//
// Locked items are shown tastefully where commercially useful, with the minimum
// plan required to unlock them, so prospects see the upgrade path.
// ─────────────────────────────────────────────────────────────────────────────

import {
  LayoutDashboard,
  Wallet,
  ShieldCheck,
  User,
  Rocket,
  Building2,
  Users,
  FileText,
  BarChart3,
  CreditCard,
  ArrowLeftRight,
  Brain,
  Palette,
  History,
  CheckSquare,
  ClipboardCheck,
  Zap,
  Vault,
  FileSignature,
  Server,
  TrendingDown,
  ScrollText,
} from 'lucide-react';
import { DemoPlan, DemoPlanFeatures, DEMO_PLANS, requiredDemoPlanFor } from '@/lib/demo/plans';

/** Internal view identifier rendered inside the demo shell. */
export type DemoView =
  | 'dashboard'
  | 'wallet'
  | 'kyc'
  | 'withdrawals'
  | 'account'
  | 'issuer'
  | 'projects'
  | 'investors'
  | 'documents'
  | 'analytics'
  | 'payments'
  | 'bridge'
  | 'aiCopilot'
  | 'users'
  | 'branding'
  | 'auditTrail'
  | 'approvals'
  | 'compliance'
  | 'api'
  | 'vault'
  | 'mica'
  | 'signature'
  | 'infrastructure';

export interface DemoNavItem {
  view: DemoView;
  label: string;
  icon: React.ElementType;
  /** Feature that gates this item. If absent, always available. */
  feature?: keyof DemoPlanFeatures;
}

export interface DemoNavSection {
  label: string;
  items: DemoNavItem[];
}

// Master catalogue of every possible navigation entry.
const PLATFORM: DemoNavItem[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'wallet', label: 'Wallet Preview', icon: Wallet },
  { view: 'kyc', label: 'KYC Verification', icon: ShieldCheck, feature: 'kyc' },
  { view: 'withdrawals', label: 'Withdrawals', icon: TrendingDown, feature: 'payments' },
  { view: 'account', label: 'Account', icon: User },
];

const ASSETS: DemoNavItem[] = [
  { view: 'issuer', label: 'Issuer Setup', icon: Rocket, feature: 'projects' },
  { view: 'projects', label: 'Projects', icon: Building2, feature: 'projects' },
  { view: 'investors', label: 'Investors', icon: Users, feature: 'investors' },
  { view: 'documents', label: 'Documents', icon: FileText, feature: 'documents' },
  { view: 'analytics', label: 'Analytics', icon: BarChart3, feature: 'advancedAnalytics' },
];

const INFRASTRUCTURE: DemoNavItem[] = [
  { view: 'payments', label: 'Pay', icon: CreditCard, feature: 'payments' },
  { view: 'bridge', label: 'Bridge', icon: ArrowLeftRight, feature: 'bridge' },
  { view: 'aiCopilot', label: 'AI Copilot', icon: Brain, feature: 'aiCopilot' },
  { view: 'vault', label: 'Vault', icon: Vault, feature: 'vault' },
  { view: 'api', label: 'API & Webhooks', icon: Zap, feature: 'api' },
];

const ORGANIZATION: DemoNavItem[] = [
  { view: 'users', label: 'Users & Roles', icon: Users, feature: 'usersAndRoles' },
  { view: 'branding', label: 'Branding', icon: Palette, feature: 'fullBranding' },
  { view: 'auditTrail', label: 'Audit Trail', icon: History, feature: 'auditTrail' },
  { view: 'approvals', label: 'Approvals', icon: CheckSquare, feature: 'approvals' },
  {
    view: 'compliance',
    label: 'Compliance Reports',
    icon: ClipboardCheck,
    feature: 'complianceReports',
  },
];

const GOVERNANCE: DemoNavItem[] = [
  { view: 'mica', label: 'MiCA Reporting', icon: ScrollText, feature: 'micaReporting' },
  {
    view: 'signature',
    label: 'Digital Signature',
    icon: FileSignature,
    feature: 'digitalSignature',
  },
  {
    view: 'infrastructure',
    label: 'Dedicated Infrastructure',
    icon: Server,
    feature: 'dedicatedInfrastructure',
  },
];

/**
 * Which locked (feature-gated) items are worth surfacing per plan to show the
 * commercial upgrade path without overloading the lower tiers.
 */
const STARTER_LOCK_TEASERS: DemoView[] = ['aiCopilot', 'bridge', 'api', 'vault'];
const BUSINESS_LOCK_TEASERS: DemoView[] = ['vault', 'mica', 'signature', 'infrastructure'];

function filterSection(
  plan: DemoPlan,
  label: string,
  items: DemoNavItem[],
  lockTeasers: DemoView[]
): DemoNavSection | null {
  const features = DEMO_PLANS[plan].features;
  const visible = items.filter((item) => {
    if (!item.feature) return true;
    if (features[item.feature]) return true;
    // locked → only show if it's a chosen teaser for this plan
    return lockTeasers.includes(item.view);
  });
  if (visible.length === 0) return null;
  return { label, items: visible };
}

/** Build the full navigation for a plan. */
export function getDemoNavigation(plan: DemoPlan): DemoNavSection[] {
  const lockTeasers =
    plan === 'starter' ? STARTER_LOCK_TEASERS : plan === 'business' ? BUSINESS_LOCK_TEASERS : [];

  const sections: (DemoNavSection | null)[] = [
    filterSection(plan, 'Platform', PLATFORM, lockTeasers),
    filterSection(plan, 'Assets', ASSETS, lockTeasers),
    filterSection(plan, 'Infrastructure', INFRASTRUCTURE, lockTeasers),
    filterSection(plan, 'Organization', ORGANIZATION, lockTeasers),
    filterSection(plan, 'Governance', GOVERNANCE, lockTeasers),
  ];

  return sections.filter((s): s is DemoNavSection => s !== null);
}

/** Is a nav item unlocked for the current plan? */
export function isViewUnlocked(plan: DemoPlan, item: DemoNavItem): boolean {
  if (!item.feature) return true;
  return DEMO_PLANS[plan].features[item.feature];
}

/** Human label for the minimum plan that unlocks a feature. */
export function unlockPlanLabel(feature: keyof DemoPlanFeatures): string {
  return DEMO_PLANS[requiredDemoPlanFor(feature)].label;
}
