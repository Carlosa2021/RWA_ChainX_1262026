"use client";

import { useState, useEffect } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { Vault, Shield, TrendingUp, Lock, Plus, Minus, Eye, BarChart3, Zap, Star, CheckCircle, Loader, AlertCircle, Settings } from 'lucide-react';

export interface ThirdwebVaultDemoProps {
  className?: string;
  onVaultAction?: (details: {
    action: 'deposit' | 'withdraw' | 'stake' | 'unstake';
    token: string;
    amount: number;
    txHash: string;
  }) => void;
  onVaultError?: (error: string) => void;
}

interface AssetBalance {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  vaultBalance: number;
  stakedBalance: number;
  apy: number;
  totalValue: number;
  priceUSD: number;
  yieldEarned: number;
  isStakeable: boolean;
}

interface VaultStrategy {
  id: string;
  name: string;
  description: string;
  apy: number;
  risk: 'Low' | 'Medium' | 'High';
  minDeposit: number;
  maxCapacity: number;
  currentTVL: number;
  rewards: string[];
  lockPeriod: string;
}

const mockAssets: AssetBalance[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    balance: 2.45,
    vaultBalance: 1.8,
    stakedBalance: 1.2,
    apy: 5.2,
    totalValue: 4580.50,
    priceUSD: 1868.50,
    yieldEarned: 28.45,
    isStakeable: true
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💲',
    balance: 1250.00,
    vaultBalance: 800.00,
    stakedBalance: 600.00,
    apy: 8.5,
    totalValue: 1250.00,
    priceUSD: 1.00,
    yieldEarned: 51.00,
    isStakeable: true
  },
  {
    symbol: 'REAL',
    name: 'Real Estate Tokens',
    icon: '🏢',
    balance: 45.0,
    vaultBalance: 30.0,
    stakedBalance: 25.0,
    apy: 12.3,
    totalValue: 45000.00,
    priceUSD: 1000.00,
    yieldEarned: 307.50,
    isStakeable: true
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    icon: '⬟',
    balance: 125.75,
    vaultBalance: 80.00,
    stakedBalance: 60.00,
    apy: 7.8,
    totalValue: 108.39,
    priceUSD: 0.862,
    yieldEarned: 4.68,
    isStakeable: true
  }
];

const vaultStrategies: VaultStrategy[] = [
  {
    id: 'real-estate-yield',
    name: 'Real Estate Yield Farming',
    description: 'Maximize returns from tokenized real estate investments',
    apy: 12.5,
    risk: 'Medium',
    minDeposit: 1000,
    maxCapacity: 10000000,
    currentTVL: 2450000,
    rewards: ['REAL', 'Rental Income', 'Capital Gains'],
    lockPeriod: '30 days'
  },
  {
    id: 'stable-income',
    name: 'Stable Income Strategy',
    description: 'Conservative strategy focusing on stable returns',
    apy: 8.2,
    risk: 'Low',
    minDeposit: 100,
    maxCapacity: 5000000,
    currentTVL: 1890000,
    rewards: ['USDC', 'Compound Interest'],
    lockPeriod: '7 days'
  },
  {
    id: 'defi-maximizer',
    name: 'DeFi Yield Maximizer',
    description: 'Automated yield optimization across protocols',
    apy: 15.8,
    risk: 'High',
    minDeposit: 500,
    maxCapacity: 3000000,
    currentTVL: 1250000,
    rewards: ['ETH', 'Protocol Tokens', 'Trading Fees'],
    lockPeriod: '90 days'
  }
];

export default function ThirdwebVaultDemo({
  className = "",
  onVaultAction,
  onVaultError
}: ThirdwebVaultDemoProps) {
  const account = useActiveAccount();
  
  const [selectedAsset, setSelectedAsset] = useState<AssetBalance>(mockAssets[0]);
  const [selectedStrategy, setSelectedStrategy] = useState<VaultStrategy>(vaultStrategies[0]);
    const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'strategies' | 'analytics'>('overview');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingAction, setProcessingAction] = useState<string>('');
  const [vaultStats, setVaultStats] = useState({
    totalTVL: 0,
    totalYield: 0,
    avgApy: 0,
    activeStrategies: 0
  });

  // Calcular estadísticas del vault
  useEffect(() => {
    const totalTVL = mockAssets.reduce((sum, asset) => sum + (asset.vaultBalance * asset.priceUSD), 0);
    const totalYield = mockAssets.reduce((sum, asset) => sum + asset.yieldEarned, 0);
    const avgApy = mockAssets.reduce((sum, asset) => sum + asset.apy, 0) / mockAssets.length;
    const activeStrategies = vaultStrategies.length;

    setVaultStats({ totalTVL, totalYield, avgApy, activeStrategies });
  }, []);

  const simulateVaultAction = async (action: 'deposit' | 'withdraw' | 'stake' | 'unstake', amount: number) => {
    setIsProcessing(true);
    setProcessingAction(action);
    
    try {
      // Simulación del proceso
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingAction('Preparing transaction...');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingAction('Confirming on blockchain...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingAction('Updating vault balances...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generar hash de transacción simulado
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      onVaultAction?.({
        action,
        token: selectedAsset.symbol,
        amount,
        txHash: mockTxHash
      });
      
    } catch (error) {
      onVaultError?.(`Error en ${action}: ${error}`);
    } finally {
      setIsProcessing(false);
      setProcessingAction('');
      setDepositAmount('');
      setWithdrawAmount('');
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!account) {
    return (
      <div className={`bg-white rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <Vault className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Conecta tu Billetera
          </h3>
          <p className="text-gray-600">
            Para usar thirdweb Vault, primero conecta tu billetera
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Vault className="w-6 h-6" />
          <h2 className="text-xl font-bold">thirdweb Vault</h2>
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
            SECURE
          </span>
        </div>
        <p className="text-indigo-100 text-sm mb-4">
          Custodia segura y optimización de rendimientos para tus activos
        </p>
        
        {/* Stats rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-indigo-200">Total en Vault</div>
            <div className="text-lg font-bold">${vaultStats.totalTVL.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-indigo-200">Yield Ganado</div>
            <div className="text-lg font-bold text-green-300">${vaultStats.totalYield.toFixed(2)}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-indigo-200">APY Promedio</div>
            <div className="text-lg font-bold">{vaultStats.avgApy.toFixed(1)}%</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-indigo-200">Estrategias</div>
            <div className="text-lg font-bold">{vaultStats.activeStrategies}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'deposit', label: 'Deposit/Withdraw', icon: Plus },
            { id: 'strategies', label: 'Strategies', icon: BarChart3 },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'deposit' | 'strategies' | 'analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Assets in Vault</h3>
            
            <div className="grid gap-4">
              {mockAssets.map((asset) => (
                <div key={asset.symbol} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{asset.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{asset.name}</h4>
                        <p className="text-sm text-gray-500">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${asset.totalValue.toLocaleString()}</div>
                      <div className="text-sm text-green-600">+{asset.apy}% APY</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Wallet</div>
                      <div className="font-medium">{asset.balance} {asset.symbol}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">In Vault</div>
                      <div className="font-medium text-indigo-600">{asset.vaultBalance} {asset.symbol}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Yield Earned</div>
                      <div className="font-medium text-green-600">${asset.yieldEarned}</div>
                    </div>
                  </div>
                  
                  {asset.isStakeable && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600">Staked: {asset.stakedBalance} {asset.symbol}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deposit/Withdraw Tab */}
        {activeTab === 'deposit' && (
          <div className="space-y-6">
            {/* Asset Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Asset
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {mockAssets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      selectedAsset.symbol === asset.symbol
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-xl block mb-1">{asset.icon}</span>
                      <div className="text-sm font-medium">{asset.symbol}</div>
                      <div className="text-xs text-gray-500">Balance: {asset.balance}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Deposit Section */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Deposit to Vault
                </h4>
                <div className="space-y-3">
                  <div>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Amount to deposit"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="mt-1 text-sm text-gray-600">
                      Available: {selectedAsset.balance} {selectedAsset.symbol}
                    </div>
                  </div>
                  <button
                    onClick={() => depositAmount && simulateVaultAction('deposit', parseFloat(depositAmount))}
                    disabled={!depositAmount || isProcessing}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing && processingAction.includes('deposit') ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Depositing...
                      </div>
                    ) : (
                      'Deposit'
                    )}
                  </button>
                </div>
              </div>

              {/* Withdraw Section */}
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                  <Minus className="w-4 h-4" />
                  Withdraw from Vault
                </h4>
                <div className="space-y-3">
                  <div>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Amount to withdraw"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <div className="mt-1 text-sm text-gray-600">
                      In Vault: {selectedAsset.vaultBalance} {selectedAsset.symbol}
                    </div>
                  </div>
                  <button
                    onClick={() => withdrawAmount && simulateVaultAction('withdraw', parseFloat(withdrawAmount))}
                    disabled={!withdrawAmount || isProcessing}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing && processingAction.includes('withdraw') ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Withdrawing...
                      </div>
                    ) : (
                      'Withdraw'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Available Yield Strategies</h3>
            
            <div className="grid gap-4">
              {vaultStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedStrategy.id === strategy.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedStrategy(strategy)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                      <p className="text-sm text-gray-600">{strategy.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{strategy.apy}% APY</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(strategy.risk)}`}>
                        {strategy.risk} Risk
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-gray-500">Min Deposit</div>
                      <div className="font-medium">${strategy.minDeposit.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">TVL</div>
                      <div className="font-medium">${strategy.currentTVL.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Lock Period</div>
                      <div className="font-medium">{strategy.lockPeriod}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Rewards</div>
                      <div className="font-medium">{strategy.rewards.join(', ')}</div>
                    </div>
                  </div>
                  
                  {selectedStrategy.id === strategy.id && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => simulateVaultAction('stake', 1000)}
                        disabled={isProcessing}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            Joining Strategy...
                          </div>
                        ) : (
                          'Join Strategy'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Vault Analytics</h3>
            
            {/* Performance Metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-700">+24.8%</div>
                    <div className="text-sm text-green-600">Total Returns (30d)</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-700">99.9%</div>
                    <div className="text-sm text-blue-600">Security Score</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-purple-700">0.95</div>
                    <div className="text-sm text-purple-600">Sharpe Ratio</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Risk Assessment */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Smart Contract Risk</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">Low</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Liquidity Risk</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">Medium</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Market Risk</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-red-600">Medium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-indigo-900 mb-1">
                Enterprise-Grade Security
              </h4>
              <p className="text-xs text-indigo-700">
                All assets are protected by multi-signature wallets, time-locks, and undergo regular security audits. Smart contracts are verified and open-source.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}