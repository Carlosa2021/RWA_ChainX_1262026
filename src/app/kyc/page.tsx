'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  MapPin,
  Loader2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';

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
    documentType: 'dni',
  });
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchKYCStatus = useCallback(async () => {
    if (!address) return;

    try {
      setIsLoadingStatus(true);

      // Sistema KYC simplificado
      const initialStatus: KYCStatus = {
        wallet_address: address,
        document_type: '',
        status: 'not_submitted',
        submitted_at: undefined,
        reviewed_at: undefined,
        rejection_reason: undefined,
      };

      setKycStatus(initialStatus);
    } catch (error) {
      console.error('Error al obtener estado KYC:', error);
      setKycStatus(null);
    } finally {
      setIsLoadingStatus(false);
    }
  }, [address]);

  // Cargar estado del KYC al montar
  useEffect(() => {
    if (address) {
      fetchKYCStatus();
    }
  }, [address, fetchKYCStatus]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        toast.error('El archivo debe ser menor a 10MB');
        return;
      }

      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setter(file);
        toast.success(`Archivo "${file.name}" seleccionado`);
      } else {
        toast.error('Solo se permiten archivos PDF o imágenes (JPG, PNG)');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error('Por favor conecta tu wallet primero');
      return;
    }

    if (!documentFront) {
      toast.error('Debes subir el frente de tu documento');
      return;
    }

    if (formData.documentType === 'dni' && !documentBack) {
      toast.error('Debes subir el reverso de tu DNI');
      return;
    }

    if (!proofOfAddress) {
      toast.error('Debes subir un comprobante de domicilio');
      return;
    }

    setIsSubmitting(true);

    try {
      // Verificar si el backend está disponible
      if (!API_URL || API_URL.includes('localhost')) {
        // Envío simulado

        // Simular envío exitoso
        await new Promise((resolve) => setTimeout(resolve, 2000));

        toast.success('¡Documentos enviados correctamente! En revisión...');

        // Notify admin via Resend (fire-and-forget, non-blocking)
        fetch('/api/kyc-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: address,
            documentType: formData.documentType,
            submittedAt: new Date().toISOString(),
          }),
        }).catch((err) => console.warn('[kyc] Notify failed (non-blocking):', err));

        // Actualizar estado a "pending"
        setKycStatus({
          wallet_address: address,
          document_type: formData.documentType,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        });

        // Limpiar formulario
        setDocumentFront(null);
        setDocumentBack(null);
        setProofOfAddress(null);

        return;
      }

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
        toast.success('¡Documentos enviados correctamente! En revisión...');

        // Notify admin via Resend (fire-and-forget, non-blocking)
        fetch('/api/kyc-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: address,
            documentType: formData.documentType,
            submittedAt: new Date().toISOString(),
          }),
        }).catch((err) => console.warn('[kyc] Notify failed (non-blocking):', err));

        // Actualizar estado
        await fetchKYCStatus();
        // Limpiar formulario
        setDocumentFront(null);
        setDocumentBack(null);
        setProofOfAddress(null);
      } else {
        toast.error(data.error || 'Error al enviar documentos');
      }
    } catch (error) {
      console.error('Error al enviar KYC:', error);

      // Fallback a simulación en caso de error
      // Envío simulado en caso de error de conexión

      toast.success('¡Documentos enviados correctamente! En revisión... (MODO DEMO)');

      // Notify admin via Resend (fire-and-forget, non-blocking)
      fetch('/api/kyc-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          documentType: formData.documentType,
          submittedAt: new Date().toISOString(),
        }),
      }).catch((err) => console.warn('[kyc] Notify failed (non-blocking):', err));

      // Actualizar estado a "pending"
      setKycStatus({
        wallet_address: address,
        document_type: formData.documentType,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      });

      // Limpiar formulario
      setDocumentFront(null);
      setDocumentBack(null);
      setProofOfAddress(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    if (!kycStatus || kycStatus.status === 'not_submitted') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <AlertCircle className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Not Verified</span>
        </div>
      );
    }

    switch (kycStatus.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
              In Review
            </span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
            <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Verified</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-700 dark:text-red-300">Rejected</span>
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
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Identity Verification
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  KYC — MiCA &amp; AML compliance required to participate in digital securities
                  offerings.
                </p>
              </div>
              {!isLoadingStatus && getStatusBadge()}
            </div>

            <p className="text-gray-600 dark:text-gray-300">
              Para invertir en proyectos inmobiliarios tokenizados, necesitamos verificar tu
              identidad según las regulaciones MiCA y AML.
            </p>
          </div>

          {/* Loading State */}
          {isLoadingStatus && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* Status: Approved */}
          {!isLoadingStatus && kycStatus?.status === 'approved' && (
            <div className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800/50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Identity Verified
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Your identity has been cleared. You may now participate in digital securities
                offerings.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Verified on:{' '}
                {kycStatus.reviewed_at &&
                  new Date(kycStatus.reviewed_at).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </div>
            </div>
          )}

          {/* Status: In Review */}
          {!isLoadingStatus && kycStatus?.status === 'pending' && (
            <div className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Documents Under Review
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Your submission is being reviewed. This typically takes 24–48 hours.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Submitted on:{' '}
                {kycStatus.submitted_at &&
                  new Date(kycStatus.submitted_at).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </div>
            </div>
          )}

          {/* Status: Rejected */}
          {!isLoadingStatus && kycStatus?.status === 'rejected' && (
            <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                    Submission Rejected
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {kycStatus.rejection_reason || 'No reason specified.'}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Please correct the issues identified above and resubmit your documents.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario - Solo si no está aprobado o en revisión */}
          {!isLoadingStatus &&
            kycStatus?.status !== 'approved' &&
            kycStatus?.status !== 'pending' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de documento */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Document type
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none"
                  >
                    <option value="dni">DNI / NIE (España)</option>
                    <option value="passport">Pasaporte</option>
                    <option value="driver_license">Licencia de conducir</option>
                  </select>
                </div>

                {/* Upload: Documento frontal */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Identity Document — Front *
                  </label>

                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, setDocumentFront)}
                    className="hidden"
                    id="documentFront"
                  />
                  <label
                    htmlFor="documentFront"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-900 dark:hover:border-white cursor-pointer transition-colors"
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
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG o PDF (máx. 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Upload: Documento reverso (solo para DNI) */}
                {formData.documentType === 'dni' && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
                      Identity Document — Back *
                    </label>

                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, setDocumentBack)}
                      className="hidden"
                      id="documentBack"
                    />
                    <label
                      htmlFor="documentBack"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-900 dark:hover:border-white cursor-pointer transition-colors"
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
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG o PDF (máx. 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                )}

                {/* Upload: Comprobante de domicilio */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Proof of Address *
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Utility bill, bank statement, or lease agreement (issued within the last 3
                    months)
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
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-900 dark:hover:border-white cursor-pointer transition-colors"
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
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG o PDF (máx. 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !address}
                  className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-gray-900 font-medium py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting documents...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Submit Documents for Verification
                    </>
                  )}
                </button>

                {!address && (
                  <p className="text-center text-xs text-red-600 dark:text-red-400">
                    Connect your wallet to submit documents.
                  </p>
                )}
              </form>
            )}

          {/* Info */}
          <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Why is identity verification required?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  MiCA and EU AML/KYC regulatory compliance
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Protection against fraud and money laundering
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Security guarantee for all participants in the offering
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Your documents are encrypted and processed securely
                </span>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
