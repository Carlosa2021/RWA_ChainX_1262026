'use client';

import React from 'react';
import { PowerBadge } from '@/components/PowerBadge';

export default function SimpleHeader() {
  const [port, setPort] = React.useState('3000');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setPort(window.location.port || '3000');
    }
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CX</span>
            </div>
            <span className="font-bold text-gray-900">ChainX RWA</span>
            <PowerBadge />
          </div>
        </div>
        
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span>Puerto: {port}</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}