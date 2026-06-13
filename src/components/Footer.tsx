'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { useBranding } from '@/contexts/BrandingContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { branding } = useBranding();

  const brandUrl = process.env.NEXT_PUBLIC_BRAND_URL ?? 'https://app.chainx.ch';
  const brandTagline =
    process.env.NEXT_PUBLIC_BRAND_TAGLINE ??
    'Digital Securities Infrastructure · ERC-3643 · Polygon';
  const brandHostname = (() => {
    try {
      return new URL(brandUrl).hostname;
    } catch {
      return brandUrl;
    }
  })();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Top row: brand + nav links */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
              {branding.brandName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{brandTagline}</p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-gray-500 dark:text-gray-400">
            <a
              href={brandUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {brandHostname}
            </a>
            <a
              href={`${brandUrl}/#pricing`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Pricing
            </a>
            <a
              href={`${brandUrl}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Documentation
            </a>
            <a
              href={`mailto:${branding.supportEmail}`}
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Support
            </a>
          </div>
        </div>

        {/* Infrastructure disclaimer — mandatory */}
        <div className="flex items-start gap-2.5 mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <Shield className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Technology infrastructure only.
            </span>{' '}
            ChainX® provides software infrastructure for digital securities issuance and real-world
            asset lifecycle management. ChainX does not provide investment advice, manage investor
            funds, custody client assets, or perform any regulated financial activity. All capital
            market activities are conducted by the licensed operator of this platform. Target
            returns displayed are issuer projections and do not constitute a guarantee of
            performance.
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-600 gap-2">
          <p>
            © {currentYear} ChainX Technology S.A. · All rights reserved · ChainX® Trademark N°
            830657 (Switzerland)
          </p>
          <div className="flex items-center gap-3">
            {branding.showInfraNotice && (
              <>
                <span>Powered by ChainX Infrastructure</span>
                <span>·</span>
              </>
            )}
            <span>ERC-3643 compliant</span>
            <span>·</span>
            <span>MiCA-ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
