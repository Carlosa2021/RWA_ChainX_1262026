"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign,
  PieChart,
  Activity,
  ExternalLink,
  Loader2
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

// Transacción real conocida
const realTransactions = [
  { 
    id: 1, 
    type: "invest" as const, 
    project: "Proyecto Alzira", 
    amount: 1.16, 
    amountToken: 1,
    date: "2025-10-12", 
    hash: "0xe8bc062fee3ccbf6dc2aa023f828c3bc97f3d4b95df831ff8eeb59f53a89dfd5" 
  },
];

export default function BilleteraPage() {
  const { address } = useAuth();
  const walletData = useWallet();
  const [filter, setFilter] = useState<"all" | "invest" | "dividend" | "withdraw">("all");

  const filteredTxs = filter === "all" ? realTransactions : realTransactions.filter(tx => tx.type === filter);

  // Loading state
  if (walletData.loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-8 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Cargando datos de blockchain...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Not connected state
  if (!address) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-8 flex items-center justify-center">
            <div className="text-center">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Conecta tu billetera
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Conecta tu wallet para ver tu balance y transacciones
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { usdcBalance, tokens, totalValueUsd, totalValueEur } = walletData;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Billetera</h1>
                <p className="text-gray-600 dark:text-gray-400">Gestiona tus activos y transacciones</p>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Portfolio */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-90">Portfolio Total</span>
                </div>
                <TrendingUp className="w-5 h-5 opacity-75" />
              </div>
              <div className="text-4xl font-bold mb-2">
                ${totalValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm opacity-75">
                ≈ €{totalValueEur.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* USDC Balance */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">USDC Disponible</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                ${usdcBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Listo para invertir
              </div>
            </div>

            {/* Token Holdings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tokens Propiedades</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                ${tokens.reduce((sum, t) => sum + t.valueUsd, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {tokens.length} {tokens.length === 1 ? 'proyecto activo' : 'proyectos activos'}
              </div>
            </div>
          </div>

          {/* Token Holdings Detail */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mis Propiedades Tokenizadas</h2>
            {tokens.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Aún no tienes tokens de propiedades
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Invierte en un proyecto para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tokens.map((token, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{token.image}</div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{token.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {token.amount} {token.amount === 1 ? 'token' : 'tokens'} · {token.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        ${token.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ≈ €{token.valueEur.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Historial de Transacciones</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "all" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilter("invest")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "invest" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  Inversiones
                </button>
                <button
                  onClick={() => setFilter("dividend")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "dividend" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  Dividendos
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTxs.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No hay transacciones para mostrar
                  </p>
                </div>
              ) : (
                filteredTxs.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "invest" ? "bg-blue-100 dark:bg-blue-900/30" :
                        tx.type === "dividend" ? "bg-green-100 dark:bg-green-900/30" :
                        "bg-yellow-100 dark:bg-yellow-900/30"
                      }`}>
                        {tx.type === "invest" ? <ArrowUpRight className="w-5 h-5 text-blue-600 dark:text-blue-400" /> :
                         tx.type === "dividend" ? <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" /> :
                         <ArrowDownLeft className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {tx.type === "invest" ? "Inversión" : tx.type === "dividend" ? "Dividendo" : "Retiro"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {tx.project} · {tx.date}
                          {tx.type === "invest" && tx.amountToken && (
                            <span className="ml-2 text-blue-600 dark:text-blue-400">
                              +{tx.amountToken} {tx.amountToken === 1 ? 'token' : 'tokens'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right font-bold text-green-600 dark:text-green-400">
                        +${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <a
                        href={`https://polygonscan.com/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        title="Ver en PolygonScan"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
