"use client";

import { createContext, useContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getTw } from "@/lib/thirdweb";
import { readContract } from "thirdweb";

interface AuthContextType {
  isOwner: boolean;
  isKYCVerified: boolean;
  address: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Owner address MUST be configured per client deployment
const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase();
const IDENTITY_REGISTRY = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY as `0x${string}` | undefined;

export function AuthProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount();
  const address = account?.address?.toLowerCase();

  // Check if current wallet is the configured owner
  const isOwner = !!address && !!OWNER_ADDRESS && address === OWNER_ADDRESS;

  // Real KYC verification using IdentityRegistry.isVerified(address)
  const [kyc, setKyc] = useState<boolean>(false);
  const [checkedAddr, setCheckedAddr] = useState<string | undefined>(undefined);

  const ir = useMemo(() => (IDENTITY_REGISTRY ? getTw(IDENTITY_REGISTRY) : undefined), []);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        // If no address or no IR configured, default to owner-only
        if (!address || !ir) {
          setKyc(isOwner);
          setCheckedAddr(address);
          return;
        }
        const res = await readContract({
          contract: ir,
          method: "function isVerified(address) view returns (bool)",
          params: [address as `0x${string}`],
        });
        if (!cancelled) {
          setKyc(Boolean(res));
          setCheckedAddr(address);
        }
      } catch (e) {
        console.error("❌ Error leyendo isVerified del IdentityRegistry:", e);
        // Fallback: solo owner considerado verificado para no bloquear admin
        if (!cancelled) {
          setKyc(isOwner);
          setCheckedAddr(address);
        }
      }
    }
    // Evita llamadas redundantes si no cambia la address
    if (address !== checkedAddr) {
      check();
    }
    return () => {
      cancelled = true;
    };
  }, [address, ir, isOwner, checkedAddr]);

  const isKYCVerified = kyc || isOwner;

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
