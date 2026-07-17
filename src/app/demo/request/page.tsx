import type { Metadata } from 'next';
import { DemoRequestForm } from '@/components/demo/DemoRequestForm';

export const metadata: Metadata = {
  title: 'Request a Private Demo · ChainX',
  description:
    'Request a private, enterprise demo of the ChainX digital securities infrastructure. Tell us about your organization and deployment interest.',
};

export default function DemoRequestPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-2xl -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <DemoRequestForm />
      </div>
    </div>
  );
}
