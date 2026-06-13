'use client';

import { useEffect } from 'react';
import { useBranding } from '@/contexts/BrandingContext';

/**
 * Dynamically updates <link rel="icon"> based on branding.faviconUrl.
 * Falls back to /favicon.ico (set by static metadata).
 * Must be rendered inside BrandingProvider.
 */
export function FaviconInjector() {
  const { branding, mounted } = useBranding();

  useEffect(() => {
    if (!mounted) return;
    const url = branding.faviconUrl || '/favicon.ico';
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = url;
  }, [branding.faviconUrl, mounted]);

  return null;
}
