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
  ExternalLink
} from "lucide-react";

// Mock data - TODO: Replace with real blockchain data
const mockBalance = {
  usdc: 25000,
  tokens: [
    { name: "REIT Madrid Centro", symbol: "RMAD", amount: 50, value: 15000, image: "🏢" },
    { name: "REIT Barcelona Beach", symbol: "RBCN", amount: 30, value: 7500, image: "🌊" },
    { name: "REIT Valencia Tech", symbol: "RVLC", amount: 20, value: 2500, image: "🚀" },
  ]
};

const mockTransactions = [
  { id: 1, type: "invest", project: "Madrid Centro", amount: 5000, date: "2024-01-15", hash: "0x1234...abcd" },
  { id: 2, type: "dividend", project: "Barcelona Beach", amount: 125, date: "2024-01-10", hash: "0x5678...efgh" },
  { id: 3, type: "invest", project: "Valencia Tech", amount: 2500, date: "2024-01-05", hash: "0x9012...ijkl" },
  { id: 4, type: "dividend", project: "Madrid Centro", amount: 85, date: "2023-12-28", hash: "0x3456...mnop" },
  { id: 5, type: "withdraw", project: "USDC", amount: 1000, date: "2023-12-20", hash: "0x7890...qrst" },
];

export default function BilleteraPage() {
  const { address } = useAuth();
  const [filter, setFilter] = useState<"all" | "invest" | "dividend" | "withdraw">("all");

  const totalValue = mockBalance.usdc + mockBalance.tokens.reduce((sum, t) => sum + t.value, 0);
  const filteredTxs = filter === "all" ? mockTransactions : mockTransactions.filter(tx => tx.type === filter);

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
                ${totalValue.toLocaleString()}
              </div>
              <div className="text-sm opacity-75">
                +12.5% este mes
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
                ${mockBalance.usdc.toLocaleString()}
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Añadir fondos →
              </button>
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
                ${mockBalance.tokens.reduce((sum, t) => sum + t.value, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {mockBalance.tokens.length} proyectos activos
              </div>
            </div>
          </div>

          {/* Token Holdings Detail */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mis Propiedades Tokenizadas</h2>
            <div className="space-y-4">
              {mockBalance.tokens.map((token, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{token.image}</div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{token.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{token.amount} tokens · {token.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      ${token.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      +8.2% APY
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              {filteredTxs.map((tx) => (
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
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-right font-bold ${
                      tx.type === "withdraw" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"
                    }`}>
                      {tx.type === "withdraw" ? "-" : "+"}${tx.amount.toLocaleString()}
                    </div>
                    <a
                      href={`https://polygonscan.com/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
