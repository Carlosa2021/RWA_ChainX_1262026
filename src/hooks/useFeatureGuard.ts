"use client";

import { useState } from 'react';
import { useLicense } from '@/contexts/LicenseContext';
import { Plan } from '@/config/plans';

interface UseFeatureGuardResult {
  hasAccess: boolean;
  showUpgradePrompt: () => void;
  upgradePromptOpen: boolean;
  closeUpgradePrompt: () => void;
  requiredFeature: string;
}

export function useFeatureGuard(feature: keyof Plan['features'], featureName: string): UseFeatureGuardResult {
  const { hasFeature } = useLicense();
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);
  
  const hasAccess = hasFeature(feature);
  
  const showUpgradePrompt = () => {
    if (!hasAccess) {
      setUpgradePromptOpen(true);
    }
  };
  
  const closeUpgradePrompt = () => {
    setUpgradePromptOpen(false);
  };
  
  return {
    hasAccess,
    showUpgradePrompt,
    upgradePromptOpen,
    closeUpgradePrompt,
    requiredFeature: featureName
  };
}

// Hook específico para límites
export function useLimitGuard(limitType: 'maxProperties' | 'maxInvestors' | 'maxTokensPerProperty', current: number) {
  const { getFeatureLimit, canExceedFeatureLimit } = useLicense();
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);
  
  const limit = getFeatureLimit(limitType);
  const canExceed = canExceedFeatureLimit(limitType, current);
  const isUnlimited = limit === -1;
  
  const showUpgradePrompt = () => {
    if (!canExceed && !isUnlimited) {
      setUpgradePromptOpen(true);
    }
  };
  
  const closeUpgradePrompt = () => {
    setUpgradePromptOpen(false);
  };
  
  return {
    limit,
    current,
    canExceed,
    isUnlimited,
    showUpgradePrompt,
    upgradePromptOpen,
    closeUpgradePrompt,
    requiredFeature: `${limitType} limit increase`
  };
}

// Hook para verificar múltiples features a la vez
export function useMultiFeatureGuard(features: Array<{key: keyof Plan['features'], name: string}>) {
  const { hasFeature } = useLicense();
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState<string>('');
  
  const checkAccess = (featureKey: keyof Plan['features'], featureName: string): boolean => {
    const hasAccess = hasFeature(featureKey);
    if (!hasAccess) {
      setBlockedFeature(featureName);
      setUpgradePromptOpen(true);
      return false;
    }
    return true;
  };
  
  const closeUpgradePrompt = () => {
    setUpgradePromptOpen(false);
    setBlockedFeature('');
  };
  
  const allFeaturesEnabled = features.every(f => hasFeature(f.key));
  
  return {
    checkAccess,
    allFeaturesEnabled,
    upgradePromptOpen,
    closeUpgradePrompt,
    blockedFeature
  };
}