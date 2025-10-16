"use client";

import { Brain, Sparkles, TrendingUp, CreditCard, Shield, Globe, Zap, Target } from "lucide-react";

export function SalesShowcaseBanner() {
  return (
    <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0">
        <div className="absolute top-8 left-16 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute top-12 right-24 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-8 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-80"></div>
        <div className="absolute bottom-12 right-1/3 w-5 h-5 bg-orange-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-1/2 left-12 w-6 h-6 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/3 right-16 w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
      </div>

      <div className="relative container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            LA PLATAFORMA RWA
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-100">
            MÁS AVANZADA DEL MUNDO
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            <span className="text-yellow-300 font-semibold">Primera y única</span> plataforma de tokenización inmobiliaria con 
            <span className="text-green-300 font-semibold"> IA nativa</span> y 
            <span className="text-blue-300 font-semibold"> pagos instantáneos</span> integrados
          </p>
        </div>

        {/* Grid de características únicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all hover:scale-105">
            <Brain className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">IA NATIVA</h3>
            <p className="text-sm text-gray-200">Análisis automático, predicciones ROI, chat inteligente</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all hover:scale-105">
            <CreditCard className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">PAGOS INSTANT.</h3>
            <p className="text-sm text-gray-200">EUR, USD, USDC, USDT, ETH sin fricciones</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all hover:scale-105">
            <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">ROI 12-15%</h3>
            <p className="text-sm text-gray-200">Rendimientos superiores con liquidez blockchain</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all hover:scale-105">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">COMPLIANCE</h3>
            <p className="text-sm text-gray-200">MiCA + ERC-3643 totalmente auditado</p>
          </div>
        </div>

        {/* Propuesta de valor única */}
        <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-lg border border-white/30 rounded-3xl p-8 mb-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Target className="w-8 h-8 text-orange-400" />
              ¿POR QUÉ ES IRRESISTIBLE?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4">
                <h4 className="font-bold text-yellow-300 mb-2">🚀 VENTAJA COMPETITIVA</h4>
                <p className="text-sm">Ninguna otra plataforma RWA tiene IA integrada. Te pone 2-3 años por delante.</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4">
                <h4 className="font-bold text-green-300 mb-2">💰 CONVERSIÓN MÁXIMA</h4>
                <p className="text-sm">Pagos sin fricciones = más inversores. UX que convierte visitantes en clientes.</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4">
                <h4 className="font-bold text-blue-300 mb-2">⚡ ESCALABILIDAD GLOBAL</h4>
                <p className="text-sm">ChainX + Polygon = infraestructura para millones de usuarios y transacciones.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas impactantes */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-yellow-300">📊 NÚMEROS QUE CONVENCEN</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl p-4">
              <div className="text-3xl font-black text-white">95%</div>
              <div className="text-sm text-gray-200">Precisión IA</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl p-4">
              <div className="text-3xl font-black text-white">&lt;30s</div>
              <div className="text-sm text-gray-200">Tiempo inversión</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl p-4">
              <div className="text-3xl font-black text-white">6</div>
              <div className="text-sm text-gray-200">Métodos pago</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-xl p-4">
              <div className="text-3xl font-black text-white">24/7</div>
              <div className="text-sm text-gray-200">Analytics IA</div>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center mt-10">
          <p className="text-lg text-gray-200 mb-4">
            <Globe className="w-5 h-5 inline mr-2" />
            Desplegada y funcionando en producción
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full border border-green-500/30">
              ✓ Demo Mode Activo
            </span>
            <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
              ✓ Acceso Completo
            </span>
            <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full border border-purple-500/30">
              ✓ Lista para Clientes
            </span>
          </div>
        </div>
      </div>

      {/* Barra de progreso animada de alta intensidad */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent">
        <div className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 animate-pulse"></div>
      </div>
    </div>
  );
}