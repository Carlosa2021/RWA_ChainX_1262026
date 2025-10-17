"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlanType, Plan, getPlan, isFeatureEnabled, getLimit, canExceedLimit } from '@/config/plans';

interface LicenseContextType {
  // Current Plan
  currentPlan: PlanType;
  planDetails: Plan;
  
  // Plan Management
  setPlan: (plan: PlanType) => void;
  
  // Feature Checking
  hasFeature: (feature: keyof Plan['features']) => boolean;
  getFeatureLimit: (limit: 'maxProperties' | 'maxInvestors' | 'maxTokensPerProperty') => number;
  canExceedFeatureLimit: (limit: 'maxProperties' | 'maxInvestors' | 'maxTokensPerProperty', current: number) => boolean;
  
  // License Status
  isValid: boolean;
  expiresAt?: Date;
  
  // License Key (for validation)
  licenseKey?: string;
  setLicenseKey: (key: string) => void;
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

interface LicenseProviderProps {
  children: ReactNode;
  defaultPlan?: PlanType;
  licenseKey?: string;
}

export function LicenseProvider({ 
  children, 
  defaultPlan = 'STARTER',
  licenseKey: initialLicenseKey 
}: LicenseProviderProps) {
  const [currentPlan, setCurrentPlan] = useState<PlanType>(defaultPlan);
  const [licenseKey, setLicenseKey] = useState<string | undefined>(initialLicenseKey);
  const [isValid, setIsValid] = useState(true);
  const [expiresAt, setExpiresAt] = useState<Date | undefined>();

  // Get plan from environment variables or license key
  useEffect(() => {
    // Try to get plan from environment
    const envPlan = process.env.NEXT_PUBLIC_PLAN as PlanType;
    if (envPlan && ['STARTER', 'PRO', 'ENTERPRISE'].includes(envPlan)) {
      setCurrentPlan(envPlan);
    }

    // Try to get license key from environment or localStorage
    const envLicenseKey = process.env.NEXT_PUBLIC_LICENSE_KEY;
    const storedLicenseKey = typeof window !== 'undefined' ? localStorage.getItem('chainx_license_key') : null;
    
    if (envLicenseKey) {
      setLicenseKey(envLicenseKey);
      validateLicense(envLicenseKey);
    } else if (storedLicenseKey) {
      setLicenseKey(storedLicenseKey);
      validateLicense(storedLicenseKey);
    }
  }, []);

  // License validation (simplified for now)
  const validateLicense = async (key: string) => {
    try {
      // In production, this would validate against your license server
      // For now, we'll use a simple format: PLAN_CLIENTID_HASH
      const parts = key.split('_');
      if (parts.length >= 2) {
        const planFromKey = parts[0] as PlanType;
        if (['STARTER', 'PRO', 'ENTERPRISE'].includes(planFromKey)) {
          setCurrentPlan(planFromKey);
          setIsValid(true);
          // Set expiration (e.g., 30 days from now)
          setExpiresAt(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
        }
      }
    } catch (error) {
      console.error('License validation failed:', error);
      setIsValid(false);
    }
  };

  const setPlan = (plan: PlanType) => {
    setCurrentPlan(plan);
    // In production, this would update the license on the server
  };

  const handleSetLicenseKey = (key: string) => {
    setLicenseKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chainx_license_key', key);
    }
    validateLicense(key);
  };

  const planDetails = getPlan(currentPlan);

  const hasFeature = (feature: keyof Plan['features']): boolean => {
    return isFeatureEnabled(currentPlan, feature);
  };

  const getFeatureLimit = (limit: 'maxProperties' | 'maxInvestors' | 'maxTokensPerProperty'): number => {
    return getLimit(currentPlan, limit);
  };

  const canExceedFeatureLimit = (limit: 'maxProperties' | 'maxInvestors' | 'maxTokensPerProperty', current: number): boolean => {
    return canExceedLimit(currentPlan, limit, current);
  };

  const value: LicenseContextType = {
    currentPlan,
    planDetails,
    setPlan,
    hasFeature,
    getFeatureLimit,
    canExceedFeatureLimit,
    isValid,
    expiresAt,
    licenseKey,
    setLicenseKey: handleSetLicenseKey,
  };

  return (
    <LicenseContext.Provider value={value}>
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicense() {
  const context = useContext(LicenseContext);
  if (context === undefined) {
    throw new Error('useLicense must be used within a LicenseProvider');
  }
  return context;
}

// Hook for feature checking
export function useFeature(feature: keyof Plan['features']) {
  const { hasFeature } = useLicense();
  return hasFeature(feature);
}

// Hook for limit checking
export function useLimit(limit: 'maxProperties' | 'maxInvestors' | 'maxTokensPerProperty') {
  const { getFeatureLimit, canExceedFeatureLimit } = useLicense();
  
  return {
    limit: getFeatureLimit(limit),
    canExceed: (current: number) => canExceedFeatureLimit(limit, current),
    isUnlimited: getFeatureLimit(limit) === -1
  };
}