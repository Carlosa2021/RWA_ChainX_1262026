"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { ProjectCard } from "@/components/ProjectCard";
import { InvestmentModal } from "@/components/InvestmentModal";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Building2, 
  TrendingUp, 
  Wallet, 
  Users,
  Sparkles,
  ArrowRight,
  Shield
} from "lucide-react";
import { useState } from "react";

const mockProjects = [
  {
    id: 1,
    name: "Property Madrid Centro",
    location: "Madrid, España",
    totalValue: "€50,000",
    pricePerToken: "€1,000",
    tokensAvailable: 30,
    tokensTotal: 50,
    apy: "10%",
    status: "active" as const,
    progress: 40,
    investors: 23,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    id: 2,
    name: "Barcelona Luxury",
    location: "Barcelona, España",
    totalValue: "€75,000",
    pricePerToken: "€1,500",
    tokensAvailable: 0,
    tokensTotal: 50,
    apy: "12%",
    status: "funded" as const,
    progress: 100,
    investors: 50,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  },
  {
    id: 3,
    name: "Valencia Beach",
    location: "Valencia, España",
    totalValue: "€60,000",
    pricePerToken: "€800",
    tokensAvailable: 45,
    tokensTotal: 75,
    apy: "11%",
    status: "active" as const,
    progress: 40,
    investors: 18,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  },
];

export default function Home() {
  const { isOwner, isKYCVerified } = useAuth();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  
  const currentProject = mockProjects.find(p => p.id === selectedProject);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-8">
          {/* Hero Section */}
          <div className="mb-8 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  {isOwner ? "Panel de Administración" : "Bienvenido a InmoToken"}
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-3">
                {isOwner ? "Gestiona Tu Plataforma RWA" : "Invierte en Inmuebles Tokenizados"}
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-2xl">
                {isOwner 
                  ? "Control total sobre proyectos, KYC de inversores y compliance MiCA. Tu plataforma, tus reglas."
                  : "La plataforma más innovadora de inversión inmobiliaria. ERC-3643 + MiCA compliance. Rendimientos del 10% anual."
                }
              </p>
              
              {!isKYCVerified && !isOwner && (
                <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Verificación KYC Requerida</p>
                    <p className="text-sm text-white/80">Completa tu KYC para poder invertir (MiCA compliance)</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {isOwner ? "Crear Proyecto" : "Explorar Propiedades"}
                  <ArrowRight className="w-5 h-5" />
                </button>
                {isOwner && (
                  <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30">
                    Ver Inversores
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title={isOwner ? "Proyectos Totales" : "Propiedades Disponibles"}
              value="3"
              subtitle={isOwner ? "En plataforma" : "Activas ahora"}
              icon={Building2}
              iconColor="text-blue-600"
              iconBg="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatsCard
              title={isOwner ? "Inversión Total" : "Tu Inversión"}
              value={isOwner ? "€185K" : "$4"}
              subtitle={isOwner ? "Valor bloqueado" : "En USDC"}
              icon={Wallet}
              iconColor="text-green-600"
              iconBg="bg-green-100 dark:bg-green-900/30"
            />
            <StatsCard
              title="Rendimiento"
              value="+12.5%"
              subtitle="APY promedio"
              icon={TrendingUp}
              iconColor="text-purple-600"
              iconBg="bg-purple-100 dark:bg-purple-900/30"
            />
            <StatsCard
              title={isOwner ? "Inversores" : "Comunidad"}
              value={isOwner ? "127" : "500+"}
              subtitle={isOwner ? "KYC aprobados" : "Inversores verificados"}
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
              {mockProjects.map((project) => (
                <ProjectCard
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
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Investment Modal */}
      {currentProject && (
        <InvestmentModal
          projectId={currentProject.id}
          projectName={currentProject.name}
          pricePerToken={currentProject.pricePerToken}
          isOpen={selectedProject !== null}
          onClose={() => setSelectedProject(null)}
          isKYCVerified={isKYCVerified}
        />
      )}
    </div>
  );
}

