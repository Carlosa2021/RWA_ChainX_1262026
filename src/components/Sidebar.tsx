"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard,
  Wallet,
  ShieldCheck, 
  TrendingDown, 
  User, 
  LogOut,
  Building2,
  Settings,
  Moon,
  Sun,
  DollarSign,
  Brain,
  Sparkles,
  CreditCard,
  ArrowLeftRight,
  Vault
} from "lucide-react";const thirdwebNavigation = [
  { name: "thirdweb Pay", href: "/payments", icon: CreditCard, special: true },
  { name: "thirdweb Bridge", href: "/bridge", icon: ArrowLeftRight, special: true },
  { name: "thirdweb Vault", href: "/vault", icon: Vault, special: true },
];

const baseNavigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "AI Showcase", href: "/ai-showcase", icon: Brain, special: true },
  { name: "Billetera", href: "/billetera", icon: Wallet },
  { name: "KYC", href: "/kyc", icon: ShieldCheck },
  { name: "Retiros", href: "/retiros", icon: TrendingDown },
  { name: "Usuario", href: "/usuario", icon: User },
];

const adminNavigation = [
  { name: "Admin", href: "/admin", icon: Settings },
  { name: "Pagos", href: "/admin/pagos", icon: DollarSign },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOwner } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();

  // Reorganizar para que thirdweb aparezca siempre arriba
  const navigation = isOwner 
    ? [
        baseNavigation[0], // Dashboard
        ...thirdwebNavigation, // thirdweb features
        baseNavigation[1], // AI Showcase
        ...adminNavigation, // Admin options
        ...baseNavigation.slice(2) // Resto de opciones
      ]
    : [
        baseNavigation[0], // Dashboard
        ...thirdwebNavigation, // thirdweb features
        ...baseNavigation.slice(1) // Resto de opciones
      ];

  const handleLogout = () => {
    // Intenta desconectar usando el hook de blockchain
    try {
      // Resetear localStorage de wallet
      localStorage.removeItem('thirdweb:active-wallet-id');
      localStorage.removeItem('thirdweb:connected-wallet-ids');
      
      // Recargar página para limpiar estado
      window.location.reload();
    } catch (error) {
      console.error("Error al desconectar wallet:", error);
      // Fallback: recargar página
      window.location.reload();
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">InmoToken</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isOwner ? "Admin Panel" : "RWA Platform"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isAdminRoute = item.href === "/admin";
          const isAIShowcase = item.href === "/ai-showcase";
          const isPayments = item.href === "/payments";
          const isBridge = item.href === "/bridge";
          const isVault = item.href === "/vault";
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative
                ${isActive 
                  ? isAdminRoute
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                    : isAIShowcase
                    ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40"
                    : isPayments
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/40"
                    : isBridge
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/40"
                    : isVault
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40"
                    : "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              <Icon className={`w-5 h-5 ${
                isAdminRoute && !isActive ? "text-purple-600 dark:text-purple-400" : 
                isAIShowcase && !isActive ? "text-blue-600 dark:text-blue-400" : 
                isPayments && !isActive ? "text-blue-600 dark:text-blue-400" :
                isBridge && !isActive ? "text-emerald-600 dark:text-emerald-400" :
                isVault && !isActive ? "text-indigo-600 dark:text-indigo-400" : ""
              }`} />
              <span className="font-medium">{item.name}</span>
              
              {/* Badge para AI Showcase */}
              {isAIShowcase && (
                <div className="ml-auto flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-0.5 rounded-full font-semibold">
                    NEW
                  </span>
                </div>
              )}
              
              {/* Badge para thirdweb Pay */}
              {isPayments && (
                <div className="ml-auto flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span className="text-xs bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 px-2 py-0.5 rounded-full font-semibold">
                    PAY
                  </span>
                </div>
              )}
              
              {/* Badge para thirdweb Bridge */}
              {isBridge && (
                <div className="ml-auto flex items-center gap-1">
                  <ArrowLeftRight className="w-3 h-3" />
                  <span className="text-xs bg-gradient-to-r from-emerald-400 to-teal-400 text-gray-900 px-2 py-0.5 rounded-full font-semibold">
                    CROSS-CHAIN
                  </span>
                </div>
              )}
              
              {/* Badge para thirdweb Vault */}
              {isVault && (
                <div className="ml-auto flex items-center gap-1">
                  <Vault className="w-3 h-3" />
                  <span className="text-xs bg-gradient-to-r from-indigo-400 to-purple-400 text-gray-900 px-2 py-0.5 rounded-full font-semibold">
                    SECURE
                  </span>
                </div>
              )}
              
              {/* Badge para Admin */}
              {isAdminRoute && (
                <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                  Owner
                </span>
              )}
              
              {/* Efecto de brillo para AI Showcase */}
              {isAIShowcase && !isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse rounded-xl"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        {mounted && (
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Modo Oscuro</span>
              </>
            )}
          </button>
        )}
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
