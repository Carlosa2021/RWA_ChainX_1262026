import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChainX® RWA InmoToken | Tokenización Inmobiliaria Premium",
  description: "Plataforma profesional de tokenización inmobiliaria con ERC-3643 + MiCA compliance",
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
              <Toaster position="top-right" richColors closeButton />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
