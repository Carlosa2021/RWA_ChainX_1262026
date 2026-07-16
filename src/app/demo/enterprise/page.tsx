import type { Metadata } from 'next';
import { DemoProvider } from '@/contexts/DemoContext';
import { DemoShell } from '@/components/demo/DemoShell';

export const metadata: Metadata = {
  title: 'ChainX Enterprise Demo · View-only',
  description:
    'Explore the ChainX Enterprise plan — regulated, high-volume digital securities infrastructure — in a safe, view-only demo. No wallet required.',
};

export default function EnterpriseDemoPage() {
  return (
    <DemoProvider plan="enterprise">
      <DemoShell />
    </DemoProvider>
  );
}
