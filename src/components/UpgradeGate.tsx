'use client';

/**
 * UpgradeGate — ChainX® RWA Platform
 *
 * Two usage patterns:
 *
 * 1. Wrap content to block it with an overlay + modal:
 *    <UpgradeGate feature="analyticsAdvanced">
 *      <MetricsDashboard />
 *    </UpgradeGate>
 *
 * 2. Use the hook for conditional rendering:
 *    const { locked, gate } = useUpgradeGate('analyticsAdvanced');
 *    if (locked) return gate;
 */

import { useState, ReactNode } from 'react';
import { Lock, X, Check, ArrowRight, Zap, Building2, Crown } from 'lucide-react';
import { useLicense } from '@/contexts/LicenseContext';
import { PlanFeatures, PlanType, PLANS } from '@/config/plans';

// ─── Plan pill colours ────────────────────────────────────────
const PLAN_STYLES: Record<
  PlanType,
  { bg: string; border: string; text: string; icon: ReactNode; label: string }
> = {
  STARTER: {
    bg: 'from-gray-800 to-gray-900',
    border: 'border-gray-600',
    text: 'text-gray-300',
    icon: <Building2 className="w-4 h-4" />,
    label: 'Starter',
  },
  BUSINESS: {
    bg: 'from-blue-900 to-indigo-900',
    border: 'border-blue-500',
    text: 'text-blue-300',
    icon: <Zap className="w-4 h-4" />,
    label: 'Business',
  },
  ENTERPRISE: {
    bg: 'from-purple-900 to-rose-900',
    border: 'border-purple-500',
    text: 'text-purple-300',
    icon: <Crown className="w-4 h-4" />,
    label: 'Enterprise',
  },
};

// ─── Upgrade Modal ────────────────────────────────────────────
function UpgradeModal({
  requiredPlan,
  featureLabel,
  onClose,
}: {
  requiredPlan: PlanType;
  featureLabel: string;
  onClose: () => void;
}) {
  const style = PLAN_STYLES[requiredPlan];
  const plan = PLANS[requiredPlan];

  // Show current plan and all plans above it
  const plansToShow: PlanType[] =
    requiredPlan === 'BUSINESS' ? ['BUSINESS', 'ENTERPRISE'] : ['ENTERPRISE'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700/60 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className={`bg-linear-to-r ${style.bg} rounded-t-2xl p-6 border-b ${style.border}/30`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-xl bg-white/10 ${style.text}`}>
              <Lock className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${style.text}`}>
              Función bloqueada
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {featureLabel} requiere el plan <span className={style.text}>{style.label}</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Actualiza tu plan para desbloquear esta funcionalidad y acelerar tu crecimiento.
          </p>
        </div>

        {/* Plan comparison */}
        <div className="p-6 space-y-3">
          {plansToShow.map((planId) => {
            const p = PLANS[planId];
            const s = PLAN_STYLES[planId];
            const isRecommended = planId === requiredPlan;

            return (
              <div
                key={planId}
                className={`rounded-xl border p-4 ${
                  isRecommended
                    ? `bg-linear-to-r ${s.bg} ${s.border}/50`
                    : 'bg-gray-800/50 border-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={s.text}>{s.icon}</span>
                    <span className="font-bold text-white">{p.name}</span>
                    {isRecommended && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${s.text} font-semibold`}
                      >
                        Recomendado
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    {p.contactSales ? (
                      <span className="text-sm font-bold text-white">A medida</span>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-white">
                          €{p.price.toLocaleString('es-ES')}
                        </span>
                        <span className="text-gray-400 text-xs">/mes</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 3 key features of this plan */}
                <ul className="space-y-1 mb-3">
                  {p.id === 'BUSINESS' &&
                    [
                      'Campañas y proyectos ilimitados',
                      'Analytics avanzado + CSV export',
                      'White Label + dominio propio',
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                        <Check className="w-3 h-3 text-blue-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  {p.id === 'ENTERPRISE' &&
                    [
                      'Infraestructura dedicada',
                      'Compliance MiCA + multi-jurisdicción',
                      'Account manager + SLA garantizado',
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                        <Check className="w-3 h-3 text-purple-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                </ul>

                <a
                  href="https://chainx.ch/#pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isRecommended
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {p.contactSales ? 'Contactar ventas' : `Actualizar a ${p.name}`}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        <div className="px-6 pb-4 text-center text-xs text-gray-600">
          Sin permanencia · Cancela cuando quieras · Soporte en español
        </div>
      </div>
    </div>
  );
}

// ─── UpgradeGate Component ────────────────────────────────────
interface UpgradeGateProps {
  feature: keyof PlanFeatures;
  featureLabel?: string;
  children: ReactNode;
  /** overlay = blur + lock icon over content (default) | replace = show placeholder instead */
  mode?: 'overlay' | 'replace';
}

export function UpgradeGate({
  feature,
  featureLabel,
  children,
  mode = 'overlay',
}: UpgradeGateProps) {
  const { hasFeature, requiredPlanFor } = useLicense();
  const [showModal, setShowModal] = useState(false);

  // Feature available — render children normally
  if (hasFeature(feature)) return <>{children}</>;

  const required = requiredPlanFor(feature);
  const style = PLAN_STYLES[required];
  const label = featureLabel || String(feature);

  if (mode === 'replace') {
    return (
      <>
        <div
          onClick={() => setShowModal(true)}
          className="cursor-pointer rounded-2xl border border-dashed border-gray-700 bg-gray-900/40 p-8 flex flex-col items-center justify-center gap-3 hover:border-gray-600 transition-colors group"
        >
          <div
            className={`p-3 rounded-xl ${style.text} bg-gray-800 group-hover:scale-110 transition-transform`}
          >
            <Lock className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-xs text-gray-500 mt-1">
              Disponible en el plan{' '}
              <span className={`font-semibold ${style.text}`}>{style.label}</span>
            </p>
          </div>
          <button
            className={`text-xs px-4 py-1.5 rounded-full border ${style.border} ${style.text} hover:bg-white/5 transition-colors`}
          >
            Ver planes →
          </button>
        </div>
        {showModal && (
          <UpgradeModal
            requiredPlan={required}
            featureLabel={label}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  // mode === "overlay"
  return (
    <>
      <div className="relative">
        {/* Blurred content */}
        <div className="pointer-events-none select-none blur-sm opacity-40">{children}</div>

        {/* Lock overlay */}
        <div
          onClick={() => setShowModal(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer group rounded-2xl"
        >
          <div className="absolute inset-0 bg-gray-950/60 rounded-2xl" />
          <div
            className={`relative p-3 rounded-xl ${style.text} bg-gray-900 border ${style.border}/40 shadow-xl group-hover:scale-110 transition-transform`}
          >
            <Lock className="w-6 h-6" />
          </div>
          <div className="relative text-center">
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-xs text-gray-400 mt-1">
              Plan <span className={`font-bold ${style.text}`}>{style.label}</span> requerido
            </p>
          </div>
          <button
            className={`relative text-xs px-4 py-1.5 rounded-full bg-linear-to-r ${style.bg} border ${style.border}/50 ${style.text} font-semibold hover:opacity-90 transition-opacity`}
          >
            Actualizar plan
          </button>
        </div>
      </div>

      {showModal && (
        <UpgradeModal
          requiredPlan={required}
          featureLabel={label}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

// ─── Hook for imperative usage ────────────────────────────────
export function useUpgradeGate(feature: keyof PlanFeatures, featureLabel?: string) {
  const { hasFeature } = useLicense();
  const locked = !hasFeature(feature);

  return {
    locked,
    gate: locked ? (
      <UpgradeGate feature={feature} featureLabel={featureLabel} mode="replace">
        <div />
      </UpgradeGate>
    ) : null,
  };
}
