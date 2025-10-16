"use client";

import { useState } from "react";
import { MapPin, TrendingUp, Users, CheckCircle, ChevronLeft, ChevronRight, Eye, Brain, CreditCard } from "lucide-react";
import AIInvestmentAssistant from './AIInvestmentAssistant';
import PaymentSystem from './PaymentSystem';

interface PropertyData {
  id: string;
  title: string;
  price: number;
  location: string;
  roi: number;
  type: string;
}

interface EnhancedPropertyCardProps {
  name: string;
  location: string;
  totalValue: string;
  pricePerToken: string;
  tokensAvailable: number;
  tokensTotal: number;
  apy: string;
  status: "active" | "funded" | "upcoming";
  progress: number;
  image: string;
  images?: string[];
  investors?: number;
  minInvestment?: number;
  maxInvestment?: number;
  onInvest: () => void;
}

export function EnhancedPropertyCard({
  name,
  location,
  totalValue,
  pricePerToken,
  tokensAvailable,
  tokensTotal,
  apy,
  progress,
  image,
  images,
  investors = 15,
  minInvestment = 1000,
  maxInvestment = 100000,
  onInvest,
}: EnhancedPropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  
  const propertyImages = images && images.length > 0 ? images : [image];
  const isFullyFunded = progress >= 100;
  
  // Convertir datos para el AI
  const propertyData: PropertyData = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    title: name,
    price: parseFloat(pricePerToken.replace(/[€,]/g, '')),
    location,
    roi: parseFloat(apy.replace('%', '')),
    type: 'residential'
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === propertyImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setShowAI(false);
    setShowPayments(false);
  };

  const handlePaymentSuccess = (details: {
    projectId: string;
    amount: number;
    tokens: number;
    paymentMethod: string;
    transactionId: string;
    timestamp: string;
  }) => {
    console.log('Pago exitoso:', details);
    alert(`¡Inversión exitosa! Has recibido ${details.tokens} tokens.`);
    closeModal();
    onInvest();
  };

  const handlePaymentError = (error: string) => {
    console.error('Error de pago:', error);
    alert(error);
  };

  return (
    <>
      {/* Tarjeta Principal */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        
        {/* Sección de Imagen */}
        <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
          <img
            src={propertyImages[currentImageIndex]}
            alt={`${name} - Imagen ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Badge de Estado */}
          <div className="absolute top-4 left-4">
            {isFullyFunded ? (
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Financiado
              </div>
            ) : (
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Activo
              </div>
            )}
          </div>

          {/* Nuevos botones AI y Payments */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => {
                setShowAI(true);
                openModal();
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors"
              title="Análisis AI"
            >
              <Brain className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => {
                setShowPayments(true);
                openModal();
              }}
              disabled={isFullyFunded}
              className={`text-white p-2 rounded-full transition-colors ${
                isFullyFunded 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              title="Pago Rápido"
            >
              <CreditCard className="w-5 h-5" />
            </button>

            <button
              onClick={openModal}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
              title="Ampliar imagen"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* Controles de Carrusel */}
          {propertyImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors mr-32"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Indicadores */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {propertyImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Título y Ubicación */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {name}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm line-clamp-1">{location}</span>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Valor Total</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{totalValue}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Precio Token</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{pricePerToken}</p>
            </div>
          </div>

          {/* Barra de Progreso */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                {progress.toFixed(1)}% completado
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {tokensAvailable}/{tokensTotal} tokens
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Footer con nuevas opciones */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">{apy}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">{investors}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAI(true);
                  openModal();
                }}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
              >
                <Brain className="w-4 h-4" />
                AI
              </button>
              
              <button
                onClick={isFullyFunded ? undefined : onInvest}
                disabled={isFullyFunded}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isFullyFunded
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                {isFullyFunded ? "Completo" : "Invertir"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Mejorado */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full flex gap-6">
            
            {/* Imagen Principal */}
            {!showAI && !showPayments && (
              <div className="flex-1 max-w-4xl">
                <img
                  src={propertyImages[currentImageIndex]}
                  alt={`${name} - Imagen ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                
                {/* Controles del Modal */}
                {propertyImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Info */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
                      {currentImageIndex + 1} / {propertyImages.length} - {name}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Panel AI */}
            {showAI && (
              <div className="w-full max-w-2xl max-h-full overflow-y-auto">
                <AIInvestmentAssistant 
                  property={propertyData}
                  className="max-h-[80vh]"
                />
              </div>
            )}

            {/* Panel de Pagos */}
            {showPayments && (
              <div className="w-full max-w-lg max-h-full overflow-y-auto">
                <PaymentSystem
                  projectId={propertyData.id}
                  tokenPrice={propertyData.price}
                  minInvestment={minInvestment}
                  maxInvestment={maxInvestment}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  className="max-h-[80vh]"
                />
              </div>
            )}

            {/* Controles del Modal */}
            <div className="absolute top-4 right-4 flex gap-2">
              {!showAI && !showPayments && (
                <>
                  <button
                    onClick={() => setShowAI(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-colors"
                    title="Análisis AI"
                  >
                    <Brain className="w-6 h-6" />
                  </button>
                  
                  {!isFullyFunded && (
                    <button
                      onClick={() => setShowPayments(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
                      title="Pago Rápido"
                    >
                      <CreditCard className="w-6 h-6" />
                    </button>
                  )}
                </>
              )}
              
              <button
                onClick={closeModal}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Navegación entre paneles */}
            {(showAI || showPayments) && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  onClick={() => {
                    setShowAI(false);
                    setShowPayments(false);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm"
                >
                  📷 Imágenes
                </button>
                <button
                  onClick={() => {
                    setShowAI(true);
                    setShowPayments(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    showAI ? 'bg-purple-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  🧠 AI
                </button>
                {!isFullyFunded && (
                  <button
                    onClick={() => {
                      setShowAI(false);
                      setShowPayments(true);
                    }}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      showPayments ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    💳 Pagar
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Click para cerrar */}
          <div className="absolute inset-0 -z-10" onClick={closeModal} />
        </div>
      )}
    </>
  );
}