"use client";

// Force Vercel redeploy - v2.0
import React, { useState } from 'react';
import { EnhancedPropertyCard } from '@/components/EnhancedPropertyCard';
import SmartPaymentsDashboard from '@/components/SmartPaymentsDashboard';
import AIInvestmentAssistant from '@/components/AIInvestmentAssistant';
import { SalesShowcaseBanner } from '@/components/SalesShowcaseBanner';
import Footer from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Brain, CreditCard, TrendingUp, Sparkles, Lock } from 'lucide-react';
import { useFeatureGuard } from '@/hooks/useFeatureGuard';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { logger } from '@/lib/logger';

// Datos de ejemplo para las propiedades
const sampleProperties = [
  {
    id: "torre-valencia-premium",
    name: "Torre Valencia Premium",
    location: "Valencia, España",
    totalValue: "€2.5M",
    pricePerToken: "€20",
    tokensAvailable: 8500,
    tokensTotal: 12500,
    apy: "12.5%",
    status: "active" as const,
    progress: 68,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop"
    ],
    investors: 23,
    minInvestment: 1000,
    maxInvestment: 50000
  },
  {
    id: "residencial-barcelona",
    name: "Residencial Barcelona Luxury",
    location: "Barcelona, Cataluña",
    totalValue: "€3.2M",
    pricePerToken: "€25",
    tokensAvailable: 4200,
    tokensTotal: 12800,
    apy: "14.2%",
    status: "active" as const,
    progress: 67,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1566908829077-2e3b0a8b4c8c?w=500&h=300&fit=crop"
    ],
    investors: 31,
    minInvestment: 1500,
    maxInvestment: 75000
  },
  {
    id: "oficinas-madrid-centro",
    name: "Oficinas Madrid Centro",
    location: "Madrid, España",
    totalValue: "€4.1M",
    pricePerToken: "€30",
    tokensAvailable: 2100,
    tokensTotal: 13667,
    apy: "11.8%",
    status: "active" as const,
    progress: 85,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&h=300&fit=crop"
    ],
    investors: 45,
    minInvestment: 2000,
    maxInvestment: 100000
  },
  {
    id: "sevilla-innovation-hub",
    name: "Sevilla Innovation Hub",
    location: "Sevilla, Andalucía",
    totalValue: "€1.8M",
    pricePerToken: "€15",
    tokensAvailable: 12000,
    tokensTotal: 12000,
    apy: "15.3%",
    status: "upcoming" as const,
    progress: 0,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&h=300&fit=crop"
    ],
    investors: 0,
    minInvestment: 500,
    maxInvestment: 25000
  }
];

export default function AIPaymentsShowcase() {
  // Feature Guard Protection
  const { hasAccess, showUpgradePrompt, upgradePromptOpen, closeUpgradePrompt, requiredFeature } = useFeatureGuard('aiEnabled', 'AI Showcase');
  
  const [selectedProperty, setSelectedProperty] = useState(sampleProperties[0]);
  const [view, setView] = useState<'properties' | 'dashboard' | 'ai'>('properties');

  // If user doesn't have access, return the locked page
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
                  <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    AI Showcase Locked
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    The AI Showcase feature is available in Pro and Enterprise plans
                  </p>
                  <button
                    onClick={showUpgradePrompt}
                    className="px-8 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
                  >
                    Upgrade Plan
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

  const handleInvest = (propertyId: string) => {
    logger.info(`Inversión iniciada para: ${propertyId}`);
  };

  // Convertir propiedad para el AI
  const propertyDataForAI = {
    id: selectedProperty.id,
    title: selectedProperty.name,
    price: parseFloat(selectedProperty.pricePerToken.replace(/[€,]/g, '')),
    location: selectedProperty.location,
    roi: parseFloat(selectedProperty.apy.replace('%', '')),
    type: 'mixed'
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Header Espectacular para Ventas */}
      <SalesShowcaseBanner />

      {/* Navegación de Vistas */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              {[
                { id: 'properties', label: 'Propiedades AI', icon: Brain, desc: 'Con análisis inteligente' },
                { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, desc: 'Analytics en tiempo real' },
                { id: 'ai', label: 'Asistente AI', icon: Sparkles, desc: 'Consultor personal' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id as 'properties' | 'dashboard' | 'ai')}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                    view === tab.id
                      ? 'bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs opacity-80">{tab.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vista de Propiedades con AI */}
        {view === 'properties' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                🏠 Propiedades Inteligentes
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Cada propiedad incluye análisis AI en tiempo real, predicciones de ROI y sistema de pagos instantáneo
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {sampleProperties.map((property) => (
                <EnhancedPropertyCard
                  key={property.id}
                  name={property.name}
                  location={property.location}
                  totalValue={property.totalValue}
                  pricePerToken={property.pricePerToken}
                  tokensAvailable={property.tokensAvailable}
                  tokensTotal={property.tokensTotal}
                  apy={property.apy}
                  status={property.status}
                  progress={property.progress}
                  image={property.image}
                  images={property.images}
                  investors={property.investors}
                  minInvestment={property.minInvestment}
                  maxInvestment={property.maxInvestment}
                  onInvest={() => handleInvest(property.id)}
                />
              ))}
            </div>

            {/* Características destacadas */}
            <div className="mt-16 bg-linear-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                🚀 Características Revolucionarias
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Análisis AI</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Score automático, predicciones ROI y análisis de riesgos en tiempo real
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pagos Instantáneos</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Fiat-to-crypto directo: EUR, USD, USDC, USDT, ETH con fees mínimos
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">ROI Superior</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Rendimientos del 12-15% anuales con liquidez blockchain mejorada
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista Dashboard */}
        {view === 'dashboard' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                📊 Dashboard Inteligente
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Analytics en tiempo real, gestión automática y insights AI para optimizar tu cartera
              </p>
            </div>

            <SmartPaymentsDashboard className="max-w-6xl mx-auto" />
          </div>
        )}

        {/* Vista Asistente AI */}
        {view === 'ai' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                🤖 Asistente de Inversión AI
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Consultor personal con inteligencia artificial para analizar cualquier propiedad
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {/* Selector de Propiedad */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona una propiedad para análisis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleProperties.map((property) => (
                    <button
                      key={property.id}
                      onClick={() => setSelectedProperty(property)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedProperty.id === property.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {property.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {property.location} • ROI {property.apy}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Asistente AI */}
              <AIInvestmentAssistant 
                property={propertyDataForAI}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer con Info */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              🔥 La plataforma más disruptiva del mercado inmobiliario
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
              Combinamos inteligencia artificial, pagos instantáneos y tokenización blockchain 
              para crear una experiencia de inversión inmobiliaria sin precedentes. 
              Desarrollado por ChainX para máxima seguridad y escalabilidad.
            </p>
            
            <div className="flex justify-center gap-8 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>AI Avanzado Integrado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Pagos Multi-moneda</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Analytics Tiempo Real</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>ROI 12-15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
