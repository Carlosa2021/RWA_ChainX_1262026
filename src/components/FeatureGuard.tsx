'use client';

import React from 'react';
import { useFeatureAccess, usePlanConfig, PlanConfig } from '@/hooks/usePlanSystem';
import { useUpgradeModal } from '@/components/UpgradeModal';
import { Lock, Crown, Zap, ArrowUp, Sparkles } from 'lucide-react';

interface FeatureGuardProps {
  feature: keyof PlanConfig['features'];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGuard({ feature, children, fallback, showUpgrade = true }: FeatureGuardProps) {
  const hasAccess = useFeatureAccess(feature);
  const planConfig = usePlanConfig();
  const { openModal } = useUpgradeModal();

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const getUpgradeIcon = () => {
    if (planConfig.type === 'STARTER') return Crown;
    if (planConfig.type === 'PRO') return Zap;
    return ArrowUp;
  };

  const UpgradeIcon = getUpgradeIcon();
  
  const getRequiredPlan = () => {
    // Mapeo de features a plan mínimo requerido
    const featureToMinPlan: Record<string, string> = {
      adminPanel: 'PRO',
      analytics: 'PRO', 
      customBranding: 'PRO',
      prioritySupport: 'PRO',
      kycManagement: 'PRO',
      payoutDistribution: 'PRO',
      multiCurrency: 'PRO',
      advancedReports: 'PRO',
      whiteLabel: 'ENTERPRISE',
      apiAccess: 'ENTERPRISE',
      customIntegrations: 'ENTERPRISE',
    };
    return featureToMinPlan[feature] || 'PRO';
  };

  const requiredPlan = getRequiredPlan();

  const handleUpgradeClick = () => {
    openModal(requiredPlan, feature);
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-50 z-10"></div>
      <div className="relative">
        {children}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white dark:bg-gray-900 border-2 border-orange-200 dark:border-orange-700 rounded-xl p-4 shadow-lg text-center max-w-sm">
            <UpgradeIcon className="w-8 h-8 text-orange-500 mx-auto mb-2 animate-bounce" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {requiredPlan} Requerido
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Esta característica requiere plan {requiredPlan} o superior
            </p>
            <button 
              onClick={handleUpgradeClick}
              className="px-4 py-2 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 inline mr-1 group-hover:animate-spin" />
              Upgrade ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar límites con progreso visual
export function LimitDisplay({ 
  current, 
  max, 
  label, 
  type = 'projects' 
}: { 
  current: number; 
  max: number; 
  label: string;
  type?: 'projects' | 'investors';
}) {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage > 80;
  const isAtLimit = current >= max;

  const getBarColor = () => {
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-yellow-500'; 
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (isAtLimit) return 'text-red-600';
    if (isNearLimit) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className={`text-sm font-semibold ${getTextColor()}`}>
          {current} / {max}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      
      {isAtLimit && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
          <Lock className="w-3 h-3" />
          <span>Límite alcanzado - Upgrade para continuar</span>
        </div>
      )}
      
      {isNearLimit && !isAtLimit && (
        <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
          <ArrowUp className="w-3 h-3" />
          <span>Cerca del límite - Considera upgrading</span>
        </div>
      )}
    </div>
  );
}