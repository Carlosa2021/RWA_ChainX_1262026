'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ShieldCheck,
  ShieldX,
  Download,
  MoreHorizontal,
  ChevronDown,
  Globe,
} from 'lucide-react';

type InvestorStatus = 'verified' | 'pending' | 'rejected' | 'expired';

interface Investor {
  id: number;
  name: string;
  email: string;
  wallet: string;
  country: string;
  status: InvestorStatus;
  kycDate?: string;
  totalInvested: number;
  campaigns: string[];
  provider: string;
}

const mockInvestors: Investor[] = [
  {
    id: 1,
    name: 'Carlos Martínez',
    email: 'carlos@example.com',
    wallet: '0x3f4a8b2c1d5e6f7890ab',
    country: '🇪🇸 España',
    status: 'verified',
    kycDate: '2026-03-15',
    totalInvested: 7500,
    campaigns: ['Torre Oficinas', 'Costa Brava'],
    provider: 'Sumsub',
  },
  {
    id: 2,
    name: 'Anna Schmidt',
    email: 'anna@example.de',
    wallet: '0x1a2b3c4d5e6f7890cd',
    country: '🇩🇪 Alemania',
    status: 'verified',
    kycDate: '2026-04-02',
    totalInvested: 15000,
    campaigns: ['Torre Oficinas'],
    provider: 'Sumsub',
  },
  {
    id: 3,
    name: 'Jean Dupont',
    email: 'jean@example.fr',
    wallet: '0x9876543210abcdef12',
    country: '🇫🇷 Francia',
    status: 'pending',
    kycDate: undefined,
    totalInvested: 0,
    campaigns: [],
    provider: 'Veriff',
  },
  {
    id: 4,
    name: 'Maria Costa',
    email: 'maria@example.pt',
    wallet: '0xabcdef1234567890ef',
    country: '🇵🇹 Portugal',
    status: 'rejected',
    kycDate: undefined,
    totalInvested: 0,
    campaigns: [],
    provider: 'Sumsub',
  },
  {
    id: 5,
    name: 'Pieter van Berg',
    email: 'pieter@example.nl',
    wallet: '0x2468ace0246890bd',
    country: '🇳🇱 Países Bajos',
    status: 'verified',
    kycDate: '2026-05-10',
    totalInvested: 3000,
    campaigns: ['Costa Brava'],
    provider: 'Sumsub',
  },
  {
    id: 6,
    name: 'Luca Rossi',
    email: 'luca@example.it',
    wallet: '0x13579bdf13579bd0',
    country: '🇮🇹 Italia',
    status: 'expired',
    kycDate: '2025-01-20',
    totalInvested: 2000,
    campaigns: ['Torre Oficinas'],
    provider: 'Onfido',
  },
];

function StatusBadge({ status }: { status: InvestorStatus }) {
  const map: Record<InvestorStatus, { label: string; icon: React.ElementType; cls: string }> = {
    verified: {
      label: 'Identity Verified',
      icon: CheckCircle2,
      cls: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    },
    pending: {
      label: 'Verification Pending',
      icon: Clock,
      cls: 'bg-amber-950 text-amber-400 border-amber-800',
    },
    rejected: {
      label: 'Verification Rejected',
      icon: XCircle,
      cls: 'bg-red-950 text-red-400 border-red-800',
    },
    expired: {
      label: 'KYC Expired',
      icon: ShieldX,
      cls: 'bg-gray-900 text-gray-500 border-gray-800',
    },
  };
  const { label, icon: Icon, cls } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${cls}`}
    >
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

export default function InversoresPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | InvestorStatus>('all');

  const filtered = mockInvestors.filter((inv) => {
    const matchSearch =
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.email.toLowerCase().includes(search.toLowerCase()) ||
      inv.wallet.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: mockInvestors.length,
    verified: mockInvestors.filter((i) => i.status === 'verified').length,
    pending: mockInvestors.filter((i) => i.status === 'pending').length,
    rejected: mockInvestors.filter((i) => i.status === 'rejected').length,
    expired: mockInvestors.filter((i) => i.status === 'expired').length,
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Investor Management"
          subtitle="Identity verification, wallet registry and investment positions · ERC-3643"
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* DEMO badge — PHASE 2: replace mockInvestors with useVerifiedWallets() + IdentityRegistry reads */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 w-fit">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Demo Data
            </span>
            <span className="text-xs text-gray-600">
              · Sample investors for illustration. No live data displayed.
            </span>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Identity Verified', count: counts.verified, cls: 'text-emerald-400' },
              { label: 'Pending Verification', count: counts.pending, cls: 'text-amber-400' },
              { label: 'Rejected', count: counts.rejected, cls: 'text-red-400' },
              { label: 'KYC Expired', count: counts.expired, cls: 'text-gray-500' },
            ].map(({ label, count, cls }) => (
              <div
                key={label}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
              >
                <p className={`text-2xl font-bold ${cls}`}>{count}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Search by name, email or wallet address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'verified', 'pending', 'rejected', 'expired'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    filterStatus === s
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {s === 'all'
                    ? `All (${counts.all})`
                    : s === 'verified'
                      ? `Verified (${counts.verified})`
                      : s === 'pending'
                        ? `Pending (${counts.pending})`
                        : s === 'rejected'
                          ? `Rejected (${counts.rejected})`
                          : `Expired (${counts.expired})`}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs text-gray-400 border border-gray-700 hover:border-gray-600 bg-gray-800/60 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          {/* Investors table */}
          <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    {[
                      'Investor',
                      'Wallet',
                      'Country',
                      'KYC',
                      'Verified by',
                      'Invested',
                      'Projects',
                      '',
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">{inv.name}</p>
                          <p className="text-xs text-gray-500">{inv.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono text-gray-400">
                          {inv.wallet.slice(0, 8)}...{inv.wallet.slice(-4)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-300">{inv.country}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-gray-500">{inv.provider}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-white font-medium">
                          {inv.totalInvested > 0
                            ? `€${inv.totalInvested.toLocaleString('es-ES')}`
                            : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {inv.campaigns.length > 0 ? (
                            inv.campaigns.map((c) => (
                              <span
                                key={c}
                                className="text-xs bg-purple-900/30 text-purple-400 border border-purple-700/30 px-2 py-0.5 rounded-full"
                              >
                                {c}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-600">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 text-gray-600 hover:text-purple-400 hover:bg-gray-800 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          {inv.status === 'pending' && (
                            <>
                              <button className="p-1.5 text-gray-600 hover:text-green-400 hover:bg-gray-800 rounded-lg transition-colors">
                                <ShieldCheck className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                                <ShieldX className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {inv.status === 'expired' && (
                            <button
                              className="p-1.5 text-gray-600 hover:text-amber-400 hover:bg-gray-800 rounded-lg transition-colors"
                              title="Solicitar renovación KYC"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-600">
              Mostrando {filtered.length} de {mockInvestors.length} inversores
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
