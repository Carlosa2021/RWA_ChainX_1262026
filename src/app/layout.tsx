import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Geist } from 'next/font/google';
import './globals.css';
import { ThirdwebProvider } from 'thirdweb/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LicenseProvider } from '@/contexts/LicenseContext';
import { EnterpriseProvider } from '@/components/EnterpriseProvider';
import { TenantProvider } from '@/contexts/TenantContext';
import { BrandingProvider } from '@/contexts/BrandingContext';
import { FaviconInjector } from '@/components/FaviconInjector';
import { resolveTenant } from '@/lib/tenants/resolveTenant';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? 'ChainX RWA';
const brandUrl = process.env.NEXT_PUBLIC_BRAND_URL ?? 'https://app.chainx.ch';
const brandTagline =
  process.env.NEXT_PUBLIC_BRAND_TAGLINE ?? 'Digital Securities Infrastructure · ERC-3643 · Polygon';

export const metadata: Metadata = {
  title: `${brandName} | Real World Assets Tokenization Platform`,
  description: `${brandTagline} — Professional multi-tier SaaS platform for Real World Assets tokenization with ERC-3643 + MiCA compliance`,
  applicationName: brandName,
  metadataBase: new URL(brandUrl),
  openGraph: {
    title: `${brandName} | Real World Assets Tokenization`,
    description: brandTagline,
    url: brandUrl,
    siteName: brandName,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brandName} | Real World Assets Tokenization`,
    description: brandTagline,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resolve tenant server-side from Host header (no window.location, no middleware)
  const host = (await headers()).get('host') ?? 'app.chainx.ch';
  const tenant = await resolveTenant(host);
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || !theme) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        <ThirdwebProvider>
          <ThemeProvider>
            <AuthProvider>
              <EnterpriseProvider>
                <LicenseProvider>
                  <TenantProvider tenant={tenant}>
                    <BrandingProvider
                      tenantDefaults={{
                        brandName: tenant.brandName,
                        supportEmail: tenant.supportEmail,
                        primaryColor: tenant.primaryColor,
                        secondaryColor: tenant.secondaryColor,
                        faviconUrl: tenant.faviconUrl,
                        showInfraNotice: tenant.showInfraNotice,
                      }}
                    >
                      <FaviconInjector />
                      <Toaster position="top-right" richColors closeButton />
                      {children}
                    </BrandingProvider>
                  </TenantProvider>
                </LicenseProvider>
              </EnterpriseProvider>
            </AuthProvider>
          </ThemeProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
