'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLicense } from '@/contexts/LicenseContext';
import { usePermissions } from '@/lib/rbac/usePermissions';
import { Permission } from '@/lib/rbac/permissions';
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
  CreditCard,
  Palette,
  History,
  ClipboardCheck,
  CheckSquare,
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
  // RBAC (additive): when set, the item is only shown if the active role holds
  // this permission. Items without it keep their previous visibility rules.
  requiredPermission?: Permission;
}

interface NavSection {
  label: string;
  ownerOnly?: boolean;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Platform',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Wallet', href: '/billetera', icon: Wallet },
      { name: 'KYC Verification', href: '/kyc', icon: ShieldCheck },
      { name: 'Withdrawals', href: '/retiros', icon: TrendingDown },
      { name: 'Account', href: '/usuario', icon: User },
    ],
  },
  {
    label: 'Projects',
    ownerOnly: true,
    items: [
      {
        name: 'Issuer Setup',
        href: '/onboarding',
        icon: Rocket,
        badge: 'RWA',
        ownerOnly: true,
      },
      {
        name: 'Projects',
        href: '/onboarding/dashboard',
        icon: Building2,
        ownerOnly: true,
        requiredPermission: Permission.PROJECTS_VIEW,
      },
      {
        name: 'Investors',
        href: '/onboarding/inversores',
        icon: Users,
        lockedFeature: 'investorManagement',
        ownerOnly: true,
        requiredPermission: Permission.INVESTORS_VIEW,
      },
      {
        name: 'Documents',
        href: '/onboarding/documentos',
        icon: FileText,
        lockedFeature: 'documentManagement',
        ownerOnly: true,
        requiredPermission: Permission.DOCUMENTS_VIEW,
      },
      {
        name: 'Analytics',
        href: '/onboarding/metricas',
        icon: BarChart3,
        lockedFeature: 'analyticsAdvanced',
        ownerOnly: true,
        requiredPermission: Permission.ANALYTICS_VIEW,
      },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      {
        name: 'Pay',
        href: '/payments',
        icon: CreditCard,
        badge: 'PAY',
        lockedFeature: 'payEnabled',
      },
      {
        name: 'Bridge',
        href: '/bridge',
        icon: ArrowLeftRight,
        badge: 'BRIDGE',
        lockedFeature: 'bridgeEnabled',
      },
      {
        name: 'Vault',
        href: '/vault',
        icon: Vault,
        badge: 'VAULT',
        lockedFeature: 'vaultEnabled',
      },
      {
        name: 'AI Analytics',
        href: '/ai-showcase',
        icon: Brain,
        badge: 'AI',
        lockedFeature: 'aiEnabled',
      },
    ],
  },
  {
    label: 'Administration',
    ownerOnly: true,
    items: [
      {
        name: 'Admin Panel',
        href: '/admin',
        icon: Settings,
        badge: 'Admin',
        ownerOnly: true,
        requiredPermission: Permission.SETTINGS_MANAGE,
      },
      {
        name: 'Users',
        href: '/admin/users',
        icon: Users,
        lockedFeature: 'institutionalTools',
        ownerOnly: true,
        requiredPermission: Permission.USERS_VIEW,
      },
      {
        name: 'Branding',
        href: '/settings/branding',
        icon: Palette,
        lockedFeature: 'customBranding',
        ownerOnly: true,
        requiredPermission: Permission.BRANDING_VIEW,
      },
      {
        name: 'Audit Trail',
        href: '/admin/audit-trail',
        icon: History,
        ownerOnly: true,
        requiredPermission: Permission.AUDIT_VIEW,
      },
      {
        name: 'Approvals',
        href: '/admin/approvals',
        icon: CheckSquare,
        ownerOnly: true,
        requiredPermission: Permission.APPROVAL_VIEW,
      },
      {
        name: 'Compliance Reports',
        href: '/compliance/reports',
        icon: ClipboardCheck,
        ownerOnly: true,
        requiredPermission: Permission.COMPLIANCE_VIEW,
      },
      {
        name: 'Billing',
        href: '/admin/pagos',
        icon: DollarSign,
        ownerOnly: true,
        requiredPermission: Permission.BILLING_VIEW,
      },
    ],
  },
];

const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  STARTER: { label: 'Starter', cls: 'bg-gray-700 text-gray-300' },
  BUSINESS: { label: 'Business', cls: 'bg-blue-900/60 text-blue-300' },
  ENTERPRISE: { label: 'Enterprise', cls: 'bg-blue-900/40 text-blue-300' },
};

export function Sidebar() {
  const pathname = usePathname();
  const { isOwner } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();
  const { hasFeature, currentPlan, requiredPlanFor } = useLicense();
  const { can } = usePermissions();
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
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
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
              // RBAC (additive): hide items the active role cannot view. Routes are
              // never removed — only navigation visibility is affected.
              if (item.requiredPermission && !can(item.requiredPermission)) return false;
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
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`}
                      />
                      <span className="font-medium text-sm flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 px-1.5 py-0.5 rounded-md font-medium">
                          {item.badge}
                        </span>
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
                <p className="text-xs font-semibold">Upgrade plan</p>
                <p className="text-xs text-blue-400/70 truncate">Unlock more features</p>
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
    'Unlimited projects and offerings',
    'Advanced analytics + CSV/PDF export',
    'White Label + custom domain',
    'API Access + Webhooks',
    'Priority support 24h',
  ],
  ENTERPRISE: [
    'Dedicated infrastructure',
    'MiCA compliance + multi-jurisdiction',
    'Custom KYC/AML workflows',
    'Account manager + SLA',
    'Private Cloud or On-Premise',
  ],
};

const PLAN_STYLES: Record<PlanType, { grad: string; border: string; text: string; check: string }> =
  {
    STARTER: {
      grad: 'from-gray-800 to-gray-900',
      border: 'border-gray-600',
      text: 'text-gray-300',
      check: 'text-gray-400',
    },
    BUSINESS: {
      grad: 'from-blue-900 to-indigo-900',
      border: 'border-blue-500',
      text: 'text-blue-300',
      check: 'text-blue-400',
    },
    ENTERPRISE: {
      grad: 'from-blue-950 to-indigo-950',
      border: 'border-blue-600',
      text: 'text-blue-300',
      check: 'text-blue-400',
    },
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
              Feature locked
            </span>
          </div>
          <p className="text-base font-bold text-white">
            <span className="text-blue-400">{featureLabel}</span> is not included in your current
            plan
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Upgrade to unlock this and other advanced features.
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
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${s.text} font-semibold`}
                      >
                        Recommended
                      </span>
                    )}
                  </div>
                  <div>
                    {p.contactSales ? (
                      <span className="text-sm font-bold text-white">A medida</span>
                    ) : (
                      <>
                        <span className="text-lg font-bold text-white">
                          {p.price.toLocaleString('es-ES')}
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
                  {p.contactSales ? 'Contact sales' : `Upgrade to ${p.name}`}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-gray-700 pb-4">No lock-in · Cancel anytime</p>
      </div>
    </div>
  );
}
