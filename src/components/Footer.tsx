"use client";

import React from 'react';
import { Heart, Shield, Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Línea superior con logo y tecnología */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-6 border-b border-gray-700">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              InmoToken
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              Democratizando la inversión inmobiliaria
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Blockchain Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">AI Integrado</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-gray-300">Made in Switzerland</span>
            </div>
          </div>
        </div>

        {/* Información de tecnología y derechos */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-blue-300 mb-2">🏗️ Tecnología</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Next.js 15 + React 19</li>
              <li>• Blockchain Polygon</li>
              <li>• IA Avanzada</li>
              <li>• Pagos Multi-currency</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-purple-300 mb-2">🌐 Conecta</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• dapp.inmotoken.es</li>
              <li>• Soporte 24/7</li>
              <li>• Documentación API</li>
              <li>• Comunidad Discord</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-green-300 mb-2">🎯 Ventajas</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Inversión desde 100€</li>
              <li>• Rentabilidad 8-12%</li>
              <li>• Liquidez inmediata</li>
              <li>• Sin intermediarios</li>
            </ul>
          </div>
        </div>

        {/* Línea de derechos de autor */}
        <div className="pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-gray-400 mb-2 md:mb-0">
              © {currentYear} <span className="font-bold text-blue-400">ChainX Technology</span>. 
              Todos los derechos reservados.
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Desarrollado por ChainX</span>
              <span>•</span>
              <span>Powered by AI</span>
              <span>•</span>
              <span>Versión 2.0</span>
            </div>
          </div>
          
          <div className="text-center mt-3 text-xs text-gray-500">
            <p>
              Plataforma avanzada de tokenización blockchain desarrollada por <strong>ChainX Technology</strong>.
              Tecnología blockchain + IA para el futuro de las inversiones.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}