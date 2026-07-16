// ─────────────────────────────────────────────────────────────────────────────
// ChainX® Demo Gateway — Plan Entitlement Model (Single Source of Truth)
// Sprint 11.0 — Multi-Plan Demo Gateway
//
// This file is FRONTEND-ONLY, STATIC and READ-ONLY. It powers the public demo
// experience under /demo/**. It does NOT read env vars, does NOT touch auth,
// does NOT call the blockchain and NEVER grants access to real /admin routes.
//
// The public demo always displays "Business" (never the legacy internal "pro"
// label). If a legacy mapping is ever required, it must be isolated in the
// single `fromLegacyPlan` helper at the bottom of this file.
// ─────────────────────────────────────────────────────────────────────────────

export type DemoPlan = 'starter' | 'business' | 'enterprise';

export interface DemoPlanLimits {
  properties: number | 'unlimited';
  investors: number | 'unlimited';
  wallets: number | 'unlimited';
}

export interface DemoPlanFeatures {
  // Core operating tools
  dashboard: boolean;
  projects: boolean;
  investors: boolean;
  kyc: boolean;
  ownKycProvider: boolean;
  documents: boolean;
  payments: boolean;
  bridge: boolean;
  vault: boolean;
  aiCopilot: boolean;
  advancedAnalytics: boolean;
  exports: boolean;
  api: boolean;
  webhooks: boolean;
  fullBranding: boolean;
  customDomain: boolean;
  usersAndRoles: boolean;
  auditTrail: boolean;
  approvals: boolean;
  complianceReports: boolean;
  micaReporting: boolean;
  digitalSignature: boolean;
  dedicatedInfrastructure: boolean;
  dedicatedAccountManager: boolean;
}

export interface DemoPlanConfig {
  id: DemoPlan;
  /** Display label — ALWAYS use this in UI (never "pro"). */
  label: string;
  tagline: string;
  description: string;
  /** Short marketing bullets shown on the gateway plan card. */
  highlights: string[];
  /** CTA label for the gateway plan card. */
  cta: string;
  popular?: boolean;
  priceHint: string;
  limits: DemoPlanLimits;
  features: DemoPlanFeatures;
}

// ─── Entitlement definitions ────────────────────────────────────────────────

export const DEMO_PLANS: Record<DemoPlan, DemoPlanConfig> = {
  starter: {
    id: 'starter',
    label: 'Starter',
    tagline: 'Launch your first tokenized asset',
    description: 'Launch your first tokenized asset with the essential operating tools.',
    highlights: [
      'Up to 3 tokenized properties',
      'Standard KYC & investor management',
      'Documents, basic payments & analytics',
    ],
    cta: 'Enter Starter Demo',
    priceHint: 'from €499 / mo',
    limits: {
      properties: 3,
      investors: 500,
      wallets: 500,
    },
    features: {
      dashboard: true,
      projects: true,
      investors: true,
      kyc: true,
      ownKycProvider: false,
      documents: true,
      payments: true,
      bridge: false,
      vault: false,
      aiCopilot: false,
      advancedAnalytics: false,
      exports: true,
      api: false,
      webhooks: false,
      fullBranding: false,
      customDomain: false,
      usersAndRoles: false,
      auditTrail: false,
      approvals: false,
      complianceReports: false,
      micaReporting: false,
      digitalSignature: false,
      dedicatedInfrastructure: false,
      dedicatedAccountManager: false,
    },
  },

  business: {
    id: 'business',
    label: 'Business',
    tagline: 'Operate a complete white-label platform',
    description:
      'Operate a complete white-label tokenization platform with advanced integrations and automation.',
    highlights: [
      'Unlimited properties & investors',
      'Full white-label, custom domain & AI Copilot',
      'Bridge, APIs, webhooks, audit trail & approvals',
    ],
    cta: 'Enter Business Demo',
    popular: true,
    priceHint: 'from €1,499 / mo',
    limits: {
      properties: 'unlimited',
      investors: 'unlimited',
      wallets: 10000,
    },
    features: {
      dashboard: true,
      projects: true,
      investors: true,
      kyc: true,
      ownKycProvider: true,
      documents: true,
      payments: true,
      bridge: true,
      vault: false,
      aiCopilot: true,
      advancedAnalytics: true,
      exports: true,
      api: true,
      webhooks: true,
      fullBranding: true,
      customDomain: true,
      usersAndRoles: true,
      auditTrail: true,
      approvals: true,
      complianceReports: true,
      micaReporting: false,
      digitalSignature: false,
      dedicatedInfrastructure: false,
      dedicatedAccountManager: false,
    },
  },

  enterprise: {
    id: 'enterprise',
    label: 'Enterprise',
    tagline: 'Regulated, high-volume digital securities infrastructure',
    description:
      'Run regulated, high-volume digital securities infrastructure with dedicated controls and support.',
    highlights: [
      'Everything in Business, unlimited scale',
      'Vault, advanced MiCA reporting & digital signatures',
      'Dedicated infrastructure & account manager',
    ],
    cta: 'Enter Enterprise Demo',
    priceHint: 'from €4,999 / mo',
    limits: {
      properties: 'unlimited',
      investors: 'unlimited',
      wallets: 'unlimited',
    },
    features: {
      dashboard: true,
      projects: true,
      investors: true,
      kyc: true,
      ownKycProvider: true,
      documents: true,
      payments: true,
      bridge: true,
      vault: true,
      aiCopilot: true,
      advancedAnalytics: true,
      exports: true,
      api: true,
      webhooks: true,
      fullBranding: true,
      customDomain: true,
      usersAndRoles: true,
      auditTrail: true,
      approvals: true,
      complianceReports: true,
      micaReporting: true,
      digitalSignature: true,
      dedicatedInfrastructure: true,
      dedicatedAccountManager: true,
    },
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

export const DEMO_PLAN_ORDER: DemoPlan[] = ['starter', 'business', 'enterprise'];

export function getDemoPlan(plan: DemoPlan): DemoPlanConfig {
  return DEMO_PLANS[plan];
}

export function getAllDemoPlans(): DemoPlanConfig[] {
  return DEMO_PLAN_ORDER.map((p) => DEMO_PLANS[p]);
}

export function isDemoPlan(value: string): value is DemoPlan {
  return value === 'starter' || value === 'business' || value === 'enterprise';
}

/** Returns true if a feature is enabled for the given demo plan. */
export function demoHasFeature(plan: DemoPlan, feature: keyof DemoPlanFeatures): boolean {
  return DEMO_PLANS[plan].features[feature];
}

const DEMO_PLAN_RANK: Record<DemoPlan, number> = {
  starter: 0,
  business: 1,
  enterprise: 2,
};

/** Lowest demo plan that unlocks a given feature (for upgrade messaging). */
export function requiredDemoPlanFor(feature: keyof DemoPlanFeatures): DemoPlan {
  for (const plan of DEMO_PLAN_ORDER) {
    if (DEMO_PLANS[plan].features[feature]) return plan;
  }
  return 'enterprise';
}

export function demoPlanAtLeast(current: DemoPlan, required: DemoPlan): boolean {
  return DEMO_PLAN_RANK[current] >= DEMO_PLAN_RANK[required];
}

/**
 * SINGLE isolated legacy mapping. The rest of the demo never references "pro".
 * Kept only so any legacy internal identifier resolves to the "business" demo.
 */
export function fromLegacyPlan(raw: string): DemoPlan {
  const value = raw.toLowerCase();
  if (value === 'pro') return 'business';
  if (isDemoPlan(value)) return value;
  return 'starter';
}
