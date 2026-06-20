'use client';

// -----------------------------------------------------------------------------
// ChainX RWA Platform - Tenant Provisioning Wizard (Sprint 9.6B)
// -----------------------------------------------------------------------------
// UI-only orchestration for creating a tenant and persisting initial branding.
// -----------------------------------------------------------------------------

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  Globe,
  Loader2,
  Mail,
  Palette,
} from 'lucide-react';

type WizardStep = 1 | 2 | 3;
type WizardPlan = 'starter' | 'business' | 'enterprise';
type FieldErrors = Partial<Record<keyof TenantWizardForm, string>>;

interface TenantWizardForm {
  tenantId: string;
  plan: WizardPlan;
  brandName: string;
  brandUrl: string;
  supportEmail: string;
  hostname: string;
  logoUrl: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  showInfraNotice: boolean;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  tenantId?: string;
}

const TENANT_ID_RE = /^[a-z0-9-]{1,50}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const DNS_HOSTNAME_RE =
  /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

const PLAN_OPTIONS: { id: WizardPlan; label: string; description: string }[] = [
  { id: 'starter', label: 'Starter', description: 'Entry-level white-label setup' },
  { id: 'business', label: 'Business', description: 'Growth tier for active operators' },
  { id: 'enterprise', label: 'Enterprise', description: 'Full platform controls' },
];

const STEP_META: { id: WizardStep; label: string; icon: React.ElementType }[] = [
  { id: 1, label: 'Identity', icon: Building2 },
  { id: 2, label: 'Domain', icon: Globe },
  { id: 3, label: 'Branding', icon: Palette },
];

const INITIAL_FORM: TenantWizardForm = {
  tenantId: '',
  plan: 'starter',
  brandName: '',
  brandUrl: '',
  supportEmail: '',
  hostname: '',
  logoUrl: '',
  tagline: '',
  primaryColor: '#2563EB',
  secondaryColor: '#0B1220',
  showInfraNotice: true,
};

function normalizeTenantId(value: string) {
  return value.trim().toLowerCase();
}

function normalizeHostname(value: string) {
  return value.trim().toLowerCase();
}

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateStep(step: WizardStep, form: TenantWizardForm) {
  const errors: FieldErrors = {};
  const tenantId = normalizeTenantId(form.tenantId);
  const hostname = normalizeHostname(form.hostname);

  if (step === 1) {
    if (!tenantId) errors.tenantId = 'Tenant ID is required.';
    else if (!TENANT_ID_RE.test(tenantId)) {
      errors.tenantId = 'Use lowercase letters, numbers, and hyphens only. Max 50 chars.';
    }

    if (!form.brandName.trim()) errors.brandName = 'Brand name is required.';
    if (!form.brandUrl.trim()) errors.brandUrl = 'Brand URL is required.';
    else if (!isValidHttpUrl(form.brandUrl.trim())) errors.brandUrl = 'Use a valid http(s) URL.';

    if (!form.supportEmail.trim()) errors.supportEmail = 'Support email is required.';
    else if (!EMAIL_RE.test(form.supportEmail.trim())) {
      errors.supportEmail = 'Use a valid email address.';
    }
  }

  if (step === 2 && hostname && !DNS_HOSTNAME_RE.test(hostname)) {
    errors.hostname = 'Use a valid DNS hostname, for example client.example.com.';
  }

  if (step === 3) {
    if (!HEX_COLOR_RE.test(form.primaryColor)) errors.primaryColor = 'Use a valid hex color.';
    if (!HEX_COLOR_RE.test(form.secondaryColor)) errors.secondaryColor = 'Use a valid hex color.';
    if (form.logoUrl.trim() && !isValidHttpUrl(form.logoUrl.trim())) {
      errors.logoUrl = 'Use a valid http(s) URL.';
    }
  }

  return errors;
}

async function parseApiResponse(response: Response): Promise<ApiResponse> {
  const data = (await response.json()) as ApiResponse;
  if (!response.ok || !data.success) {
    throw new Error(data.error ?? 'Request failed.');
  }
  return data;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600 dark:text-red-400">{message}</p>;
}

export default function NewTenantPage() {
  const { address, isOwner } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<TenantWizardForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof TenantWizardForm>(field: K, value: TenantWizardForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const goNext = () => {
    const nextErrors = validateStep(step, form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStep((current) => (current < 3 ? ((current + 1) as WizardStep) : current));
  };

  const goBack = () => {
    setStep((current) => (current > 1 ? ((current - 1) as WizardStep) : current));
  };

  const provisionTenant = async () => {
    if (!address) {
      toast.error('Connect the platform admin wallet before provisioning.');
      return;
    }

    const allErrors = {
      ...validateStep(1, form),
      ...validateStep(2, form),
      ...validateStep(3, form),
    };
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      toast.error('Review the highlighted fields before provisioning.');
      return;
    }

    const tenantId = normalizeTenantId(form.tenantId);
    const hostname = normalizeHostname(form.hostname);
    const brandConfig = {
      brandName: form.brandName.trim(),
      brandUrl: form.brandUrl.trim(),
      supportEmail: form.supportEmail.trim().toLowerCase(),
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      showInfraNotice: form.showInfraNotice,
      logoUrl: form.logoUrl.trim() || undefined,
      tagline: form.tagline.trim() || undefined,
    };

    setSubmitting(true);
    const toastId = toast.loading('Provisioning tenant...');

    try {
      const tenantResponse = await fetch('/api/admin/tenants/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerAddress: address,
          id: tenantId,
          plan: form.plan,
          hostname,
          ...brandConfig,
        }),
      });
      await parseApiResponse(tenantResponse);

      const brandingResponse = await fetch('/api/admin/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerAddress: address,
          tenantId,
          config: brandConfig,
        }),
      });
      await parseApiResponse(brandingResponse);

      toast.success('Tenant provisioned successfully.', { id: toastId });
      router.push(`/admin/tenants/${tenantId}?tab=domains`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to provision tenant.';
      toast.error(message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOwner) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Access Denied</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This page requires Platform Admin access.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const activeStepValid = Object.keys(validateStep(step, form)).length === 0;
  const previewName = form.brandName.trim() || 'Client Portal';
  const previewTagline = form.tagline.trim() || 'Tokenized real estate operations';
  const previewEmail = form.supportEmail.trim() || 'support@example.com';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <button
            onClick={() => router.push('/admin/tenants')}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Tenants
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">New Tenant</h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
              Provision a white-label client portal and initial visual branding.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] max-w-6xl">
            <div className="space-y-5">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="grid grid-cols-3 gap-2">
                  {STEP_META.map(({ id, label, icon: Icon }) => {
                    const isActive = step === id;
                    const isComplete = step > id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          if (id < step) setStep(id);
                        }}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                          isActive
                            ? 'border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isComplete
                              ? 'bg-green-600 text-white'
                              : isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-900 text-gray-400 border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          {isComplete ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </span>
                        <span>
                          <span className="block text-xs text-gray-400 dark:text-gray-500">
                            Step {id}
                          </span>
                          <span className="block text-sm font-medium text-gray-900 dark:text-white">
                            {label}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Tenant Identity
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Core client metadata used by the admin read layer.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Tenant ID
                        </span>
                        <input
                          type="text"
                          value={form.tenantId}
                          maxLength={50}
                          onChange={(e) => updateField('tenantId', e.target.value.toLowerCase())}
                          placeholder="acme-capital"
                          className="mt-1 w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FieldError message={errors.tenantId} />
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Support Email
                        </span>
                        <input
                          type="email"
                          value={form.supportEmail}
                          onChange={(e) => updateField('supportEmail', e.target.value)}
                          placeholder="support@client.com"
                          className="mt-1 w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FieldError message={errors.supportEmail} />
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Brand Name
                        </span>
                        <input
                          type="text"
                          value={form.brandName}
                          onChange={(e) => updateField('brandName', e.target.value)}
                          placeholder="ACME Capital"
                          className="mt-1 w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FieldError message={errors.brandName} />
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Brand URL
                        </span>
                        <input
                          type="url"
                          value={form.brandUrl}
                          onChange={(e) => updateField('brandUrl', e.target.value)}
                          placeholder="https://client.com"
                          className="mt-1 w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FieldError message={errors.brandUrl} />
                      </label>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Plan
                      </span>
                      <div className="mt-2 grid gap-3 sm:grid-cols-3">
                        {PLAN_OPTIONS.map((plan) => {
                          const selected = form.plan === plan.id;
                          return (
                            <button
                              key={plan.id}
                              type="button"
                              onClick={() => updateField('plan', plan.id)}
                              className={`text-left rounded-xl border p-3 transition-colors ${
                                selected
                                  ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              }`}
                            >
                              <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                                {plan.label}
                              </span>
                              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {plan.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Domain
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Optional hostname collection. Vercel registration remains a separate domain
                        action.
                      </p>
                    </div>

                    <label className="block max-w-xl">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Hostname
                      </span>
                      <input
                        type="text"
                        value={form.hostname}
                        onChange={(e) => updateField('hostname', e.target.value.toLowerCase())}
                        placeholder="portal.client.com"
                        className="mt-1 w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FieldError message={errors.hostname} />
                    </label>

                    <div className="rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-900/20 p-4 max-w-xl">
                      <div className="flex gap-3">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          This step only stores the desired hostname. DNS registration and
                          verification are handled from the Domains panel after provisioning.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Branding Basics
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Initial visual settings persisted after the tenant record is created.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Logo URL
                        </span>
                        <input
                          type="url"
                          value={form.logoUrl}
                          onChange={(e) => updateField('logoUrl', e.target.value)}
                          placeholder="https://client.com/logo.png"
                          className="mt-1 w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FieldError message={errors.logoUrl} />
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Tagline
                        </span>
                        <input
                          type="text"
                          value={form.tagline}
                          onChange={(e) => updateField('tagline', e.target.value)}
                          placeholder="Private real estate access"
                          className="mt-1 w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Primary Color
                        </span>
                        <div className="mt-1 flex gap-2">
                          <input
                            type="color"
                            value={form.primaryColor}
                            onChange={(e) => updateField('primaryColor', e.target.value)}
                            className="h-10 w-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950"
                          />
                          <input
                            type="text"
                            value={form.primaryColor}
                            onChange={(e) => updateField('primaryColor', e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <FieldError message={errors.primaryColor} />
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Secondary Color
                        </span>
                        <div className="mt-1 flex gap-2">
                          <input
                            type="color"
                            value={form.secondaryColor}
                            onChange={(e) => updateField('secondaryColor', e.target.value)}
                            className="h-10 w-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950"
                          />
                          <input
                            type="text"
                            value={form.secondaryColor}
                            onChange={(e) => updateField('secondaryColor', e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <FieldError message={errors.secondaryColor} />
                      </label>
                    </div>

                    <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 dark:border-gray-800 p-4 max-w-xl">
                      <span>
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">
                          Show infrastructure notice
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Display the ChainX infrastructure disclosure in the client portal.
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={form.showInfraNotice}
                        onChange={(e) => updateField('showInfraNotice', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 1 || submitting}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <div className="flex items-center gap-2">
                    {step === 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          updateField('hostname', '');
                          setErrors((prev) => ({ ...prev, hostname: undefined }));
                          setStep(3);
                        }}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Skip
                      </button>
                    )}
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!activeStepValid || submitting}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={provisionTenant}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Provision Tenant
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <aside className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h2>
              </div>

              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <div className="p-5 text-white" style={{ backgroundColor: form.primaryColor }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold shrink-0">
                      {previewName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{previewName}</p>
                      <p className="text-xs text-white/80 truncate">{previewTagline}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tenant ID</p>
                    <p className="mt-1 font-mono text-xs text-gray-900 dark:text-white">
                      {normalizeTenantId(form.tenantId) || 'tenant-id'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Plan</p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {form.plan}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-900 dark:text-white truncate">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      {previewEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Domain</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-900 dark:text-white truncate">
                      <Globe className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      {normalizeHostname(form.hostname) || 'Skipped'}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
