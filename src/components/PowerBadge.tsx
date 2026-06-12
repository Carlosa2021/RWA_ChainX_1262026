'use client';

import React from 'react';
import { usePlanConfig } from '@/hooks/usePlanSystem';
import { Crown, Zap, Star, Sparkles } from 'lucide-react';

export function PowerBadge() {
  const planConfig = usePlanConfig();

  const getBadgeConfig = () => {
    switch (planConfig.type) {
      case 'STARTER':
        return {
          icon: Star,
          label: 'BASIC',
          gradient: 'from-blue-400 to-blue-600',
          glow: 'shadow-blue-500/30',
          animation: 'hover:scale-110'
        };
      case 'PRO':
        return {
          icon: Crown,
          label: 'PRO',
          gradient: 'from-green-400 to-green-600',
          glow: 'shadow-green-500/30',
          animation: 'hover:scale-110 hover:rotate-12'
        };
      case 'ENTERPRISE':
        return {
          icon: Zap,
          label: 'ENTERPRISE',
          gradient: 'from-purple-400 via-pink-500 to-purple-600',
          glow: 'shadow-purple-500/40',
          animation: 'hover:scale-110 hover:rotate-12 animate-pulse'
        };
      default:
        return {
          icon: Star,
          label: 'BASIC',
          gradient: 'from-gray-400 to-gray-600',
          glow: 'shadow-gray-500/30',
          animation: 'hover:scale-110'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className="relative group">
      <div className={`
        inline-flex items-center gap-2 px-4 py-2 
        bg-linear-to-r ${config.gradient} 
        text-white rounded-full font-bold text-sm
        shadow-lg ${config.glow} hover:shadow-xl
        transition-all duration-300 cursor-pointer
        ${config.animation}
      `}>
        <Icon className="w-4 h-4" />
        <span>{config.label}</span>
        
        {planConfig.type === 'ENTERPRISE' && (
          <Sparkles className="w-3 h-3 animate-spin" />
        )}
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-black text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
          Plan {planConfig.type} - €{planConfig.price}/mes
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      </div>
    </div>
  );
}

// Componente de contador de features desbloqueadas
export function FeatureCounter() {
  const planConfig = usePlanConfig();
  
  const totalFeatures = Object.keys(planConfig.features).length;
  const enabledFeatures = Object.values(planConfig.features).filter(Boolean).length;
  const percentage = (enabledFeatures / totalFeatures) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Features Desbloqueadas
        </span>
        <span className="text-sm font-bold text-purple-600">
          {enabledFeatures}/{totalFeatures}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className="h-2 rounded-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="text-center">
        <span className="text-xs text-gray-500">
          {percentage === 100 ? '🎉 ¡Todas desbloqueadas!' : `${(100 - percentage).toFixed(0)}% más con upgrade`}
        </span>
      </div>
    </div>
  );
}