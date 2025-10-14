"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  AlertCircle,
  X
} from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004";

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

export default function AdminPage() {
  const { isOwner, address } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal para ver documentos
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null);
  const [documents, setDocuments] = useState<KYCDocuments | null>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  
  // Modal para rechazar
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submissionToReject, setSubmissionToReject] = useState<KYCSubmission | null>(null);

  useEffect(() => {
    if (!isOwner) {
      router.push("/");
      return;
    }
    fetchSubmissions();
  }, [isOwner, router, activeTab]);

  const fetchSubmissions = async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      const endpoint = activeTab === "pending" ? "/kyc/pending" : "/kyc/all";
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'x-admin-address': address
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar solicitudes');
      }
      
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error al cargar KYCs:", error);
      // Don't show error toast if backend is not available (development mode)
      if (!API_URL.includes('localhost')) {
        toast.error("Error al cargar las solicitudes");
      } else {
        console.warn("Backend KYC no disponible. Mostrando lista vacía.");
        setSubmissions([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDocuments = async (submission: KYCSubmission) => {
    if (!address) return;
    
    try {
      setIsLoadingDocs(true);
      setSelectedSubmission(submission);
      setShowDocsModal(true);
      
      const response = await fetch(`${API_URL}/kyc/documents/${submission.wallet_address}`, {
        headers: {
          'x-admin-address': address
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar documentos');
      }
      
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      toast.error("Error al cargar los documentos");
      setShowDocsModal(false);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleApprove = async (submission: KYCSubmission) => {
    if (!address) return;
    
    const confirmed = window.confirm(
      `¿Aprobar KYC para ${submission.wallet_address}?\n\nEsto permitirá al usuario invertir en proyectos.`
    );
    
    if (!confirmed) return;
    
    try {
      toast.loading("Aprobando KYC...");
      
      const response = await fetch(`${API_URL}/kyc/approve/${submission.wallet_address}`, {
        method: 'POST',
        headers: {
          'x-admin-address': address,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success(`✅ KYC aprobado para ${submission.wallet_address.slice(0, 10)}...`);
        await fetchSubmissions();
        setShowDocsModal(false);
      } else {
        toast.error(data.error || "Error al aprobar KYC");
      }
    } catch (error) {
      console.error("Error al aprobar:", error);
      toast.error("Error de conexión");
    }
  };

  const openRejectModal = (submission: KYCSubmission) => {
    setSubmissionToReject(submission);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!address || !submissionToReject) return;
    
    if (!rejectionReason.trim()) {
      toast.error("Por favor, especifica una razón para el rechazo");
      return;
    }
    
    try {
      toast.loading("Rechazando KYC...");
      
      const response = await fetch(`${API_URL}/kyc/reject/${submissionToReject.wallet_address}`, {
        method: 'POST',
        headers: {
          'x-admin-address': address,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success(`❌ KYC rechazado para ${submissionToReject.wallet_address.slice(0, 10)}...`);
        await fetchSubmissions();
        setShowRejectModal(false);
        setShowDocsModal(false);
        setSubmissionToReject(null);
        setRejectionReason("");
      } else {
        toast.error(data.error || "Error al rechazar KYC");
      }
    } catch (error) {
      console.error("Error al rechazar:", error);
      toast.error("Error de conexión");
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.wallet_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pendiente
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Aprobado
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Rechazado
          </span>
        );
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel - KYC</h1>
                <p className="text-gray-600 dark:text-gray-400">Gestiona las verificaciones de identidad</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pendientes</span>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {submissions.filter(s => s.status === 'pending').length}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Aprobados</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {submissions.filter(s => s.status === 'approved').length}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Rechazados</span>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {submissions.filter(s => s.status === 'rejected').length}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "pending"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Pendientes
              {activeTab === "pending" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "all"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Todas
              {activeTab === "all" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por wallet address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          )}

          {/* Table */}
          {!isLoading && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Wallet Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Documento
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 dark:text-gray-400">
                            {searchTerm ? "No se encontraron resultados" : "No hay solicitudes"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {submission.wallet_address.slice(2, 4).toUpperCase()}
                              </div>
                              <span className="font-mono text-sm text-gray-900 dark:text-white">
                                {submission.wallet_address.slice(0, 10)}...{submission.wallet_address.slice(-8)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700 dark:text-gray-300 uppercase">
                              {submission.document_type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(submission.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(submission.submitted_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewDocuments(submission)}
                                className="flex items-center gap-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Ver
                              </button>
                              
                              {submission.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(submission)}
                                    className="flex items-center gap-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Aprobar
                                  </button>
                                  <button
                                    onClick={() => openRejectModal(submission)}
                                    className="flex items-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Rechazar
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Ver Documentos */}
      {showDocsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Documentos KYC
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {selectedSubmission?.wallet_address}
                </p>
              </div>
              <button
                onClick={() => setShowDocsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {isLoadingDocs ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
              ) : (
                <>
                  {/* Documento Frente */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Documento de Identidad (Frente)
                    </h3>
                    {documents?.documentFront ? (
                      <img
                        src={documents.documentFront}
                        alt="Documento frente"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No disponible</p>
                    )}
                  </div>

                  {/* Documento Reverso */}
                  {documents?.documentBack && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Documento de Identidad (Reverso)
                      </h3>
                      <img
                        src={documents.documentBack}
                        alt="Documento reverso"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}

                  {/* Comprobante Domicilio */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Comprobante de Domicilio
                    </h3>
                    {documents?.proofOfAddress ? (
                      <img
                        src={documents.proofOfAddress}
                        alt="Comprobante de domicilio"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No disponible</p>
                    )}
                  </div>

                  {/* Actions */}
                  {selectedSubmission?.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <button
                        onClick={() => selectedSubmission && handleApprove(selectedSubmission)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Aprobar KYC
                      </button>
                      <button
                        onClick={() => {
                          if (selectedSubmission) {
                            openRejectModal(selectedSubmission);
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        Rechazar KYC
                      </button>
                    </div>
                  )}

                  {/* Estado no pendiente */}
                  {selectedSubmission?.status !== 'pending' && (
                    <div className="flex items-start gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Estado: {selectedSubmission?.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                        </p>
                        {selectedSubmission?.reviewed_at && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Revisado el {new Date(selectedSubmission.reviewed_at).toLocaleString('es-ES')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rechazar */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rechazar KYC</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {submissionToReject?.wallet_address.slice(0, 20)}...
                  </p>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Razón del rechazo *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ej: Documento ilegible, datos no coinciden, etc."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
