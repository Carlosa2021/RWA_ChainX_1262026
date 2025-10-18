'use client';

import React from 'react';
import { usePlanConfig } from '@/hooks/usePlanSystem';
import { LimitDisplay, FeatureGuard } from '@/components/FeatureGuard';
import { FeatureCounter } from '@/components/PowerBadge';
import { ArrowUp, Star, Shield } from 'lucide-react';

export default function SimplePlanDisplay() {
  const planConfig = usePlanConfig();
  const [port, setPort] = React.useState<string>('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setPort(window.location.port || '3000');
    }
  }, []);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'STARTER': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PRO': return 'bg-green-100 text-green-800 border-green-200';
      case 'ENTERPRISE': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getBadgeColor(planConfig.type)}`}>
          <Star className="w-4 h-4 mr-2" />
          Plan Activo: {planConfig.type} (Puerto: {port})
        </div>
        <div className="mt-2">
          <span className="text-3xl font-bold text-gray-900">€{planConfig.price}</span>
          <span className="text-gray-500">/mes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <LimitDisplay
          current={2} // Simulado
          max={planConfig.maxProjects}
          label="Proyectos"
          type="projects"
        />
        <LimitDisplay
          current={35} // Simulado
          max={planConfig.maxInvestors}
          label="Inversores"
          type="investors"
        />
        <FeatureCounter />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <FeatureCard 
          title="Dashboard Básico" 
          enabled={planConfig.features.basicDashboard}
          description="Panel principal de control"
        />
        <FeatureCard 
          title="Panel de Administración" 
          enabled={planConfig.features.adminPanel}
          description="Gestión avanzada de usuarios"
        />
        <FeatureCard 
          title="Analytics Avanzados" 
          enabled={planConfig.features.analytics}
          description="Reportes detallados"
        />
        <FeatureCard 
          title="White Label" 
          enabled={planConfig.features.whiteLabel}
          description="Marca personalizada"
        />
        <FeatureCard 
          title="Acceso API" 
          enabled={planConfig.features.apiAccess}
          description="Integración por API"
        />
        <FeatureCard 
          title="Branding Personalizado" 
          enabled={planConfig.features.customBranding}
          description="Personalización visual"
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <Shield className="w-4 h-4 inline mr-1" />
          <strong>Sistema de Licencias Activo:</strong> Puerto {port} - Plan {planConfig.type} - Badge: {planConfig.badge}
        </p>
      </div>
    </div>
  );
}

// Componente para mostrar features individuales
function FeatureCard({ title, enabled, description }: { title: string; enabled: boolean; description: string }) {
  return (
    <div className={`p-3 rounded-lg border ${enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className={`text-sm font-medium ${enabled ? 'text-green-800' : 'text-gray-500'}`}>
          {title}
        </span>
      </div>
      <p className={`text-xs ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
        {description}
      </p>
    </div>
  );
}