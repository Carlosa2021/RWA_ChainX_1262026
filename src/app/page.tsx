'use client';

// Force dynamic rendering (no static generation at build time)
export const dynamic = 'force-dynamic';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { SimplePropertyCard } from '@/components/SimplePropertyCard';
import { InvestmentModal } from '@/components/InvestmentModal';
// import { AIShowcaseBanner } from "@/components/AIShowcaseBanner"; // Removed - intrusive
// import SimplePlanDisplay from "@/components/SimplePlanDisplay";
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects, useProjectStats, ProjectDisplay } from '@/hooks/useProjects';
import { useLicense } from '@/contexts/LicenseContext';
import { usePlanConfig } from '@/hooks/usePlanSystem';
import { Building2, TrendingUp, Wallet, Users, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const { isOwner, isKYCVerified } = useAuth();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // PRODUCTION: Only real projects from blockchain (ProjectRegistry)
  // NO mock/demo projects - clean dashboard
  const { projects, isLoading: loadingProjects, refetch } = useProjects();
  const stats = useProjectStats();

  // Tipado explícito para evitar error con array vacío
  const safeProjects: ProjectDisplay[] = projects || [];
  const currentProject = safeProjects.find((p) => p.id === selectedProject);

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
        <Header />

        <main className="px-6 py-8 max-w-7xl mx-auto">
          {/* Platform header — institutional positioning */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
              {isOwner ? 'Portfolio Dashboard' : 'Active Offerings'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isOwner
                ? 'Manage digital securities issuance and asset lifecycle on Polygon.'
                : 'ERC-3643 compliant digital securities. Participation requires identity verification.'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title={isOwner ? 'Active Projects' : 'Available Offerings'}
              value={loadingProjects ? '...' : String(stats.totalProjects)}
              subtitle={isOwner ? 'On this platform' : 'Open for subscription'}
              icon={Building2}
              iconColor="text-blue-600"
              iconBg="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatsCard
              title={isOwner ? 'Capital Raised' : 'Assets Under Management'}
              value={loadingProjects ? '...' : `€${Math.round(stats.totalValueLocked / 1000)}K`}
              subtitle={isOwner ? 'Committed across all offerings' : 'Tokenized real-world assets'}
              icon={Wallet}
              iconColor="text-green-600"
              iconBg="bg-green-100 dark:bg-green-900/30"
            />
            <StatsCard
              title="Target Return (p.a.)"
              value={loadingProjects ? '...' : `${stats.averageAPY.toFixed(1)}%`}
              subtitle="Issuer projection · not guaranteed"
              icon={TrendingUp}
              iconColor="text-gray-500"
              iconBg="bg-gray-100 dark:bg-gray-800"
            />
            <StatsCard
              title={isOwner ? 'Verified Investors' : 'Qualified Investors'}
              value={loadingProjects ? '...' : String(stats.totalInvestors)}
              subtitle={isOwner ? 'Identity verified (KYC)' : 'Active on platform'}
              icon={Users}
              iconColor="text-orange-600"
              iconBg="bg-orange-100 dark:bg-orange-900/30"
            />
          </div>

          {/* Projects Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {isOwner ? 'Active Projects' : 'Open Offerings'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isOwner
                    ? 'Manage tokenized asset offerings. All transfers enforced by ERC-3643 compliance layer.'
                    : 'Participation requires identity verification. Target returns are issuer projections, not guaranteed.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isOwner && (
                  <button className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-800 border border-gray-700 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                    + New Project
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Loading offerings from Polygon...
                    </p>
                  </div>
                </div>
              ) : safeProjects.length === 0 ? (
                // No projects state
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No offerings available
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isOwner
                        ? 'Create your first digital securities offering via the Issuer Registration wizard.'
                        : 'Check back soon for new offerings.'}
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
                        alert('⚠️ Debes completar KYC primero (MiCA compliance)');
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
