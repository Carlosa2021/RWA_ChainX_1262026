'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLicense } from '@/contexts/LicenseContext';
import { useState } from 'react';
import {
  LayoutDashboard,
  Wallet,
  ShieldCheck,
  TrendingDown,
  User,
  LogOut,
  Building2,
  Settings,
  Moon,
  Sun,
  DollarSign,
  Brain,
  Sparkles,
  CreditCard,
  ArrowLeftRight,
  Vault,
  Rocket,
  BarChart3,
  Users,
  FileText,
  Lock,
  Zap,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';
import { PlanFeatures, PLANS, PlanType } from '@/config/plans';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  lockedFeature?: keyof PlanFeatures;
  ownerOnly?: boolean;
}

interface NavSection {
  label: string;
  ownerOnly?: boolean;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Plataforma',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Billetera', href: '/billetera', icon: Wallet },
      { name: 'KYC', href: '/kyc', icon: ShieldCheck },
      { name: 'Retiros', href: '/retiros', icon: TrendingDown },
      { name: 'Usuario', href: '/usuario', icon: User },
    ],
  },
  {
    label: 'Thirdweb',
    items: [
      {
        name: 'Pay',
        href: '/payments',
        icon: CreditCard,
        badge: 'PAY',
        badgeColor: 'from-green-400 to-emerald-400',
        lockedFeature: 'payEnabled',
      },
      {
        name: 'Bridge',
        href: '/bridge',
        icon: ArrowLeftRight,
        badge: 'CROSS',
        badgeColor: 'from-emerald-400 to-teal-400',
        lockedFeature: 'bridgeEnabled',
      },
      {
        name: 'Vault',
        href: '/vault',
        icon: Vault,
        badge: 'SECURE',
        badgeColor: 'from-indigo-400 to-purple-400',
        lockedFeature: 'vaultEnabled',
      },
      {
        name: 'AI Showcase',
        href: '/ai-showcase',
        icon: Brain,
        badge: 'NEW',
        badgeColor: 'from-yellow-400 to-orange-400',
        lockedFeature: 'aiEnabled',
      },
    ],
  },
  {
    label: 'Administracion',
    ownerOnly: true,
    items: [
      {
        name: 'Admin',
        href: '/admin',
        icon: Settings,
        badge: 'Owner',
        badgeColor: 'purple',
        ownerOnly: true,
      },
      { name: 'Pagos', href: '/admin/pagos', icon: DollarSign, ownerOnly: true },
    ],
  },
  {
    label: 'Tokenizacion RWA',
    ownerOnly: true,
    items: [
      {
        name: 'Onboarding',
        href: '/onboarding',
        icon: Rocket,
        badge: 'RWA',
        badgeColor: 'rose',
        ownerOnly: true,
      },
      { name: 'Campannas', href: '/onboarding/dashboard', icon: Building2, ownerOnly: true },
      {
        name: 'Inversores',
        href: '/onboarding/inversores',
        icon: Users,
        lockedFeature: 'investorManagement',
        ownerOnly: true,
      },
      {
        name: 'Documentos',
        href: '/onboarding/documentos',
        icon: FileText,
        lockedFeature: 'documentManagement',
        ownerOnly: true,
      },
      {
        name: 'Metricas',
        href: '/onboarding/metricas',
        icon: BarChart3,
        lockedFeature: 'analyticsAdvanced',
        ownerOnly: true,
      },
    ],
  },
];

function sectionActiveColor(href: string): string {
  if (href.startsWith('/onboarding'))
    return 'bg-linear-to-r from-rose-600 to-orange-600 text-white shadow-rose-500/25';
  if (href === '/admin' || href.startsWith('/admin'))
    return 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/30';
  if (href === '/payments')
    return 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/40';
  if (href === '/bridge')
    return 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/40';
  if (href === '/vault')
    return 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/40';
  if (href === '/ai-showcase')
    return 'bg-linear-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-blue-500/40';
  return 'bg-linear-to-r from-orange-500 to-pink-500 text-white shadow-orange-500/30';
}

function iconColor(href: string, isActive: boolean): string {
  if (isActive) return '';
  if (href === '/admin' || href.startsWith('/admin')) return 'text-purple-500';
  if (href.startsWith('/onboarding')) return 'text-rose-400';
  if (href === '/payments') return 'text-blue-400';
  if (href === '/bridge') return 'text-emerald-400';
  if (href === '/vault') return 'text-indigo-400';
  if (href === '/ai-showcase') return 'text-blue-400';
  return 'text-gray-400';
}

const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  STARTER: { label: 'Starter', cls: 'bg-gray-700 text-gray-300' },
  BUSINESS: { label: 'Business', cls: 'bg-blue-900/60 text-blue-300' },
  ENTERPRISE: { label: 'Enterprise', cls: 'bg-purple-900/60 text-purple-300' },
};

export function Sidebar() {
  const pathname = usePathname();
  const { isOwner } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();
  const { hasFeature, currentPlan, requiredPlanFor } = useLicense();
  const [upgradeModal, setUpgradeModal] = useState<{
    feature: keyof PlanFeatures;
    label: string;
  } | null>(null);

  const handleLogout = () => {
    try {
      localStorage.removeItem('thirdweb:active-wallet-id');
      localStorage.removeItem('thirdweb:connected-wallet-ids');
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  const planBadge = PLAN_BADGE[currentPlan] || PLAN_BADGE.STARTER;

  return (
    <>
      <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                ChainX RWA
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${planBadge.cls}`}>
                  {planBadge.label}
                </span>
                {isOwner && <span className="text-xs text-gray-500">Owner</span>}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          {NAV_SECTIONS.map((section) => {
            if (section.ownerOnly && !isOwner) return null;

            const visibleItems = section.items.filter((item) => {
              if (item.ownerOnly && !isOwner) return false;
              return true;
            });
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.label} className="mb-2">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3 pt-3 pb-1">
                  {section.label}
                </p>

                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  const isLocked = item.lockedFeature ? !hasFeature(item.lockedFeature) : false;

                  if (isLocked && item.lockedFeature) {
                    const required = requiredPlanFor(item.lockedFeature);
                    return (
                      <button
                        key={item.href}
                        onClick={() =>
                          setUpgradeModal({ feature: item.lockedFeature!, label: item.name })
                        }
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="font-medium text-sm flex-1 text-left">{item.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-medium">
                            {required === 'BUSINESS' ? 'Business' : 'Enterprise'}
                          </span>
                          <Lock className="w-3 h-3 text-gray-500" />
                        </div>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all shadow-sm ${
                        isActive
                          ? `${sectionActiveColor(item.href)} shadow-lg`
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${iconColor(item.href, isActive)}`} />
                      <span className="font-medium text-sm flex-1">{item.name}</span>
                      {item.badge &&
                        (item.badgeColor === 'purple' ? (
                          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        ) : item.badgeColor === 'rose' ? (
                          <span className="text-xs bg-rose-900/40 text-rose-300 border border-rose-700/40 px-2 py-0.5 rounded-full font-semibold">
                            {item.badge}
                          </span>
                        ) : (
                          <span
                            className={`text-xs bg-linear-to-r ${item.badgeColor} text-gray-900 px-2 py-0.5 rounded-full font-semibold`}
                          >
                            {item.badge}
                          </span>
                        ))}
                      {item.href === '/ai-showcase' && !isActive && (
                        <Sparkles className="w-3 h-3 text-blue-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          {currentPlan !== 'ENTERPRISE' && isOwner && (
            <a
              href="https://chainx.ch/#pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-900/20 border border-blue-700/30 text-blue-300 hover:bg-blue-900/40 transition-all"
            >
              <Zap className="w-4 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">Actualizar plan</p>
                <p className="text-xs text-blue-400/70 truncate">Desbloquear mas funciones</p>
              </div>
            </a>
          )}

          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm">Modo Oscuro</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {upgradeModal && (
        <UpgradeModalInline
          feature={upgradeModal.feature}
          featureLabel={upgradeModal.label}
          onClose={() => setUpgradeModal(null)}
        />
      )}
    </>
  );
}

const PLAN_HIGHLIGHTS: Record<PlanType, string[]> = {
  STARTER: [],
  BUSINESS: [
    'Campanas y proyectos ilimitados',
    'Analytics avanzado + CSV/PDF export',
    'White Label + dominio propio',
    'API Access + Webhooks',
    'Soporte prioritario 24h',
  ],
  ENTERPRISE: [
    'Infraestructura dedicada',
    'Compliance MiCA + multi-jurisdiccion',
    'KYC/AML avanzado a medida',
    'Account manager + SLA',
    'Private Cloud o On-Premise',
  ],
};

const PLAN_STYLES: Record<PlanType, { grad: string; border: string; text: string; check: string }> = {
  STARTER: { grad: 'from-gray-800 to-gray-900', border: 'border-gray-600', text: 'text-gray-300', check: 'text-gray-400' },
  BUSINESS: { grad: 'from-blue-900 to-indigo-900', border: 'border-blue-500', text: 'text-blue-300', check: 'text-blue-400' },
  ENTERPRISE: { grad: 'from-purple-900 to-rose-900', border: 'border-purple-500', text: 'text-purple-300', check: 'text-purple-400' },
};

function UpgradeModalInline({
  feature,
  featureLabel,
  onClose,
}: {
  feature: keyof PlanFeatures;
  featureLabel: string;
  onClose: () => void;
}) {
  const { requiredPlanFor } = useLicense();
  const required = requiredPlanFor(feature);
  const plansToShow: PlanType[] =
    required === 'BUSINESS' ? ['BUSINESS', 'ENTERPRISE'] : ['ENTERPRISE'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700/60 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-5 border-b border-gray-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-gray-800 text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Funcion bloqueada
            </span>
          </div>
          <p className="text-base font-bold text-white">
            <span className="text-rose-400">{featureLabel}</span> no esta incluido en tu plan actual
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Actualiza para desbloquear esta y otras funciones avanzadas.
          </p>
        </div>

        <div className="p-4 space-y-3">
          {plansToShow.map((planId) => {
            const p = PLANS[planId];
            const s = PLAN_STYLES[planId];
            const isRec = planId === required;
            return (
              <div
                key={planId}
                className={`rounded-xl border p-4 ${isRec ? `bg-linear-to-r ${s.grad} ${s.border}/50` : 'bg-gray-800/50 border-gray-700/50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{p.name}</span>
                    {isRec && (
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${s.text} font-semibold`}>
                        Recomendado
                      </span>
                    )}
                  </div>
                  <div>
                    {p.contactSales ? (
                      <span className="text-sm font-bold text-white">A medida</span>
                    ) : (
                      <>
                        <span className="text-lg font-bold text-white">
                          {p.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">/mes</span>
                      </>
                    )}
                  </div>
                </div>
                <ul className="space-y-1 mb-3">
                  {PLAN_HIGHLIGHTS[planId].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                      <Check className={`w-3 h-3 shrink-0 ${s.check}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://chainx.ch/#pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${isRec ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  {p.contactSales ? 'Contactar ventas' : `Actualizar a ${p.name}`}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-gray-700 pb-4">
          Sin permanencia - Cancela cuando quieras
        </p>
      </div>
    </div>
  );
}
