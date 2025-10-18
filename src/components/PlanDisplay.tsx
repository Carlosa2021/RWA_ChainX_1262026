import React from 'react';
import { usePlanConfig } from '@/hooks/usePlanConfig';

export default function PlanDisplay() {
  const planConfig = usePlanConfig();

  const getFeatureIcon = (enabled: boolean) => enabled ? '✅' : '❌';
  
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'STARTER': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PRO': return 'bg-green-100 text-green-800 border-green-200';
      case 'ENTERPRISE': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getBadgeColor(planConfig.type)}`}>
          <span className="mr-2">🏷️</span>
          Plan Activo: {planConfig.name}
        </div>
        <div className="mt-2">
          <span className="text-3xl font-bold text-gray-900">€{planConfig.price}</span>
          <span className="text-gray-500">/mes</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{planConfig.maxProjects}</div>
          <div className="text-sm text-gray-600">Proyectos Máximos</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{planConfig.maxInvestors}</div>
          <div className="text-sm text-gray-600">Inversores Máximos</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 mb-3">Características Incluidas:</h3>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-700">Dashboard Básico</span>
          <span className="text-xl">{getFeatureIcon(planConfig.features.basicDashboard)}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-700">Panel de Administración</span>
          <span className="text-xl">{getFeatureIcon(planConfig.features.adminPanel)}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-700">Analytics Avanzados</span>
          <span className="text-xl">{getFeatureIcon(planConfig.features.analytics)}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-700">White Label</span>
          <span className="text-xl">{getFeatureIcon(planConfig.features.whiteLabel)}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-700">Acceso API</span>
          <span className="text-xl">{getFeatureIcon(planConfig.features.apiAccess)}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-700">Branding Personalizado</span>
          <span className="text-xl">{getFeatureIcon(planConfig.features.customBranding)}</span>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700">Soporte Prioritario</span>
          <span className="text-xl">{getFeatureIcon(planConfig.features.prioritySupport)}</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Información Técnica:</strong> Este servidor está ejecutándose con la configuración del plan <strong>{planConfig.type}</strong>.
          Las características y límites se aplican automáticamente según el puerto: <strong>{typeof window !== 'undefined' ? window.location.port : '3000'}</strong>
        </p>
      </div>
    </div>
  );
}