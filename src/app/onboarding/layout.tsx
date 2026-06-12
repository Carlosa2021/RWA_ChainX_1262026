import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding | ChainX® RWA Platform',
  description: 'Configura tu plataforma de tokenización inmobiliaria en minutos',
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      {children}
    </div>
  );
}
