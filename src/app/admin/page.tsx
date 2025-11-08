"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { CreateProjectForm } from "@/components/CreateProjectForm";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useProjectCreation } from "@/hooks/useProjectCreation";
import { useProjects, ProjectDisplay } from "@/hooks/useProjects";
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Loader2,
  FileText,
  X,
  Plus,
  Building2,
  TrendingUp,
  Coins
} from "lucide-react";
import { toast } from "sonner";
import { getTw } from "@/lib/thirdweb";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { useVerifiedWallets } from "@/hooks/useVerifiedWallets";

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

// Todas las propiedades son usadas por CreateProjectForm
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const { address } = useAuth();
  
  // Estados
  const [activeTab, setActiveTab] = useState<'kyc' | 'projects'>('kyc');
  const [kycSubTab, setKycSubTab] = useState<'pending' | 'all'>('all');
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [stats, setStats] = useState<KYCStats>({ pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // 🆕 Estados para registro manual de KYC
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [walletCheckStatus, setWalletCheckStatus] = useState<{
    checked: boolean;
    isVerified: boolean;
  }>({ checked: false, isVerified: false });

  // Hooks
  const { projects, refetch: refetchProjects } = useProjects();
  const { createProject, isLoading: isCreating } = useProjectCreation();
  const { mutate: sendTransaction } = useSendTransaction();
  const { verifiedWallets, isLoading: isLoadingWallets, checkWallet, fetchAllWallets } = useVerifiedWallets();

  // Cargar solicitudes KYC desde blockchain
  const fetchSubmissions = useCallback(async () => {
    if (!address) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 🚀 Leer wallets registradas desde blockchain
      await fetchAllWallets();
      
    } catch (error) {
      console.error("Error cargando wallets desde blockchain:", error);
      setSubmissions([]);
      setStats({ pending: 0, approved: 0, rejected: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [address, fetchAllWallets]); // ✅ Removido kycSubTab y verifiedWallets
  
  // 🆕 Efecto separado para procesar verifiedWallets cuando cambian
  useEffect(() => {
    if (!address || verifiedWallets.length === 0) return;
    
    // Convertir a formato KYCSubmission
    const blockchainSubmissions: KYCSubmission[] = verifiedWallets.map((wallet, index) => ({
      id: index + 1,
      wallet_address: wallet.address,
      document_type: "Blockchain", // Sin documentos físicos por ahora
      status: wallet.isVerified ? 'approved' : 'pending',
      submitted_at: wallet.registeredAt || new Date().toISOString(),
      reviewed_at: wallet.isVerified ? wallet.registeredAt : undefined,
      reviewed_by: wallet.isVerified ? address : undefined,
    }));

    // Filtrar según el tab activo
    const filteredData = kycSubTab === "pending" 
      ? blockchainSubmissions.filter(s => s.status === "pending")
      : blockchainSubmissions;
      
    setSubmissions(filteredData);
    
    // Calcular estadísticas
    setStats({
      pending: blockchainSubmissions.filter(s => s.status === 'pending').length,
      approved: blockchainSubmissions.filter(s => s.status === 'approved').length,
      rejected: 0, // No hay sistema de rechazo por ahora
    });
  }, [address, kycSubTab, verifiedWallets]); // ✅ Solo escuchar cambios en los datos

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
    // ✅ Ejecutar cuando cambie el tab activo O cuando se conecte la wallet
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, address]);

  // 🆕 Registrar wallet en IdentityRegistry (blockchain)
  const handleRegisterWallet = async () => {
    if (!address || !newWalletAddress.trim()) {
      toast.error("Ingrese una dirección de wallet válida");
      return;
    }

    // Validar formato de dirección Ethereum
    if (!ethers.isAddress(newWalletAddress)) {
      toast.error("Dirección de wallet inválida");
      return;
    }

    // Verificar si ya está aprobada
    if (!walletCheckStatus.checked) {
      toast.error("Primero verifica si la wallet ya está aprobada");
      return;
    }

    if (walletCheckStatus.isVerified) {
      toast.error("Esta wallet ya está aprobada en blockchain");
      return;
    }

    const IR_ADDRESS = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY;
    if (!IR_ADDRESS) {
      toast.error("IdentityRegistry no configurado");
      return;
    }

    try {
      setIsRegistering(true);
      console.log("🔐 Registrando wallet en IdentityRegistry:", newWalletAddress);

      const contract = getTw(IR_ADDRESS as `0x${string}`);
      const tx = prepareContractCall({
        contract,
        method: "function registerIdentity(address _userAddress, address _identity, uint16 _country)",
        params: [
          newWalletAddress as `0x${string}`,
          ethers.ZeroAddress as `0x${string}`, // identity onchainID (puede ser 0x0)
          0, // country code (0 = no especificado)
        ],
      });

      sendTransaction(tx, {
        onSuccess: () => {
          toast.success(`Wallet ${newWalletAddress.slice(0, 10)}... aprobada para invertir`);
          setShowRegisterForm(false);
          setNewWalletAddress("");
          setWalletCheckStatus({ checked: false, isVerified: false });
          setIsRegistering(false);
          
          // Recargar lista desde blockchain
          setTimeout(() => {
            fetchAllWallets().then(() => fetchSubmissions());
          }, 2000); // Esperar 2s para que se indexe el evento
        },
        onError: (error) => {
          console.error("❌ Error al registrar:", error);
          toast.error("Error al registrar wallet en blockchain");
          setIsRegistering(false);
        },
      });
    } catch (error) {
      console.error("Error al preparar registro:", error);
      toast.error("Error al preparar la transacción");
      setIsRegistering(false);
    }
  };

  // 🆕 Verificar estado de wallet antes de registrar
  const handleCheckWallet = async () => {
    if (!newWalletAddress.trim() || !ethers.isAddress(newWalletAddress)) {
      toast.error("Ingrese una dirección válida primero");
      return;
    }

    try {
      const isVerified = await checkWallet(newWalletAddress);
      setWalletCheckStatus({ checked: true, isVerified });

      if (isVerified) {
        toast.success("✅ Esta wallet YA está aprobada en blockchain");
      } else {
        toast.info("⏳ Wallet no encontrada - puedes registrarla ahora");
      }
    } catch (error) {
      console.error("Error verificando wallet:", error);
      toast.error("Error al verificar wallet");
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

          <div className="flex gap-3">
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
            
            <button
              onClick={() => setShowRegisterForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Registrar Wallet
            </button>
          </div>
        </div>

        {/* Tabla de submissions */}
        {isLoading || isLoadingWallets ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando wallets desde blockchain...</span>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {searchTerm ? "No se encontraron wallets" : "No hay wallets registradas en blockchain"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Usa el botón &quot;Registrar Wallet&quot; para aprobar nuevos inversores
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Wallet</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Fecha Registro</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Verificación</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                          {submission.wallet_address}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(submission.wallet_address);
                            toast.success("Dirección copiada");
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Copiar dirección"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : submission.status === 'approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {submission.status === 'pending' ? '⏳ Pendiente' : 
                         submission.status === 'approved' ? '✅ Verificado' : '❌ Rechazado'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {new Date(submission.submitted_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {submission.status === 'approved' ? (
                        <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                          ✅ Puede invertir
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setNewWalletAddress(submission.wallet_address);
                            setShowRegisterForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                        >
                          Verificar ahora →
                        </button>
                      )}
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

      {/* 🆕 Modal de registrar wallet */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Registrar Wallet (KYC)
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowRegisterForm(false);
                  setNewWalletAddress("");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Dirección Wallet
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWalletAddress}
                    onChange={(e) => {
                      setNewWalletAddress(e.target.value);
                      setWalletCheckStatus({ checked: false, isVerified: false });
                    }}
                    placeholder="0x..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                    disabled={isRegistering}
                  />
                  <button
                    onClick={handleCheckWallet}
                    disabled={isRegistering || !newWalletAddress.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Verificar
                  </button>
                </div>

                {walletCheckStatus.checked && (
                  <div className={`mt-2 p-3 rounded-lg ${
                    walletCheckStatus.isVerified 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    <p className="text-sm font-medium">
                      {walletCheckStatus.isVerified 
                        ? '✅ Wallet ya aprobada en blockchain'
                        : '⏳ Wallet no registrada - puedes aprobarla ahora'
                      }
                    </p>
                  </div>
                )}

                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  Esta wallet podrá invertir inmediatamente después de la aprobación en blockchain
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>ℹ️ Registro en Blockchain:</strong><br/>
                  La aprobación se guarda directamente en el <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">IdentityRegistry</code> de Polygon.
                  La wallet podrá invertir instantáneamente.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRegisterForm(false);
                    setNewWalletAddress("");
                    setWalletCheckStatus({ checked: false, isVerified: false });
                  }}
                  disabled={isRegistering}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRegisterWallet}
                  disabled={
                    isRegistering || 
                    !newWalletAddress.trim() || 
                    !walletCheckStatus.checked ||
                    walletCheckStatus.isVerified
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Aprobar en Blockchain
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}