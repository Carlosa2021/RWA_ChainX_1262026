'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChainX® Demo Context — Sprint 11.0 Multi-Plan Demo Gateway
//
// A dedicated, isolated context for the public demo experience. It is NOT real
// authentication. It never grants access to /admin/**, never reads the connected
// wallet, never modifies AuthContext, and only ever operates inside /demo/**.
//
// DemoSession is a static, read-only descriptor of the currently viewed plan.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { DemoPlan, DemoPlanConfig, getDemoPlan } from '@/lib/demo/plans';

export interface DemoSession {
  readonly demoMode: true;
  readonly readOnly: true;
  readonly plan: DemoPlan;
  readonly tenantId: 'meridian-demo';
  readonly role: 'DEMO_CLIENT_ADMIN';
}

interface DemoContextType {
  session: DemoSession;
  config: DemoPlanConfig;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ plan, children }: { plan: DemoPlan; children: ReactNode }) {
  const value = useMemo<DemoContextType>(() => {
    const session: DemoSession = {
      demoMode: true,
      readOnly: true,
      plan,
      tenantId: 'meridian-demo',
      role: 'DEMO_CLIENT_ADMIN',
    };
    return { session, config: getDemoPlan(plan) };
  }, [plan]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextType {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return ctx;
}

/** Convenience hook — is a feature enabled for the active demo plan? */
export function useDemoFeature(feature: keyof DemoPlanConfig['features']): boolean {
  const { config } = useDemo();
  return config.features[feature];
}
