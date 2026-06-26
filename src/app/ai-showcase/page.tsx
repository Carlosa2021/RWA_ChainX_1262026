'use client';

// Force Vercel redeploy - v2.0
import React, { useState } from 'react';
import SmartPaymentsDashboard from '@/components/SmartPaymentsDashboard';
import AIInvestmentAssistant from '@/components/AIInvestmentAssistant';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import {
  Brain,
  TrendingUp,
  Sparkles,
  Lock,
  AlertTriangle,
  Target,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  Shield,
} from 'lucide-react';
import { useFeatureGuard } from '@/hooks/useFeatureGuard';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { logger } from '@/lib/logger';

// Meridian Capital AG — Tokenized real estate portfolio
const sampleProperties = [
  {
    id: 'basel-riverside-offices',
    name: 'Basel Riverside Offices',
    location: 'Basel, Switzerland',
    totalValue: '€18.5M',
    pricePerToken: '€500',
    tokensAvailable: 7400,
    tokensTotal: 37000,
    apy: '8.2%',
    status: 'active' as const,
    progress: 80,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=500&h=300&fit=crop',
    ],
    investors: 84,
    minInvestment: 500,
    maxInvestment: 500000,
  },
  {
    id: 'zurich-residential-portfolio',
    name: 'Zurich Residential Portfolio',
    location: 'Zurich, Switzerland',
    totalValue: '€12.2M',
    pricePerToken: '€200',
    tokensAvailable: 24400,
    tokensTotal: 61000,
    apy: '6.8%',
    status: 'active' as const,
    progress: 60,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=500&h=300&fit=crop',
    ],
    investors: 156,
    minInvestment: 200,
    maxInvestment: 250000,
  },
  {
    id: 'madrid-prime-offices',
    name: 'Madrid Prime Offices',
    location: 'Madrid, Spain',
    totalValue: '€24.5M',
    pricePerToken: '€1,000',
    tokensAvailable: 20580,
    tokensTotal: 24500,
    apy: '7.5%',
    status: 'upcoming' as const,
    progress: 16,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop',
    ],
    investors: 28,
    minInvestment: 1000,
    maxInvestment: 1000000,
  },
  {
    id: 'ibiza-luxury-villas',
    name: 'Ibiza Luxury Villas',
    location: 'Ibiza, Spain',
    totalValue: '€6.5M',
    pricePerToken: '€250',
    tokensAvailable: 26000,
    tokensTotal: 26000,
    apy: '11.2%',
    status: 'upcoming' as const,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=300&fit=crop',
    ],
    investors: 0,
    minInvestment: 250,
    maxInvestment: 100000,
  },
];

export default function AIPaymentsShowcase() {
  // Feature Guard Protection
  const { hasAccess, showUpgradePrompt, upgradePromptOpen, closeUpgradePrompt, requiredFeature } =
    useFeatureGuard('aiEnabled', 'AI Showcase');

  const [selectedProperty, setSelectedProperty] = useState(sampleProperties[0]);
  const [view, setView] = useState<'executive' | 'portfolio' | 'copilot'>('executive');

  // If user doesn't have access, return the locked page
  if (!hasAccess) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto flex items-center justify-center">
            <div className="text-center max-w-sm p-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-gray-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                AI Copilot — Enterprise Only
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                The Enterprise AI Copilot is available on Pro and Enterprise plans.
              </p>
              <button
                onClick={showUpgradePrompt}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-semibold transition-colors"
              >
                Upgrade to Enterprise
              </button>
            </div>
          </main>
        </div>
        <UpgradePrompt
          feature={requiredFeature}
          isOpen={upgradePromptOpen}
          onClose={closeUpgradePrompt}
        />
      </div>
    );
  }

  const handleInvest = (propertyId: string) => {
    logger.info(`Inversión iniciada para: ${propertyId}`);
  };

  // Convertir propiedad para el AI
  const propertyDataForAI = {
    id: selectedProperty.id,
    title: selectedProperty.name,
    price: parseFloat(selectedProperty.pricePerToken.replace(/[€,]/g, '')),
    location: selectedProperty.location,
    roi: parseFloat(selectedProperty.apy.replace('%', '')),
    type: 'mixed',
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="AI Copilot"
          subtitle="Meridian Capital AG · Enterprise Portfolio Intelligence · Powered by ChainX AI"
        />
        <main className="flex-1 overflow-y-auto">
          {/* Tab Navigation */}
          <div className="px-6 pt-5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-1">
              {[
                { id: 'executive' as const, label: 'Executive Summary', icon: Brain },
                { id: 'portfolio' as const, label: 'Portfolio Analysis', icon: TrendingUp },
                { id: 'copilot' as const, label: 'AI Copilot', icon: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    view === tab.id
                      ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* ────────── EXECUTIVE SUMMARY ────────── */}
            {view === 'executive' && (
              <div className="space-y-6">
                {/* AI Briefing Banner */}
                <div className="bg-gray-900 dark:bg-gray-950 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-800 rounded-xl shrink-0">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-3 mb-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                          ChainX AI · Portfolio Briefing
                        </span>
                        <span className="text-gray-700">·</span>
                        <span className="text-xs text-gray-500">26 June 2026 · 09:42 CET</span>
                        <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/40 border border-emerald-800/60 text-emerald-400 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Portfolio Healthy
                        </span>
                      </div>
                      <p className="text-white font-semibold text-lg mb-2">
                        Meridian Capital AG — Q2 2026 Executive Report
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Portfolio performing above benchmark. Capital raised is €35.84M across 5
                        tokenized offerings (50.1% of total target). Valencia Logistics Hub is fully
                        funded and distributing 9.1% p.a. Two offerings are actively open for
                        subscription. Three compliance items require immediate attention before Q3
                        distributions can proceed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Executive KPI Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Total AUM (Tokenized)',
                      value: '€71.5M',
                      sub: '5 registered offerings',
                      trend: '+€6.5M from Ibiza launch',
                      icon: DollarSign,
                    },
                    {
                      label: 'Capital Raised',
                      value: '€35.84M',
                      sub: '50.1% of total target',
                      trend: '+€1.2M this month',
                      icon: TrendingUp,
                    },
                    {
                      label: 'Verified Investors',
                      value: '580',
                      sub: '8 jurisdictions · ERC-3643',
                      trend: '+23 this week',
                      icon: Users,
                    },
                    {
                      label: 'Avg. Target Return',
                      value: '8.4% p.a.',
                      sub: 'Issuer projection · not guaranteed',
                      trend: undefined as string | undefined,
                      icon: Activity,
                    },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {kpi.label}
                        </span>
                        <kpi.icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {kpi.value}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
                      {kpi.trend && (
                        <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          {kpi.trend}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Portfolio table + AI insights side panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Portfolio list */}
                  <div className="lg:col-span-2 bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/60 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        Offering Portfolio
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Meridian Capital AG · 5 tokenized assets · Polygon Mainnet · ERC-3643
                      </p>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                      {sampleProperties.map((p) => (
                        <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {p.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {p.location} · Target {p.apy}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {p.totalValue}
                            </p>
                            <p className="text-xs text-gray-500">{p.progress}% raised</p>
                          </div>
                          <div className="w-24 shrink-0">
                            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  p.progress === 100
                                    ? 'bg-emerald-500'
                                    : p.progress > 50
                                      ? 'bg-blue-500'
                                      : 'bg-amber-500'
                                }`}
                                style={{ width: `${p.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights column */}
                  <div className="space-y-4">
                    {/* Attention Required */}
                    <div className="bg-amber-950/20 dark:bg-amber-950/30 border border-amber-900/40 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <h3 className="text-sm font-semibold text-amber-400">Requires Attention</h3>
                        <span className="ml-auto text-xs text-amber-600">3</span>
                      </div>
                      <div className="space-y-2 text-xs text-amber-200/70">
                        <p className="flex gap-2">
                          <span className="text-amber-500 shrink-0">→</span>
                          KYC Expired — H.-P. Vogt (CH)
                        </p>
                        <p className="flex gap-2">
                          <span className="text-amber-500 shrink-0">→</span>
                          Insurance Cert. expired — Madrid Prime
                        </p>
                        <p className="flex gap-2">
                          <span className="text-amber-500 shrink-0">→</span>
                          AML/KYC 2026 Declaration — missing
                        </p>
                      </div>
                    </div>

                    {/* Next Actions */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-blue-500" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Next Actions
                        </h3>
                      </div>
                      <ol className="space-y-2 text-xs text-gray-500">
                        <li className="flex gap-2">
                          <span className="text-blue-500 font-semibold shrink-0">1.</span>
                          Process Q2 2026 distribution (€198,500)
                        </li>
                        <li className="flex gap-2">
                          <span className="text-blue-500 font-semibold shrink-0">2.</span>
                          Approve Madrid Prime subscription
                        </li>
                        <li className="flex gap-2">
                          <span className="text-blue-500 font-semibold shrink-0">3.</span>
                          Renew KYC — H.-P. Vogt, Y. Tanaka
                        </li>
                        <li className="flex gap-2">
                          <span className="text-blue-500 font-semibold shrink-0">4.</span>
                          Upload AML/KYC 2026 Declaration
                        </li>
                      </ol>
                    </div>

                    {/* Q2 Distribution Ready */}
                    <div className="bg-emerald-950/20 dark:bg-emerald-950/30 border border-emerald-900/40 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm font-semibold text-emerald-400">
                          Q2 Distribution Ready
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">€198,500</p>
                      <p className="text-xs text-emerald-300/70">
                        580 token holders · 2 offerings · Pending sign-off
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ────────── PORTFOLIO ANALYSIS ────────── */}
            {view === 'portfolio' && (
              <div className="space-y-6">
                <div className="bg-gray-900 dark:bg-gray-950 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded-xl">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        Portfolio Analysis — Meridian Capital AG
                      </p>
                      <p className="text-gray-400 text-xs">
                        Fundraising performance, payment flows and subscription velocity · June 2026
                      </p>
                    </div>
                  </div>
                </div>
                <SmartPaymentsDashboard className="max-w-6xl mx-auto" />
              </div>
            )}

            {/* ────────── AI COPILOT ────────── */}
            {view === 'copilot' && (
              <div className="space-y-6">
                {/* Copilot header */}
                <div className="bg-gray-900 dark:bg-gray-950 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gray-800 rounded-xl">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Enterprise Portfolio Copilot</p>
                      <p className="text-gray-400 text-xs">
                        Ask about investors, offerings, compliance, distributions or portfolio
                        performance
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Generate Q1 investor report for Basel Riverside',
                      'Summarize portfolio health for board presentation',
                      'Which offering has the highest projected return?',
                      'Show investors with pending KYC renewal',
                      'Summarize Q2 2026 subscription performance',
                    ].map((prompt) => (
                      <span
                        key={prompt}
                        className="text-xs px-3 py-1.5 rounded-full border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                      >
                        {prompt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Property selector */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Select offering context
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {sampleProperties.map((property) => (
                        <button
                          key={property.id}
                          onClick={() => setSelectedProperty(property)}
                          className={`p-3 rounded-xl border transition-all text-left ${
                            selectedProperty.id === property.id
                              ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={property.image}
                              alt={property.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {property.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {property.location} · {property.apy}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Assistant */}
                  <AIInvestmentAssistant property={propertyDataForAI} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
