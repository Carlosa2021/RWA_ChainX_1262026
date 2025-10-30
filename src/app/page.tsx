"use client";

// Force dynamic rendering (no static generation at build time)
export const dynamic = 'force-dynamic';

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { SimplePropertyCard } from "@/components/SimplePropertyCard";
import { InvestmentModal } from "@/components/InvestmentModal";
// import { AIShowcaseBanner } from "@/components/AIShowcaseBanner"; // Removed - intrusive
// import SimplePlanDisplay from "@/components/SimplePlanDisplay";
import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects, useProjectStats, ProjectDisplay } from "@/hooks/useProjects";
import { useLicense } from "@/contexts/LicenseContext";
import { usePlanConfig } from "@/hooks/usePlanSystem";
import { 
  Building2, 
  TrendingUp, 
  Wallet, 
  Users,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { isOwner, isKYCVerified } = useAuth();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  
  // Obtener proyectos reales desde blockchain
  const { projects, isLoading: loadingProjects, refetch } = useProjects();
  const stats = useProjectStats();
  
  // Tipado explícito para evitar error con array vacío
  const safeProjects: ProjectDisplay[] = projects || [];
  const currentProject = safeProjects.find(p => p.id === selectedProject);

  // Recargar proyectos cada 30 segundos para detectar nuevos proyectos
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000); // 30 segundos
    
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <Sidebar />
      
      <div className="flex-1">
        <SimpleHeader />
        <Header />
        
        <main className="px-6 py-8 max-w-7xl mx-auto">
          {/* Hero Section - Estilo Apple minimalista */}
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Invierte en Real Estate
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              Tokenización profesional de activos inmobiliarios. Seguro, transparente y regulado.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title={isOwner ? "Proyectos Totales" : "Propiedades Disponibles"}
              value={loadingProjects ? "..." : String(stats.totalProjects)}
              subtitle={isOwner ? "En plataforma" : "Activas ahora"}
              icon={Building2}
              iconColor="text-blue-600"
              iconBg="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatsCard
              title={isOwner ? "Inversión Total" : "Valor Total"}
              value={loadingProjects ? "..." : `€${Math.round(stats.totalValueLocked / 1000)}K`}
              subtitle={isOwner ? "Valor bloqueado" : "Inmuebles tokenizados"}
              icon={Wallet}
              iconColor="text-green-600"
              iconBg="bg-green-100 dark:bg-green-900/30"
            />
            <StatsCard
              title="Rendimiento"
              value={loadingProjects ? "..." : `${stats.averageAPY.toFixed(1)}%`}
              subtitle="APY promedio"
              icon={TrendingUp}
              iconColor="text-purple-600"
              iconBg="bg-purple-100 dark:bg-purple-900/30"
            />
            <StatsCard
              title={isOwner ? "Inversores" : "Comunidad"}
              value={loadingProjects ? "..." : String(stats.totalInvestors)}
              subtitle={isOwner ? "KYC aprobados" : "Inversores activos"}
              icon={Users}
              iconColor="text-orange-600"
              iconBg="bg-orange-100 dark:bg-orange-900/30"
            />
          </div>

          {/* Projects Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🏆 {isOwner ? "Gestionar Proyectos" : "Oportunidades de Inversión"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isOwner 
                    ? "Administra propiedades tokenizadas y controla inversiones"
                    : "Invierte en inmuebles tokenizados con garantía legal"
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isOwner && (
                  <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                    + Nuevo Proyecto
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingProjects ? (
                // Loading skeleton
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Cargando proyectos desde blockchain...
                    </p>
                  </div>
                </div>
              ) : safeProjects.length === 0 ? (
                // No projects state
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No hay proyectos disponibles
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {isOwner ? "Crea tu primer proyecto inmobiliario" : "Vuelve pronto para nuevas oportunidades"}
                    </p>
                  </div>
                </div>
              ) : (
                // Projects list
                safeProjects.map((project) => (
                  <SimplePropertyCard
                    key={project.id}
                    {...project}
                    onInvest={() => {
                      if (!isKYCVerified && !isOwner) {
                        alert("⚠️ Debes completar KYC primero (MiCA compliance)");
                        return;
                      }
                      setSelectedProject(project.id);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>

      {/* Investment Modal */}
      {currentProject && (
        <InvestmentModal
          projectName={currentProject.name}
          pricePerToken={currentProject.pricePerToken}
          tokenAddress={currentProject.securityToken}
          isOpen={selectedProject !== null}
          onClose={() => setSelectedProject(null)}
          onSuccess={() => {
            refetch(); // Refresh projects from blockchain
            setSelectedProject(null);
          }}
          isKYCVerified={isKYCVerified}
        />
      )}
    </div>
  );
}

