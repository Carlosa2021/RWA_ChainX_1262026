"use client";

import Link from "next/link";
import { ConnectButton, darkTheme, lightTheme } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { polygon } from "thirdweb/chains";
import { Moon, Sun, Bell, Brain, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
// import { usePlanConfig } from "@/hooks/usePlanConfig";
import {
  createWallet,
  walletConnect,
  inAppWallet,
} from "thirdweb/wallets";

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "email",
        "google",
        "apple",
        "facebook",
        "phone",
        "passkey",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  walletConnect(),
];

export function Header() {
  const { theme, toggleTheme, mounted } = useTheme();
  // const planConfig = usePlanConfig();

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'STARTER': return 'bg-blue-500 text-white';
      case 'PRO': return 'bg-green-500 text-white';
      case 'ENTERPRISE': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Search / Title */}
        <div className="flex-1 flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ChainX RWA Platform - Manage your tokenized real world assets
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* AI Showcase Quick Access */}
          <Link
            href="/ai-showcase"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/40 transition-all group"
          >
            <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold hidden sm:block">AI Showcase</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </Link>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          )}

          {/* Wallet Connect */}
          <ConnectButton
            client={client}
            chain={polygon}
            wallets={wallets}
            theme={theme === "dark" ? darkTheme() : lightTheme()}
            connectButton={{
              label: "Conectar Wallet",
              className: "!bg-gradient-to-r !from-orange-500 !to-pink-500 !text-white !font-semibold !px-6 !py-3 !rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all",
            }}
            connectModal={{
              size: "wide",
              title: "Conecta tu Wallet",
              showThirdwebBranding: false,
            }}
          />
        </div>
      </div>
    </header>
  );
}
