"use client";

import { useState } from 'react';
import { CheckCircle, Building, MapPin, TrendingUp, CreditCard, Sparkles, Lock } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import ThirdwebPayDemo from '../../components/ThirdwebPayDemo';
import { useFeatureGuard } from '../../hooks/useFeatureGuard';
import { UpgradePrompt } from '../../components/UpgradePrompt';

const sampleProperties = [
  {
    id: "1",
    name: "Torre Mediterráneo Premium",
    location: "Valencia, España",
    image: "/images/projects/torre-mediterraneo.jpg",
    pricePerToken: 1000,
    totalTokens: 50000,
    roi: 8.5,
    description: "Desarrollo residencial de lujo en el corazón de Valencia"
  },
  {
    id: "2", 
    name: "Residencial Costa Blanca",
    location: "Alicante, España",
    image: "/images/projects/costa-blanca.jpg",
    pricePerToken: 750,
    totalTokens: 75000,
    roi: 7.2,
    description: "Complejo residencial frente al mar Mediterráneo"
  },
  {
    id: "3",
    name: "Centro Comercial Madrid Norte",
    location: "Madrid, España", 
    image: "/images/projects/centro-comercial.jpg",
    pricePerToken: 2000,
    totalTokens: 25000,
    roi: 9.1,
    description: "Centro comercial estratégicamente ubicado en Madrid"
  }
];

export default function PaymentsPage() {
  // Feature Guard Protection
  const { hasAccess, showUpgradePrompt, upgradePromptOpen, closeUpgradePrompt, requiredFeature } = useFeatureGuard('payEnabled', 'Pay');
  
  const [selectedProperty, setSelectedProperty] = useState(sampleProperties[0]);
  const [tokensDesired, setTokensDesired] = useState(10);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

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
                  <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Pay Feature Locked
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    The Pay feature is available in Pro and Enterprise plans
                  </p>
                  <button
                    onClick={showUpgradePrompt}
                    className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
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

  const totalInvestment = tokensDesired * selectedProperty.pricePerToken;
  const minInvestment = selectedProperty.pricePerToken;
  const maxInvestment = selectedProperty.pricePerToken * 100;

  const handlePaymentSuccess = (txHash: string) => {
    setTransactionHash(txHash);
    setPaymentCompleted(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Hero Section */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-8 h-8" />
                <h1 className="text-3xl font-bold">thirdweb Pay Integration</h1>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  DEMO
                </span>
              </div>
              <p className="text-xl text-blue-100 mb-6">
                Experiencia de pagos fiat-to-crypto perfecta para inversiones inmobiliarias
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">💳 Múltiples Métodos</h3>
                <p className="text-sm text-blue-100">Tarjetas, PayPal, Crypto, Transferencias</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🔒 Seguridad Total</h3>
                <p className="text-sm text-blue-100">Encriptación bancaria y cumplimiento PCI</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">⚡ Conversión Instantánea</h3>
                <p className="text-sm text-blue-100">De fiat a tokens en segundos</p>
              </div>
            </div>
          </div>

          {!paymentCompleted ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Sección de Selección de Propiedad */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Selecciona una Propiedad
                  </h2>
                  
                  <div className="space-y-4">
                    {sampleProperties.map((property) => (
                      <div
                        key={property.id}
                        onClick={() => setSelectedProperty(property)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedProperty.id === property.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={property.image}
                            alt={property.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{property.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <MapPin className="w-4 h-4" />
                              {property.location}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{property.description}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                €{property.pricePerToken.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}/token
                              </span>
                              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-semibold">{property.roi}% ROI</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Configuración de Inversión */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Configurar Inversión
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cantidad de Tokens
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={tokensDesired}
                        onChange={(e) => setTokensDesired(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Número de tokens"
                      />
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Tokens seleccionados:</span>
                          <span className="font-semibold dark:text-white">{tokensDesired}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Precio por token:</span>
                          <span className="font-semibold dark:text-white">€{selectedProperty.pricePerToken.toLocaleString()}</span>
                        </div>
                        <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-bold text-blue-600 dark:text-blue-400">
                          <span>Total de inversión:</span>
                          <span>€{totalInvestment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>ROI proyectado:</span>
                          <span className="font-semibold">{selectedProperty.roi}% anual</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de Pago con thirdweb Pay */}
              <div className="lg:sticky lg:top-8">
                <ThirdwebPayDemo
                  propertyId={selectedProperty.id}
                  propertyName={selectedProperty.name}
                  propertyPrice={selectedProperty.pricePerToken}
                  minInvestment={minInvestment}
                  maxInvestment={maxInvestment}
                  onPaymentSuccess={handlePaymentSuccess}
                  className="shadow-lg"
                />
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
                  ¡Inversión Completada!
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  Tu pago se ha procesado exitosamente usando thirdweb Pay
                </p>
                
                <div className="bg-green-50 rounded-lg p-6 mb-8">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Propiedad:</span>
                      <span className="font-semibold text-green-700">{selectedProperty.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tokens adquiridos:</span>
                      <span className="font-semibold text-green-700">{tokensDesired}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Inversión total:</span>
                      <span className="font-semibold text-green-700">€{totalInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hash de transacción:</span>
                      <span className="font-mono text-xs text-green-700 break-all">
                        {transactionHash}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setPaymentCompleted(false);
                      setTransactionHash('');
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Nueva Inversión
                  </button>
                  <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    Ver Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Documentación y Características */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Características de thirdweb Pay
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🎯 Conversión Directa</h3>
                <p className="text-sm text-blue-700">
                  Los usuarios pueden pagar con fiat y recibir tokens directamente, sin necesidad de convertir manualmente a crypto.
                </p>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🌍 Global</h3>
                <p className="text-sm text-purple-700">
                  Acepta pagos de todo el mundo con múltiples monedas y métodos de pago regionales.
                </p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">📱 Móvil Optimizado</h3>
                <p className="text-sm text-green-700">
                  Experiencia perfecta en dispositivos móviles con Apple Pay, Google Pay y más.
                </p>
              </div>
              
              <div className="p-6 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">⚡ Rápido</h3>
                <p className="text-sm text-yellow-700">
                  Transacciones procesadas en segundos con confirmación instantánea en blockchain.
                </p>
              </div>
              
              <div className="p-6 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">🔒 Seguro</h3>
                <p className="text-sm text-red-700">
                  Cumplimiento PCI DSS, encriptación end-to-end y protección contra fraude.
                </p>
              </div>
              
              <div className="p-6 bg-indigo-50 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">🛠️ Fácil Integración</h3>
                <p className="text-sm text-indigo-700">
                  SDK simple que se integra con cualquier aplicación web3 en minutos.
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
