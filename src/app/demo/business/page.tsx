import type { Metadata } from 'next';
import { DemoProvider } from '@/contexts/DemoContext';
import { DemoShell } from '@/components/demo/DemoShell';

export const metadata: Metadata = {
  title: 'ChainX Business Demo · View-only',
  description:
    'Explore the ChainX Business plan — complete white-label tokenization platform — in a safe, view-only demo. No wallet required.',
};

export default function BusinessDemoPage() {
  return (
    <DemoProvider plan="business">
      <DemoShell />
    </DemoProvider>
  );
}
