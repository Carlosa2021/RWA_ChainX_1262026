// Plan Configuration System
// Defines features and limitations for each plan

export type PlanType = 'STARTER' | 'PRO' | 'ENTERPRISE';

export interface PlanFeatures {
  // Core Limitations
  maxProperties: number;
  maxInvestors: number;
  maxTokensPerProperty: number;
  
  // Module Access
  aiEnabled: boolean;
  payEnabled: boolean;
  bridgeEnabled: boolean;
  vaultEnabled: boolean;
  analyticsEnabled: boolean;
  
  // Customization
  customBranding: boolean;
  customDomain: boolean;
  customColors: boolean;
  logoUpload: boolean;
  
  // Support & Features
  prioritySupport: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  whiteLabel: boolean;
  
  // Advanced Features
  multiLanguage: boolean;
  advancedKyc: boolean;
  institutionalTools: boolean;
  customReports: boolean;
}

export interface Plan {
  id: PlanType;
  name: string;
  price: number; // Monthly price in EUR
  description: string;
  features: PlanFeatures;
  popular?: boolean;
  badge?: string;
}

// Plan Definitions
export const PLANS: Record<PlanType, Plan> = {
  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    price: 49,
    description: 'Perfect for testing and small projects',
    badge: 'BASIC',
    features: {
      // Core Limitations
      maxProperties: 1,
      maxInvestors: 50,
      maxTokensPerProperty: 1000,
      
      // Module Access - Very Limited
      aiEnabled: false,
      payEnabled: false,
      bridgeEnabled: false,
      vaultEnabled: false,
      analyticsEnabled: false,
      
      // Customization - None
      customBranding: false,
      customDomain: false,
      customColors: false,
      logoUpload: false,
      
      // Support & Features - Basic
      prioritySupport: false,
      apiAccess: false,
      webhooks: false,
      whiteLabel: false,
      
      // Advanced Features - None
      multiLanguage: false,
      advancedKyc: false,
      institutionalTools: false,
      customReports: false,
    }
  },
  
  PRO: {
    id: 'PRO',
    name: 'Professional',
    price: 499,
    description: 'Advanced features for growing businesses',
    badge: 'POPULAR',
    popular: true,
    features: {
      // Core Limitations - Expanded
      maxProperties: 10,
      maxInvestors: 1000,
      maxTokensPerProperty: 10000,
      
      // Module Access - Partial
      aiEnabled: true,
      payEnabled: true,
      bridgeEnabled: true,
      vaultEnabled: false, // Reserved for Enterprise
      analyticsEnabled: true,
      
      // Customization - Partial
      customBranding: true,
      customDomain: false, // Reserved for Enterprise
      customColors: true,
      logoUpload: true,
      
      // Support & Features - Enhanced
      prioritySupport: true,
      apiAccess: true,
      webhooks: true,
      whiteLabel: false, // Reserved for Enterprise
      
      // Advanced Features - Some
      multiLanguage: true,
      advancedKyc: true,
      institutionalTools: false, // Reserved for Enterprise
      customReports: true,
    }
  },
  
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 4999,
    description: 'Complete white-label solution for enterprises',
    badge: 'PREMIUM',
    features: {
      // Core Limitations - Unlimited
      maxProperties: -1, // Unlimited
      maxInvestors: -1, // Unlimited
      maxTokensPerProperty: -1, // Unlimited
      
      // Module Access - Full
      aiEnabled: true,
      payEnabled: true,
      bridgeEnabled: true,
      vaultEnabled: true,
      analyticsEnabled: true,
      
      // Customization - Complete
      customBranding: true,
      customDomain: true,
      customColors: true,
      logoUpload: true,
      
      // Support & Features - Premium
      prioritySupport: true,
      apiAccess: true,
      webhooks: true,
      whiteLabel: true,
      
      // Advanced Features - All
      multiLanguage: true,
      advancedKyc: true,
      institutionalTools: true,
      customReports: true,
    }
  }
};

// Helper functions
export const getPlan = (planType: PlanType): Plan => {
  return PLANS[planType];
};

export const isFeatureEnabled = (planType: PlanType, feature: keyof PlanFeatures): boolean => {
  return PLANS[planType].features[feature] as boolean;
};

export const getLimit = (planType: PlanType, limit: 'maxProperties' | 'maxInvestors' | 'maxTokensPerProperty'): number => {
  return PLANS[planType].features[limit];
};

export const canExceedLimit = (planType: PlanType, limit: 'maxProperties' | 'maxInvestors' | 'maxTokensPerProperty', current: number): boolean => {
  const maxLimit = getLimit(planType, limit);
  if (maxLimit === -1) return true; // Unlimited
  return current < maxLimit;
};

// Plan comparison for UI
export const getAllPlans = (): Plan[] => {
  return Object.values(PLANS);
};