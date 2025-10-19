'use client';

import React from 'react';

export type PlanType = 'STARTER' | 'PRO' | 'ENTERPRISE';

export interface PlanConfig {
  type: PlanType;
  name: string;
  price: number;
  maxProjects: number;
  maxInvestors: number;
  badge: string;
  color: string;
  features: {
    basicDashboard: boolean;
    adminPanel: boolean;
    analytics: boolean;
    whiteLabel: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
    projectCreation: boolean;
    investmentTracking: boolean;
    kycManagement: boolean;
    payoutDistribution: boolean;
    multiCurrency: boolean;
    advancedReports: boolean;
    customIntegrations: boolean;
  };
}

// Configuraciones por puerto
const PLAN_CONFIGS: Record<number, PlanConfig> = {
  3000: {
    type: 'STARTER',
    name: 'STARTER',
    price: 49,
    maxProjects: 3,
    maxInvestors: 50,
    badge: 'BASIC',
    color: 'blue',
    features: {
      basicDashboard: true,
      adminPanel: false,
      analytics: false,
      whiteLabel: false,
      apiAccess: false,
      customBranding: false,
      prioritySupport: false,
      projectCreation: true,
      investmentTracking: true,
      kycManagement: false,
      payoutDistribution: false,
      multiCurrency: false,
      advancedReports: false,
      customIntegrations: false,
    }
  },
  3001: {
    type: 'PRO',
    name: 'PRO',
    price: 499,
    maxProjects: 25,
    maxInvestors: 500,
    badge: 'PRO',
    color: 'green',
    features: {
      basicDashboard: true,
      adminPanel: true,
      analytics: true,
      whiteLabel: false,
      apiAccess: false,
      customBranding: true,
      prioritySupport: true,
      projectCreation: true,
      investmentTracking: true,
      kycManagement: true,
      payoutDistribution: true,
      multiCurrency: true,
      advancedReports: true,
      customIntegrations: false,
    }
  },
  3004: {
    type: 'ENTERPRISE',
    name: 'ENTERPRISE',
    price: 4999,
    maxProjects: -1, // Ilimitado
    maxInvestors: -1, // Ilimitado
    badge: 'ENTERPRISE',
    color: 'purple',
    features: {
      basicDashboard: true,
      adminPanel: true,
      analytics: true,
      whiteLabel: true,
      apiAccess: true,
      customBranding: true,
      prioritySupport: true,
      projectCreation: true,
      investmentTracking: true,
      kycManagement: true,
      payoutDistribution: true,
      multiCurrency: true,
      advancedReports: true,
      customIntegrations: true,
    }
  }
};

// Configuración predeterminada ENTERPRISE
const DEFAULT_ENTERPRISE_CONFIG: PlanConfig = {
  type: 'ENTERPRISE',
  name: 'ENTERPRISE',
  price: 4999,
  maxProjects: -1, // Ilimitado
  maxInvestors: -1, // Ilimitado
  badge: 'ENTERPRISE',
  color: 'purple',
  features: {
    basicDashboard: true,
    adminPanel: true,
    analytics: true,
    whiteLabel: true,
    apiAccess: true,
    customBranding: true,
    prioritySupport: true,
    projectCreation: true,
    investmentTracking: true,
    kycManagement: true,
    payoutDistribution: true,
    multiCurrency: true,
    advancedReports: true,
    customIntegrations: true,
  }
};

// Hook principal para obtener configuración
export function usePlanConfig(): PlanConfig {
  // Iniciamos SIEMPRE con ENTERPRISE
  const [config, setConfig] = React.useState<PlanConfig>(DEFAULT_ENTERPRISE_CONFIG);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // FORZAR ENTERPRISE sin importar puerto o ENV
      setConfig(DEFAULT_ENTERPRISE_CONFIG);
      console.log(`🚀 FORCED ENTERPRISE MODE ACTIVATED`);
      console.log(`✅ All features enabled, unlimited projects/investors`);
    }
  }, []);

  return config;
}

// Hook para verificar si una feature está disponible
export function useFeatureAccess(feature: keyof PlanConfig['features']): boolean {
  const config = usePlanConfig();
  return config.features[feature];
}

// Hook para verificar límites
export function usePlanLimits() {
  const config = usePlanConfig();
  
  return {
    canCreateProject: (currentProjects: number) => currentProjects < config.maxProjects,
    canAddInvestor: (currentInvestors: number) => currentInvestors < config.maxInvestors,
    projectsRemaining: (currentProjects: number) => Math.max(0, config.maxProjects - currentProjects),
    investorsRemaining: (currentInvestors: number) => Math.max(0, config.maxInvestors - currentInvestors),
  };
}