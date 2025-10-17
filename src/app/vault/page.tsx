"use client";

import { useState } from 'react';
import { CheckCircle, Vault, Shield, TrendingUp, Lock, Users, Zap, Globe, BarChart3, AlertTriangle } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import ThirdwebVaultDemo from '../../components/ThirdwebVaultDemo';
import { useFeatureGuard } from '../../hooks/useFeatureGuard';
import { UpgradePrompt } from '../../components/UpgradePrompt';

const securityFeatures = [
  {
    icon: Shield,
    title: 'Multi-Signature Security',
    description: 'All transactions require multiple cryptographic signatures for maximum security',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: Lock,
    title: 'Time-Lock Mechanisms',
    description: 'Critical operations are subject to time delays, preventing rapid unauthorized changes',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    icon: BarChart3,
    title: 'Risk Management',
    description: 'Advanced algorithms continuously monitor and adjust risk exposure across all strategies',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: Users,
    title: 'Decentralized Governance',
    description: 'Community-driven decisions through transparent voting mechanisms',
    color: 'text-orange-600 bg-orange-100'
  }
];

const vaultBenefits = [
  {
    title: '🔒 Maximum Security',
    subtitle: 'Enterprise-grade protection',
    description: 'Your assets are protected by military-grade encryption, multi-signature wallets, and continuous security monitoring.',
    stats: '99.9% uptime • $0 lost in 2+ years'
  },
  {
    title: '📈 Optimized Yields',
    subtitle: 'AI-powered strategies',
    description: 'Our intelligent algorithms automatically optimize your returns across multiple DeFi protocols and real estate opportunities.',
    stats: '15.2% avg APY • 24/7 optimization'
  },
  {
    title: '🌍 Diversified Portfolio',
    subtitle: 'Global asset exposure',
    description: 'Access to tokenized real estate, DeFi protocols, and traditional finance instruments in one secure platform.',
    stats: '50+ assets • 15 countries'
  },
  {
    title: '⚡ Instant Liquidity',
    subtitle: 'Flexible withdrawals',
    description: 'Withdraw your funds anytime with our innovative liquidity pools, no lengthy waiting periods.',
    stats: '< 5min withdrawals • 95% liquid'
  }
];

const riskLevels = [
  {
    level: 'Conservative',
    risk: 'Low Risk',
    apy: '6-8%',
    description: 'Stable income focused on blue-chip real estate and government bonds',
    allocation: 'Real Estate 60% • Stablecoins 30% • Bonds 10%',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    level: 'Balanced',
    risk: 'Medium Risk',
    apy: '10-15%',
    description: 'Diversified portfolio balancing growth and stability',
    allocation: 'Real Estate 40% • DeFi 35% • Stablecoins 25%',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    level: 'Aggressive',
    risk: 'High Risk',
    apy: '18-25%',
    description: 'Growth-focused with emerging opportunities and higher volatility',
    allocation: 'DeFi 50% • Real Estate 30% • Emerging 20%',
    color: 'bg-red-100 text-red-800 border-red-200'
  }
];

export default function VaultPage() {
  // Feature Guard Protection
  const { hasAccess, showUpgradePrompt, upgradePromptOpen, closeUpgradePrompt, requiredFeature } = useFeatureGuard('vaultEnabled', 'Vault');
  
  const [vaultAction, setVaultAction] = useState<{
    action: 'deposit' | 'withdraw' | 'stake' | 'unstake';
    token: string;
    amount: number;
    txHash: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // If user doesn't have access, show upgrade prompt immediately
  if (!hasAccess) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Vault Feature Locked
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    The Vault feature is available in Enterprise plans only
                  </p>
                  <button
                    onClick={showUpgradePrompt}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    Upgrade to Enterprise
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
        <UpgradePrompt 
          feature={requiredFeature}
          isOpen={upgradePromptOpen}
          onClose={closeUpgradePrompt}
        />
      </div>
    );
  }

  const handleVaultAction = (details: {
    action: 'deposit' | 'withdraw' | 'stake' | 'unstake';
    token: string;
    amount: number;
    txHash: string;
  }) => {
    setVaultAction(details);
    setShowSuccess(true);
  };

  const handleVaultError = (error: string) => {
    console.error('Vault error:', error);
    alert(`Error en el vault: ${error}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Vault className="w-8 h-8" />
                <h1 className="text-3xl font-bold">thirdweb Vault</h1>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  SECURE
                </span>
              </div>
              <p className="text-xl text-indigo-100 mb-6">
                Custodia institucional y optimización de rendimientos para tus activos digitales
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🔐 Seguridad Total</h3>
                <p className="text-sm text-indigo-100">Multi-sig + Time-locks</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🤖 IA Optimizada</h3>
                <p className="text-sm text-indigo-100">Estrategias automatizadas</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🌍 Diversificación</h3>
                <p className="text-sm text-indigo-100">Activos globales</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">⚡ Liquidez</h3>
                <p className="text-sm text-indigo-100">Retiros instantáneos</p>
              </div>
            </div>
          </div>

          {!showSuccess ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Vault Interface */}
              <div className="lg:col-span-2">
                <ThirdwebVaultDemo
                  onVaultAction={handleVaultAction}
                  onVaultError={handleVaultError}
                  className="shadow-lg"
                />
              </div>

              {/* Information Sidebar */}
              <div className="space-y-6">
                {/* Live Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Vault Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Value Locked</span>
                      <span className="text-xl font-bold text-indigo-600">$12.4M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Strategies</span>
                      <span className="text-lg font-semibold">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average APY</span>
                      <span className="text-lg font-semibold text-green-600">12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Users</span>
                      <span className="text-lg font-semibold">2,847</span>
                    </div>
                  </div>
                </div>

                {/* Risk Profiles */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Profiles</h3>
                  <div className="space-y-3">
                    {riskLevels.map((profile, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${profile.color}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{profile.level}</h4>
                          <span className="text-sm font-medium">{profile.apy}</span>
                        </div>
                        <p className="text-sm mb-2">{profile.description}</p>
                        <p className="text-xs opacity-75">{profile.allocation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">Security Guarantee</h4>
                      <p className="text-sm text-green-700 mb-3">
                        All funds are protected by institutional-grade security measures including multi-signature wallets, time-locks, and continuous monitoring.
                      </p>
                      <div className="text-xs text-green-600 font-medium">
                        ✓ Audited by Certik • ✓ Insured up to $1M • ✓ Bug Bounty Program
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  ¡Operación Completada!
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  Tu {vaultAction?.action} ha sido procesada exitosamente en thirdweb Vault
                </p>
                
                <div className="bg-green-50 rounded-lg p-6 mb-8">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Acción:</span>
                      <span className="font-semibold text-green-700 capitalize">{vaultAction?.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Token:</span>
                      <span className="font-semibold text-green-700">{vaultAction?.token}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cantidad:</span>
                      <span className="font-semibold text-green-700">{vaultAction?.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hash de transacción:</span>
                      <span className="font-mono text-xs text-green-700 break-all">
                        {vaultAction?.txHash}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      setVaultAction(null);
                    }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Nueva Operación
                  </button>
                  <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    Ver Portfolio
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Features */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Características de Seguridad
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="p-6 border border-gray-200 rounded-lg">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ¿Por qué elegir thirdweb Vault?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {vaultBenefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <h4 className="text-sm font-medium text-indigo-600 mb-3">{benefit.subtitle}</h4>
                  <p className="text-gray-600 text-sm mb-4">{benefit.description}</p>
                  <div className="text-xs text-gray-500 font-medium bg-gray-50 px-3 py-2 rounded">
                    {benefit.stats}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Warning */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Aviso de Riesgo</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  Las inversiones en criptoactivos y bienes raíces tokenizados conllevan riesgos. El valor de los activos puede fluctuar y existe la posibilidad de pérdidas. 
                  Diversifica tu portfolio y solo invierte lo que puedas permitirte perder.
                </p>
                <div className="text-xs text-yellow-700">
                  <strong>Regulación:</strong> thirdweb Vault cumple con las regulaciones locales e internacionales aplicables.
                </div>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}