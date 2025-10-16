"use client";

import { useState, useEffect } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { ArrowLeftRight, Network, Shield, CheckCircle, Loader, AlertTriangle, ChevronDown, ExternalLink, Zap } from 'lucide-react';

export interface ThirdwebBridgeDemoProps {
  className?: string;
  onBridgeSuccess?: (details: {
    fromChain: string;
    toChain: string;
    token: string;
    amount: number;
    txHash: string;
  }) => void;
  onBridgeError?: (error: string) => void;
}

interface NetworkOption {
  id: string;
  name: string;
  chainId: number;
  color: string;
  icon: string;
  nativeCurrency: string;
  bridgeFee: number;
  estimatedTime: string;
}

interface TokenOption {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  decimals: number;
  supported: boolean;
}

const supportedNetworks: NetworkOption[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    color: 'bg-blue-500',
    icon: '⟠',
    nativeCurrency: 'ETH',
    bridgeFee: 0.003,
    estimatedTime: '15-30 min'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    color: 'bg-purple-500',
    icon: '⬟',
    nativeCurrency: 'MATIC',
    bridgeFee: 0.001,
    estimatedTime: '5-10 min'
  },
  {
    id: 'bsc',
    name: 'BSC',
    chainId: 56,
    color: 'bg-yellow-500',
    icon: '●',
    nativeCurrency: 'BNB',
    bridgeFee: 0.002,
    estimatedTime: '3-5 min'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    chainId: 42161,
    color: 'bg-blue-600',
    icon: '◆',
    nativeCurrency: 'ETH',
    bridgeFee: 0.001,
    estimatedTime: '1-2 min'
  }
];

const supportedTokens: TokenOption[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    balance: 2.45,
    decimals: 18,
    supported: true
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💲',
    balance: 1250.00,
    decimals: 6,
    supported: true
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '₮',
    balance: 850.50,
    decimals: 6,
    supported: true
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    icon: '⬟',
    balance: 125.75,
    decimals: 18,
    supported: true
  }
];

export default function ThirdwebBridgeDemo({
  className = "",
  onBridgeSuccess,
  onBridgeError
}: ThirdwebBridgeDemoProps) {
  const account = useActiveAccount();
  
  const [fromChain, setFromChain] = useState<NetworkOption>(supportedNetworks[0]);
  const [toChain, setToChain] = useState<NetworkOption>(supportedNetworks[1]);
  const [selectedToken, setSelectedToken] = useState<TokenOption>(supportedTokens[1]); // USDC por defecto
  const [amount, setAmount] = useState<string>('');
  const [showFromDropdown, setShowFromDropdown] = useState<boolean>(false);
  const [showToDropdown, setShowToDropdown] = useState<boolean>(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [estimatedGas, setEstimatedGas] = useState<number>(0);

  // Calcular comisiones y tiempo estimado
  useEffect(() => {
    if (amount && fromChain && toChain) {
      const bridgeFee = fromChain.bridgeFee + toChain.bridgeFee;
      const networkFee = Math.random() * 0.002 + 0.001; // Simular gas
      setEstimatedGas(bridgeFee + networkFee);
    }
  }, [amount, fromChain, toChain]);

  const swapNetworks = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const simulateBridge = async () => {
    if (!amount || !fromChain || !toChain || !selectedToken) return;
    
    setIsProcessing(true);
    setCurrentStep(2);
    
    try {
      // Simulación del proceso de bridge
      setProcessingStep('Verificando balance...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep('Aprobando token...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingStep(`Iniciando bridge desde ${fromChain.name}...`);
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setProcessingStep('Esperando confirmación en blockchain...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setProcessingStep(`Finalizando en ${toChain.name}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar hash de transacción simulado
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      setCurrentStep(3);
      onBridgeSuccess?.({
        fromChain: fromChain.name,
        toChain: toChain.name,
        token: selectedToken.symbol,
        amount: parseFloat(amount),
        txHash: mockTxHash
      });
      
    } catch (error) {
      onBridgeError?.(`Error en el bridge: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!account) {
    return (
      <div className={`bg-white rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Conecta tu Billetera
          </h3>
          <p className="text-gray-600">
            Para usar thirdweb Bridge, primero conecta tu billetera
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <ArrowLeftRight className="w-6 h-6" />
          <h2 className="text-xl font-bold">thirdweb Bridge</h2>
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
            CROSS-CHAIN
          </span>
        </div>
        <p className="text-emerald-100 text-sm">
          Transfiere activos entre blockchains de forma segura y eficiente
        </p>
      </div>

      <div className="p-6">
        {/* Paso 1: Configuración del Bridge */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Selección de Redes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transferir desde/hacia
              </label>
              
              <div className="flex items-center gap-4">
                {/* Red Origen */}
                <div className="flex-1 relative">
                  <div
                    onClick={() => setShowFromDropdown(!showFromDropdown)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${fromChain.color} rounded-full flex items-center justify-center text-white font-bold`}>
                        {fromChain.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{fromChain.name}</div>
                        <div className="text-sm text-gray-500">Chain ID: {fromChain.chainId}</div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  {showFromDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {supportedNetworks.map((network) => (
                        <div
                          key={network.id}
                          onClick={() => {
                            setFromChain(network);
                            setShowFromDropdown(false);
                          }}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                        >
                          <div className={`w-6 h-6 ${network.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                            {network.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{network.name}</div>
                            <div className="text-sm text-gray-500">{network.estimatedTime}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botón de Intercambio */}
                <button
                  onClick={swapNetworks}
                  className="p-3 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
                </button>

                {/* Red Destino */}
                <div className="flex-1 relative">
                  <div
                    onClick={() => setShowToDropdown(!showToDropdown)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${toChain.color} rounded-full flex items-center justify-center text-white font-bold`}>
                        {toChain.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{toChain.name}</div>
                        <div className="text-sm text-gray-500">Chain ID: {toChain.chainId}</div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  {showToDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {supportedNetworks.filter(n => n.id !== fromChain.id).map((network) => (
                        <div
                          key={network.id}
                          onClick={() => {
                            setToChain(network);
                            setShowToDropdown(false);
                          }}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                        >
                          <div className={`w-6 h-6 ${network.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                            {network.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{network.name}</div>
                            <div className="text-sm text-gray-500">{network.estimatedTime}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selección de Token y Cantidad */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Token */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token
                </label>
                <div
                  onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                  className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{selectedToken.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{selectedToken.symbol}</div>
                      <div className="text-sm text-gray-500">Balance: {selectedToken.balance}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                {showTokenDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {supportedTokens.map((token) => (
                      <div
                        key={token.symbol}
                        onClick={() => {
                          setSelectedToken(token);
                          setShowTokenDropdown(false);
                        }}
                        className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${
                          !token.supported ? 'opacity-50' : ''
                        }`}
                      >
                        <span className="text-lg">{token.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{token.symbol}</div>
                          <div className="text-sm text-gray-500">Balance: {token.balance}</div>
                        </div>
                        {!token.supported && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            No soportado
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.000001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setAmount(selectedToken.balance.toString())}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    MAX
                  </button>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Disponible: {selectedToken.balance} {selectedToken.symbol}
                </div>
              </div>
            </div>

            {/* Información del Bridge */}
            {amount && parseFloat(amount) > 0 && (
              <div className="bg-emerald-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-emerald-900">Detalles del Bridge</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cantidad a transferir:</span>
                    <span className="font-medium">{amount} {selectedToken.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comisión de bridge:</span>
                    <span className="font-medium">~{estimatedGas.toFixed(6)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo estimado:</span>
                    <span className="font-medium">{fromChain.estimatedTime}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-emerald-700">
                    <span>Recibirás:</span>
                    <span>{amount} {selectedToken.symbol}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de Bridge */}
            <button
              onClick={simulateBridge}
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing || fromChain.id === toChain.id}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Procesando Bridge...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Iniciar Bridge
                </>
              )}
            </button>
          </div>
        )}

        {/* Paso 2: Procesando */}
        {currentStep === 2 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Procesando Bridge
            </h3>
            <p className="text-gray-600 mb-4">
              {processingStep}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: '60%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Esto puede tardar varios minutos dependiendo de la congestión de la red
            </p>
          </div>
        )}

        {/* Paso 3: Éxito */}
        {currentStep === 3 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Bridge Completado!
            </h3>
            <p className="text-gray-600 mb-6">
              Tus activos han sido transferidos exitosamente
            </p>
            <div className="bg-green-50 rounded-lg p-4 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Desde:</span>
                  <span className="font-semibold text-green-700">{fromChain.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hacia:</span>
                  <span className="font-semibold text-green-700">{toChain.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cantidad:</span>
                  <span className="font-semibold text-green-700">{amount} {selectedToken.symbol}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentStep(1);
                setAmount('');
              }}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Nuevo Bridge
            </button>
          </div>
        )}

        {/* Información de Seguridad */}
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-emerald-900 mb-1">
                Bridge Seguro con thirdweb
              </h4>
              <p className="text-xs text-emerald-700">
                Todas las transferencias cross-chain están protegidas por contratos inteligentes auditados y validadores descentralizados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}