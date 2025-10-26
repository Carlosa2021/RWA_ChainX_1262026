"use client";

import { useState } from "react";
import { 
  Building2, 
  Euro, 
  FileText, 
  Globe, 
  MapPin, 
  Upload,
  Coins,
  Calculator,
  Save,
  Eye,
  ArrowRight,
  // Info,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

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

interface CreateProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  isLoading?: boolean;
}

const STABLECOINS = [
  { 
    value: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", 
    label: "USDC (Polygon)",
    symbol: "USDC"
  },
  { 
    value: "0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c", 
    label: "EURC (Polygon)",
    symbol: "EURC"
  }
];

const PROPERTY_TYPES = [
  "Residencial - Apartamento",
  "Residencial - Casa",
  "Comercial - Oficina",
  "Comercial - Local",
  "Industrial - Almacén",
  "Industrial - Fábrica",
  "Terreno - Urbano",
  "Terreno - Rústico",
  "Hotel",
  "Parking"
];

export function CreateProjectForm({ onSubmit, isLoading }: CreateProjectFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    // Datos reales del inmueble en Reyes Católicos 97, Alzira
    name: "Inmueble Reyes Católicos Alzira",
    symbol: "RCA97-001",
    description: "Inmueble residencial ubicado en Calle Reyes Católicos 97, 1º y 1ªA de Alzira, Valencia C.P. 46600, España. La propiedad cuenta con 6 habitaciones, salón, cocina y 2 baños independientes, con un patio cubierto central y un solarium/terraza en la parte superior. Se encuentra ubicado en las calles más céntricas y señoriales de Alzira, capital de la comarca de la Ribera Alta. Ofrece una rentabilidad del 8% anual a través de ingresos por alquiler.",
    location: "Calle Reyes Católicos 97, 1º y 1ªA, Alzira, Valencia C.P. 46600, España",
    totalValue: "175000", // €175,000
    pricePerToken: "1000", // €1,000 por token
    maxTokens: "175", // 175 tokens
    minInvestment: "1000", // Mínimo 1 token (€1,000)
    decimals: "0",
    stablecoin: STABLECOINS[1].value, // EURC para euros
    propertyImages: [],
    legalDocuments: [],
    metadataURI: "reyes-catolicos-alzira-2025",
    propertyType: "Residencial - Apartamento",
    expectedReturn: "8", // 8% anual
    duration: "60", // 5 años (60 meses)
    rentYield: "8"
  });

  // const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calcular algunos campos
    if (field === "name") {
      const symbol = value
        .split(" ")
        .map(word => word.charAt(0).toUpperCase())
        .join("")
        .substring(0, 6);
      setFormData(prev => ({ ...prev, symbol }));
    }
    
    if (field === "totalValue" || field === "pricePerToken") {
      const total = parseFloat(formData.totalValue || "0");
      const price = parseFloat(formData.pricePerToken || "0");
      if (total > 0 && price > 0) {
        const maxTokens = Math.floor(total / price);
        setFormData(prev => ({ ...prev, maxTokens: maxTokens.toString() }));
      }
    }
  };

  const handleFileUpload = (field: "propertyImages" | "legalDocuments", files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setFormData(prev => ({ ...prev, [field]: fileArray }));
    
    toast.success(`${fileArray.length} archivo(s) seleccionado(s)`);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.description && formData.location && formData.propertyType);
      case 2:
        return !!(formData.totalValue && formData.pricePerToken && formData.maxTokens);
      case 3:
        return !!(formData.symbol && formData.stablecoin);
      case 4:
        return formData.propertyImages.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error("Por favor completa todos los campos requeridos");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      toast.error("Error al crear el proyecto");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-purple-600" />
                Información del Proyecto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ej: Edificio Residencial Madrid Centro"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Propiedad *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange("propertyType", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ubicación *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Ej: Calle Gran Vía 123, Madrid, España"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción del Proyecto *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe las características principales del proyecto, ubicación, calidades, servicios, etc."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-purple-600" />
                Configuración Financiera
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor Total del Proyecto (€) *
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.totalValue}
                      onChange={(e) => handleInputChange("totalValue", e.target.value)}
                      placeholder="500000"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Precio por Token (€) *
                  </label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.pricePerToken}
                      onChange={(e) => handleInputChange("pricePerToken", e.target.value)}
                      placeholder="100"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Máximo de Tokens *
                  </label>
                  <input
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => handleInputChange("maxTokens", e.target.value)}
                    placeholder="5000"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    readOnly
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Se calcula automáticamente: Valor Total ÷ Precio por Token
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Inversión Mínima (€)
                  </label>
                  <input
                    type="number"
                    value={formData.minInvestment}
                    onChange={(e) => handleInputChange("minInvestment", e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rentabilidad Esperada (% anual)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.expectedReturn}
                    onChange={(e) => handleInputChange("expectedReturn", e.target.value)}
                    placeholder="8.5"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duración del Proyecto (años)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="5"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Coins className="w-6 h-6 text-purple-600" />
                Configuración del Token
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Símbolo del Token *
                  </label>
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={(e) => handleInputChange("symbol", e.target.value.toUpperCase())}
                    placeholder="ERMC"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Máximo 6 caracteres. Se genera automáticamente del nombre.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Decimales del Token *
                  </label>
                  <select
                    value={formData.decimals}
                    onChange={(e) => handleInputChange("decimals", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="0">0 (tokens indivisibles)</option>
                    <option value="2">2 (divisible en céntimos)</option>
                    <option value="18">18 (máxima divisibilidad)</option>
                  </select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Para propiedades físicas se recomienda 0 decimales.
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stablecoin de Pago *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {STABLECOINS.map(coin => (
                      <label
                        key={coin.value}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.stablecoin === coin.value
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-300 dark:border-gray-700 hover:border-purple-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="stablecoin"
                          value={coin.value}
                          checked={formData.stablecoin === coin.value}
                          onChange={(e) => handleInputChange("stablecoin", e.target.value)}
                          className="w-4 h-4 text-purple-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {coin.symbol}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {coin.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Upload className="w-6 h-6 text-purple-600" />
                Documentos y Archivos
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imágenes de la Propiedad *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Subir imágenes de la propiedad
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        PNG, JPG, WEBP hasta 10MB cada una
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload("propertyImages", e.target.files)}
                        className="hidden"
                        id="property-images"
                      />
                      <label
                        htmlFor="property-images"
                        className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl cursor-pointer transition-colors"
                      >
                        Seleccionar archivos
                      </label>
                    </div>
                  </div>
                  {formData.propertyImages.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✓ {formData.propertyImages.length} imagen(es) seleccionada(s)
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Documentos Legales (Opcional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Subir documentos legales
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        PDF, DOC, DOCX - Escrituras, certificados, etc.
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload("legalDocuments", e.target.files)}
                        className="hidden"
                        id="legal-docs"
                      />
                      <label
                        htmlFor="legal-docs"
                        className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg cursor-pointer transition-colors text-sm"
                      >
                        Seleccionar archivos
                      </label>
                    </div>
                  </div>
                  {formData.legalDocuments.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✓ {formData.legalDocuments.length} documento(s) seleccionado(s)
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URI de Metadatos (IPFS)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.metadataURI}
                      onChange={(e) => handleInputChange("metadataURI", e.target.value)}
                      placeholder="ipfs://QmYourHashHere o https://gateway.pinata.cloud/..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Se generará automáticamente al subir los archivos a IPFS
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-purple-600" />
                Revisar y Confirmar
              </h3>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Información Básica</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600 dark:text-gray-400">Nombre:</span> <span className="font-medium">{formData.name}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Símbolo:</span> <span className="font-mono font-bold">{formData.symbol}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Ubicación:</span> <span className="font-medium">{formData.location}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Tipo:</span> <span className="font-medium">{formData.propertyType}</span></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Configuración Financiera</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600 dark:text-gray-400">Valor Total:</span> <span className="font-bold text-green-600">€{Number(formData.totalValue).toLocaleString()}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Precio/Token:</span> <span className="font-bold">€{formData.pricePerToken}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Máx. Tokens:</span> <span className="font-bold">{Number(formData.maxTokens).toLocaleString()}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Stablecoin:</span> <span className="font-medium">{STABLECOINS.find(c => c.value === formData.stablecoin)?.symbol}</span></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Archivos</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600 dark:text-gray-400">Imágenes:</span> <span className="font-medium">{formData.propertyImages.length} archivo(s)</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Documentos:</span> <span className="font-medium">{formData.legalDocuments.length} archivo(s)</span></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Rentabilidad</h4>
                    <div className="space-y-2 text-sm">
                      {formData.expectedReturn && <div><span className="text-gray-600 dark:text-gray-400">Retorno Esperado:</span> <span className="font-bold text-green-600">{formData.expectedReturn}% anual</span></div>}
                      {formData.duration && <div><span className="text-gray-600 dark:text-gray-400">Duración:</span> <span className="font-medium">{formData.duration} años</span></div>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Antes de crear el proyecto:
                      </p>
                      <ul className="space-y-1 text-yellow-700 dark:text-yellow-300">
                        <li>• Verifica que todos los datos sean correctos</li>
                        <li>• Los tokens se desplegarán inmediatamente en la blockchain</li>
                        <li>• El proyecto será visible para todos los inversores</li>
                        <li>• Esta acción no se puede deshacer fácilmente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { id: 1, title: "Información", icon: Building2 },
    { id: 2, title: "Financiero", icon: Calculator },
    { id: 3, title: "Token", icon: Coins },
    { id: 4, title: "Archivos", icon: Upload },
    { id: 5, title: "Revisar", icon: Eye }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Crear Nuevo Proyecto de Tokenización
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Convierte tu propiedad inmobiliaria en tokens digitales
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isValidated = validateStep(step.id);
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all ${
                  isActive 
                    ? "border-purple-500 bg-purple-500 text-white"
                    : isCompleted 
                    ? "border-green-500 bg-green-500 text-white"
                    : isValidated
                    ? "border-purple-300 bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-semibold ${
                    isActive || isCompleted 
                      ? "text-gray-900 dark:text-white" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 mx-4 hidden md:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="min-h-[500px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 dark:text-white font-semibold rounded-xl transition-colors"
        >
          Anterior
        </button>
        
        <div className="flex items-center gap-3">
          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !validateStep(4)}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creando Proyecto...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Crear Proyecto
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}