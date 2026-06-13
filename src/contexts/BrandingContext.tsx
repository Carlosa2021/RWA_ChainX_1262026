'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface BrandingConfig {
  brandName: string;
  supportEmail: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  showInfraNotice: boolean;
}

const DEFAULTS: BrandingConfig = {
  brandName: 'ChainX RWA',
  supportEmail: 'hola@chainx.ch',
  primaryColor: '#2563EB',
  secondaryColor: '#0B1220',
  showInfraNotice: true,
};

const STORAGE_KEY = 'chainx-branding';
const STORAGE_VERSION = 1;

interface StoredBranding {
  version: number;
  branding: BrandingConfig;
}

interface BrandingContextValue {
  branding: BrandingConfig;
  setBranding: (config: Partial<BrandingConfig>) => void;
  resetBranding: () => void;
  mounted: boolean;
}

const BrandingContext = createContext<BrandingContextValue>({
  branding: DEFAULTS,
  setBranding: () => {},
  resetBranding: () => {},
  mounted: false,
});

export function BrandingProvider({
  children,
  tenantDefaults,
}: {
  children: React.ReactNode;
  tenantDefaults?: Partial<BrandingConfig>;
}) {
  // Precedence (lowest → highest): DEFAULTS → tenantDefaults → localStorage
  // useRef ensures effectiveDefaults is computed once at mount (tenantDefaults is stable from server).
  const effectiveDefaults = useRef<BrandingConfig>({ ...DEFAULTS, ...tenantDefaults }).current;

  const [branding, setBrandingState] = useState<BrandingConfig>(effectiveDefaults);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredBranding;
        if (parsed.version === STORAGE_VERSION && parsed.branding) {
          // localStorage wins over effectiveDefaults
          setBrandingState({ ...effectiveDefaults, ...parsed.branding });
        } else {
          // Version mismatch — clear stale data, fall back to effectiveDefaults
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // localStorage unavailable — use effectiveDefaults silently
    }
    setMounted(true);
  }, [effectiveDefaults]);

  const setBranding = useCallback((config: Partial<BrandingConfig>) => {
    setBrandingState((prev) => {
      const next = { ...prev, ...config };
      try {
        const payload: StoredBranding = { version: STORAGE_VERSION, branding: next };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // localStorage unavailable — skip persistence
      }
      return next;
    });
  }, []);

  const resetBranding = useCallback(() => {
    // Reset to effectiveDefaults (tenant-aware), not raw DEFAULTS
    setBrandingState(effectiveDefaults);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [effectiveDefaults]);

  return (
    <BrandingContext.Provider value={{ branding, setBranding, resetBranding, mounted }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding(): BrandingContextValue {
  return useContext(BrandingContext);
}
