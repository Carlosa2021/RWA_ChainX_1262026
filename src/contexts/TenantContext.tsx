'use client';

/**
 * TenantContext — Sprint 7.1 Tenant Foundation
 *
 * Receives a serializable TenantConfig resolved server-side in layout.tsx.
 * Exposes it to all client components via useTenant().
 *
 * No state mutation — tenant config is static per request.
 * Sprint 8 will add tenant switching for multi-tenant admin views.
 */
import React, { createContext, useContext } from 'react';
import type { TenantConfig } from '@/lib/tenants/types';

interface TenantContextValue {
  tenant: TenantConfig;
}

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: React.ReactNode;
  tenant: TenantConfig;
}

export function TenantProvider({ children, tenant }: TenantProviderProps) {
  return <TenantContext.Provider value={{ tenant }}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return ctx;
}
