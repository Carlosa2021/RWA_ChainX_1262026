"use client";

import { useState } from "react";
import { MapPin, TrendingUp, Users, CheckCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface SimplePropertyCardProps {
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
  onInvest: () => void;
}

export function SimplePropertyCard({
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
  onInvest,
}: SimplePropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const propertyImages = images && images.length > 0 ? images : [image];
  const isFullyFunded = progress >= 100;

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
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Tarjeta Principal - Estilo Apple/Thirdweb */}
      <div className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
        
        {/* Sección de Imagen */}
        <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <img
            src={propertyImages[currentImageIndex]}
            alt={`${name} - Imagen ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Badge de Estado - Minimalista */}
          <div className="absolute top-4 left-4">
            {isFullyFunded ? (
              <div className="backdrop-blur-xl bg-green-500/90 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg">
                <CheckCircle className="w-4 h-4" />
                Financiado
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-purple-500/90 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                Activo
              </div>
            )}
          </div>

          {/* Controles de Carrusel - Glassmorphism */}
          {propertyImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full transition-all border border-white/20"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full transition-all border border-white/20"
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

          {/* Botón para Ampliar */}
          <button
            onClick={openModal}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
            aria-label="Ampliar imagen"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido - Tipografía Apple */}
        <div className="p-6">
          {/* Título y Ubicación */}
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {name}
            </h3>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm line-clamp-1">{location}</span>
            </div>
          </div>

          {/* Estadísticas - Grid minimalista */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Valor Total</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{totalValue}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Precio Token</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{pricePerToken}</p>
            </div>
          </div>

          {/* Barra de Progreso - Estilo moderno */}
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {progress.toFixed(1)}% completado
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {tokensAvailable}/{tokensTotal} tokens
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-500 shadow-lg"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Footer - Limpio */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold text-sm">{apy}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{investors}</span>
              </div>
            </div>
            <button
              onClick={onInvest}
              disabled={isFullyFunded}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                isFullyFunded
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
              }`}
            >
              {isFullyFunded ? "Completo" : "Invertir"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Glassmorphism */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-6xl max-h-full">
            <img
              src={propertyImages[currentImageIndex]}
              alt={`${name} - Imagen ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
            
            {/* Botón Cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
            >
              ✕
            </button>

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
          
          {/* Click para cerrar */}
          <div className="absolute inset-0 -z-10" onClick={closeModal} />
        </div>
      )}
    </>
  );
}