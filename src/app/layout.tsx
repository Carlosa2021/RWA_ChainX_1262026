import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { ThirdwebProvider } from 'thirdweb/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LicenseProvider } from '@/contexts/LicenseContext';
import { EnterpriseProvider } from '@/components/EnterpriseProvider';
import { BrandingProvider } from '@/contexts/BrandingContext';
import { FaviconInjector } from '@/components/FaviconInjector';
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                  <BrandingProvider>
                    <FaviconInjector />
                    <Toaster position="top-right" richColors closeButton />
                    {children}
                  </BrandingProvider>
                </LicenseProvider>
              </EnterpriseProvider>
            </AuthProvider>
          </ThemeProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
