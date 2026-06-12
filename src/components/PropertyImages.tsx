"use client";

import { useState } from "react";
import { FileImage, ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

interface PropertyImagesProps {
  images: string[];
  projectName: string;
  className?: string;
}

export function PropertyImages({ images, projectName, className = "" }: PropertyImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <FileImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Sin imágenes disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Imagen principal en la tarjeta - SIN ZOOM INTERNO */}
      <div className={`relative w-full h-full ${className}`}>
        <div 
          className="relative overflow-hidden rounded-xl cursor-pointer group h-full"
          onClick={openModal}
        >
          <img
            src={images[currentIndex]}
            alt={`${projectName} - Imagen ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            draggable={false}
          />
          
          {/* Overlay simplificado */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            {/* Icono de zoom */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-2 bg-black/80 text-white rounded-full">
                <ZoomIn className="w-5 h-5" />
              </div>
            </div>

            {/* Botones de navegación simplificados */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="Imagen anterior"
                >
                  <div className="p-2 bg-black/80 text-white rounded-full hover:bg-black transition-colors duration-200">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="Siguiente imagen"
                >
                  <div className="p-2 bg-black/80 text-white rounded-full hover:bg-black transition-colors duration-200">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              </>
            )}

            {/* Texto de instrucción simplificado */}
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/80 text-white rounded-lg px-3 py-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <ZoomIn className="w-4 h-4" />
                  Click para ampliar
                </p>
              </div>
            </div>

            {/* Indicador de imagen actual */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/80 text-white px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold">
                    {currentIndex + 1} / {images.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de imagen ampliada */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-3 bg-black/80 text-white rounded-full backdrop-blur-sm shadow-lg z-10 hover:bg-black transition-colors duration-200"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Imagen ampliada */}
            <div className="relative w-full h-full flex items-center justify-center p-16">
              <img
                src={images[currentIndex]}
                alt={`${projectName} - Imagen ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
              />

              {/* Controles de navegación en modal */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/80 text-white rounded-full backdrop-blur-sm shadow-lg hover:bg-black transition-colors duration-200"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/80 text-white rounded-full backdrop-blur-sm shadow-lg hover:bg-black transition-colors duration-200"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}

              {/* Información de la imagen en modal */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg pointer-events-none">
                <span className="text-white text-sm font-semibold">
                  {currentIndex + 1} / {images.length} - {projectName}
                </span>
              </div>

              {/* Thumbnails en modal */}
              {images.length > 1 && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 max-w-md">
                  <div className="flex gap-2 overflow-x-auto bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors duration-200 ${
                          index === currentIndex 
                            ? "border-white" 
                            : "border-white/30 hover:border-white/60"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}