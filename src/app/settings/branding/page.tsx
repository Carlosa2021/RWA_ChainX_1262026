'use client';

// White Label Branding Panel — ChainX® RWA Platform
// UI-first implementation. No backend, no DB, no blockchain.
// Configures the CLIENT/OPERATOR investor-facing portal brand (preview only).
// Plan gating: STARTER locked · BUSINESS / ENTERPRISE available (feature flag: customBranding)

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useLicense } from '@/contexts/LicenseContext';
import { PLANS } from '@/config/plans';
import { toast } from 'sonner';
import {
  Building2,
  Globe,
  Palette,
  Upload,
  Lock,
  ArrowRight,
  Save,
  Eye,
  ShieldCheck,
} from 'lucide-react';

// ─── Locked state (STARTER plan) ──────────────────────────────
function BrandingLocked() {
  const business = PLANS.BUSINESS;
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 mb-5">
        <Lock className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Branding is available on Business and Enterprise plans
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
        White-label branding lets you customize the investor portal with your own logo, colors and
        domain.
      </p>
      <a
        href="https://chainx.ch/#pricing"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
      >
        Upgrade to Business · €{business.price.toLocaleString('es-ES')}/mo
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

// ─── Reusable field primitives (theme-aware) ──────────────────
function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 dark:text-gray-500">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-colors';

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── File upload (UI only — stores file name in state) ────────
function FileUpload({
  label,
  accept,
  fileName,
  onSelect,
  hint,
}: {
  label: string;
  accept: string;
  fileName: string;
  onSelect: (name: string) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-dashed border-gray-300 dark:border-gray-700 px-3 py-2.5 hover:border-blue-500 transition-colors">
        <Upload className="w-4 h-4 text-gray-500 shrink-0" />
        <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
          {fileName || `Select file (${accept})`}
        </span>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onSelect(f.name);
          }}
        />
      </label>
    </Field>
  );
}

// ─── Branding Panel (BUSINESS / ENTERPRISE) ───────────────────
function BrandingPanel() {
  const [companyName, setCompanyName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [logoName, setLogoName] = useState('');
  const [faviconName, setFaviconName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [secondaryColor, setSecondaryColor] = useState('#0B1220');
  const [customDomain, setCustomDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [portalLanguage, setPortalLanguage] = useState('English');
  const [showInfraNotice, setShowInfraNotice] = useState(true);

  const portalName = displayName || companyName || 'Your Brand';
  const portalDomain = customDomain || subdomain || 'yourbrand.chainx.app';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ─── LEFT: form ─── */}
      <div className="space-y-5">
        {/* Section 1 — Company Identity */}
        <SectionCard icon={Building2} title="Company Identity">
          <Field label="Company Name">
            <input
              className={inputCls}
              placeholder="MadroOffice Capital"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </Field>
          <Field label="Public Display Name">
            <input
              className={inputCls}
              placeholder="MadroOffice"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Field>
          <Field label="Support Email">
            <input
              type="email"
              className={inputCls}
              placeholder="support@madrooffice.com"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
          </Field>
          <Field label="Email Sender Name">
            <input
              className={inputCls}
              placeholder="MadroOffice Investor Relations"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </Field>
        </SectionCard>

        {/* Section 2 — Visual Identity */}
        <SectionCard icon={Palette} title="Visual Identity">
          <FileUpload
            label="Logo"
            accept="PNG, SVG, JPG"
            fileName={logoName}
            onSelect={setLogoName}
            hint="Recommended: transparent PNG or SVG, min. 200px height."
          />
          <FileUpload
            label="Favicon"
            accept="PNG, SVG, ICO"
            fileName={faviconName}
            onSelect={setFaviconName}
            hint="Square format, 32×32 or 64×64."
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent cursor-pointer"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
                <input
                  className={inputCls}
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </div>
            </Field>
            <Field label="Secondary Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent cursor-pointer"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
                <input
                  className={inputCls}
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* Section 3 — Domain */}
        <SectionCard icon={Globe} title="Domain">
          <Field
            label="Custom Domain"
            hint="Custom domains require DNS verification before going live."
          >
            <input
              className={inputCls}
              placeholder="invest.madrooffice.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
          </Field>
          <Field label="ChainX Subdomain">
            <input
              className={inputCls}
              placeholder="madrooffice.chainx.app"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
            />
          </Field>

          {/* Read-only DNS instruction card */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              DNS Configuration
            </p>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs font-mono">
              <span className="text-gray-500">Type</span>
              <span className="text-gray-900 dark:text-gray-200">CNAME</span>
              <span className="text-gray-500">Host</span>
              <span className="text-gray-900 dark:text-gray-200">invest</span>
              <span className="text-gray-500">Value</span>
              <span className="text-gray-900 dark:text-gray-200">cname.chainx.app</span>
              <span className="text-gray-500">Status</span>
              <span className="text-amber-600 dark:text-amber-400">Pending verification</span>
            </div>
          </div>
        </SectionCard>

        {/* Section 4 — Portal Settings */}
        <SectionCard icon={ShieldCheck} title="Portal Settings">
          <Field label="Portal Language">
            <select
              className={inputCls}
              value={portalLanguage}
              onChange={(e) => setPortalLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>German</option>
            </select>
          </Field>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-900 dark:text-white">
                Show ChainX Infrastructure Notice
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                When enabled, the portal footer shows: Powered by ChainX Infrastructure.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showInfraNotice}
              onClick={() => setShowInfraNotice((v) => !v)}
              className={`shrink-0 mt-1 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showInfraNotice ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showInfraNotice ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </SectionCard>

        {/* Action buttons (UI-only) */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => toast.success('Branding settings saved as draft.')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            onClick={() => toast.success('Preview generated.')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview Portal
          </button>
          <button
            onClick={() => toast.success('Domain verification request created.')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-colors"
          >
            <Globe className="w-4 h-4" /> Request Domain Verification
          </button>
        </div>
      </div>

      {/* ─── RIGHT: live preview ─── */}
      <div className="lg:sticky lg:top-24 h-fit">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">
          Live Investor Portal Preview
        </p>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-950">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="flex-1 mx-2 text-center">
              <span className="text-xs text-gray-500 font-mono">{portalDomain}</span>
            </div>
          </div>

          {/* Portal header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {portalName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {portalName}
              </span>
            </div>
            <nav className="hidden sm:flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <span>Projects</span>
              <span>Documents</span>
              <span>KYC</span>
              <span>Account</span>
            </nav>
          </div>

          {/* Hero */}
          <div className="px-5 py-6" style={{ backgroundColor: `${secondaryColor}` }}>
            <h2 className="text-lg font-bold text-white">Investor Portal</h2>
            <p className="text-xs text-gray-300 mt-1 max-w-sm">
              Access tokenized real estate projects, documents and portfolio updates.
            </p>
            <button
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold"
              style={{ backgroundColor: primaryColor }}
            >
              View Projects <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sample project card */}
          <div className="p-5">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-500" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Torre Oficinas Madrid Centro
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Capital Raised</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">€1.875.000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Target Return</p>
                  <p className="text-sm font-bold" style={{ color: primaryColor }}>
                    7.5% p.a.
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                Issuer projection · not guaranteed.
              </p>
            </div>
          </div>

          {/* Portal footer */}
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Support: {supportEmail || 'support@yourbrand.com'}
            </span>
            {showInfraNotice && (
              <span className="text-xs text-gray-400 dark:text-gray-600">
                Powered by ChainX Infrastructure
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function BrandingPage() {
  const { hasFeature } = useLicense();
  const unlocked = hasFeature('customBranding');

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Branding</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure the investor-facing experience for your white-label portal.
            </p>
          </div>

          {unlocked ? <BrandingPanel /> : <BrandingLocked />}
        </main>
      </div>
    </div>
  );
}
