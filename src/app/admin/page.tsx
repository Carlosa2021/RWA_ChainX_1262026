"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { CreateProjectForm } from "@/components/CreateProjectForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useProjectCreation } from "@/hooks/useProjectCreation";
import { useProjects, ProjectDisplay } from "@/hooks/useProjects";
import Image from "next/image";
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  Loader2,
  FileText,
  X,
  Plus,
  Building2,
  TrendingUp,
  Coins
} from "lucide-react";
import { toast } from "sonner";

interface KYCSubmission {
  id: number;
  wallet_address: string;
  document_type: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
}

interface KYCDocuments {
  documentFront: string | null;
  documentBack: string | null;
  proofOfAddress: string | null;
}

interface ProjectFormData {
  // Información básica
  name: string;
  symbol: string;
  description: string;
  location: string;
  
  // Información financiera
  totalValue: string;
  pricePerToken: string;
  maxTokens: string;
  minInvestment: string;
  
  // Configuración técnica
  decimals: string;
  stablecoin: string;
  
  // Documentos y metadatos
  propertyImages: File[];
  legalDocuments: File[];
  metadataURI: string;
  
  // Características del proyecto
  propertyType: string;
  expectedReturn: string;
  duration: string;
  rentYield: string;
}

interface KYCStats {
  pending: number;
  approved: number;
  rejected: number;
}

export default function AdminPage() {
  const { address, isOwner } = useAuth();
  const router = useRouter();
  
  // Estados
  const [activeTab, setActiveTab] = useState<'kyc' | 'projects'>('kyc');
  const [kycSubTab, setKycSubTab] = useState<'pending' | 'all'>('pending');
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [stats, setStats] = useState<KYCStats>({ pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null);
  const [documents, setDocuments] = useState<KYCDocuments | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Hooks
  const { projects, refetch: refetchProjects } = useProjects();
  const { createProject, isLoading: isCreating } = useProjectCreation();

  // Debug temporal
  console.log("Admin - Proyectos cargados:", projects?.length, projects);

  // Cargar solicitudes KYC
  const fetchSubmissions = useCallback(async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      
      // Simular datos para demostración del panel admin
      // En producción real, esto se conectaría con el backend KYC
      const mockSubmissions: KYCSubmission[] = [
        {
          id: 1,
          wallet_address: "0x742d35Cc6634C0532925a3b8D404C3D8dCd1234",
          document_type: "DNI",
          status: "pending",
          submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          wallet_address: "0x8ba1f109551bD432803012645Hac189B5678",
          document_type: "Pasaporte",
          status: "approved",
          submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          reviewed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          reviewed_by: address,
        },
        {
          id: 3,
          wallet_address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
          document_type: "NIE",
          status: "rejected",
          submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          reviewed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          reviewed_by: address,
          rejection_reason: "Documento no legible"
        }
      ];

      // Filtrar según el tab activo
      const filteredData = kycSubTab === "pending" 
        ? mockSubmissions.filter(s => s.status === "pending")
        : mockSubmissions;
        
      setSubmissions(filteredData);
      
      // Calcular estadísticas de todos los submissions
      setStats({
        pending: mockSubmissions.filter(s => s.status === 'pending').length,
        approved: mockSubmissions.filter(s => s.status === 'approved').length,
        rejected: mockSubmissions.filter(s => s.status === 'rejected').length,
      });
      
    } catch (error) {
      console.error("Error en el panel KYC:", error);
      setSubmissions([]);
      setStats({ pending: 0, approved: 0, rejected: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [address, kycSubTab]);

  // Efectos
  useEffect(() => {
    // 🎭 DEMO MODE: Comentado para permitir acceso completo sin verificación
    // if (!isOwner) {
    //   router.push("/");
    //   return;
    // }
    
    if (activeTab === 'kyc') {
      fetchSubmissions();
    } else {
      refetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, router, activeTab, kycSubTab, address]); // Controlamos manualmente las dependencias

  // Manejar visualización de documentos
  const handleViewDocuments = async (submission: KYCSubmission) => {
    if (!address) return;
    
    try {
      setSelectedSubmission(submission);
      setDocuments(null);
      
      // Simular carga de documentos para demostración
      setTimeout(() => {
        const mockDocuments: KYCDocuments = {
          documentFront: "/images/projects/alzira-reyes-catolicos/Alzira3.jpg",
          documentBack: "/images/projects/alzira-reyes-catolicos/Alzira4.jpg",
          proofOfAddress: "/images/projects/alzira-reyes-catolicos/Alzira5.jpg"
        };
        setDocuments(mockDocuments);
      }, 1000);
      
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      toast.error("Error al cargar los documentos");
    }
  };

  // Aprobar KYC
  const handleApprove = async (submissionId: number) => {
    if (!address) return;
    
    try {
      // Simular aprobación exitosa
      console.log("Aprobando KYC para submission:", submissionId);
      toast.success("KYC aprobado exitosamente");
      setSelectedSubmission(null);
      setDocuments(null);
      
      // Actualizar la lista para reflejar el cambio
      setTimeout(() => {
        fetchSubmissions();
      }, 500);
      
    } catch (error) {
      console.error("Error al aprobar KYC:", error);
      toast.error("Error al aprobar el KYC");
    }
  };

  // Rechazar KYC
  const handleReject = async (submissionId: number) => {
    if (!address || !rejectionReason.trim()) {
      toast.error("Debe proporcionar una razón para el rechazo");
      return;
    }
    
    try {
      // Simular rechazo exitoso
      console.log("Rechazando KYC para submission:", submissionId, "Razón:", rejectionReason);
      toast.success("KYC rechazado");
      setSelectedSubmission(null);
      setDocuments(null);
      setRejectionReason("");
      
      // Actualizar la lista para reflejar el cambio
      setTimeout(() => {
        fetchSubmissions();
      }, 500);
      
    } catch (error) {
      console.error("Error al rechazar KYC:", error);
      toast.error("Error al rechazar el KYC");
    }
  };

  // Crear proyecto
  const handleCreateProject = useCallback(async (formData: ProjectFormData) => {
    try {
      await createProject(formData);
      setShowCreateForm(false);
      toast.success("Proyecto creado exitosamente");
      refetchProjects();
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      toast.error("Error al crear el proyecto");
    }
  }, [createProject, refetchProjects]);

  // Filtrar submissions
  const filteredSubmissions = submissions.filter(submission =>
    submission.wallet_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renderizar contenido KYC
  const renderKYCContent = () => (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pendientes</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Aprobados</p>
              <p className="text-3xl font-bold">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Rechazados</p>
              <p className="text-3xl font-bold">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Tabs y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setKycSubTab('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                kycSubTab === 'pending'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setKycSubTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                kycSubTab === 'all'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Todas
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Tabla de submissions */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? "No se encontraron solicitudes" : "No hay solicitudes KYC"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Wallet</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Documento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {`${submission.wallet_address.slice(0, 6)}...${submission.wallet_address.slice(-4)}`}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{submission.document_type}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : submission.status === 'approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {submission.status === 'pending' ? 'Pendiente' : 
                         submission.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {new Date(submission.submitted_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewDocuments(submission)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar contenido de proyectos
  const renderProjectsContent = () => {
    // Tipado explícito con ProjectDisplay[] para evitar error de TypeScript con array vacío
    const safeProjects: ProjectDisplay[] = projects || [];
    
    return (
    <div className="space-y-6">
      {/* Header con botón crear */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestionar Proyectos</h2>
          <p className="text-gray-600 dark:text-gray-400">Administra propiedades tokenizadas y controla inversiones</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Estadísticas de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Proyectos</p>
              <p className="text-3xl font-bold">{safeProjects.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Activos</p>
              <p className="text-3xl font-bold">{safeProjects.filter(p => p?.status === 'active').length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Valor Total</p>
              <p className="text-3xl font-bold">€{safeProjects.reduce((acc, p) => {
                if (!p?.totalValue) return acc;
                const value = parseInt(p.totalValue.replace(/[^\d]/g, '') || '0');
                return acc + value;
              }, 0).toLocaleString()}</p>
            </div>
            <Coins className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Inversores</p>
              <p className="text-3xl font-bold">{safeProjects.reduce((acc, p) => acc + (p?.investors || 0), 0)}</p>
            </div>
            <Users className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Lista de proyectos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Proyectos Registrados</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">Proyecto</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">Ubicación</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">Valor</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">Tokens</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">Estado</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">Progreso</th>
              </tr>
            </thead>
            <tbody>
              {safeProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No hay proyectos registrados</p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Crear primer proyecto
                    </button>
                  </td>
                </tr>
              ) : (
                safeProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                          {project.name?.slice(0, 2)?.toUpperCase() || "IN"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {project.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {project.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{project.location}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{project.totalValue}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{project.pricePerToken}/token</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white">{project.tokensAvailable}/{project.tokensTotal}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : project.status === 'funded'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {project.status === 'active' ? 'Activo' : 
                         project.status === 'funded' ? 'Financiado' : 'Próximo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(project.progress || 0, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {(project.progress || 0).toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header del panel */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel - KYC</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Gestiona las verificaciones de identidad</p>
            </div>

            {/* Navegación por tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
              <button
                onClick={() => setActiveTab('kyc')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'kyc'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Shield className="w-4 h-4" />
                KYC
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Proyectos
              </button>
            </div>

            {/* Contenido según tab activo */}
            {activeTab === 'kyc' ? renderKYCContent() : renderProjectsContent()}
          </div>
        </main>
      </div>

      {/* Modal de documentos KYC */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Documentos KYC - {selectedSubmission.wallet_address.slice(0, 10)}...
              </h3>
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setDocuments(null);
                  setRejectionReason("");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {!documents ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Información del submission */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Tipo de documento:</span>
                        <p className="text-gray-600 dark:text-gray-300">{selectedSubmission.document_type}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Estado:</span>
                        <p className="text-gray-600 dark:text-gray-300">{selectedSubmission.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documentos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {documents.documentFront && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Documento (Frontal)</h4>
                        <Image 
                          src={documents.documentFront} 
                          alt="Documento frontal" 
                          width={400}
                          height={256}
                          className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                      </div>
                    )}
                    
                    {documents.documentBack && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Documento (Posterior)</h4>
                        <Image 
                          src={documents.documentBack} 
                          alt="Documento posterior" 
                          width={400}
                          height={256}
                          className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                      </div>
                    )}
                    
                    {documents.proofOfAddress && (
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Comprobante de Domicilio</h4>
                        <Image 
                          src={documents.proofOfAddress} 
                          alt="Comprobante de domicilio" 
                          width={800}
                          height={256}
                          className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  {selectedSubmission.status === 'pending' && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => handleApprove(selectedSubmission.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Aprobar KYC
                        </button>
                        
                        <div className="flex-1 space-y-2">
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Razón del rechazo..."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            rows={2}
                          />
                          <button
                            onClick={() => handleReject(selectedSubmission.id)}
                            disabled={!rejectionReason.trim()}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Rechazar KYC
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de crear proyecto */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Crear Nuevo Proyecto</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <CreateProjectForm
                onSubmit={handleCreateProject}
                isLoading={isCreating}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}