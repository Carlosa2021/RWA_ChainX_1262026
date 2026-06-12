// Plan Configuration System — ChainX® RWA Platform
// Aligned with chainx.ch pricing page
// STARTER €499 / BUSINESS €1,499 / ENTERPRISE €4,999

export type PlanType = 'STARTER' | 'BUSINESS' | 'ENTERPRISE';
// Legacy alias — keep for backward compatibility during migration
export type LegacyPlanType = 'PRO';

export interface PlanFeatures {
  // ── Core Limits ────────────────────────────────────────────
  maxProperties: number; // -1 = unlimited
  maxInvestors: number; // -1 = unlimited
  maxActiveWallets: number; // -1 = unlimited
  maxTokensPerProperty: number; // -1 = unlimited

  // ── Thirdweb Modules ───────────────────────────────────────
  payEnabled: boolean; // Fiat on-ramp (Thirdweb Pay)
  bridgeEnabled: boolean; // Cross-chain bridge
  vaultEnabled: boolean; // Secure vault
  aiEnabled: boolean; // AI Showcase

  // ── RWA Modules ────────────────────────────────────────────
  campaignsEnabled: boolean; // Tokenization campaigns
  investorManagement: boolean; // Investor dashboard
  investorExportCsv: boolean; // CSV/PDF export
  documentManagement: boolean; // Document management
  documentSigning: boolean; // Digital signing (Enterprise)
  analyticsBasic: boolean; // Basic recaudación metrics
  analyticsAdvanced: boolean; // Portfolio Analytics Dashboard
  analyticsCompliance: boolean; // MiCA Compliance Reporting
  kycProviderOwn: boolean; // Client brings own KYC API
  investorPortal: boolean; // Public investor portal

  // ── Customization ──────────────────────────────────────────
  whiteLabel: boolean; // White label platform
  customDomain: boolean; // Custom domain support
  customBranding: boolean; // Logo + colors

  // ── Infrastructure ─────────────────────────────────────────
  hostedDeployment: boolean; // ChainX managed hosting
  dedicatedInfra: boolean; // Dedicated infrastructure
  mainnetDeployment: boolean; // Direct mainnet deployment
  apiAccess: boolean; // REST API access
  webhooks: boolean; // Webhook events

  // ── Support ────────────────────────────────────────────────
  prioritySupport: boolean; // Priority 24h support
  accountManager: boolean; // Dedicated account manager
  slaAgreement: boolean; // SLA guarantee
  advancedKyc: boolean; // Advanced KYC/AML integrations
  institutionalTools: boolean; // Institutional architecture
  multiJurisdiction: boolean; // Multi-jurisdiction deployment
}

export interface Plan {
  id: PlanType;
  name: string;
  price: number; // Monthly price in EUR (chainx.ch)
  priceAnnual: number; // Annual price per month (future billing)
  description: string;
  bestFor: string;
  features: PlanFeatures;
  popular?: boolean;
  badge?: string;
  contactSales?: boolean; // Enterprise: show "Contact Sales" instead of price
}

// ─── Plan Definitions (aligned with chainx.ch) ──────────────────────────────
export const PLANS: Record<PlanType, Plan> = {
  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    price: 499,
    priceAnnual: 399,
    description: 'Perfect for validating your first tokenized real estate project.',
    bestFor: 'Real estate agencies, startups and MVP validation.',
    badge: 'STARTER',
    features: {
      // Limits
      maxProperties: 3,
      maxInvestors: 500,
      maxActiveWallets: 500,
      maxTokensPerProperty: 10000,

      // Thirdweb
      payEnabled: true,
      bridgeEnabled: false,
      vaultEnabled: false,
      aiEnabled: false,

      // RWA Modules
      campaignsEnabled: true,
      investorManagement: true,
      investorExportCsv: false,
      documentManagement: true,
      documentSigning: false,
      analyticsBasic: true,
      analyticsAdvanced: false,
      analyticsCompliance: false,
      kycProviderOwn: false, // ChainX manages KYC for them
      investorPortal: false,

      // Customization
      whiteLabel: false,
      customDomain: false,
      customBranding: false,

      // Infrastructure
      hostedDeployment: true,
      dedicatedInfra: false,
      mainnetDeployment: true,
      apiAccess: false,
      webhooks: false,

      // Support
      prioritySupport: false,
      accountManager: false,
      slaAgreement: false,
      advancedKyc: false,
      institutionalTools: false,
      multiJurisdiction: false,
    },
  },

  BUSINESS: {
    id: 'BUSINESS',
    name: 'Business',
    price: 1499,
    priceAnnual: 1199,
    description: 'For growing companies scaling real-world asset tokenization.',
    bestFor: 'Real estate companies, investment firms and professional issuers.',
    badge: 'POPULAR',
    popular: true,
    features: {
      // Limits — unlimited campaigns
      maxProperties: -1,
      maxInvestors: -1,
      maxActiveWallets: 10000,
      maxTokensPerProperty: -1,

      // Thirdweb
      payEnabled: true,
      bridgeEnabled: true,
      vaultEnabled: false,
      aiEnabled: true,

      // RWA Modules
      campaignsEnabled: true,
      investorManagement: true,
      investorExportCsv: true,
      documentManagement: true,
      documentSigning: false,
      analyticsBasic: true,
      analyticsAdvanced: true,
      analyticsCompliance: false,
      kycProviderOwn: true,
      investorPortal: true,

      // Customization
      whiteLabel: true,
      customDomain: true,
      customBranding: true,

      // Infrastructure
      hostedDeployment: true,
      dedicatedInfra: false,
      mainnetDeployment: true,
      apiAccess: true,
      webhooks: true,

      // Support
      prioritySupport: true,
      accountManager: false,
      slaAgreement: false,
      advancedKyc: true,
      institutionalTools: false,
      multiJurisdiction: false,
    },
  },

  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 4999,
    priceAnnual: 3999,
    description: 'Institutional-grade tokenization infrastructure.',
    bestFor: 'Banks, asset managers, funds, governments and institutional issuers.',
    badge: 'ENTERPRISE',
    contactSales: true,
    features: {
      // Limits — fully unlimited
      maxProperties: -1,
      maxInvestors: -1,
      maxActiveWallets: -1,
      maxTokensPerProperty: -1,

      // Thirdweb
      payEnabled: true,
      bridgeEnabled: true,
      vaultEnabled: true,
      aiEnabled: true,

      // RWA Modules
      campaignsEnabled: true,
      investorManagement: true,
      investorExportCsv: true,
      documentManagement: true,
      documentSigning: true,
      analyticsBasic: true,
      analyticsAdvanced: true,
      analyticsCompliance: true,
      kycProviderOwn: true,
      investorPortal: true,

      // Customization
      whiteLabel: true,
      customDomain: true,
      customBranding: true,

      // Infrastructure
      hostedDeployment: true,
      dedicatedInfra: true,
      mainnetDeployment: true,
      apiAccess: true,
      webhooks: true,

      // Support
      prioritySupport: true,
      accountManager: true,
      slaAgreement: true,
      advancedKyc: true,
      institutionalTools: true,
      multiJurisdiction: true,
    },
  },
};

// ─── Helper functions ────────────────────────────────────────────────────────

/** Normalise legacy 'PRO' key → 'BUSINESS' */
export const normalisePlan = (raw: string): PlanType => {
  if (raw === 'PRO') return 'BUSINESS';
  if (['STARTER', 'BUSINESS', 'ENTERPRISE'].includes(raw)) return raw as PlanType;
  return 'STARTER'; // safe default
};

export const getPlan = (planType: PlanType): Plan => PLANS[planType];

export const isFeatureEnabled = (planType: PlanType, feature: keyof PlanFeatures): boolean =>
  Boolean(PLANS[planType].features[feature]);

export const getLimit = (
  planType: PlanType,
  limit: 'maxProperties' | 'maxInvestors' | 'maxActiveWallets' | 'maxTokensPerProperty'
): number => PLANS[planType].features[limit];

export const canExceedLimit = (
  planType: PlanType,
  limit: 'maxProperties' | 'maxInvestors' | 'maxActiveWallets' | 'maxTokensPerProperty',
  current: number
): boolean => {
  const max = getLimit(planType, limit);
  return max === -1 || current < max; // -1 = unlimited
};

/** Plan hierarchy: STARTER < BUSINESS < ENTERPRISE */
const PLAN_RANK: Record<PlanType, number> = { STARTER: 0, BUSINESS: 1, ENTERPRISE: 2 };
export const planRank = (p: PlanType) => PLAN_RANK[p];
export const planAtLeast = (current: PlanType, required: PlanType): boolean =>
  PLAN_RANK[current] >= PLAN_RANK[required];

/** Which plan is required for a given feature */
export const requiredPlanFor = (feature: keyof PlanFeatures): PlanType => {
  if (PLANS.STARTER.features[feature]) return 'STARTER';
  if (PLANS.BUSINESS.features[feature]) return 'BUSINESS';
  return 'ENTERPRISE';
};

export const getAllPlans = (): Plan[] => Object.values(PLANS);
