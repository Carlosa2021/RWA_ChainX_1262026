'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  FolderOpen,
  Plus,
  Shield,
  Lock,
} from 'lucide-react';

type DocStatus = 'approved' | 'pending' | 'expired' | 'required';
type DocCategory = 'legal' | 'financial' | 'kyc' | 'compliance' | 'reporting';

interface Document {
  id: number;
  name: string;
  category: DocCategory;
  campaign?: string;
  status: DocStatus;
  uploadedAt?: string;
  expiresAt?: string;
  size?: string;
  uploader: string;
  version: number;
  confidential: boolean;
}

const mockDocs: Document[] = [
  {
    id: 1,
    name: 'Meridian Capital AG — Certificate of Incorporation',
    category: 'legal',
    status: 'approved',
    uploadedAt: '2025-07-14',
    size: '1.8 MB',
    uploader: 'H. Müller',
    version: 1,
    confidential: true,
  },
  {
    id: 2,
    name: 'VAT Registration Certificate — CHE-478.321.912 (FINMA)',
    category: 'legal',
    status: 'approved',
    uploadedAt: '2025-07-14',
    size: '0.6 MB',
    uploader: 'H. Müller',
    version: 1,
    confidential: true,
  },
  {
    id: 3,
    name: 'Basel Riverside Offices — Investment Prospectus (MiCA Art. 25)',
    category: 'financial',
    campaign: 'Basel Riverside',
    status: 'approved',
    uploadedAt: '2025-08-20',
    expiresAt: '2026-08-20',
    size: '5.4 MB',
    uploader: 'A. Brandt',
    version: 2,
    confidential: false,
  },
  {
    id: 4,
    name: 'Basel Riverside Offices — RICS Valuation Report (Sep 2025)',
    category: 'financial',
    campaign: 'Basel Riverside',
    status: 'approved',
    uploadedAt: '2025-09-02',
    size: '3.7 MB',
    uploader: 'A. Brandt',
    version: 1,
    confidential: false,
  },
  {
    id: 5,
    name: 'Basel Riverside Offices — Lease Agreement (Anchor Tenant, 10-year)',
    category: 'legal',
    campaign: 'Basel Riverside',
    status: 'approved',
    uploadedAt: '2025-08-10',
    expiresAt: '2035-08-10',
    size: '4.2 MB',
    uploader: 'H. Müller',
    version: 1,
    confidential: true,
  },
  {
    id: 6,
    name: 'Zurich Residential Portfolio — Key Information Document (KID)',
    category: 'financial',
    campaign: 'Zurich Residential',
    status: 'approved',
    uploadedAt: '2025-10-15',
    size: '1.1 MB',
    uploader: 'A. Brandt',
    version: 1,
    confidential: false,
  },
  {
    id: 7,
    name: 'Valencia Logistics Hub — Subscription Agreement (Master)',
    category: 'legal',
    campaign: 'Valencia Hub',
    status: 'approved',
    uploadedAt: '2025-11-05',
    size: '2.9 MB',
    uploader: 'H. Müller',
    version: 3,
    confidential: true,
  },
  {
    id: 8,
    name: 'Q1 2026 Distribution Report — Basel Riverside Offices',
    category: 'reporting',
    campaign: 'Basel Riverside',
    status: 'approved',
    uploadedAt: '2026-04-05',
    size: '0.8 MB',
    uploader: 'System',
    version: 1,
    confidential: false,
  },
  {
    id: 9,
    name: 'Q1 2026 Distribution Report — Valencia Logistics Hub',
    category: 'reporting',
    campaign: 'Valencia Hub',
    status: 'approved',
    uploadedAt: '2026-04-05',
    size: '0.7 MB',
    uploader: 'System',
    version: 1,
    confidential: false,
  },
  {
    id: 10,
    name: 'Madrid Prime Offices — Legal Opinion (Garrigües, Apr 2026)',
    category: 'legal',
    campaign: 'Madrid Prime',
    status: 'pending',
    uploadedAt: '2026-04-22',
    size: '3.1 MB',
    uploader: 'C. Reyes',
    version: 1,
    confidential: true,
  },
  {
    id: 11,
    name: 'AML/KYC Annual Compliance Declaration 2026',
    category: 'compliance',
    status: 'required',
    uploader: '—',
    version: 0,
    confidential: true,
  },
  {
    id: 12,
    name: 'Property Insurance Certificate — Madrid Prime Offices',
    category: 'legal',
    campaign: 'Madrid Prime',
    status: 'expired',
    uploadedAt: '2025-06-01',
    expiresAt: '2026-06-01',
    size: '1.4 MB',
    uploader: 'H. Müller',
    version: 1,
    confidential: false,
  },
];

const categoryLabels: Record<
  DocCategory,
  { label: string; icon: React.ElementType; color: string }
> = {
  legal: { label: 'Legal', icon: FileText, color: 'text-blue-400' },
  financial: { label: 'Financial', icon: Shield, color: 'text-green-400' },
  kyc: { label: 'KYC', icon: CheckCircle2, color: 'text-blue-400' },
  compliance: { label: 'Compliance', icon: Lock, color: 'text-amber-400' },
  reporting: { label: 'Reporting', icon: FolderOpen, color: 'text-gray-400' },
};

function StatusBadge({ status }: { status: DocStatus }) {
  const map: Record<DocStatus, { label: string; cls: string }> = {
    approved: { label: 'Approved', cls: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
    pending: { label: 'Pending', cls: 'bg-amber-950 text-amber-400 border-amber-800' },
    expired: { label: 'Renewal Required', cls: 'bg-red-950 text-red-400 border-red-800' },
    required: {
      label: 'Missing',
      cls: 'bg-gray-900 text-gray-400 border-gray-700 border-dashed',
    },
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${map[status].cls}`}>
      {map[status].label}
    </span>
  );
}

export default function DocumentosPage() {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<'all' | DocCategory>('all');

  const filtered = mockDocs.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || d.category === filterCat;
    return matchSearch && matchCat;
  });

  const expiredCount = mockDocs.filter((d) => d.status === 'expired').length;
  const requiredCount = mockDocs.filter((d) => d.status === 'required').length;

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Document Management"
          subtitle="Meridian Capital AG · Legal, financial and compliance documentation · Versioned and audit-ready"
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* DEMO badge — PHASE 2: replace mockDocs with document storage API reads */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-fit">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Demo Data
            </span>
            <span className="text-xs text-gray-600">
              · Sample documents for illustration. No live data displayed.
            </span>
          </div>

          {/* Alerts */}
          {(expiredCount > 0 || requiredCount > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expiredCount > 0 && (
                <div className="flex items-center gap-3 bg-red-950 border border-red-900 rounded-xl p-4">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-300">
                      {expiredCount} document(s) expired
                    </p>
                    <p className="text-xs text-red-400/80 mt-0.5">
                      Renew to maintain regulatory compliance standing.
                    </p>
                  </div>
                </div>
              )}
              {requiredCount > 0 && (
                <div className="flex items-center gap-3 bg-amber-950 border border-amber-900 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-300">
                      {requiredCount} required document(s) pending upload
                    </p>
                    <p className="text-xs text-amber-400/80 mt-0.5">
                      Required for annual compliance review.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                className="w-full bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Search document..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilterCat('all')}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  filterCat === 'all'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                All ({mockDocs.length})
              </button>
              {(Object.keys(categoryLabels) as DocCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    filterCat === cat
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {categoryLabels[cat].label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap">
              <Plus className="w-3.5 h-3.5" /> Upload Document
            </button>
          </div>

          {/* Documents grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((doc) => {
              const catMeta = categoryLabels[doc.category];
              const CatIcon = catMeta.icon;
              return (
                <div
                  key={doc.id}
                  className={`bg-white dark:bg-gray-900/60 border rounded-xl p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40 ${
                    doc.status === 'required'
                      ? 'border-dashed border-gray-700'
                      : doc.status === 'expired'
                        ? 'border-red-700/30'
                        : 'border-gray-800/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 ${catMeta.color}`}
                    >
                      {doc.status === 'required' ? (
                        <Upload className="w-4 h-4" />
                      ) : (
                        <CatIcon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                            {doc.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-xs ${catMeta.color}`}>{catMeta.label}</span>
                            {doc.campaign && (
                              <span className="text-xs text-gray-600">· {doc.campaign}</span>
                            )}
                            {doc.confidential && (
                              <span className="text-xs text-gray-600 flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> Confidential
                              </span>
                            )}
                          </div>
                        </div>
                        <StatusBadge status={doc.status} />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-gray-600 space-y-0.5">
                          {doc.uploadedAt && (
                            <p>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-GB')}</p>
                          )}
                          {doc.expiresAt && (
                            <p className={doc.status === 'expired' ? 'text-red-400' : ''}>
                              Expires: {new Date(doc.expiresAt).toLocaleDateString('en-GB')}
                            </p>
                          )}
                          {doc.size && (
                            <p>
                              {doc.size} · v{doc.version}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {doc.status !== 'required' && (
                            <>
                              <button className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          {doc.status === 'required' && (
                            <button className="flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-900/40 border border-blue-700/40 text-blue-400 rounded-lg hover:bg-blue-900/60 transition-colors">
                              <Upload className="w-3 h-3" /> Upload
                            </button>
                          )}
                          {doc.status === 'expired' && (
                            <button className="flex items-center gap-1 px-2.5 py-1 text-xs bg-amber-900/40 border border-amber-700/40 text-amber-400 rounded-lg hover:bg-amber-900/60 transition-colors">
                              <Upload className="w-3 h-3" /> Renew
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-700">
            Documents encrypted AES-256 at rest · Access audited · Retention per GDPR
          </p>
        </main>
      </div>
    </div>
  );
}
