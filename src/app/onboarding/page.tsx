'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Package,
  CheckCircle2,
  Shield,
  Home,
  DollarSign,
  Zap,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Check,
  Clock,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Upload,
  X,
  Plus,
  Minus,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  WIZARD_STEPS,
  PLAN_DETAILS,
  WizardStepMeta,
  CompanyData,
  PlanData,
  VerificationData,
  KYCConfigData,
  CampaignData,
  FinancialData,
  TokenizationData,
  PublicationData,
  PlanTier,
  KYCProvider,
  PropertyType,
  TokenizationStepLog,
} from '@/types/onboarding';

// ─── Initial State ───────────────────────────────────────────
const initialTokenizationSteps: TokenizationStepLog[] = [
  { label: 'Preparando contrato de seguridad', status: 'pending' },
  { label: 'Configurando registro de identidad', status: 'pending' },
  { label: 'Estableciendo reglas de compliance', status: 'pending' },
  { label: 'Emitiendo tokens de inversión', status: 'pending' },
  { label: 'Registrando en ProjectRegistry', status: 'pending' },
];

// ─── Progress Bar ─────────────────────────────────────────────
function WizardProgress({ currentStep, steps }: { currentStep: number; steps: WizardStepMeta[] }) {
  return (
    <div className="w-full">
      {/* Mobile: step counter */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <span className="text-sm text-gray-400">
          Paso {currentStep} de {steps.length}
        </span>
        <span className="text-sm font-medium text-purple-400">
          {steps[currentStep - 1]?.icon} {steps[currentStep - 1]?.title}
        </span>
      </div>

      {/* Desktop: full step indicators */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-800 z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-purple-600 z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : isCurrent
                      ? 'bg-gray-900 border-purple-500 text-purple-400'
                      : 'bg-gray-900 border-gray-700 text-gray-600'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span
                className={`mt-2 text-xs font-medium whitespace-nowrap ${
                  isCurrent ? 'text-purple-400' : isCompleted ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {step.icon} {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar (mobile) */}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden md:hidden">
        <div
          className="h-full bg-purple-600 transition-all duration-500 rounded-full"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Step 1: Company Registration ────────────────────────────
function StepRegistro({
  data,
  onChange,
}: {
  data: Partial<CompanyData>;
  onChange: (d: Partial<CompanyData>) => void;
}) {
  const [showPass, setShowPass] = useState(false);

  const set = (key: keyof CompanyData, value: string | boolean) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Registro de empresa</h2>
        <p className="text-gray-400 text-sm">
          Crea tu cuenta empresarial para gestionar activos tokenizados
        </p>
      </div>

      {/* Company info */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Datos empresariales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Nombre legal <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Inmobiliaria García S.L."
              value={data.legalName || ''}
              onChange={(e) => set('legalName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Nombre comercial</label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="García Real Estate"
              value={data.tradeName || ''}
              onChange={(e) => set('tradeName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Forma jurídica <span className="text-red-400">*</span>
            </label>
            <select
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none"
              value={data.legalForm || ''}
              onChange={(e) => set('legalForm', e.target.value)}
            >
              <option value="">Selecciona...</option>
              <option>S.L.</option>
              <option>S.A.</option>
              <option>S.L.U.</option>
              <option>S.A.U.</option>
              <option>S.C.</option>
              <option>Cooperativa</option>
              <option>Fundación</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              País <span className="text-red-400">*</span>
            </label>
            <select
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none"
              value={data.country || ''}
              onChange={(e) => set('country', e.target.value)}
            >
              <option value="">Selecciona...</option>
              <option>España</option>
              <option>Alemania</option>
              <option>Francia</option>
              <option>Italia</option>
              <option>Portugal</option>
              <option>Países Bajos</option>
              <option>Bélgica</option>
              <option>Suiza</option>
              <option>Austria</option>
              <option>Otro UE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              CIF / NIF / VAT <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="B12345678"
              value={data.taxId || ''}
              onChange={(e) => set('taxId', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Sitio web</label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="https://tuempresa.com"
              value={data.website || ''}
              onChange={(e) => set('website', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Dirección completa <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder="Calle Gran Vía 23, 2ª planta"
            value={data.address || ''}
            onChange={(e) => set('address', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Ciudad <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Madrid"
              value={data.city || ''}
              onChange={(e) => set('city', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Código postal <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="28001"
              value={data.postalCode || ''}
              onChange={(e) => set('postalCode', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Contact person */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Persona responsable
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Nombre completo <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="María García López"
              value={data.contactName || ''}
              onChange={(e) => set('contactName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Cargo <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="CEO / Director General"
              value={data.contactRole || ''}
              onChange={(e) => set('contactRole', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Email corporativo <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="maria@tuempresa.com"
              value={data.contactEmail || ''}
              onChange={(e) => set('contactEmail', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Teléfono <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="+34 600 000 000"
              value={data.contactPhone || ''}
              onChange={(e) => set('contactPhone', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Acceso a la plataforma
        </h3>
        <div className="relative">
          <label className="block text-sm text-gray-300 mb-1.5">
            Contraseña <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 pr-10 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Mínimo 12 caracteres"
              value={data.password || ''}
              onChange={(e) => set('password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Mínimo 12 caracteres, mayúsculas, números y símbolos
          </p>
        </div>
      </div>

      {/* Legal */}
      <div className="space-y-3">
        {[
          {
            key: 'acceptedTerms' as keyof CompanyData,
            label: 'Acepto los Términos y Condiciones de ChainX®',
          },
          {
            key: 'acceptedPrivacy' as keyof CompanyData,
            label: 'Acepto la Política de Privacidad y el tratamiento de datos (RGPD)',
          },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                data[key]
                  ? 'bg-purple-600 border-purple-600'
                  : 'border-gray-600 group-hover:border-purple-500'
              }`}
              onClick={() => set(key, !data[key])}
            >
              {data[key] && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-gray-300">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Plan Selection ───────────────────────────────────
function StepPlan({
  data,
  onChange,
}: {
  data: Partial<PlanData>;
  onChange: (d: Partial<PlanData>) => void;
}) {
  const billing = data.billing || 'monthly';
  const tiers: PlanTier[] = ['starter', 'pro', 'enterprise'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Selecciona tu plan</h2>
        <p className="text-gray-400 text-sm">Sin permanencia. Cambia o cancela cuando quieras.</p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm ${billing === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
          Mensual
        </span>
        <button
          onClick={() =>
            onChange({ ...data, billing: billing === 'monthly' ? 'annual' : 'monthly' })
          }
          className={`relative w-12 h-6 rounded-full transition-colors ${
            billing === 'annual' ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              billing === 'annual' ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${billing === 'annual' ? 'text-white' : 'text-gray-500'}`}>
          Anual <span className="text-green-400 text-xs font-medium ml-1">-20%</span>
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => {
          const plan = PLAN_DETAILS[tier];
          const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice;
          const isSelected = data.tier === tier;

          return (
            <div
              key={tier}
              onClick={() => onChange({ ...data, tier })}
              className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-purple-500 bg-purple-900/20'
                  : plan.highlighted
                    ? 'border-purple-700/50 bg-gray-800/60 hover:border-purple-600'
                    : 'border-gray-700/50 bg-gray-800/40 hover:border-gray-600'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MÁS POPULAR
                  </span>
                </div>
              )}

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-white">€{price}</span>
                  <span className="text-gray-400 text-sm">/mes</span>
                </div>
                {billing === 'annual' && (
                  <p className="text-xs text-green-400 mt-0.5">
                    Ahorras €{(plan.monthlyPrice - plan.annualPrice) * 12}/año
                  </p>
                )}
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-600">
        El pago se gestiona de forma segura mediante Stripe. No almacenamos datos de tarjeta.
      </p>
    </div>
  );
}

// ─── Step 3: Company Verification ────────────────────────────
function StepVerificacion({
  data,
  onChange,
}: {
  data: Partial<VerificationData>;
  onChange: (d: Partial<VerificationData>) => void;
}) {
  const docs = [
    {
      key: 'incorporationCertificate' as keyof VerificationData,
      label: 'Certificado de constitución',
      description: 'Escritura de constitución o equivalente. Máx. 10MB.',
      required: true,
    },
    {
      key: 'fiscalDocument' as keyof VerificationData,
      label: 'Documento de identificación fiscal',
      description: 'Tarjeta de identificación fiscal o equivalente UE.',
      required: true,
    },
    {
      key: 'directorId' as keyof VerificationData,
      label: 'DNI/Pasaporte del representante legal',
      description: 'Documento de identidad vigente del administrador.',
      required: true,
    },
    {
      key: 'beneficialOwnerDeclaration' as keyof VerificationData,
      label: 'Declaración de beneficiarios reales',
      description: 'Titularidades reales ≥25%. Requerido por directiva AML5.',
      required: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Verificación empresarial</h2>
        <p className="text-gray-400 text-sm">
          Necesitamos verificar tu empresa para cumplir con la normativa AML/KYC europea. Revisión
          en 24-48h laborables.
        </p>
      </div>

      {/* Status banner */}
      {data.status === 'pending' && (
        <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-700/40 rounded-xl p-4">
          <Clock className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-300">Documentación en revisión</p>
            <p className="text-xs text-amber-500 mt-0.5">
              Nuestro equipo de compliance revisará tu documentación. Tiempo estimado: 24-48h.
            </p>
          </div>
        </div>
      )}
      {data.status === 'rejected' && (
        <div className="flex items-center gap-3 bg-red-900/20 border border-red-700/40 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-300">Documentación rechazada</p>
            <p className="text-xs text-red-400 mt-0.5">
              {data.rejectionReason || 'Revisa los documentos y vuelve a enviarlos.'}
            </p>
          </div>
        </div>
      )}
      {data.status === 'approved' && (
        <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/40 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-300">Empresa verificada</p>
            <p className="text-xs text-green-500 mt-0.5">
              Tu empresa ha sido verificada correctamente. Puedes continuar.
            </p>
          </div>
        </div>
      )}

      {/* Document uploads */}
      <div className="space-y-3">
        {docs.map((doc) => {
          const file = data[doc.key] as File | null | undefined;
          return (
            <div key={doc.key} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{doc.label}</p>
                    {doc.required && <span className="text-red-400 text-xs">*</span>}
                    {!doc.required && (
                      <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>
                  {file && (
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-green-400">{file.name}</span>
                      <span className="text-xs text-gray-600">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer shrink-0">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      onChange({ ...data, [doc.key]: f });
                    }}
                  />
                  <div
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      file
                        ? 'bg-green-900/30 text-green-400 border border-green-700/40 hover:bg-green-900/50'
                        : 'bg-purple-900/30 text-purple-400 border border-purple-700/40 hover:bg-purple-900/50'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {file ? 'Cambiar' : 'Subir'}
                  </div>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-900/10 border border-blue-700/30 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-300">
            Todos los documentos se transmiten cifrados (TLS 1.3) y se almacenan con cifrado
            AES-256. Sólo el equipo de compliance tiene acceso. Se eliminan según la normativa RGPD
            tras verificación.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: KYC Configuration ───────────────────────────────
function StepKYCConfig({
  data,
  onChange,
}: {
  data: Partial<KYCConfigData>;
  onChange: (d: Partial<KYCConfigData>) => void;
}) {
  const providers: { id: KYCProvider; name: string; logo: string; description: string }[] = [
    {
      id: 'sumsub',
      name: 'Sumsub',
      logo: '🔐',
      description: 'Líder europeo en KYC/AML. Recomendado para MiCA.',
    },
    {
      id: 'veriff',
      name: 'Veriff',
      logo: '✅',
      description: 'Alta tasa de conversión. Ideal para UE y España.',
    },
    { id: 'onfido', name: 'Onfido', logo: '🛡️', description: 'ML avanzado. Cobertura global.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Configuración de KYC</h2>
        <p className="text-gray-400 text-sm">
          Tus inversores deberán verificar su identidad antes de invertir. Selecciona el proveedor y
          conecta tu cuenta.
        </p>
      </div>

      {/* Provider selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Proveedor KYC
        </h3>
        {providers.map((p) => (
          <div
            key={p.id}
            onClick={() => onChange({ ...data, provider: p.id })}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              data.provider === p.id
                ? 'border-purple-500 bg-purple-900/20'
                : 'border-gray-700/50 bg-gray-800/40 hover:border-gray-600'
            }`}
          >
            <span className="text-2xl">{p.logo}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{p.name}</span>
                {p.id === 'sumsub' && (
                  <span className="text-xs bg-purple-900/50 text-purple-300 border border-purple-700/40 px-2 py-0.5 rounded-full">
                    Recomendado
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>
            </div>
            {data.provider === p.id && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
          </div>
        ))}
      </div>

      {/* API credentials */}
      {data.provider && (
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-4">
          <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
            Credenciales API — {providers.find((p) => p.id === data.provider)?.name}
          </h3>
          <p className="text-xs text-gray-500">
            Obtén tus credenciales desde el dashboard de{' '}
            {providers.find((p) => p.id === data.provider)?.name}.{' '}
            <a href="#" className="text-purple-400 hover:underline inline-flex items-center gap-1">
              Ver guía de integración <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                API Key <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none font-mono"
                placeholder="sbx_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={data.apiKey || ''}
                onChange={(e) => onChange({ ...data, apiKey: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                API Secret <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none font-mono"
                placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={data.apiSecret || ''}
                onChange={(e) => onChange({ ...data, apiSecret: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Webhook Secret</label>
              <input
                type="password"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none font-mono"
                placeholder="whsec_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={data.webhookSecret || ''}
                onChange={(e) => onChange({ ...data, webhookSecret: e.target.value })}
              />
            </div>
          </div>

          {/* Test mode toggle */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-white">Modo sandbox</p>
              <p className="text-xs text-gray-500">
                Actívalo para pruebas antes de ir a producción
              </p>
            </div>
            <div
              onClick={() => onChange({ ...data, testMode: !data.testMode })}
              className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                data.testMode ? 'bg-amber-600' : 'bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  data.testMode ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </div>
          </label>

          {data.testMode && (
            <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-amber-300">
                Modo sandbox activo. Las verificaciones no tendrán efecto real hasta que cambies a
                producción.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step 5: Campaign Creation ────────────────────────────────
function StepCampana({
  data,
  onChange,
}: {
  data: Partial<CampaignData>;
  onChange: (d: Partial<CampaignData>) => void;
}) {
  const propertyTypes: { id: PropertyType; label: string; icon: string }[] = [
    { id: 'residencial', label: 'Residencial', icon: '🏠' },
    { id: 'comercial', label: 'Comercial', icon: '🏪' },
    { id: 'industrial', label: 'Industrial', icon: '🏭' },
    { id: 'hotelero', label: 'Hotelero', icon: '🏨' },
    { id: 'mixto', label: 'Uso mixto', icon: '🏢' },
  ];

  const [highlights, setHighlights] = useState<string[]>(data.highlights || ['']);

  const updateHighlight = (i: number, val: string) => {
    const hl = [...highlights];
    hl[i] = val;
    setHighlights(hl);
    onChange({ ...data, highlights: hl });
  };

  const addHighlight = () => {
    if (highlights.length < 6) {
      const hl = [...highlights, ''];
      setHighlights(hl);
    }
  };

  const removeHighlight = (i: number) => {
    const hl = highlights.filter((_, idx) => idx !== i);
    setHighlights(hl);
    onChange({ ...data, highlights: hl });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Crear campaña de inversión</h2>
        <p className="text-gray-400 text-sm">
          Describe la propiedad que vas a tokenizar. Esto es lo que verán tus inversores.
        </p>
      </div>

      {/* Property type */}
      <div>
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
          Tipo de activo
        </h3>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ ...data, propertyType: t.id })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                data.propertyType === t.id
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Información del activo
        </h3>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Nombre de la campaña <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder="Torre Oficinas Madrid Centro"
            value={data.name || ''}
            onChange={(e) =>
              onChange({
                ...data,
                name: e.target.value,
                slug: e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, ''),
              })
            }
          />
          {data.slug && <p className="text-xs text-gray-600 mt-1">URL: /inversiones/{data.slug}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Descripción breve (para listados) <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder="Edificio de oficinas AAA en el corazón financiero de Madrid"
            maxLength={150}
            value={data.shortDescription || ''}
            onChange={(e) => onChange({ ...data, shortDescription: e.target.value })}
          />
          <p className="text-xs text-gray-600 mt-1">{(data.shortDescription || '').length}/150</p>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Descripción completa <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={5}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none"
            placeholder="Describe en detalle la propiedad, su ubicación, características, inquilinos actuales, contratos de arrendamiento, estado de reforma..."
            value={data.description || ''}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
          />
        </div>
      </div>

      {/* Location */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Ubicación
        </h3>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Dirección completa <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder="Paseo de la Castellana 123"
            value={data.address || ''}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Ciudad <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Madrid"
              value={data.city || ''}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">País</label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="España"
              value={data.country || ''}
              onChange={(e) => onChange({ ...data, country: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Superficie (m²) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="850"
              value={data.surface || ''}
              onChange={(e) => onChange({ ...data, surface: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Licencia / Referencia catastral
            </label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="7845921VK4874N0001ZP"
              value={data.licenseNumber || ''}
              onChange={(e) => onChange({ ...data, licenseNumber: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Key highlights */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-3">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Puntos clave de inversión
          <span className="ml-2 text-gray-600 text-xs normal-case font-normal">Hasta 6</span>
        </h3>
        <p className="text-xs text-gray-500">
          Razones por las que invertir en esta propiedad. Aparecerán como bullets destacados.
        </p>
        {highlights.map((hl, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder={`Ej: Contrato de arrendamiento AAA firmado hasta 2031`}
              value={hl}
              onChange={(e) => updateHighlight(i, e.target.value)}
            />
            {highlights.length > 1 && (
              <button
                onClick={() => removeHighlight(i)}
                className="text-gray-600 hover:text-red-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {highlights.length < 6 && (
          <button
            onClick={addHighlight}
            className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300"
          >
            <Plus className="w-4 h-4" /> Añadir punto
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Step 6: Financial Configuration ─────────────────────────
function StepFinanciero({
  data,
  onChange,
}: {
  data: Partial<FinancialData>;
  onChange: (d: Partial<FinancialData>) => void;
}) {
  const totalTokens =
    data.totalValueEur && data.pricePerTokenEur
      ? Math.floor(Number(data.totalValueEur) / Number(data.pricePerTokenEur)).toLocaleString(
          'es-ES'
        )
      : '—';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Configuración financiera</h2>
        <p className="text-gray-400 text-sm">
          Define la estructura de inversión y los tokenomics de tu campaña.
        </p>
      </div>

      {/* Valuation */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Valoración y tokens
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Valor total del activo (EUR) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm">€</span>
              <input
                type="number"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="2500000"
                value={data.totalValueEur || ''}
                onChange={(e) => onChange({ ...data, totalValueEur: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Precio por token (EUR) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm">€</span>
              <input
                type="number"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="100"
                value={data.pricePerTokenEur || ''}
                onChange={(e) => onChange({ ...data, pricePerTokenEur: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Símbolo del token <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none uppercase"
              placeholder="MADROFFICE"
              maxLength={10}
              value={data.tokenSymbol || ''}
              onChange={(e) => onChange({ ...data, tokenSymbol: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Tokens totales (calculado)</label>
            <div className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 text-purple-400 text-sm font-mono">
              {totalTokens} tokens
            </div>
          </div>
        </div>
      </div>

      {/* Investment limits */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Límites de inversión
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Inversión mínima (EUR) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm">€</span>
              <input
                type="number"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="500"
                value={data.minInvestmentEur || ''}
                onChange={(e) => onChange({ ...data, minInvestmentEur: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Inversión máxima por wallet (EUR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm">€</span>
              <input
                type="number"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="50000"
                value={data.maxInvestmentEur || ''}
                onChange={(e) => onChange({ ...data, maxInvestmentEur: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Soft cap (EUR)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm">€</span>
              <input
                type="number"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="1000000"
                value={data.softCap || ''}
                onChange={(e) => onChange({ ...data, softCap: e.target.value })}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Si no se alcanza, se reembolsa automáticamente
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Hard cap (EUR) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm">€</span>
              <input
                type="number"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="2500000"
                value={data.hardCap || ''}
                onChange={(e) => onChange({ ...data, hardCap: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Returns */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Rendimiento y plazos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              APY esperado (%) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 pr-8 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="7.5"
                value={data.expectedApyPercent || ''}
                onChange={(e) => onChange({ ...data, expectedApyPercent: e.target.value })}
              />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Frecuencia de distribución</label>
            <select
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none"
              value={data.distributionFrequency || 'quarterly'}
              onChange={(e) =>
                onChange({
                  ...data,
                  distributionFrequency: e.target.value as 'monthly' | 'quarterly' | 'annual',
                })
              }
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="annual">Anual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Período de lock-up (meses)</label>
            <input
              type="number"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="12"
              value={data.lockupPeriod || ''}
              onChange={(e) => onChange({ ...data, lockupPeriod: e.target.value })}
            />
            <p className="text-xs text-gray-600 mt-1">
              Tiempo mínimo de tenencia antes de poder vender
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Fecha límite de financiación
            </label>
            <input
              type="date"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none"
              value={data.fundingDeadline || ''}
              onChange={(e) => onChange({ ...data, fundingDeadline: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Estrategia de salida</label>
          <textarea
            rows={2}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none"
            placeholder="Venta del activo en 5 años con distribución del 100% del beneficio entre tokenholders..."
            value={data.exitStrategy || ''}
            onChange={(e) => onChange({ ...data, exitStrategy: e.target.value })}
          />
        </div>
      </div>

      {/* Payment methods */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-3">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
          Métodos de pago aceptados
        </h3>
        {[
          {
            id: 'usdc' as const,
            label: 'USDC (stablecoin)',
            description: 'Pago en cripto, instantáneo',
          },
          {
            id: 'card' as const,
            label: 'Tarjeta de crédito/débito',
            description: 'Via Stripe, conversión automática a USDC',
          },
          {
            id: 'wire' as const,
            label: 'Transferencia bancaria',
            description: 'SEPA, 1-2 días hábiles',
          },
        ].map((method) => {
          const methods = data.paymentMethods || [];
          const isSelected = methods.includes(method.id);
          return (
            <label key={method.id} className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-white">{method.label}</p>
                <p className="text-xs text-gray-500">{method.description}</p>
              </div>
              <div
                onClick={() => {
                  const updated = isSelected
                    ? methods.filter((m) => m !== method.id)
                    : [...methods, method.id];
                  onChange({ ...data, paymentMethods: updated });
                }}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-600'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 7: Tokenization ─────────────────────────────────────
function StepTokenizacion({ data }: { data: TokenizationData }) {
  const steps = data.steps;
  const icons: Record<string, string> = {
    pending: '○',
    running: '◎',
    done: '✓',
    error: '✗',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Tokenización automática</h2>
        <p className="text-gray-400 text-sm">
          Estamos desplegando tu campaña en Polygon Mainnet. Este proceso tarda aproximadamente 2-3
          minutos.
        </p>
      </div>

      {/* Main progress */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Progreso general</span>
          <span className="text-sm font-bold text-purple-400">{data.progress}%</span>
        </div>
        <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-700"
            style={{ width: `${data.progress}%` }}
          />
        </div>

        {/* Steps list */}
        <div className="space-y-3 pt-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                  step.status === 'done'
                    ? 'bg-green-900/40 text-green-400 border border-green-700/40'
                    : step.status === 'running'
                      ? 'bg-purple-900/40 text-purple-400 border border-purple-600 animate-pulse'
                      : step.status === 'error'
                        ? 'bg-red-900/40 text-red-400 border border-red-700/40'
                        : 'bg-gray-900 text-gray-600 border border-gray-700'
                }`}
              >
                {step.status === 'running' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  icons[step.status]
                )}
              </div>
              <div className="flex-1">
                <span
                  className={`text-sm ${
                    step.status === 'done'
                      ? 'text-gray-300'
                      : step.status === 'running'
                        ? 'text-white font-medium'
                        : step.status === 'error'
                          ? 'text-red-400'
                          : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </span>
                {step.txHash && (
                  <a
                    href={`https://polygonscan.com/tx/${step.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-purple-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    Ver tx <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status messages */}
      {data.status === 'idle' && (
        <div className="bg-blue-900/10 border border-blue-700/30 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-300">
            Haz clic en <strong>Iniciar tokenización</strong> para comenzar el despliegue.
          </p>
        </div>
      )}
      {data.status === 'completed' && data.tokenAddress && (
        <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="text-sm font-semibold text-green-300">
              ¡Tokenización completada con éxito!
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Token desplegado en:{' '}
            <a
              href={`https://polygonscan.com/address/${data.tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 font-mono hover:underline"
            >
              {data.tokenAddress.slice(0, 10)}...{data.tokenAddress.slice(-8)}
            </a>
          </p>
        </div>
      )}
      {data.status === 'error' && (
        <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-sm font-semibold text-red-300">Error en el despliegue</p>
          </div>
          <p className="text-xs text-red-400 mt-1">
            {data.errorMessage || 'Error desconocido. Inténtalo de nuevo.'}
          </p>
        </div>
      )}

      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
        <p className="text-xs text-gray-600 text-center">
          La complejidad blockchain es gestionada automáticamente por ChainX®. Tu campaña se
          despliega con contratos auditados y compliance ERC-3643 incorporado.
        </p>
      </div>
    </div>
  );
}

// ─── Step 8: Publication ──────────────────────────────────────
function StepPublicacion({
  data,
  campaign,
  financial,
  onChange,
}: {
  data: Partial<PublicationData>;
  campaign: Partial<CampaignData>;
  financial: Partial<FinancialData>;
  onChange: (d: Partial<PublicationData>) => void;
}) {
  const confirmations = data.confirmations || {
    legalReview: false,
    micaCompliance: false,
    riskDisclosure: false,
    authorizedRepresentative: false,
  };

  const allConfirmed = Object.values(confirmations).every(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Publicar campaña</h2>
        <p className="text-gray-400 text-sm">
          Revisa el resumen y confirma para publicar tu campaña de inversión.
        </p>
      </div>

      {/* Campaign preview */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="bg-linear-to-r from-purple-900/40 to-gray-800/40 p-4 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
              Resumen de campaña
            </span>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Nombre', value: campaign.name || '—' },
              { label: 'Activo', value: campaign.propertyType || '—' },
              {
                label: 'Ubicación',
                value: campaign.city ? `${campaign.city}, ${campaign.country || ''}` : '—',
              },
              { label: 'Superficie', value: campaign.surface ? `${campaign.surface} m²` : '—' },
              {
                label: 'Valor total',
                value: financial.totalValueEur
                  ? `€${Number(financial.totalValueEur).toLocaleString('es-ES')}`
                  : '—',
              },
              {
                label: 'Precio/token',
                value: financial.pricePerTokenEur ? `€${financial.pricePerTokenEur}` : '—',
              },
              {
                label: 'APY esperado',
                value: financial.expectedApyPercent ? `${financial.expectedApyPercent}%` : '—',
              },
              {
                label: 'Inv. mínima',
                value: financial.minInvestmentEur ? `€${financial.minInvestmentEur}` : '—',
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm text-white font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal confirmations */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4" /> Confirmaciones legales obligatorias
        </h3>
        {[
          {
            key: 'legalReview' as const,
            label:
              'Confirmo que la documentación legal de la propiedad ha sido revisada por nuestro equipo legal y está en regla.',
          },
          {
            key: 'micaCompliance' as const,
            label:
              'Confirmo que esta campaña cumple con el Reglamento MiCA (UE 2023/1114) aplicable a los activos digitales.',
          },
          {
            key: 'riskDisclosure' as const,
            label:
              'Confirmo que los inversores recibirán el documento de divulgación de riesgos antes de invertir.',
          },
          {
            key: 'authorizedRepresentative' as const,
            label:
              'Actúo como representante legal autorizado de la empresa y tengo capacidad para publicar esta oferta.',
          },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                confirmations[key]
                  ? 'bg-purple-600 border-purple-600'
                  : 'border-gray-600 group-hover:border-purple-500'
              }`}
              onClick={() =>
                onChange({
                  ...data,
                  confirmations: { ...confirmations, [key]: !confirmations[key] },
                })
              }
            >
              {confirmations[key] && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-gray-300 leading-relaxed">{label}</span>
          </label>
        ))}
      </div>

      {allConfirmed && (
        <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/40 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300 font-medium">
            Todo listo. Haz clic en <strong>Publicar campaña</strong> para que tu propiedad esté
            disponible para inversores.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Wizard Page ─────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // State per step
  const [company, setCompany] = useState<Partial<CompanyData>>({});
  const [plan, setPlan] = useState<Partial<PlanData>>({ billing: 'monthly' });
  const [verification, setVerification] = useState<Partial<VerificationData>>({
    status: 'not_submitted',
  });
  const [kycConfig, setKycConfig] = useState<Partial<KYCConfigData>>({ testMode: true });
  const [campaign, setCampaign] = useState<Partial<CampaignData>>({ highlights: [''] });
  const [financial, setFinancial] = useState<Partial<FinancialData>>({
    distributionFrequency: 'quarterly',
    paymentMethods: ['usdc', 'card'],
  });
  const [tokenization, setTokenization] = useState<TokenizationData>({
    status: 'idle',
    progress: 0,
    steps: initialTokenizationSteps,
  });
  const [publication, setPublication] = useState<Partial<PublicationData>>({});

  // ── Tokenization simulation ──────────────────────────────
  const startTokenization = useCallback(async () => {
    if (tokenization.status === 'completed') return;

    setTokenization((prev) => ({ ...prev, status: 'deploying_token', progress: 5 }));

    const stepLabels = initialTokenizationSteps.map((s) => s.label);
    const progressPerStep = 20;

    for (let i = 0; i < stepLabels.length; i++) {
      setTokenization((prev) => ({
        ...prev,
        progress: (i + 1) * progressPerStep,
        steps: prev.steps.map((s, idx) => ({
          ...s,
          status: idx < i ? 'done' : idx === i ? 'running' : 'pending',
        })),
      }));

      await new Promise((r) => setTimeout(r, 2000));

      setTokenization((prev) => ({
        ...prev,
        steps: prev.steps.map((s, idx) => ({
          ...s,
          status: idx <= i ? 'done' : 'pending',
        })),
      }));
    }

    setTokenization((prev) => ({
      ...prev,
      status: 'completed',
      progress: 100,
      tokenAddress: '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0'),
    }));

    toast.success('¡Tokenización completada! Tu campaña está lista para publicarse.');
  }, [tokenization.status]);

  // ── Step validation ──────────────────────────────────────
  const validateStep = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        if (
          !company.legalName ||
          !company.taxId ||
          !company.contactEmail ||
          !company.contactName ||
          !company.country
        ) {
          toast.error('Completa los campos obligatorios');
          return false;
        }
        if (!company.acceptedTerms || !company.acceptedPrivacy) {
          toast.error('Debes aceptar los términos y la política de privacidad');
          return false;
        }
        return true;
      case 2:
        if (!plan.tier) {
          toast.error('Selecciona un plan para continuar');
          return false;
        }
        return true;
      case 3:
        if (
          !verification.incorporationCertificate ||
          !verification.fiscalDocument ||
          !verification.directorId
        ) {
          toast.error('Sube los documentos obligatorios');
          return false;
        }
        return true;
      case 4:
        if (!kycConfig.provider) {
          toast.error('Selecciona un proveedor de KYC');
          return false;
        }
        return true;
      case 5:
        if (!campaign.name || !campaign.description || !campaign.city || !campaign.propertyType) {
          toast.error('Completa los campos obligatorios de la campaña');
          return false;
        }
        return true;
      case 6:
        if (
          !financial.totalValueEur ||
          !financial.pricePerTokenEur ||
          !financial.tokenSymbol ||
          !financial.minInvestmentEur
        ) {
          toast.error('Completa los campos financieros obligatorios');
          return false;
        }
        return true;
      case 7:
        if (tokenization.status !== 'completed') {
          toast.error('Completa la tokenización antes de continuar');
          return false;
        }
        return true;
      case 8:
        const confs = publication.confirmations;
        if (
          !confs?.legalReview ||
          !confs?.micaCompliance ||
          !confs?.riskDisclosure ||
          !confs?.authorizedRepresentative
        ) {
          toast.error('Confirma todas las declaraciones legales');
          return false;
        }
        return true;
      default:
        return true;
    }
  }, [
    currentStep,
    company,
    plan,
    verification,
    kycConfig,
    campaign,
    financial,
    tokenization,
    publication,
  ]);

  const handleNext = useCallback(async () => {
    if (!validateStep()) return;

    if (currentStep === 7 && tokenization.status === 'idle') {
      await startTokenization();
      return;
    }

    if (currentStep === 8) {
      // Publish
      toast.success('🚀 ¡Campaña publicada! Redirigiendo al dashboard...');
      setPublication((prev) => ({
        ...prev,
        publishedAt: new Date().toISOString(),
        campaignUrl: `/inversiones/${campaign.slug || 'campaign'}`,
      }));
      setTimeout(() => router.push('/onboarding/dashboard'), 2000);
      return;
    }

    setCurrentStep((s) => Math.min(s + 1, WIZARD_STEPS.length));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, validateStep, startTokenization, tokenization.status, campaign.slug, router]);

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepMeta = WIZARD_STEPS[currentStep - 1];
  const isLastStep = currentStep === WIZARD_STEPS.length;
  const isTokenStep = currentStep === 7;

  const getNextLabel = () => {
    if (isLastStep) return '🚀 Publicar campaña';
    if (isTokenStep && tokenization.status === 'idle') return '⛓️ Iniciar tokenización';
    if (isTokenStep && tokenization.status === 'completed') return 'Continuar';
    return 'Continuar';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800/60 backdrop-blur-sm sticky top-0 z-20 bg-gray-950/80">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">
              ChainX® <span className="text-purple-400">Onboarding</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />~
            {WIZARD_STEPS.slice(currentStep - 1).reduce((a, s) => a + s.estimatedMinutes, 0)} min
            restantes
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto w-full px-4 py-6">
        <WizardProgress currentStep={currentStep} steps={WIZARD_STEPS} />
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-8">
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 md:p-8">
          {currentStep === 1 && <StepRegistro data={company} onChange={setCompany} />}
          {currentStep === 2 && <StepPlan data={plan} onChange={setPlan} />}
          {currentStep === 3 && <StepVerificacion data={verification} onChange={setVerification} />}
          {currentStep === 4 && <StepKYCConfig data={kycConfig} onChange={setKycConfig} />}
          {currentStep === 5 && <StepCampana data={campaign} onChange={setCampaign} />}
          {currentStep === 6 && <StepFinanciero data={financial} onChange={setFinancial} />}
          {currentStep === 7 && <StepTokenizacion data={tokenization} />}
          {currentStep === 8 && (
            <StepPublicacion
              data={publication}
              campaign={campaign}
              financial={financial}
              onChange={setPublication}
            />
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800/60">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Atrás
            </button>

            <div className="flex items-center gap-1.5">
              {WIZARD_STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-full transition-all ${
                    s.id === currentStep
                      ? 'w-6 h-2 bg-purple-500'
                      : s.id < currentStep
                        ? 'w-2 h-2 bg-purple-700'
                        : 'w-2 h-2 bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={
                (isTokenStep && tokenization.status === 'deploying_token') ||
                (isTokenStep && tokenization.status === 'configuring_registry') ||
                (isTokenStep && tokenization.status === 'setting_compliance') ||
                (isTokenStep && tokenization.status === 'minting')
              }
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {getNextLabel()}
              {!isLastStep && !isTokenStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
