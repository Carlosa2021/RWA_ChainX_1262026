import type { Metadata } from 'next';
import { DemoGateway } from '@/components/demo/DemoGateway';

export const metadata: Metadata = {
  title: 'ChainX Demo · Explore the platform without a wallet',
  description:
    'Explore the ChainX digital securities infrastructure in a safe, view-only demo. Choose Starter, Business or Enterprise — no wallet, no account required.',
};

export default function DemoPage() {
  return <DemoGateway />;
}
