'use client';

import React from 'react';
import { FeatureGuard, LimitDisplay } from '@/components/FeatureGuard';
import { UpgradeModal, useUpgradeModal } from '@/components/UpgradeModal';
import { usePlanConfig, usePlanLimits } from '@/hooks/usePlanSystem';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Crown, 
  Zap, 
  Globe,
  Database,
  Lock,
  ArrowUp,
  Shield
} from 'lucide-react';

export default function DemoPage() {
  const planConfig = usePlanConfig();
  const limits = usePlanLimits();
  const { isOpen, openModal, closeModal, context } = useUpgradeModal();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 Demo de Feature Guards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Prueba las restricciones del plan {planConfig.type} (€{planConfig.price}/mes)
          </p>
        </div>

        {/* Limits Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <LimitDisplay
            current={2}
            max={planConfig.maxProjects}
            label="Proyectos Creados"
            type="projects"
          />
          <LimitDisplay
            current={125}
            max={planConfig.maxInvestors}
            label="Inversores Registrados"
            type="investors"
          />
        </div>

        {/* Feature Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Analytics Dashboard */}
          <FeatureGuard feature="analytics">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">€125.5K</div>
                  <div className="text-sm text-blue-500">Total Invested</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">12.5%</div>
                  <div className="text-sm text-green-500">Average ROI</div>
                </div>
              </div>
            </div>
          </FeatureGuard>

          {/* Admin Panel */}
          <FeatureGuard feature="adminPanel">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">User Management</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm">Active Users</span>
                  <span className="text-sm font-semibold">47</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm">Pending KYC</span>
                  <span className="text-sm font-semibold">12</span>
                </div>
                <button className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                  Manage Users
                </button>
              </div>
            </div>
          </FeatureGuard>

          {/* KYC Management */}
          <FeatureGuard feature="kycManagement">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">KYC Management</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">5 pending reviews</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">42 approved</span>
                </div>
                <button className="w-full px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600">
                  Review KYC
                </button>
              </div>
            </div>
          </FeatureGuard>

          {/* White Label Settings */}
          <FeatureGuard feature="whiteLabel">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-yellow-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">White Label Config</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 dark:border-gray-600 rounded">
                  <label className="text-xs text-gray-500">Custom Domain</label>
                  <input 
                    type="text" 
                    placeholder="your-domain.com"
                    className="w-full mt-1 px-2 py-1 text-sm border rounded"
                  />
                </div>
                <div className="p-3 border border-gray-200 dark:border-gray-600 rounded">
                  <label className="text-xs text-gray-500">Brand Colors</label>
                  <div className="flex gap-2 mt-1">
                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                    <div className="w-6 h-6 bg-green-500 rounded"></div>
                    <div className="w-6 h-6 bg-purple-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </FeatureGuard>

          {/* API Access */}
          <FeatureGuard feature="apiAccess">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-indigo-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">API Dashboard</h3>
              </div>
              <div className="space-y-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded font-mono text-xs">
                  API Key: ****-****-****-1234
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="font-semibold text-blue-600">1,247</div>
                    <div className="text-xs text-blue-500">Requests</div>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="font-semibold text-green-600">99.9%</div>
                    <div className="text-xs text-green-500">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </FeatureGuard>

          {/* Custom Integrations */}
          <FeatureGuard feature="customIntegrations">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-orange-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Custom Integrations</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm">Salesforce CRM</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm">Custom Webhook</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <button className="w-full px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600">
                  Add Integration
                </button>
              </div>
            </div>
          </FeatureGuard>

        </div>

        {/* Upgrade CTA */}
        {planConfig.type !== 'ENTERPRISE' && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-6 text-white">
              <Crown className="w-8 h-8 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">
                ¿Necesitas más funciones?
              </h3>
              <p className="mb-4 opacity-90">
                Desbloquea todas las características con un plan superior
              </p>
              <button className="px-6 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:shadow-lg transition-all">
                <ArrowUp className="w-4 h-4 inline mr-2" />
                Upgrade Plan
              </button>
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        <UpgradeModal 
          isOpen={isOpen}
          onClose={closeModal}
          requiredPlan={context.requiredPlan}
          feature={context.feature}
        />
      </div>
    </div>
  );
}