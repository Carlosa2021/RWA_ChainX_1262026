'use client';

import React, { useState } from 'react';
import { usePlanConfig } from '@/hooks/usePlanSystem';
import { 
  Crown, 
  Zap, 
  Star, 
  ArrowUp, 
  Check, 
  X,
  Sparkles,
  Rocket,
  Shield,
  Globe
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan?: string;
  feature?: string;
}

export function UpgradeModal({ isOpen, onClose, requiredPlan, feature }: UpgradeModalProps) {
  const currentPlan = usePlanConfig();
  const [selectedPlan, setSelectedPlan] = useState<'PRO' | 'ENTERPRISE'>('PRO');

  if (!isOpen) return null;

  const plans = [
    {
      name: 'PRO',
      price: 499,
      icon: Crown,
      color: 'from-green-400 to-green-600',
      features: [
        'Panel de Administración',
        'Analytics Avanzados',
        'KYC Management',
        'Branding Personalizado',
        'Soporte Prioritario',
        '25 Proyectos',
        '500 Inversores'
      ],
      highlight: false
    },
    {
      name: 'ENTERPRISE',
      price: 4999,
      icon: Rocket,
      color: 'from-purple-400 to-purple-600',
      features: [
        'TODO de PRO +',
        'White Label Completo',
        'API Access Ilimitado',
        'Integraciones Custom',
        'Soporte 24/7',
        '100 Proyectos',
        '10,000 Inversores'
      ],
      highlight: true
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 p-6 text-white rounded-t-2xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-3 animate-pulse" />
            <h2 className="text-3xl font-bold mb-2">
              🚀 ¡Desbloquea el PODER completo!
            </h2>
            <p className="text-xl opacity-90">
              {feature ? `"${feature}" requiere plan ${requiredPlan}` : 'Elige tu plan perfecto'}
            </p>
          </div>
        </div>

        {/* Current Plan Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b">
          <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">Plan actual: {currentPlan.type} (€{currentPlan.price}/mes)</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.name;
              
              return (
                <div
                  key={plan.name}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'border-purple-500 shadow-xl scale-105' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  } ${plan.highlight ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
                  onClick={() => setSelectedPlan(plan.name as 'PRO' | 'ENTERPRISE')}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        ⭐ MÁS POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      €{plan.price}
                      <span className="text-lg text-gray-500 font-normal">/mes</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isSelected && (
                    <div className="absolute inset-0 bg-purple-500/10 rounded-xl pointer-events-none"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 text-center space-y-4">
            <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <ArrowUp className="w-6 h-6 inline mr-2 group-hover:animate-bounce" />
              Upgrade a {selectedPlan} - €{plans.find(p => p.name === selectedPlan)?.price}/mes
            </button>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>✅ Sin compromiso</span>
              <span>✅ Cancela cuando quieras</span>
              <span>✅ Migración gratis</span>
            </div>
          </div>
        </div>

        {/* Power Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-b-2xl text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Globe className="w-4 h-4 inline mr-1" />
            Únete a 10,000+ empresas que confían en ChainX RWA Platform
          </p>
        </div>
      </div>
    </div>
  );
}

// Hook para manejar el modal de upgrade
export function useUpgradeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<{ requiredPlan?: string; feature?: string }>({});

  const openModal = (requiredPlan?: string, feature?: string) => {
    setContext({ requiredPlan, feature });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContext({});
  };

  return {
    isOpen,
    openModal,
    closeModal,
    context
  };
}