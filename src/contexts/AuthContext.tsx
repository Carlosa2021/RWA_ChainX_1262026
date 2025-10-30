"use client";

import { createContext, useContext, ReactNode } from "react";
import { useActiveAccount } from "thirdweb/react";

interface AuthContextType {
  isOwner: boolean;
  isKYCVerified: boolean;
  address: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// TU dirección de owner
const OWNER_ADDRESS = "0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca".toLowerCase();

export function AuthProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount();
  const address = account?.address?.toLowerCase();
  
  // Solo el OWNER puede hacer todo sin restricciones
  const isOwner = address === OWNER_ADDRESS;
  const isKYCVerified = isOwner; // Solo owner está verificado

  return (
    <AuthContext.Provider value={{ isOwner, isKYCVerified, address }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
