"use client";

import { createContext, useContext, ReactNode } from "react";
import { useActiveAccount } from "thirdweb/react";

interface AuthContextType {
  isOwner: boolean;
  isKYCVerified: boolean;
  address: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Owner address MUST be configured per client deployment
const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase();

export function AuthProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount();
  const address = account?.address?.toLowerCase();
  
  // Check if current wallet is the configured owner
  const isOwner = !!address && !!OWNER_ADDRESS && address === OWNER_ADDRESS;
  
  // TODO: Implement real KYC verification from IdentityRegistry contract
  // For now, only owner is verified (clients must implement KYC flow)
  const isKYCVerified = isOwner;

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
