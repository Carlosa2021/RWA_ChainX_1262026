import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LicenseProvider } from "@/contexts/LicenseContext";
import { EnterpriseProvider } from "@/components/EnterpriseProvider";
import { Toaster } from "sonner";
// import EnvDebug from "@/components/EnvDebug"; // Oculto para demo

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChainX® RWA Platform | Real World Assets Tokenization Platform",
  description: "Professional multi-tier SaaS platform for Real World Assets tokenization with ERC-3643 + MiCA compliance",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                  <Toaster position="top-right" richColors closeButton />
                  {children}
                  {/* <EnvDebug /> */}
                </LicenseProvider>
              </EnterpriseProvider>
            </AuthProvider>
          </ThemeProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
