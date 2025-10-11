"use client";

import { MapPin, TrendingUp, Users, CheckCircle } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  name: string;
  location: string;
  totalValue: string;
  pricePerToken: string;
  tokensAvailable: number;
  tokensTotal: number;
  apy: string;
  status: "active" | "funded";
  progress: number;
  image: string;
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
  status,
  progress,
  image,
  investors = 15,
  onInvest,
}: ProjectCardProps) {
  const isFullyFunded = progress >= 100;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isFullyFunded && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg">
            <CheckCircle className="w-5 h-5" />
            ¡Financiado!
          </div>
        )}
        {!isFullyFunded && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
            Activo
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Location */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {name}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Valor Total</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalValue}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Precio Token</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{pricePerToken}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {progress.toFixed(1)}% completado
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">{apy}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Users className="w-5 h-5" />
              <span className="text-sm">{investors}</span>
            </div>
          </div>
          <button
            onClick={onInvest}
            disabled={isFullyFunded}
            className={`
              px-6 py-2.5 rounded-xl font-semibold transition-all
              ${isFullyFunded 
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:shadow-orange-500/30"
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
