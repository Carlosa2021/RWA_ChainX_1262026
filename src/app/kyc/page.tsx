"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  MapPin,
  Loader2,
  Clock
} from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004";

interface KYCStatus {
  id?: number;
  wallet_address: string;
  document_type: string;
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  submitted_at?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  message?: string;
}

export default function KYCPage() {
  const { address } = useAuth();
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  
  const [formData, setFormData] = useState({
    documentType: "dni",
  });
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar estado del KYC al montar
  useEffect(() => {
    if (address) {
      fetchKYCStatus();
    }
  }, [address]);

  const fetchKYCStatus = async () => {
    if (!address) return;
    
    try {
      setIsLoadingStatus(true);
      const response = await fetch(`${API_URL}/kyc/status/${address}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setKycStatus(data);
    } catch (error) {
      console.error("Error al obtener estado KYC:", error);
      // Don't show error toast if backend is not available (development mode)
      if (API_URL.includes('localhost')) {
        console.warn("Backend KYC no disponible. Usando modo offline.");
        setKycStatus({
          wallet_address: address,
          document_type: "",
          status: 'not_submitted'
        });
      } else {
        toast.error("Error al cargar el estado del KYC");
      }
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (file.size > maxSize) {
        toast.error("El archivo debe ser menor a 10MB");
        return;
      }
      
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setter(file);
        toast.success(`Archivo "${file.name}" seleccionado`);
      } else {
        toast.error("Solo se permiten archivos PDF o imágenes (JPG, PNG)");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error("Por favor conecta tu wallet primero");
      return;
    }
    
    if (!documentFront) {
      toast.error("Debes subir el frente de tu documento");
      return;
    }
    
    if (formData.documentType === "dni" && !documentBack) {
      toast.error("Debes subir el reverso de tu DNI");
      return;
    }
    
    if (!proofOfAddress) {
      toast.error("Debes subir un comprobante de domicilio");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('walletAddress', address);
      formDataToSend.append('documentType', formData.documentType);
      formDataToSend.append('documentFront', documentFront);
      if (documentBack) {
        formDataToSend.append('documentBack', documentBack);
      }
      formDataToSend.append('proofOfAddress', proofOfAddress);

      const response = await fetch(`${API_URL}/kyc/upload`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("¡Documentos enviados correctamente! En revisión...");
        // Actualizar estado
        await fetchKYCStatus();
        // Limpiar formulario
        setDocumentFront(null);
        setDocumentBack(null);
        setProofOfAddress(null);
      } else {
        toast.error(data.error || "Error al enviar documentos");
      }
    } catch (error) {
      console.error("Error al enviar KYC:", error);
      toast.error("Error de conexión con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    if (!kycStatus || kycStatus.status === 'not_submitted') {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Sin verificar</span>
        </div>
      );
    }

    switch (kycStatus.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 animate-pulse" />
            <span className="font-medium text-yellow-700 dark:text-yellow-300">En revisión</span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-700 dark:text-green-300">Verificado ✓</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="font-medium text-red-700 dark:text-red-300">Rechazado</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Verificación KYC
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Know Your Customer
                  </p>
                </div>
              </div>
              {!isLoadingStatus && getStatusBadge()}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">
              Para invertir en proyectos inmobiliarios tokenizados, necesitamos verificar tu identidad según las regulaciones MiCA y AML.
            </p>
          </div>

          {/* Loading State */}
          {isLoadingStatus && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* Estado: Aprobado */}
          {!isLoadingStatus && kycStatus?.status === 'approved' && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                ¡Tu identidad está verificada!
              </h2>
              <p className="text-green-700 dark:text-green-300 mb-6">
                Ya puedes invertir en proyectos inmobiliarios tokenizados
              </p>
              <div className="text-sm text-green-600 dark:text-green-400">
                Verificado el: {kycStatus.reviewed_at && new Date(kycStatus.reviewed_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}

          {/* Estado: En revisión */}
          {!isLoadingStatus && kycStatus?.status === 'pending' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-12 h-12 text-yellow-600 dark:text-yellow-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                Documentos en revisión
              </h2>
              <p className="text-yellow-700 dark:text-yellow-300 mb-6">
                Tu solicitud está siendo revisada. Normalmente toma 24-48 horas.
              </p>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                Enviado el: {kycStatus.submitted_at && new Date(kycStatus.submitted_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}

          {/* Estado: Rechazado */}
          {!isLoadingStatus && kycStatus?.status === 'rejected' && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
                    Solicitud rechazada
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mb-3">
                    {kycStatus.rejection_reason || "No se especificó una razón"}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Por favor, corrige los problemas y vuelve a enviar tus documentos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario - Solo si no está aprobado o en revisión */}
          {!isLoadingStatus && kycStatus?.status !== 'approved' && kycStatus?.status !== 'pending' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de documento */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tipo de documento de identidad
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="dni">DNI / NIE (España)</option>
                  <option value="passport">Pasaporte</option>
                  <option value="driver_license">Licencia de conducir</option>
                </select>
              </div>

              {/* Upload: Documento frontal */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Documento de identidad (Frente) *
                  </label>
                </div>
                
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, setDocumentFront)}
                  className="hidden"
                  id="documentFront"
                />
                <label
                  htmlFor="documentFront"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-colors"
                >
                  {documentFront ? (
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {documentFront.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(documentFront.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click para subir archivo
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG o PDF (máx. 10MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Upload: Documento reverso (solo para DNI) */}
              {formData.documentType === 'dni' && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Documento de identidad (Reverso) *
                    </label>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, setDocumentBack)}
                    className="hidden"
                    id="documentBack"
                  />
                  <label
                    htmlFor="documentBack"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    {documentBack ? (
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {documentBack.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(documentBack.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click para subir archivo
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG o PDF (máx. 10MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              )}

              {/* Upload: Comprobante de domicilio */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Comprobante de domicilio *
                  </label>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Factura de servicios, extracto bancario o contrato de alquiler (últimos 3 meses)
                </p>
                
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, setProofOfAddress)}
                  className="hidden"
                  id="proofOfAddress"
                />
                <label
                  htmlFor="proofOfAddress"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-colors"
                >
                  {proofOfAddress ? (
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {proofOfAddress.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(proofOfAddress.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click para subir archivo
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG o PDF (máx. 10MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !address}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando documentos...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Enviar documentos para verificación
                  </>
                )}
              </button>

              {!address && (
                <p className="text-center text-sm text-red-600 dark:text-red-400">
                  Conecta tu wallet para enviar documentos
                </p>
              )}
            </form>
          )}

          {/* Info */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
              ¿Por qué necesitamos verificar tu identidad?
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Cumplimiento con regulaciones MiCA y AML/KYC europeas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Protección contra fraude y lavado de dinero</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Garantía de seguridad para todos los inversores</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Tus datos están encriptados y protegidos</span>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
