"use client";

import { MapPin, TrendingUp, Users, CheckCircle } from "lucide-react";
import { PropertyImages } from "./PropertyImages";

interface ProjectCardProps {
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

export function ProjectCard({
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
}: ProjectCardProps) {
  const isFullyFunded = progress >= 100;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
      {/* Image Gallery - Aumentamos la altura y hacemos flex-shrink-0 */}
      <div className="relative h-64 flex-shrink-0">
        <PropertyImages
          images={images && images.length > 0 ? images : [image]}
          projectName={name}
          className="h-full"
        />
        
        {isFullyFunded && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 font-semibold shadow-lg z-10 text-sm">
            <CheckCircle className="w-4 h-4" />
            ¡Financiado!
          </div>
        )}
        {!isFullyFunded && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-full font-semibold shadow-lg z-10 text-sm">
            Activo
          </div>
        )}
      </div>

      {/* Content - Compactamos el contenido */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title & Location */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Stats - Compactamos */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Valor Total</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalValue}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Precio Token</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{pricePerToken}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {progress.toFixed(1)}% completado
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {tokensAvailable}/{tokensTotal} tokens
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Footer - Compactamos */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">{apy}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{investors}</span>
            </div>
          </div>
          <button
            onClick={onInvest}
            disabled={isFullyFunded}
            className={`
              px-6 py-2 rounded-lg font-semibold transition-all text-sm
              ${isFullyFunded 
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105"
              }
            `}
          >
            {isFullyFunded ? "Completo" : "Invertir"}
          </button>
        </div>
      </div>
    </div>
  );
}
