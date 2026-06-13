'use client';

import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { Wallet, CreditCard, Bitcoin, Shield, CheckCircle, Loader, DollarSign } from 'lucide-react';

export interface ThirdwebPayDemoProps {
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  minInvestment: number;
  maxInvestment: number;
  onPaymentSuccess: (txHash: string) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
}

export default function ThirdwebPayDemo({
  propertyId,
  propertyName,
  propertyPrice,
  minInvestment,
  maxInvestment,
  onPaymentSuccess,
  onPaymentError,
  className = '',
}: ThirdwebPayDemoProps) {
  const account = useActiveAccount();

  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [investmentAmount, setInvestmentAmount] = useState<number>(minInvestment);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [processingStep, setProcessingStep] = useState<string>('');

  const paymentMethods = [
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      fees: '2.9% + $0.30',
      popular: true,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      description: 'Pago seguro con PayPal',
      fees: '3.49% + $0.49',
      popular: false,
    },
    {
      id: 'crypto',
      name: 'Criptomonedas',
      icon: Bitcoin,
      description: 'ETH, USDC, USDT, BTC',
      fees: '1% + gas',
      popular: false,
    },
    {
      id: 'bank',
      name: 'Transferencia Bancaria',
      icon: DollarSign,
      description: 'ACH Transfer (3-5 días)',
      fees: '$5 fijo',
      popular: false,
    },
  ];

  const tokens = Math.floor(investmentAmount / propertyPrice);
  const totalWithFees = investmentAmount * 1.029 + 0.3; // Ejemplo con tarjeta

  const simulatePayment = async (method: string) => {
    setIsProcessing(true);
    setCurrentStep(2);

    try {
      // Simulación de procesamiento de pago
      setProcessingStep('Iniciando pago...');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProcessingStep('Verificando fondos...');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setProcessingStep('Procesando transacción...');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProcessingStep('Confirmando en blockchain...');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generar hash de transacción simulado
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      setCurrentStep(3);
      onPaymentSuccess(mockTxHash);
    } catch (error) {
      onPaymentError?.(`Error en el pago: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!account) {
    return (
      <div className={`bg-white rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Conecta tu Billetera</h3>
          <p className="text-gray-600">Para usar thirdweb Pay, primero conecta tu billetera</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6" />
          <h2 className="text-xl font-bold">thirdweb Pay</h2>
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">DEMO</span>
        </div>
        <h3 className="text-lg font-medium">{propertyName}</h3>
        <p className="text-blue-100 text-sm">Inversión en tokens inmobiliarios</p>
      </div>

      <div className="p-6">
        {/* Paso 1: Selección de método y cantidad */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Cantidad de Inversión */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Inversión
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={minInvestment}
                  max={maxInvestment}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold placeholder-gray-400"
                  placeholder="Cantidad en EUR"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  EUR
                </span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-600">
                <span>Mínimo: €{minInvestment.toLocaleString('es-ES')}</span>
                <span>Máximo: €{maxInvestment.toLocaleString('es-ES')}</span>
              </div>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Recibirás <strong>{tokens} tokens</strong> de esta propiedad
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Precio por token: €{propertyPrice.toLocaleString('es-ES')}
                </p>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Método de Pago</label>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {method.popular && (
                        <div className="absolute -top-2 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Popular
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{method.name}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{method.fees}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resumen */}
            {selectedMethod && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Resumen de Pago</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">€{investmentAmount.toLocaleString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comisiones:</span>
                    <span className="font-medium">
                      €{(totalWithFees - investmentAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>€{totalWithFees.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de Pago */}
            <button
              onClick={() => selectedMethod && simulatePayment(selectedMethod)}
              disabled={!selectedMethod || isProcessing}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  Procesando...
                </div>
              ) : (
                `Pagar €${totalWithFees.toFixed(2)}`
              )}
            </button>
          </div>
        )}

        {/* Paso 2: Procesando */}
        {currentStep === 2 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Procesando Pago</h3>
            <p className="text-gray-600 mb-4">{processingStep}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-linear-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        )}

        {/* Paso 3: Éxito */}
        {currentStep === 3 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Pago Completado!</h3>
            <p className="text-gray-600 mb-6">Tu inversión ha sido procesada exitosamente</p>
            <div className="bg-green-50 rounded-lg p-4 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tokens adquiridos:</span>
                  <span className="font-semibold text-green-700">{tokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inversión total:</span>
                  <span className="font-semibold text-green-700">
                    €{investmentAmount.toLocaleString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Propiedad:</span>
                  <span className="font-semibold text-green-700">{propertyName}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información de Seguridad */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Pagos Seguros con thirdweb</h4>
              <p className="text-xs text-blue-700">
                Todos los pagos están protegidos con encriptación de nivel bancario y son procesados
                de forma segura a través de la infraestructura de thirdweb.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
