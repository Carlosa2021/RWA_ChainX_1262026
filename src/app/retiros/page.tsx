'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Loader2,
  ExternalLink,
} from 'lucide-react';

// Mock data - TODO: Replace with real contract calls
const mockWithdrawals = [
  {
    id: 1,
    amount: 1000,
    status: 'completed',
    date: '2024-01-10',
    txHash: '0x1234...abcd',
    method: 'USDC',
  },
  {
    id: 2,
    amount: 500,
    status: 'pending',
    date: '2024-01-15',
    txHash: null,
    method: 'Bank Transfer',
  },
  {
    id: 3,
    amount: 2500,
    status: 'completed',
    date: '2023-12-28',
    txHash: '0x5678...efgh',
    method: 'USDC',
  },
  { id: 4, amount: 750, status: 'rejected', date: '2023-12-20', txHash: null, method: 'PayPal' },
];

export default function RetirosPage() {
  const { address, isKYCVerified } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('usdc');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableBalance = 5000; // Mock - TODO: Get from contract

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isKYCVerified) {
      alert('Debes completar KYC para retirar fondos');
      return;
    }

    if (parseFloat(amount) > availableBalance) {
      alert('Fondos insuficientes');
      return;
    }

    setIsSubmitting(true);

    // TODO: Submit withdrawal request
    setTimeout(() => {
      setIsSubmitting(false);
      setAmount('');
      alert('Solicitud de retiro enviada');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-linear-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Retiros</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Solicita y gestiona tus retiros de fondos
                </p>
              </div>
            </div>
          </div>

          {/* KYC Warning */}
          {!isKYCVerified && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                    KYC Requerido
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Debes verificar tu identidad antes de poder retirar fondos.
                  </p>
                </div>
                <a
                  href="/kyc"
                  className="px-6 py-3 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Verificar Ahora
                </a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - New Withdrawal */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Nuevo Retiro
                </h2>

                {/* Available Balance */}
                <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-xl p-4 mb-6 text-white">
                  <div className="text-sm opacity-90 mb-1">Disponible para retirar</div>
                  <div className="text-3xl font-bold">
                    ${availableBalance.toLocaleString('es-ES')}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cantidad (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="10"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-gray-900 dark:text-white"
                        placeholder="1000"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Mínimo: $10 · Máximo: ${availableBalance.toLocaleString('es-ES')}
                    </p>
                  </div>

                  {/* Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Método de Retiro
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-gray-900 dark:text-white"
                    >
                      <option value="usdc">💎 USDC (Polygon) - Instantáneo</option>
                      <option value="bank">🏦 Transferencia Bancaria - 2-3 días</option>
                      <option value="sepa">🇪🇺 SEPA - 1-2 días</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isKYCVerified || !address}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-linear-to-r from-yellow-500 to-orange-600 text-white hover:shadow-lg hover:shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-5 h-5" />
                        Solicitar Retiro
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  ⚡ Retiros en USDC son instantáneos. Transferencias bancarias toman 2-3 días
                  hábiles.
                </p>
              </div>
            </div>

            {/* Right Column - Withdrawal History */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Historial de Retiros
                </h2>

                <div className="space-y-3">
                  {mockWithdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            withdrawal.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : withdrawal.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                : 'bg-red-100 dark:bg-red-900/30'
                          }`}
                        >
                          {withdrawal.status === 'completed' ? (
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          ) : withdrawal.status === 'pending' ? (
                            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900 dark:text-white">
                              ${withdrawal.amount.toLocaleString('es-ES')}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                withdrawal.status === 'completed'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : withdrawal.status === 'pending'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              }`}
                            >
                              {withdrawal.status === 'completed'
                                ? 'Completado'
                                : withdrawal.status === 'pending'
                                  ? 'Pendiente'
                                  : 'Rechazado'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            {withdrawal.method} · {withdrawal.date}
                          </div>
                        </div>
                      </div>
                      {withdrawal.txHash && (
                        <a
                          href={`https://polygonscan.com/tx/${withdrawal.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Instantáneo</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    USDC directo a tu wallet
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl mb-2">🔒</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Seguro</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Transacciones verificadas
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl mb-2">💰</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Sin comisiones</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">0% fee en retiros USDC</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
