import type { Metadata } from 'next';
import { DemoProvider } from '@/contexts/DemoContext';
import { DemoShell } from '@/components/demo/DemoShell';

export const metadata: Metadata = {
  title: 'ChainX Starter Demo · View-only',
  description: 'Explore the ChainX Starter plan in a safe, view-only demo. No wallet required.',
};

export default function StarterDemoPage() {
  return (
    <DemoProvider plan="starter">
      <DemoShell />
    </DemoProvider>
  );
}
