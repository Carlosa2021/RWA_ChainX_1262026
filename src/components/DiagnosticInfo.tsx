"use client";

import React from 'react';

export function DiagnosticInfo() {
  const usdcAddress = process.env.NEXT_PUBLIC_USDC;
  const controllerAddress = process.env.NEXT_PUBLIC_CONTROLLER;
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  
  if (process.env.NODE_ENV !== 'development') {
    return null; // Solo mostrar en desarrollo
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h4 className="font-bold mb-2">🔧 Diagnóstico Env Vars</h4>
      <div className="space-y-1">
        <div>USDC: {usdcAddress || '❌ NO DEFINIDO'}</div>
        <div>Controller: {controllerAddress || '❌ NO DEFINIDO'}</div>
        <div>Chain ID: {chainId || '❌ NO DEFINIDO'}</div>
        <div>Entorno: {process.env.NODE_ENV}</div>
      </div>
    </div>
  );
}