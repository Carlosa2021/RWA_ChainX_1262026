// ============================================================
// ChainX® RWA Platform — Onboarding Types
// Wizard-based onboarding for real estate tokenization clients
// ============================================================

export type OnboardingStep =
  | 'registro'
  | 'plan'
  | 'verificacion'
  | 'kyc-config'
  | 'campana'
  | 'financiero'
  | 'tokenizacion'
  | 'publicacion';

export type PlanTier = 'starter' | 'pro' | 'enterprise';

export type KYCProvider = 'sumsub' | 'veriff' | 'onfido';

export type PropertyType = 'residencial' | 'comercial' | 'industrial' | 'hotelero' | 'mixto';

export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted';

export type TokenizationStatus =
  | 'idle'
  | 'deploying_token'
  | 'configuring_registry'
  | 'setting_compliance'
  | 'minting'
  | 'completed'
  | 'error';

// ─── Company Registration ────────────────────────────────────
export interface CompanyData {
  legalName: string;
  tradeName: string;
  legalForm: string; // SL, SA, SLU, etc.
  country: string;
  taxId: string; // CIF/NIF/VAT
  address: string;
  city: string;
  postalCode: string;
  website: string;
  // Responsible person
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
  // Auth
  password: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  emailVerified: boolean;
}

// ─── Plan ────────────────────────────────────────────────────
export interface PlanData {
  tier: PlanTier;
  billing: 'monthly' | 'annual';
  stripePaymentIntentId?: string;
}

// ─── Company Verification ────────────────────────────────────
export interface VerificationData {
  incorporationCertificate: File | null;
  fiscalDocument: File | null;
  directorId: File | null;
  beneficialOwnerDeclaration: File | null;
  status: DocumentStatus;
  rejectionReason?: string;
  submittedAt?: string;
}

// ─── KYC Provider Config ─────────────────────────────────────
export interface KYCConfigData {
  provider: KYCProvider;
  apiKey: string;
  apiSecret: string;
  webhookSecret: string;
  testMode: boolean;
  autoApproveCountries: string[];
  requiredDocuments: string[];
}

// ─── Campaign / Property ─────────────────────────────────────
export interface CampaignData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  country: string;
  surface: string; // m²
  bedrooms?: string;
  bathrooms?: string;
  constructionYear?: string;
  licenseNumber: string; // Licencia de obra / ocupación
  images: File[];
  imageUrls: string[]; // Preview URLs
  legalDescription: string;
  highlights: string[]; // Puntos clave de inversión
}

// ─── Financial Configuration ─────────────────────────────────
export interface FinancialData {
  totalValueEur: string;
  pricePerTokenEur: string;
  totalTokens: string;
  minInvestmentEur: string;
  maxInvestmentEur: string;
  expectedApyPercent: string;
  distributionFrequency: 'monthly' | 'quarterly' | 'annual';
  fundingDeadline: string; // ISO date
  hardCap: string;
  softCap: string;
  tokenSymbol: string;
  currency: 'EUR';
  paymentMethods: ('usdc' | 'card' | 'wire')[];
  lockupPeriod: string; // months
  exitStrategy: string;
}

// ─── Tokenization ────────────────────────────────────────────
export interface TokenizationData {
  status: TokenizationStatus;
  progress: number; // 0-100
  tokenAddress?: string;
  investmentControllerAddress?: string;
  identityRegistryAddress?: string;
  txHash?: string;
  errorMessage?: string;
  steps: TokenizationStepLog[];
}

export interface TokenizationStepLog {
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
  txHash?: string;
}

// ─── Publication ─────────────────────────────────────────────
export interface PublicationData {
  publishedAt?: string;
  campaignUrl?: string;
  confirmations: {
    legalReview: boolean;
    micaCompliance: boolean;
    riskDisclosure: boolean;
    authorizedRepresentative: boolean;
  };
}

// ─── Full Onboarding State ───────────────────────────────────
export interface OnboardingState {
  currentStep: number;
  completedSteps: number[];
  company: Partial<CompanyData>;
  plan: Partial<PlanData>;
  verification: Partial<VerificationData>;
  kycConfig: Partial<KYCConfigData>;
  campaign: Partial<CampaignData>;
  financial: Partial<FinancialData>;
  tokenization: TokenizationData;
  publication: Partial<PublicationData>;
}

// ─── Wizard Step Meta ────────────────────────────────────────
export interface WizardStepMeta {
  id: number;
  key: OnboardingStep;
  title: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
}

export const WIZARD_STEPS: WizardStepMeta[] = [
  {
    id: 1,
    key: 'registro',
    title: 'Registro empresa',
    description: 'Datos de tu empresa',
    icon: '🏢',
    estimatedMinutes: 5,
  },
  {
    id: 2,
    key: 'plan',
    title: 'Selección de plan',
    description: 'Elige tu nivel de servicio',
    icon: '📦',
    estimatedMinutes: 2,
  },
  {
    id: 3,
    key: 'verificacion',
    title: 'Verificación empresa',
    description: 'Documentación legal',
    icon: '✅',
    estimatedMinutes: 10,
  },
  {
    id: 4,
    key: 'kyc-config',
    title: 'Configuración KYC',
    description: 'Proveedor de verificación',
    icon: '🛡️',
    estimatedMinutes: 5,
  },
  {
    id: 5,
    key: 'campana',
    title: 'Crear campaña',
    description: 'Tu primera propiedad',
    icon: '🏠',
    estimatedMinutes: 15,
  },
  {
    id: 6,
    key: 'financiero',
    title: 'Configuración financiera',
    description: 'Tokenomics y rendimiento',
    icon: '💰',
    estimatedMinutes: 10,
  },
  {
    id: 7,
    key: 'tokenizacion',
    title: 'Tokenización automática',
    description: 'Desplegamos por ti',
    icon: '⛓️',
    estimatedMinutes: 3,
  },
  {
    id: 8,
    key: 'publicacion',
    title: 'Publicación',
    description: 'Tu campaña en vivo',
    icon: '🚀',
    estimatedMinutes: 2,
  },
];

export const PLAN_DETAILS: Record<
  PlanTier,
  {
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    features: string[];
    limits: {
      projects: number | 'unlimited';
      investors: number | 'unlimited';
      whiteLabel: boolean;
      apiAccess: boolean;
      customCompliance: boolean;
      dedicatedSupport: boolean;
    };
    highlighted?: boolean;
  }
> = {
  starter: {
    name: 'Starter',
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      'Hasta 3 proyectos activos',
      'Hasta 50 inversores',
      'KYC básico integrado',
      'Dashboard de gestión',
      'Soporte por email',
    ],
    limits: {
      projects: 3,
      investors: 50,
      whiteLabel: false,
      apiAccess: false,
      customCompliance: false,
      dedicatedSupport: false,
    },
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 299,
    annualPrice: 249,
    features: [
      'Hasta 20 proyectos activos',
      'Hasta 500 inversores',
      'KYC avanzado + AML',
      'White-label básico',
      'API access',
      'Soporte prioritario',
      'Reportes MiCA',
    ],
    limits: {
      projects: 20,
      investors: 500,
      whiteLabel: true,
      apiAccess: true,
      customCompliance: false,
      dedicatedSupport: false,
    },
    highlighted: true,
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: 999,
    annualPrice: 799,
    features: [
      'Proyectos ilimitados',
      'Inversores ilimitados',
      'KYC/AML personalizado',
      'White-label completo',
      'API + Webhooks',
      'Compliance a medida',
      'Account manager dedicado',
      'SLA 99.9%',
    ],
    limits: {
      projects: 'unlimited',
      investors: 'unlimited',
      whiteLabel: true,
      apiAccess: true,
      customCompliance: true,
      dedicatedSupport: true,
    },
  },
};
