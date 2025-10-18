import React from 'react';
import { usePlanConfig } from '@/hooks/usePlanSystem';

export default function EnvDebug() {
  const planConfig = usePlanConfig();
  const [port, setPort] = React.useState<string>('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setPort(window.location.port || '3000');
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-yellow-400 p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="text-yellow-300 font-bold mb-2">🎯 DEBUG PORT-BASED:</div>
      <div>PORT: {port}</div>
      <div>PLAN_TYPE: {planConfig.type}</div>
      <div>PLAN_NAME: {planConfig.name}</div>
      <div>PLAN_PRICE: {planConfig.price}</div>
      <div>MAX_PROJECTS: {planConfig.maxProjects}</div>
      <div>ADMIN_PANEL: {planConfig.features.adminPanel.toString()}</div>
      <div>WHITE_LABEL: {planConfig.features.whiteLabel.toString()}</div>
      <div className="text-green-400 mt-1">Port: {port}</div>
    </div>
  );
}