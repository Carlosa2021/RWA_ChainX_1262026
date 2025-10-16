"use client";

import { createContext, useContext, ReactNode } from "react";
import { useActiveAccount } from "thirdweb/react";

interface AuthContextType {
  isOwner: boolean;
  isKYCVerified: boolean;
  address: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase();

export function AuthProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount();
  const address = account?.address?.toLowerCase();
  
  // DEMO MODE: Habilitar acceso completo para showcase
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  
  const isOwner = isDemoMode ? true : (address === OWNER_ADDRESS);
  const isKYCVerified = isDemoMode ? true : false; // TODO: Check from IdentityRegistry

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
