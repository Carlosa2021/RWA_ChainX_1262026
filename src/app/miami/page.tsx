'use client';

import React from 'react';
import { usePlanConfig } from '@/hooks/usePlanSystem';
import { 
  Crown, 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  Globe,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  DollarSign,
  BarChart3
} from 'lucide-react';

export default function MiamiPresentationPage() {
  const planConfig = usePlanConfig();

  const features = [
    {
      icon: Shield,
      title: "ERC-3643 + MiCA Compliance",
      description: "Full regulatory compliance for US and EU markets",
      status: "ACTIVE"
    },
    {
      icon: Building2,
      title: "Unlimited Real Estate Projects",
      description: "Tokenize any property size - from $100K to $1B+",
      status: "ACTIVE"
    },
    {
      icon: Users,
      title: "Unlimited Investor Management",
      description: "KYC/AML automated verification for global investors",
      status: "ACTIVE"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Dashboard",
      description: "Real-time metrics, ROI tracking, and fund performance",
      status: "ACTIVE"
    },
    {
      icon: Globe,
      title: "Multi-Chain Support",
      description: "Polygon, Ethereum, Base - scale globally",
      status: "ACTIVE"
    },
    {
      icon: Zap,
      title: "White Label Solution",
      description: "Complete customization with your fund's branding",
      status: "ACTIVE"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 to-pink-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown className="w-12 h-12 text-yellow-400" />
              <h1 className="text-6xl font-bold text-white">
                ChainX<span className="text-yellow-400">®</span>
              </h1>
            </div>
            
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 mb-8 inline-block">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 font-bold text-lg">🚀 ENTERPRISE PLATFORM LIVE</span>
                <span className="text-green-200">|</span>
                <span className="text-green-100">Ready for Miami Investment Fund</span>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-4">
              Real World Assets Tokenization Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The most advanced blockchain platform for institutional real estate investment. 
              Built for funds managing <span className="text-yellow-400 font-bold">$100M+ portfolios</span>.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <DollarSign className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-3xl font-bold text-white">$50M+</div>
              <div className="text-gray-300">Platform Capacity</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Building2 className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-gray-300">Projects Supported</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-gray-300">Investors Capacity</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <TrendingUp className="w-8 h-8 text-orange-400 mb-3" />
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-gray-300">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          🔥 Enterprise Features Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-white">{feature.title}</h4>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{feature.description}</p>
                  <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium inline-block">
                    {feature.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Status */}
        <div className="bg-linear-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 mb-12">
          <div className="text-center">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Live Production Environment
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              This platform is running on our enterprise infrastructure with all features enabled. 
              Ready for immediate deployment for your fund&apos;s specific requirements.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-lg font-bold text-white">Current Plan</div>
                <div className="text-purple-400">{planConfig.type}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-lg font-bold text-white">License Status</div>
                <div className="text-green-400">ACTIVE & VALID</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-lg font-bold text-white">All Features</div>
                <div className="text-green-400">UNLOCKED</div>
              </div>
            </div>

            <button className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all inline-flex items-center gap-3">
              <span>Schedule Your Demo Call</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h4 className="text-xl font-bold text-white mb-4">Ready to discuss your requirements?</h4>
            <div className="flex items-center justify-center gap-8 text-gray-300">
              <div>
                <strong className="text-white">Email:</strong> carlos@chainx.ch
              </div>
              <div>
                <strong className="text-white">Platform:</strong> chainx-rwa.vercel.app
              </div>
              <div>
                <strong className="text-white">Meeting:</strong> Wednesday Miami
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}