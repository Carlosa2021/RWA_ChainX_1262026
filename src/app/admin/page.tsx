"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Shield,
  Users,
  Building2,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Search,
  Filter
} from "lucide-react";

interface Investor {
  address: string;
  kycStatus: "pending" | "approved" | "rejected";
  invested: string;
  projects: number;
}

interface Project {
  id: number;
  name: string;
  totalValue: string;
  invested: string;
  investors: number;
  status: "active" | "funded" | "draft";
}

const mockInvestors: Investor[] = [
  { address: "0x1234...5678", kycStatus: "approved", invested: "$25,000", projects: 3 },
  { address: "0x8765...4321", kycStatus: "pending", invested: "$0", projects: 0 },
  { address: "0xabcd...ef12", kycStatus: "approved", invested: "$50,000", projects: 5 },
];

const mockProjects: Project[] = [
  { id: 1, name: "Property Madrid Centro", totalValue: "€50,000", invested: "€20,000", investors: 15, status: "active" },
  { id: 2, name: "Barcelona Luxury", totalValue: "€75,000", invested: "€75,000", investors: 25, status: "funded" },
  { id: 3, name: "Valencia Beach", totalValue: "€60,000", invested: "€24,000", investors: 12, status: "active" },
];

export default function AdminPage() {
  const { isOwner } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "investors" | "projects">("overview");

  useEffect(() => {
    if (!isOwner) {
      router.push("/");
    }
  }, [isOwner, router]);

  if (!isOwner) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-8">
          {/* Admin Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                <p className="text-gray-600 dark:text-gray-400">Gestiona tu plataforma RWA</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "overview"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Resumen
              {activeTab === "overview" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("investors")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "investors"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Inversores KYC
              {activeTab === "investors" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "projects"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Proyectos
              {activeTab === "projects" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              )}
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">3</h3>
                  <p className="text-gray-600 dark:text-gray-400">Proyectos Totales</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">127</h3>
                  <p className="text-gray-600 dark:text-gray-400">Inversores Activos</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">€185K</h3>
                  <p className="text-gray-600 dark:text-gray-400">Inversión Total</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">8</h3>
                  <p className="text-gray-600 dark:text-gray-400">KYC Pendientes</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-3xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-left transition-all border border-white/30">
                    <Plus className="w-6 h-6 mb-2" />
                    <p className="font-semibold">Crear Proyecto</p>
                    <p className="text-sm text-white/80">Nuevo inmueble tokenizado</p>
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-left transition-all border border-white/30">
                    <CheckCircle className="w-6 h-6 mb-2" />
                    <p className="font-semibold">Aprobar KYC</p>
                    <p className="text-sm text-white/80">8 solicitudes pendientes</p>
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-left transition-all border border-white/30">
                    <TrendingUp className="w-6 h-6 mb-2" />
                    <p className="font-semibold">Ver Reportes</p>
                    <p className="text-sm text-white/80">Analytics completos</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Investors Tab */}
          {activeTab === "investors" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por dirección..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
                <button className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Filter className="w-5 h-5" />
                  Filtrar
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Dirección</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">KYC Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Invertido</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Proyectos</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockInvestors.map((investor, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                        <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-white">{investor.address}</td>
                        <td className="px-6 py-4">
                          {investor.kycStatus === "approved" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" />
                              Aprobado
                            </span>
                          )}
                          {investor.kycStatus === "pending" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{investor.invested}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{investor.projects}</td>
                        <td className="px-6 py-4">
                          {investor.kycStatus === "pending" && (
                            <div className="flex gap-2">
                              <button className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600">
                                Aprobar
                              </button>
                              <button className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600">
                                Rechazar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestionar Proyectos</h2>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nuevo Proyecto
                </button>
              </div>

              <div className="grid gap-6">
                {mockProjects.map((project) => (
                  <div key={project.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
                          {project.status === "active" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              Activo
                            </span>
                          )}
                          {project.status === "funded" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                              Financiado
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Valor Total</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{project.totalValue}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Invertido</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{project.invested}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Inversores</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{project.investors}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                          Editar
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
