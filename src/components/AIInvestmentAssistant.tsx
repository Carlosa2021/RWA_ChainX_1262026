"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface InvestmentAdvice {
  score: number;
  recommendation: string;
  risks: string[];
  opportunities: string[];
  marketAnalysis: string;
  priceTarget: number;
  timeframe: string;
}

interface PropertyData {
  id: string;
  title: string;
  price: number;
  location: string;
  roi: number;
  type: string;
}

interface PortfolioItem {
  id: string;
  amount: number;
  value: number;
}

interface AIInvestmentAssistantProps {
  property?: PropertyData;
  userProfile?: {
    riskTolerance: 'low' | 'medium' | 'high';
    investmentGoals: string[];
    portfolio: PortfolioItem[];
  };
  className?: string;
}

export default function AIInvestmentAssistant({ 
  property, 
  userProfile, // TODO: Usar para personalizar análisis AI en futuras versiones
  className = "" 
}: AIInvestmentAssistantProps) {
  const [advice, setAdvice] = useState<InvestmentAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [userInput, setUserInput] = useState('');

  // Simular análisis AI mientras configuramos thirdweb completamente
  const simulateAIAnalysis = async (propertyData: PropertyData) => {
    return new Promise<InvestmentAdvice>((resolve) => {
      setTimeout(() => {
        const score = 75 + Math.random() * 20; // Score entre 75-95
        resolve({
          score: Math.round(score),
          recommendation: score > 85 ? 'COMPRA FUERTE' : score > 75 ? 'COMPRA' : 'MANTENER',
          risks: [
            'Fluctuación del mercado inmobiliario',
            'Volatilidad de tokens',
            'Riesgo regulatorio'
          ],
          opportunities: [
            'Diversificación blockchain',
            'Rendimientos superiores al mercado',
            'Liquidez mejorada'
          ],
          marketAnalysis: `Propiedad en ${propertyData.location} muestra tendencia alcista. ROI proyectado del ${propertyData.roi}% es superior al promedio del sector.`,
          priceTarget: propertyData.price * (1 + Math.random() * 0.3),
          timeframe: '12-24 meses'
        });
      }, 1500);
    });
  };

  const getAIAnalysis = useCallback(async () => {
    if (!property) return;
    
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar con thirdweb AI cuando tengamos client ID real
      const analysis = await simulateAIAnalysis(property);
      setAdvice(analysis);
    } catch (err) {
      setError('Error al obtener análisis AI');
      console.error('AI Analysis Error:', err);
    } finally {
      setLoading(false);
    }
  }, [property]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [...chatMessages, { role: 'user' as const, content: userInput }];
    setChatMessages(newMessages);
    
    // Simular respuesta AI
    setTimeout(() => {
      const aiResponse = generateAIResponse(userInput, property);
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    }, 1000);

    setUserInput('');
  };

  const generateAIResponse = (question: string, prop?: PropertyData) => {
    const responses = [
      `Basado en el análisis de ${prop?.location}, recomiendo considerar esta inversión por su potencial de crecimiento.`,
      'Los datos de mercado muestran una tendencia positiva para propiedades tokenizadas en esta área.',
      'Tu perfil de riesgo se alinea bien con este tipo de inversión inmobiliaria.',
      'Considera diversificar tu cartera con un 15-20% en tokens inmobiliarios.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  useEffect(() => {
    if (property) {
      getAIAnalysis();
    }
  }, [property, getAIAnalysis]);

  if (!property) {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Asistente de Inversión AI
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Selecciona una propiedad para obtener análisis inteligente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Análisis AI: {property.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by Blockchain Intelligence
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Analizando con AI...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {advice && (
        <div className="space-y-6">
          {/* Score y Recomendación */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Score de Inversión</span>
              <span className={`text-lg font-bold ${advice.score > 85 ? 'text-green-600' : advice.score > 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                {advice.score}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full ${advice.score > 85 ? 'bg-green-500' : advice.score > 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${advice.score}%` }}
              ></div>
            </div>
            <p className={`text-sm font-semibold ${advice.score > 85 ? 'text-green-700 dark:text-green-300' : advice.score > 75 ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'}`}>
              {advice.recommendation}
            </p>
          </div>

          {/* Análisis de Mercado */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Análisis de Mercado</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{advice.marketAnalysis}</p>
          </div>

          {/* Predicción de Precio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-xs text-blue-600 dark:text-blue-300 font-medium">PRECIO OBJETIVO</p>
              <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                €{advice.priceTarget.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">TIMEFRAME</p>
              <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                {advice.timeframe}
              </p>
            </div>
          </div>

          {/* Riesgos y Oportunidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Riesgos
              </h4>
              <ul className="space-y-1">
                {advice.risks.map((risk, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Oportunidades
              </h4>
              <ul className="space-y-1">
                {advice.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="mt-6 border-t dark:border-gray-700 pt-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Consulta al Asistente AI</h4>
        
        {/* Messages */}
        <div className="max-h-40 overflow-y-auto mb-3 space-y-2">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`p-2 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 ml-8' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-8'
            }`}>
              <span className="font-medium">{msg.role === 'user' ? 'Tú:' : 'AI:'}</span> {msg.content}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Pregunta sobre esta inversión..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <button
            type="submit"
            disabled={!userInput.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}