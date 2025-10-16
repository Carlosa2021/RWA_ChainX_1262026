"use client";

import Link from "next/link";
import { Brain, Sparkles, TrendingUp, CreditCard, ArrowRight, X } from "lucide-react";
import { useState } from "react";

export function AIShowcaseBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute top-8 right-20 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-6 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-80"></div>
        <div className="absolute bottom-10 right-1/3 w-5 h-5 bg-white rounded-full animate-ping opacity-40"></div>
      </div>

      <div className="relative container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Icono principal */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">🚀 Nueva Experiencia AI + Payments</h3>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  ¡NUEVO!
                </span>
              </div>
              <p className="text-blue-100 text-lg">
                Descubre la plataforma más avanzada de tokenización inmobiliaria con IA integrada
              </p>
              
              {/* Características destacadas */}
              <div className="flex items-center gap-6 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-yellow-300" />
                  <span>Análisis AI en tiempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-300" />
                  <span>Pagos fiat-to-crypto</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-300" />
                  <span>ROI 12-15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-4">
            <Link
              href="/ai-showcase"
              className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-xl transition-all hover:scale-105 group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="font-semibold">Explorar AI Showcase</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Botón cerrar */}
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Cerrar banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de progreso animada */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 animate-pulse"></div>
      </div>
    </div>
  );
}