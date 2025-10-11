"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  User,
  MapPin,
  CreditCard,
  Loader2
} from "lucide-react";

export default function KYCPage() {
  const { isKYCVerified, address } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    documentType: "passport",
    documentNumber: "",
  });
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setter(file);
      } else {
        alert("Por favor sube un archivo PDF o imagen (JPG, PNG)");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentFront) {
      alert("Debes subir el frente de tu documento");
      return;
    }
    
    if (formData.documentType === "id" && !documentBack) {
      alert("Debes subir el reverso de tu ID");
      return;
    }
    
    if (!proofOfAddress) {
      alert("Debes subir un comprobante de domicilio");
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Upload to IPFS and submit to IdentityRegistry
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verificación KYC</h1>
                <p className="text-gray-600 dark:text-gray-400">Compliance MiCA - Requerido para invertir</p>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          {isKYCVerified ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900 dark:text-green-100">KYC Verificado</h3>
                  <p className="text-green-700 dark:text-green-300">Tu identidad ha sido aprobada. Puedes invertir sin restricciones.</p>
                </div>
              </div>
            </div>
          ) : submitted ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100">KYC en Revisión</h3>
                  <p className="text-yellow-700 dark:text-yellow-300">Tu solicitud está siendo procesada. Te notificaremos en 24-48 horas.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Verificación Requerida</h3>
                  <p className="text-blue-700 dark:text-blue-300">Completa tu KYC para cumplir con las regulaciones MiCA y poder invertir.</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {!isKYCVerified && !submitted && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 dark:text-white"
                        placeholder="Juan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 dark:text-white"
                        placeholder="Pérez"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Domicilio
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dirección Completa *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 dark:text-white"
                      placeholder="Calle Principal 123, Madrid, España"
                    />
                  </div>
                </div>

                {/* Document */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Documento de Identidad
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo de Documento *
                      </label>
                      <select
                        value={formData.documentType}
                        onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 dark:text-white"
                      >
                        <option value="passport">Pasaporte</option>
                        <option value="id">DNI / ID Nacional</option>
                        <option value="driver">Licencia de Conducir</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.documentNumber}
                        onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 dark:text-white"
                        placeholder="ABC123456"
                      />
                    </div>
                  </div>
                </div>

                {/* Document Uploads */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentos Requeridos
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Document Front */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {formData.documentType === "passport" ? "📘 Pasaporte (Página de Foto)" : "🪪 ID/DNI (Frente) *"}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-green-500 dark:hover:border-green-500 transition-colors">
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) => handleFileChange(e, setDocumentFront)}
                          className="hidden"
                          id="doc-front"
                        />
                        <label htmlFor="doc-front" className="cursor-pointer">
                          {documentFront ? (
                            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-semibold">{documentFront.name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                              <Upload className="w-5 h-5" />
                              <span>Click para subir (PDF o Imagen)</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Document Back (only for ID) */}
                    {formData.documentType === "id" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          🪪 ID/DNI (Reverso) *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-green-500 dark:hover:border-green-500 transition-colors">
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={(e) => handleFileChange(e, setDocumentBack)}
                            className="hidden"
                            id="doc-back"
                          />
                          <label htmlFor="doc-back" className="cursor-pointer">
                            {documentBack ? (
                              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-semibold">{documentBack.name}</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                                <Upload className="w-5 h-5" />
                                <span>Click para subir (PDF o Imagen)</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Proof of Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        📄 Comprobante de Domicilio *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-green-500 dark:hover:border-green-500 transition-colors">
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) => handleFileChange(e, setProofOfAddress)}
                          className="hidden"
                          id="proof-address"
                        />
                        <label htmlFor="proof-address" className="cursor-pointer">
                          {proofOfAddress ? (
                            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-semibold">{proofOfAddress.name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                              <Upload className="w-5 h-5" />
                              <span>Click para subir (PDF o Imagen)</span>
                            </div>
                          )}
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Recibo bancario, teléfono, electricidad o gas (máximo 3 meses)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || !address}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Enviar Solicitud KYC
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                    🔒 Tus datos están protegidos y cifrados. Cumplimos con GDPR y MiCA.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Seguro</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Datos cifrados end-to-end</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Rápido</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aprobación en 24-48h</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Compliant</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">100% MiCA & GDPR</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
