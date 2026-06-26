'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { CreateProjectForm } from '@/components/CreateProjectForm';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { useProjectCreation } from '@/hooks/useProjectCreation';
import { useProjects, ProjectDisplay } from '@/hooks/useProjects';
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
  Coins,
} from 'lucide-react';
import { toast } from 'sonner';
import { getTw } from '@/lib/thirdweb';
import { prepareContractCall } from 'thirdweb';
import { useSendTransaction } from 'thirdweb/react';
import { ethers } from 'ethers';
import { useVerifiedWallets } from '@/hooks/useVerifiedWallets';
import { logger } from '@/lib/logger';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // 🆕 Estados para registro manual de KYC
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [walletCheckStatus, setWalletCheckStatus] = useState<{
    checked: boolean;
    isVerified: boolean;
  }>({ checked: false, isVerified: false });

  // Hooks
  const { projects, refetch: refetchProjects } = useProjects();
  const { createProject, isLoading: isCreating } = useProjectCreation();
  const { mutate: sendTransaction } = useSendTransaction();
  const {
    verifiedWallets,
    isLoading: isLoadingWallets,
    checkWallet,
    fetchAllWallets,
  } = useVerifiedWallets();

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
      console.error('Error cargando wallets desde blockchain:', error);
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
      document_type: 'Blockchain', // Sin documentos físicos por ahora
      status: wallet.isVerified ? 'approved' : 'pending',
      submitted_at: wallet.registeredAt || new Date().toISOString(),
      reviewed_at: wallet.isVerified ? wallet.registeredAt : undefined,
      reviewed_by: wallet.isVerified ? address : undefined,
    }));

    // Filtrar según el tab activo
    const filteredData =
      kycSubTab === 'pending'
        ? blockchainSubmissions.filter((s) => s.status === 'pending')
        : blockchainSubmissions;

    setSubmissions(filteredData);

    // Calcular estadísticas
    setStats({
      pending: blockchainSubmissions.filter((s) => s.status === 'pending').length,
      approved: blockchainSubmissions.filter((s) => s.status === 'approved').length,
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
      toast.error('Ingrese una dirección de wallet válida');
      return;
    }

    // Validar formato de dirección Ethereum
    if (!ethers.isAddress(newWalletAddress)) {
      toast.error('Dirección de wallet inválida');
      return;
    }

    // Verificar si ya está aprobada
    if (!walletCheckStatus.checked) {
      toast.error('Primero verifica si la wallet ya está aprobada');
      return;
    }

    if (walletCheckStatus.isVerified) {
      toast.error('Esta wallet ya está aprobada en blockchain');
      return;
    }

    const IR_ADDRESS = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY;
    if (!IR_ADDRESS) {
      toast.error('IdentityRegistry no configurado');
      return;
    }

    try {
      setIsRegistering(true);
      logger.security('Registrando wallet en IdentityRegistry:', newWalletAddress);

      const contract = getTw(IR_ADDRESS as `0x${string}`);
      const tx = prepareContractCall({
        contract,
        method:
          'function registerIdentity(address _userAddress, address _identity, uint16 _country)',
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
          setNewWalletAddress('');
          setWalletCheckStatus({ checked: false, isVerified: false });
          setIsRegistering(false);

          // Recargar lista desde blockchain
          setTimeout(() => {
            fetchAllWallets().then(() => fetchSubmissions());
          }, 2000); // Esperar 2s para que se indexe el evento
        },
        onError: (error) => {
          console.error('❌ Error al registrar:', error);
          toast.error('Error al registrar wallet en blockchain');
          setIsRegistering(false);
        },
      });
    } catch (error) {
      console.error('Error al preparar registro:', error);
      toast.error('Error al preparar la transacción');
      setIsRegistering(false);
    }
  };

  // 🆕 Verificar estado de wallet antes de registrar
  const handleCheckWallet = async () => {
    if (!newWalletAddress.trim() || !ethers.isAddress(newWalletAddress)) {
      toast.error('Ingrese una dirección válida primero');
      return;
    }

    try {
      const isVerified = await checkWallet(newWalletAddress);
      setWalletCheckStatus({ checked: true, isVerified });

      if (isVerified) {
        toast.success('✅ Esta wallet YA está aprobada en blockchain');
      } else {
        toast.info('⏳ Wallet no encontrada - puedes registrarla ahora');
      }
    } catch (error) {
      console.error('Error verificando wallet:', error);
      toast.error('Error al verificar wallet');
    }
  };

  // Crear proyecto
  const handleCreateProject = useCallback(
    async (formData: ProjectFormData) => {
      try {
        await createProject(formData);
        setShowCreateForm(false);
        toast.success('Proyecto creado exitosamente');
        refetchProjects();
      } catch (error) {
        console.error('Error al crear proyecto:', error);
        toast.error('Error al crear el proyecto');
      }
    },
    [createProject, refetchProjects]
  );

  // Filtrar submissions
  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.wallet_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renderizar contenido KYC
  const renderKYCContent = () => (
    <div className="space-y-6">
      {/* KYC statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pending Review
              </p>
              <p className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">
                {stats.pending}
              </p>
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                Awaiting verification
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 shrink-0">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Verified Investors
              </p>
              <p className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">
                {stats.approved}
              </p>
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">Cleared to invest</p>
            </div>
            <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rejected
              </p>
              <p className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">
                {stats.rejected}
              </p>
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">Failed compliance</p>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 shrink-0">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* KYC table + filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setKycSubTab('pending')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                kycSubTab === 'pending'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setKycSubTab('all')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200 dark:border-gray-700 ${
                kycSubTab === 'all'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              All
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search wallet address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none dark:bg-gray-800 dark:text-white placeholder-gray-400"
              />
            </div>

            <button
              onClick={() => setShowRegisterForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Register Wallet
            </button>
          </div>
        </div>

        {/* Tabla de submissions */}
        {isLoading || isLoadingWallets ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Cargando wallets desde blockchain...
            </span>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {searchTerm
                ? 'No se encontraron wallets'
                : 'No hay wallets registradas en blockchain'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Usa el botón &quot;Registrar Wallet&quot; para aprobar nuevos inversores
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Clearance
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                          {submission.wallet_address}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(submission.wallet_address);
                            toast.success('Dirección copiada');
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Copiar dirección"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          submission.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : submission.status === 'approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {submission.status === 'pending'
                          ? '⏳ Pendiente'
                          : submission.status === 'approved'
                            ? '✅ Verificado'
                            : '❌ Rechazado'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {new Date(submission.submitted_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
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
        {/* Projects section header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tokenized Assets
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Active digital securities on Polygon Mainnet
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Project KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Projects
                </p>
                <p className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">
                  {safeProjects.length}
                </p>
                <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">Deployed on-chain</p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 shrink-0">
                <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Active
                </p>
                <p className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">
                  {safeProjects.filter((p) => p?.status === 'active').length}
                </p>
                <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                  Open for investment
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 shrink-0">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Value
                </p>
                <p className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">
                  €
                  {safeProjects
                    .reduce((acc, p) => {
                      if (!p?.totalValue) return acc;
                      const value = parseInt(p.totalValue.replace(/[^\d]/g, '') || '0');
                      return acc + value;
                    }, 0)
                    .toLocaleString('es-ES')}
                </p>
                <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">Aggregate AUM</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 shrink-0">
                <Coins className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Investors
                </p>
                <p className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">
                  {safeProjects.reduce((acc, p) => acc + (p?.investors || 0), 0)}
                </p>
                <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">Qualified wallets</p>
              </div>
              <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 shrink-0">
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Registered Projects
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tokens
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {safeProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Building2 className="w-7 h-7 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            No projects deployed
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                            Deploy your first tokenized asset on Polygon to start issuing digital
                            securities.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowCreateForm(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Deploy First Project
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  safeProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-semibold">
                            {project.name?.slice(0, 2)?.toUpperCase() || 'IN'}
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
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {project.location}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {project.totalValue}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {project.pricePerToken}/token
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 dark:text-white">
                          {project.tokensAvailable}/{project.tokensTotal}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : project.status === 'funded'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {project.status === 'active'
                            ? 'Activo'
                            : project.status === 'funded'
                              ? 'Financiado'
                              : 'Próximo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                          <div
                            className="bg-gray-900 dark:bg-white h-1.5 rounded-full transition-all duration-300"
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
          <div className="px-8 py-8">
            {/* Dashboard header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage digital securities issuance and asset lifecycle on Polygon.
                </p>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shrink-0">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Enterprise
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Online
                  </span>
                </span>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-0 border-b border-gray-200 dark:border-gray-800 mb-8 -mt-2">
              <button
                onClick={() => setActiveTab('kyc')}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'kyc'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                Identity &amp; KYC
                {activeTab === 'kyc' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-t-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'projects'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Projects
                {activeTab === 'projects' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-t-full" />
                )}
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Crear Nuevo Proyecto
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <CreateProjectForm onSubmit={handleCreateProject} isLoading={isCreating} />
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
                  setNewWalletAddress('');
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
                  <div
                    className={`mt-2 p-3 rounded-lg ${
                      walletCheckStatus.isVerified
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {walletCheckStatus.isVerified
                        ? '✅ Wallet ya aprobada en blockchain'
                        : '⏳ Wallet no registrada - puedes aprobarla ahora'}
                    </p>
                  </div>
                )}

                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  Esta wallet podrá invertir inmediatamente después de la aprobación en blockchain
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>ℹ️ Registro en Blockchain:</strong>
                  <br />
                  La aprobación se guarda directamente en el{' '}
                  <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">
                    IdentityRegistry
                  </code>{' '}
                  de Polygon. La wallet podrá invertir instantáneamente.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRegisterForm(false);
                    setNewWalletAddress('');
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
