'use client';

import React from 'react';
import { usePlanConfig } from '@/hooks/usePlanSystem';
import { useLicense } from '@/contexts/LicenseContext';

export default function EnvDebug() {
  const planConfig = usePlanConfig();
  const license = useLicense();
  const [port, setPort] = React.useState<string>('');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setPort(window.location.port || '3000');
    }
  }, []);

  // No renderizar hasta que esté montado en el cliente
  if (!mounted) {
    return null;
  }

  const isEnterprise = planConfig.type === 'ENTERPRISE';

  return (
    <div className="fixed bottom-4 right-4 bg-black/95 text-green-400 p-4 rounded-lg text-xs font-mono z-50 max-w-sm border border-green-500/30">
      <div className="text-green-300 font-bold mb-2 flex items-center gap-2">
        {isEnterprise ? '🚀' : '⚠️'} 
        PLAN STATUS: 
        <span className={isEnterprise ? 'text-green-400' : 'text-yellow-400'}>
          {planConfig.type}
        </span>
      </div>
      
      <div className="space-y-1">
        <div>PORT: <span className="text-blue-400">{port}</span></div>
        <div>PLAN: <span className="text-cyan-400">{planConfig.name}</span></div>
        <div>PRICE: <span className="text-yellow-400">€{planConfig.price}/mes</span></div>
        <div>LICENSE: <span className="text-purple-400">{license.licenseKey?.slice(0, 20)}...</span></div>
        
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="text-gray-300 text-xs mb-1">FEATURES ENABLED:</div>
          <div>📊 Analytics: <span className={planConfig.features.analytics ? 'text-green-400' : 'text-red-400'}>{planConfig.features.analytics ? 'ON' : 'OFF'}</span></div>
          <div>👑 Admin Panel: <span className={planConfig.features.adminPanel ? 'text-green-400' : 'text-red-400'}>{planConfig.features.adminPanel ? 'ON' : 'OFF'}</span></div>
          <div>🎨 White Label: <span className={planConfig.features.whiteLabel ? 'text-green-400' : 'text-red-400'}>{planConfig.features.whiteLabel ? 'ON' : 'OFF'}</span></div>
          <div>🛠️ KYC Management: <span className={planConfig.features.kycManagement ? 'text-green-400' : 'text-red-400'}>{planConfig.features.kycManagement ? 'ON' : 'OFF'}</span></div>
          <div>� API Access: <span className={planConfig.features.apiAccess ? 'text-green-400' : 'text-red-400'}>{planConfig.features.apiAccess ? 'ON' : 'OFF'}</span></div>
          <div>⚙️ Custom Integrations: <span className={planConfig.features.customIntegrations ? 'text-green-400' : 'text-red-400'}>{planConfig.features.customIntegrations ? 'ON' : 'OFF'}</span></div>
          <div>� Advanced Reports: <span className={planConfig.features.advancedReports ? 'text-green-400' : 'text-red-400'}>{planConfig.features.advancedReports ? 'ON' : 'OFF'}</span></div>
        </div>
        
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div>PROJECTS: <span className="text-blue-400">{planConfig.maxProjects === -1 ? '∞' : planConfig.maxProjects}</span></div>
          <div>INVESTORS: <span className="text-blue-400">{planConfig.maxInvestors === -1 ? '∞' : planConfig.maxInvestors}</span></div>
        </div>
      </div>
    </div>
  );
}