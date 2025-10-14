"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { 
  User, 
  CheckCircle, 
  XCircle,
  Bell,
  Globe,
  Shield,
  Moon,
  Sun,
  Copy,
  Check,
  ExternalLink
} from "lucide-react";

export default function UsuarioPage() {
  const { address, isKYCVerified, isOwner } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
                <p className="text-gray-600 dark:text-gray-400">Configuración de cuenta y preferencias</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Avatar Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {isOwner ? "👑 Owner" : "Inversor"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Miembro desde Enero 2024
                </p>
                
                {/* Wallet Address */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dirección Wallet</div>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono text-gray-900 dark:text-white">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "No conectado"}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* KYC Status */}
                <div className={`rounded-lg p-3 ${
                  isKYCVerified 
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {isKYCVerified ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-green-900 dark:text-green-100">KYC Verificado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <span className="font-semibold text-yellow-900 dark:text-yellow-100">KYC Pendiente</span>
                      </>
                    )}
                  </div>
                  {!isKYCVerified && (
                    <a href="/kyc" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Completar verificación →
                    </a>
                  )}
                </div>

                {/* View on Polygonscan */}
                {address && (
                  <a
                    href={`https://polygonscan.com/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Ver en Polygonscan
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Stats Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Inversiones</span>
                    <span className="font-semibold text-gray-900 dark:text-white">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Invertido</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$25,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Dividendos</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">+$1,250</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notificaciones</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Notificaciones Push</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Recibe alertas en el navegador</div>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications ? "translate-x-6" : ""
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Alertas por Email</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Dividendos y novedades</div>
                    </div>
                    <button
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        emailAlerts ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        emailAlerts ? "translate-x-6" : ""
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Apariencia</h3>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Modo Oscuro</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Tema actual: {theme === "dark" ? "Noche 🌙" : "Día ☀️"}
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    Cambiar Tema
                  </button>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Seguridad</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-green-900 dark:text-green-100">Wallet Conectada</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Tu wallet está conectada de forma segura via thirdweb
                    </p>
                  </div>

                  {isKYCVerified && (
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-green-900 dark:text-green-100">KYC Verificado</span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Tu identidad ha sido verificada según MiCA compliance
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Language */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Idioma</h3>
                </div>
                
                <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium">
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="de">🇩🇪 Deutsch</option>
                </select>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
