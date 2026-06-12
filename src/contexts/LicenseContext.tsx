'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PlanType,
  Plan,
  PlanFeatures,
  getPlan,
  isFeatureEnabled,
  getLimit,
  canExceedLimit,
  normalisePlan,
  planAtLeast,
  requiredPlanFor,
} from '@/config/plans';
import { logger } from '@/lib/logger';

interface LicenseContextType {
  currentPlan: PlanType;
  planDetails: Plan;
  setPlan: (plan: PlanType) => void;
  hasFeature: (feature: keyof PlanFeatures) => boolean;
  planAtLeast: (required: PlanType) => boolean;
  requiredPlanFor: (feature: keyof PlanFeatures) => PlanType;
  getFeatureLimit: (
    limit: 'maxProperties' | 'maxInvestors' | 'maxActiveWallets' | 'maxTokensPerProperty'
  ) => number;
  canExceedFeatureLimit: (
    limit: 'maxProperties' | 'maxInvestors' | 'maxActiveWallets' | 'maxTokensPerProperty',
    current: number
  ) => boolean;
  isValid: boolean;
  expiresAt?: Date;
  licenseKey?: string;
  setLicenseKey: (key: string) => void;
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

// ─── Resolve plan from .env ──────────────────────────────────
// Priority: NEXT_PUBLIC_PLAN_TYPE env var → license key prefix → STARTER (safe default)
// Set NEXT_PUBLIC_PLAN_TYPE=STARTER|BUSINESS|ENTERPRISE in .env.local per client deployment
function resolvePlanFromEnv(): PlanType {
  const envPlan = process.env.NEXT_PUBLIC_PLAN_TYPE;
  if (envPlan) return normalisePlan(envPlan);

  // Fallback: derive from license key format "PLAN-DATE-HASH"
  const envKey = process.env.NEXT_PUBLIC_LICENSE_KEY || '';
  if (envKey) {
    const prefix = envKey.split('-')[0];
    return normalisePlan(prefix);
  }

  return 'STARTER';
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2 INSERTION POINTS — Do not implement here, only document
// ─────────────────────────────────────────────────────────────────────────────
//
// [RBAC] Role-Based Access Control
//   Extend LicenseContextType to include: userRole: 'admin' | 'compliance' | 'operator' | 'readonly'
//   Read role from: JWT claim (thirdweb Auth) or operator config table (API)
//   Guard UI actions by role, not only by plan.
//   Required by: banks, regulated funds, institutional operators.
//
// [AUDIT TRAIL] Immutable Action Log
//   Every write action (KYC approve, doc upload, offering publish, forced transfer) must emit:
//   { actor, action, target, timestamp, ipHash }
//   Storage options: append-only DB table (API side) or on-chain event index.
//   Expose as: read-only audit log page (compliance officer role only).
//   Required by: institutional buyers, MiCA compliance, AML auditors.
//
// [WHITE LABEL MANAGEMENT]
//   Add operator-facing settings page at /admin/whitelabel
//   Fields: logoUrl, primaryColor, platformName, customDomain, supportEmail
//   Store in: operator config (API) or environment override at deploy time.
//   Gate behind: plan ENTERPRISE (whiteLabel feature flag already exists).
//
// [COMPLIANCE REPORTING]
//   MiCA White Paper generator: PDF export of offering terms + participant list
//   Fields: issuer, offering details, KYC summary, jurisdiction breakdown
//   Gate behind: analyticsCompliance (ENTERPRISE plan feature flag)
//   Trigger from: /onboarding/metricas "Export MiCA Report" button
//
// ─────────────────────────────────────────────────────────────────────────────

interface LicenseProviderProps {
  children: ReactNode;
}

export function LicenseProvider({ children }: LicenseProviderProps) {
  const [currentPlan, setCurrentPlan] = useState<PlanType>(() => resolvePlanFromEnv());
  const [licenseKey, setLicenseKeyState] = useState<string | undefined>(
    process.env.NEXT_PUBLIC_LICENSE_KEY
  );
  const [isValid, setIsValid] = useState(true);
  const [expiresAt, setExpiresAt] = useState<Date | undefined>();

  useEffect(() => {
    const resolved = resolvePlanFromEnv();
    setCurrentPlan(resolved);
    setIsValid(true);
    // Default expiry: 1 year from now (real validation via license server in production)
    setExpiresAt(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
    logger.info(`✅ ChainX License: ${resolved} plan activated`);
  }, []);

  const setPlan = (plan: PlanType) => setCurrentPlan(plan);

  const handleSetLicenseKey = (key: string) => {
    setLicenseKeyState(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chainx_license_key', key);
    }
    // Derive plan from key prefix (format: PLAN-DATE-HASH)
    const prefix = key.split('-')[0];
    const derived = normalisePlan(prefix);
    setCurrentPlan(derived);
    setIsValid(true);
    logger.info(`🔑 License key applied: ${derived} plan`);
  };

  const planDetails = getPlan(currentPlan);

  const value: LicenseContextType = {
    currentPlan,
    planDetails,
    setPlan,
    hasFeature: (feature) => isFeatureEnabled(currentPlan, feature),
    planAtLeast: (required) => planAtLeast(currentPlan, required),
    requiredPlanFor,
    getFeatureLimit: (limit) => getLimit(currentPlan, limit),
    canExceedFeatureLimit: (limit, current) => canExceedLimit(currentPlan, limit, current),
    isValid,
    expiresAt,
    licenseKey,
    setLicenseKey: handleSetLicenseKey,
  };

  return <LicenseContext.Provider value={value}>{children}</LicenseContext.Provider>;
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
    isUnlimited: getFeatureLimit(limit) === -1,
  };
}
