"use client";

import { useState } from 'react';
import { useLicense } from '@/contexts/LicenseContext';
import { getAllPlans } from '@/config/plans';
import { X, Check, Star, Zap, Crown } from 'lucide-react';

interface UpgradePromptProps {
  feature: string;
  onClose: () => void;
  isOpen: boolean;
}

export function UpgradePrompt({ feature, onClose, isOpen }: UpgradePromptProps) {
  const { currentPlan, planDetails } = useLicense();
  const [selectedPlan, setSelectedPlan] = useState<string>('PRO');
  
  const plans = getAllPlans();
  
  if (!isOpen) return null;

  const handleUpgrade = (planId: string) => {
    // In production, this would redirect to payment processor
    console.log(`Upgrading to ${planId}`);
    // For demo, we can show success message
    alert(`¡Upgrade to ${planId} initiated! Check your email for payment details.`);
    onClose();
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'ai':
      case 'ai showcase':
        return '🤖';
      case 'pay':
      case 'payments':
        return '💳';
      case 'bridge':
        return '🌉';
      case 'vault':
        return '🔐';
      case 'analytics':
        return '📊';
      default:
        return '✨';
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'STARTER':
        return <Zap className="w-5 h-5" />;
      case 'PRO':
        return <Star className="w-5 h-5" />;
      case 'ENTERPRISE':
        return <Crown className="w-5 h-5" />;
      default:
        return <Check className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getFeatureIcon(feature)}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Upgrade Required
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature} is available in higher plans
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Plan Warning */}
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
              {getPlanIcon(currentPlan)}
            </div>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                Current Plan: {planDetails.name} (€{planDetails.price}/month)
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                This feature requires a higher tier plan
              </p>
            </div>
          </div>
        </div>

        {/* Plans Comparison */}
        <div className="p-6 overflow-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlan;
              const isRecommended = plan.popular;
              
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl p-6 border-2 transition-all cursor-pointer ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isCurrentPlan
                      ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        POPULAR
                      </span>
                    </div>
                  )}
                  
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        CURRENT
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      {getPlanIcon(plan.id)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      €{plan.price}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Max {plan.features.maxProperties === -1 ? 'Unlimited' : plan.features.maxProperties} Properties</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>AI Features: {plan.features.aiEnabled ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Pay Module: {plan.features.payEnabled ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Bridge: {plan.features.bridgeEnabled ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Vault: {plan.features.vaultEnabled ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isCurrentPlan ? (
                    <div className="text-center text-sm text-amber-600 dark:text-amber-400 font-medium">
                      Your Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgrade(plan.id);
                      }}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                        selectedPlan === plan.id
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      Upgrade to {plan.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              All plans include 30-day money-back guarantee
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => handleUpgrade(selectedPlan)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}