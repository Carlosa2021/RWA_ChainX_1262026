"use client";

import { useState } from 'react';
import { CheckCircle, ArrowLeftRight, Network, TrendingUp, Shield, Zap, Globe, Clock } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import ThirdwebBridgeDemo from '../../components/ThirdwebBridgeDemo';

const networkStats = [
  {
    name: 'Ethereum',
    icon: '⟠',
    color: 'bg-blue-500',
    tvl: '$2.4B',
    volume24h: '$156M',
    avgTime: '15-30 min',
    fee: '~$12'
  },
  {
    name: 'Polygon',
    icon: '⬟',
    color: 'bg-purple-500',
    tvl: '$1.2B',
    volume24h: '$89M',
    avgTime: '5-10 min',
    fee: '~$0.50'
  },
  {
    name: 'BSC',
    icon: '●',
    color: 'bg-yellow-500',
    tvl: '$980M',
    volume24h: '$134M',
    avgTime: '3-5 min',
    fee: '~$2'
  },
  {
    name: 'Arbitrum',
    icon: '◆',
    color: 'bg-blue-600',
    tvl: '$1.8B',
    volume24h: '$78M',
    avgTime: '1-2 min',
    fee: '~$0.80'
  }
];

const bridgeFeatures = [
  {
    icon: Shield,
    title: 'Seguridad Máxima',
    description: 'Contratos auditados y validadores descentralizados protegen cada transferencia',
    color: 'text-emerald-600 bg-emerald-100'
  },
  {
    icon: Zap,
    title: 'Velocidad Optimizada',
    description: 'Algoritmos inteligentes seleccionan la ruta más rápida para cada transferencia',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: Globe,
    title: 'Multi-Chain',
    description: 'Soporte para todas las principales blockchains y más de 200 tokens',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    icon: Clock,
    title: 'Monitoreo 24/7',
    description: 'Seguimiento en tiempo real del estado de tus transferencias cross-chain',
    color: 'text-orange-600 bg-orange-100'
  }
];

export default function BridgePage() {
  const [bridgeCompleted, setBridgeCompleted] = useState(false);
  const [bridgeDetails, setBridgeDetails] = useState<{
    fromChain: string;
    toChain: string;
    token: string;
    amount: number;
    txHash: string;
  } | null>(null);

  const handleBridgeSuccess = (details: {
    fromChain: string;
    toChain: string;
    token: string;
    amount: number;
    txHash: string;
  }) => {
    setBridgeDetails(details);
    setBridgeCompleted(true);
  };

  const handleBridgeError = (error: string) => {
    console.error('Bridge error:', error);
    alert(`Error en el bridge: ${error}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center gap-3 mb-4">
                <ArrowLeftRight className="w-8 h-8" />
                <h1 className="text-3xl font-bold">thirdweb Bridge</h1>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  CROSS-CHAIN
                </span>
              </div>
              <p className="text-xl text-emerald-100 mb-6">
                Transfiere tus activos entre blockchains de forma segura y eficiente
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🌉 Multi-Chain</h3>
                <p className="text-sm text-emerald-100">Soporte para 10+ blockchains</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">⚡ Rápido</h3>
                <p className="text-sm text-emerald-100">Transferencias en minutos</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🔒 Seguro</h3>
                <p className="text-sm text-emerald-100">Contratos auditados</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">💰 Económico</h3>
                <p className="text-sm text-emerald-100">Comisiones optimizadas</p>
              </div>
            </div>
          </div>

          {!bridgeCompleted ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sección de Bridge */}
              <div className="lg:col-span-2">
                <ThirdwebBridgeDemo
                  onBridgeSuccess={handleBridgeSuccess}
                  onBridgeError={handleBridgeError}
                  className="shadow-lg"
                />
              </div>

              {/* Información y Estadísticas */}
              <div className="space-y-6">
                {/* Estadísticas de Redes */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5 text-emerald-600" />
                    Redes Soportadas
                  </h3>
                  <div className="space-y-4">
                    {networkStats.map((network) => (
                      <div key={network.name} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 ${network.color} rounded-full flex items-center justify-center text-white font-bold`}>
                            {network.icon}
                          </div>
                          <h4 className="font-semibold text-gray-900">{network.name}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">TVL:</span>
                            <span className="font-medium ml-1">{network.tvl}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">24h Vol:</span>
                            <span className="font-medium ml-1">{network.volume24h}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Tiempo:</span>
                            <span className="font-medium ml-1">{network.avgTime}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Comisión:</span>
                            <span className="font-medium ml-1">{network.fee}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actividad Reciente */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Actividad Reciente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">ETH → Polygon</div>
                        <div className="text-xs text-gray-500">250 USDC • 5 min ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">BSC → Arbitrum</div>
                        <div className="text-xs text-gray-500">1.5 ETH • 12 min ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Ethereum → BSC</div>
                        <div className="text-xs text-gray-500">500 USDT • Procesando...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Estado de Éxito */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  ¡Bridge Completado!
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  Tus activos han sido transferidos exitosamente entre blockchains
                </p>
                
                <div className="bg-green-50 rounded-lg p-6 mb-8">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desde:</span>
                      <span className="font-semibold text-green-700">{bridgeDetails?.fromChain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hacia:</span>
                      <span className="font-semibold text-green-700">{bridgeDetails?.toChain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Token:</span>
                      <span className="font-semibold text-green-700">{bridgeDetails?.token}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cantidad:</span>
                      <span className="font-semibold text-green-700">{bridgeDetails?.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hash de transacción:</span>
                      <span className="font-mono text-xs text-green-700 break-all">
                        {bridgeDetails?.txHash}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setBridgeCompleted(false);
                      setBridgeDetails(null);
                    }}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Nuevo Bridge
                  </button>
                  <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    Ver Transacción
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Características del Bridge */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                ¿Por qué usar thirdweb Bridge?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {bridgeFeatures.map((feature, index) => {
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

          {/* Casos de Uso */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Casos de Uso para Inversores Inmobiliarios
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">🏢 Diversificación de Portfolio</h3>
                <p className="text-gray-600 text-sm">
                  Distribuye tus tokens inmobiliarios en diferentes blockchains para optimizar costos y acceso.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">💰 Optimización de Comisiones</h3>
                <p className="text-gray-600 text-sm">
                  Transfiere activos a redes con menores costos de transacción para maximizar rendimientos.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">🔄 Liquidez Cross-Chain</h3>
                <p className="text-gray-600 text-sm">
                  Accede a diferentes pools de liquidez y mercados secundarios en múltiples blockchains.
                </p>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}