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
  Sun
} from "lucide-react";

const baseNavigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Billetera", href: "/billetera", icon: Wallet },
  { name: "KYC", href: "/kyc", icon: ShieldCheck },
  { name: "Retiros", href: "/retiros", icon: TrendingDown },
  { name: "Usuario", href: "/usuario", icon: User },
];

const adminNavigation = [
  { name: "Admin", href: "/admin", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOwner } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();

  const navigation = isOwner 
    ? [...baseNavigation.slice(0, 1), ...adminNavigation, ...baseNavigation.slice(1)]
    : baseNavigation;

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
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                ${isActive 
                  ? isAdminRoute
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isAdminRoute && !isActive ? "text-purple-600 dark:text-purple-400" : ""}`} />
              <span className="font-medium">{item.name}</span>
              {isAdminRoute && (
                <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                  Owner
                </span>
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
        
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
