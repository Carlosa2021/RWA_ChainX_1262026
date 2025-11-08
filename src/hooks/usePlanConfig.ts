'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

export interface PlanConfig {
  type: 'STARTER' | 'PRO' | 'ENTERPRISE';
  name: string;
  price: number;
  maxProjects: number;
  maxInvestors: number;
  features: {
    basicDashboard: boolean;
    adminPanel: boolean;
    analytics: boolean;
    whiteLabel: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
  };
  badge: string;
  color: string;
}

const PLAN_CONFIGS: Record<number, PlanConfig> = {
  3000: {
    type: 'STARTER',
    name: 'STARTER',
    price: 49,
    maxProjects: 3,
    maxInvestors: 50,
    features: {
      basicDashboard: true,
      adminPanel: false,
      analytics: false,
      whiteLabel: false,
      apiAccess: false,
      customBranding: false,
      prioritySupport: false,
    },
    badge: 'BASIC',
    color: 'blue'
  },
  3001: {
    type: 'PRO',
    name: 'PRO',
    price: 499,
    maxProjects: 25,
    maxInvestors: 500,
    features: {
      basicDashboard: true,
      adminPanel: true,
      analytics: true,
      whiteLabel: false,
      apiAccess: false,
      customBranding: true,
      prioritySupport: true,
    },
    badge: 'PRO',
    color: 'green'
  },
  3004: {
    type: 'ENTERPRISE',
    name: 'ENTERPRISE',
    price: 4999,
    maxProjects: 100,
    maxInvestors: 10000,
    features: {
      basicDashboard: true,
      adminPanel: true,
      analytics: true,
      whiteLabel: true,
      apiAccess: true,
      customBranding: true,
      prioritySupport: true,
    },
    badge: 'ENTERPRISE',
    color: 'purple'
  }
};

export function usePlanConfig(): PlanConfig {
  const [config, setConfig] = useState<PlanConfig>(PLAN_CONFIGS[3000]); // Default STARTER

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const port = parseInt(window.location.port) || 3000;
      const planConfig = PLAN_CONFIGS[port] || PLAN_CONFIGS[3000];
      setConfig(planConfig);
      
      // Debug info
      logger.info(`🎯 Puerto detectado: ${port} - Plan: ${planConfig.type}`);
    }
  }, []);

  return config;
}
