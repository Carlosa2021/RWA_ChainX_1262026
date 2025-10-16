"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  Brain, 
  CreditCard,
  BarChart3,
  PieChart,
  DollarSign,
  Activity,
  Shield,
  Bell
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'dividend';
  property: string;
  amount: number;
  tokens: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface PortfolioMetric {
  label: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
}

interface SmartPaymentsDashboardProps {
  userId?: string;
  className?: string;
}

export default function SmartPaymentsDashboard({
  className = ""
}: SmartPaymentsDashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetric[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'analytics' | 'ai'>('overview');

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setMetrics([
        {
          label: 'Valor Total Cartera',
          value: '€125,430',
          change: 8.2,
          changeType: 'positive',
          icon: Wallet
        },
        {
          label: 'ROI Promedio',
          value: '12.5%',
          change: 2.1,
          changeType: 'positive',
          icon: TrendingUp
        },
        {
          label: 'Propiedades Activas',
          value: '7',
          change: 0,
          changeType: 'neutral',
          icon: Target
        },
        {
          label: 'Ingresos Mes',
          value: '€3,240',
          change: -1.2,
          changeType: 'negative',
          icon: DollarSign
        }
      ]);

      setTransactions([
        {
          id: 'tx1',
          type: 'buy',
          property: 'Torre Valencia Premium',
          amount: 5000,
          tokens: 250,
          date: '2024-01-15',
          status: 'completed'
        },
        {
          id: 'tx2',
          type: 'dividend',
          property: 'Residencial Barcelona',
          amount: 340,
          tokens: 0,
          date: '2024-01-10',
          status: 'completed'
        },
        {
          id: 'tx3',
          type: 'buy',
          property: 'Oficinas Madrid Centro',
          amount: 2500,
          tokens: 125,
          date: '2024-01-08',
          status: 'pending'
        }
      ]);

      setAiInsights([
        'Recomendamos incrementar exposición al sector residencial en un 15%',
        'Valencia muestra tendencia alcista - considera aumentar posición',
        'Próximos dividendos estimados: €2,840 en los próximos 30 días',
        'Oportunidad: Nueva propiedad en Sevilla con ROI proyectado del 14%'
      ]);

      setLoading(false);
    }, 1500);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      case 'failed': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return '📈';
      case 'sell': return '📉';
      case 'dividend': return '💰';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-300">Cargando dashboard inteligente...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard Inteligente
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gestión automatizada de cartera con AI • ChainX Technology
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">En vivo</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mt-6">
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'transactions', label: 'Transacciones', icon: CreditCard },
            { id: 'analytics', label: 'Analytics', icon: PieChart },
            { id: 'ai', label: 'AI Insights', icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'transactions' | 'analytics' | 'ai')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <metric.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.changeType === 'positive' ? 'text-green-600' :
                      metric.changeType === 'negative' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {metric.changeType === 'positive' && <TrendingUp className="w-4 h-4" />}
                      {metric.changeType === 'negative' && <TrendingDown className="w-4 h-4" />}
                      {metric.change !== 0 && `${metric.change > 0 ? '+' : ''}${metric.change}%`}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {metric.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Gráfico de Rendimiento */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Rendimiento de Cartera (12 meses)
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Gráfico interactivo aquí
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    +12.5% crecimiento anual
                  </p>
                </div>
              </div>
            </div>

            {/* Alertas AI */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  Alertas Inteligentes
                </h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-300">
                    Nuevo dividendo: €340 - Residencial Barcelona
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700 dark:text-blue-300">
                    Oportunidad de rebalanceo detectada
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Historial de Transacciones
              </h3>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Exportar
              </button>
            </div>

            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(tx.type)}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {tx.property}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(tx.date).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className={`text-sm ${getStatusColor(tx.status)}`}>
                        {tx.status === 'completed' ? 'Completado' :
                         tx.status === 'pending' ? 'Pendiente' : 'Fallido'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analytics Avanzados
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribución por Ubicación */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Distribución Geográfica
                </h4>
                <div className="h-48 flex items-center justify-center">
                  <PieChart className="w-24 h-24 text-blue-500" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Valencia</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Barcelona</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Madrid</span>
                    <span className="font-medium">22%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Otros</span>
                    <span className="font-medium">15%</span>
                  </div>
                </div>
              </div>

              {/* ROI por Categoría */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  ROI por Tipo de Propiedad
                </h4>
                <div className="h-48 flex items-center justify-center">
                  <BarChart3 className="w-24 h-24 text-green-500" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Residencial</span>
                    <span className="font-medium text-green-600">14.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Comercial</span>
                    <span className="font-medium text-green-600">11.8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Oficinas</span>
                    <span className="font-medium text-green-600">9.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Insights de Inteligencia Artificial
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Análisis y recomendaciones personalizadas
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">{insight}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Acciones Recomendadas */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                Acciones Recomendadas
              </h4>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white p-3 rounded-lg font-medium transition-all">
                  🏠 Explorar Propiedad en Sevilla (ROI 14%)
                </button>
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white p-3 rounded-lg font-medium transition-all">
                  📊 Rebalancear Cartera Automáticamente
                </button>
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-3 rounded-lg font-medium transition-all">
                  💰 Configurar Auto-Reinversión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con Seguridad */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Datos encriptados y seguros</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </div>
        </div>
      </div>
    </div>
  );
}