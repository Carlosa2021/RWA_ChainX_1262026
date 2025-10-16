"use client";

import React, { useState } from 'react';

interface PaymentOption {
  id: string;
  name: string;
  icon: string;
  type: 'fiat' | 'crypto';
  currencies: string[];
}

interface PaymentDetails {
  projectId: string;
  amount: number;
  tokens: number;
  paymentMethod: string;
  transactionId: string;
  timestamp: string;
}

interface PaymentSystemProps {
  projectId: string;
  tokenPrice: number;
  minInvestment: number;
  maxInvestment: number;
  onPaymentSuccess?: (details: PaymentDetails) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
}

export default function PaymentSystem({
  projectId,
  tokenPrice,
  minInvestment,
  maxInvestment,
  onPaymentSuccess,
  onPaymentError,
  className = ""
}: PaymentSystemProps) {
  const [amount, setAmount] = useState<number>(minInvestment);
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const paymentOptions: PaymentOption[] = [
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      icon: '💳',
      type: 'fiat',
      currencies: ['EUR', 'USD']
    },
    {
      id: 'bank',
      name: 'Transferencia Bancaria',
      icon: '🏦',
      type: 'fiat',
      currencies: ['EUR', 'USD']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🔵',
      type: 'fiat',
      currencies: ['EUR', 'USD']
    },
    {
      id: 'usdc',
      name: 'USDC',
      icon: '🪙',
      type: 'crypto',
      currencies: ['USDC']
    },
    {
      id: 'usdt',
      name: 'USDT',
      icon: '₮',
      type: 'crypto',
      currencies: ['USDT']
    },
    {
      id: 'eth',
      name: 'Ethereum',
      icon: '⟠',
      type: 'crypto',
      currencies: ['ETH']
    }
  ];

  const tokensToReceive = Math.floor(amount / tokenPrice);
  const fee = amount * 0.025; // 2.5% fee
  const totalAmount = amount + fee;

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Simular procesamiento mientras configuramos la integración completamente
      await simulatePayment();
      
      onPaymentSuccess?.({
        projectId,
        amount,
        tokens: tokensToReceive,
        paymentMethod: selectedPayment,
        transactionId: `tx_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    } catch {
      onPaymentError?.('Error procesando el pago. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const simulatePayment = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular 90% de éxito
        if (Math.random() > 0.1) {
          resolve('Payment successful');
        } else {
          reject(new Error('Payment failed'));
        }
      }, 2000);
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Inversión Inteligente
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          ChainX Technology • Pagos seguros y descentralizados
        </p>
      </div>

      {/* Cantidad de Inversión */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cantidad a invertir
        </label>
        <div className="relative">
          <input
            type="number"
            min={minInvestment}
            max={maxInvestment}
            step="100"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 font-medium">
            EUR
          </span>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Mín: {formatCurrency(minInvestment)}</span>
          <span>Máx: {formatCurrency(maxInvestment)}</span>
        </div>
      </div>

      {/* Resumen de Tokens */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Tokens a recibir:</span>
          <span className="text-lg font-bold text-purple-800 dark:text-purple-200">
            {tokensToReceive.toLocaleString()} RWA
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Precio por token:</span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {formatCurrency(tokenPrice)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">Fee (2.5%):</span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {formatCurrency(fee)}
          </span>
        </div>
        <hr className="my-2 border-gray-200 dark:border-gray-700" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Total:</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Métodos de Pago */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Método de pago
        </label>
        <div className="grid grid-cols-2 gap-3">
          {paymentOptions.slice(0, 4).map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedPayment(option.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedPayment === option.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-xs font-medium text-gray-900 dark:text-white">
                {option.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {option.currencies.join(', ')}
              </div>
            </button>
          ))}
        </div>

        {/* Opciones Avanzadas */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full mt-3 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
        >
          {showAdvanced ? '▼ Ocultar' : '▶ Más opciones de pago'}
        </button>

        {showAdvanced && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {paymentOptions.slice(4).map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedPayment(option.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedPayment === option.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {option.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {option.currencies.join(', ')}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Información de Seguridad */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Transacción segura
            </p>
            <p className="text-xs text-green-600 dark:text-green-300">
              Encriptación SSL • Cumplimiento KYC • Auditoría blockchain
            </p>
          </div>
        </div>
      </div>

      {/* Botón de Pago */}
      <button
        onClick={handlePayment}
        disabled={loading || amount < minInvestment || amount > maxInvestment}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Procesando pago...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Invertir {formatCurrency(totalAmount)}</span>
          </>
        )}
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Al continuar, aceptas nuestros términos de servicio y política de privacidad. 
        Esta inversión conlleva riesgos. Consulta con un asesor financiero.
      </p>
    </div>
  );
}