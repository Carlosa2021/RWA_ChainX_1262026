'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface EnterpriseContextType {
  isEnterpriseMode: boolean;
  isLoaded: boolean;
}

const EnterpriseContext = createContext<EnterpriseContextType>({
  isEnterpriseMode: true,
  isLoaded: false
});

export function EnterpriseProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnterpriseMode] = useState(true); // SIEMPRE true

  useEffect(() => {
    // Forzar configuración Enterprise
    console.log('🚀 ENTERPRISE PROVIDER: Forcing Enterprise Mode');
    console.log('✅ All features unlocked');
    console.log('🔥 Unlimited projects and investors');
    
    // Marcar como cargado después de un breve delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <EnterpriseContext.Provider value={{ isEnterpriseMode, isLoaded }}>
      {children}
    </EnterpriseContext.Provider>
  );
}

export function useEnterprise() {
  return useContext(EnterpriseContext);
}