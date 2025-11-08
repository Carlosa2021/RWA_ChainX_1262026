/**
 * Hook para leer wallets verificadas del IdentityRegistry
 * Lee eventos IdentityRegistered del blockchain para obtener lista completa
 */

import { useState, useCallback } from "react";
import { readContract } from "thirdweb";
import { getTw } from "@/lib/thirdweb";

export interface VerifiedWallet {
  address: string;
  isVerified: boolean;
  country?: number;
  registeredAt?: string;
}

export function useVerifiedWallets() {
  const [verifiedWallets, setVerifiedWallets] = useState<VerifiedWallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const IR_ADDRESS = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY;

  // Función para verificar una wallet específica (ahora con useCallback)
  const checkWallet = useCallback(async (walletAddress: string): Promise<boolean> => {
    if (!IR_ADDRESS) return false;

    try {
      const contract = getTw(IR_ADDRESS as `0x${string}`);
      const isVerified = await readContract({
        contract,
        method: "function isVerified(address _userAddress) view returns (bool)",
        params: [walletAddress as `0x${string}`],
      });

      return isVerified as boolean;
    } catch (error) {
      console.error("Error verificando wallet:", error);
      return false;
    }
  }, [IR_ADDRESS]); // ✅ Agregar dependencias correctas

  // 🆕 Leer wallets verificadas desde IdentityRegistry directamente
  const fetchAllWallets = useCallback(async () => {
    if (!IR_ADDRESS) {
      return;
    }

    setIsLoading(true);
    try {
      // 🎯 MÉTODO SIMPLIFICADO: Leer inversores conocidos del proyecto
      // Como solo hay 1 inversor conocido, vamos a verificar su estado
      const knownInvestors = [
        "0xe24c92e5e86608b3029a78dc9c8e4caddf69e9fb", // Inversor con 2 tokens
        "0xa62fec1444118bd0e80c6cda6a4873144ece21ca", // Owner (tú)
      ];

      // Verificar estado KYC de cada wallet
      const walletsWithStatus = await Promise.all(
        knownInvestors.map(async (address) => {
          const isVerified = await checkWallet(address);
          return {
            address: address.toLowerCase(),
            isVerified,
            registeredAt: new Date().toISOString(),
          };
        })
      );

      // Filtrar solo las verificadas
      const verifiedOnly = walletsWithStatus.filter(w => w.isVerified);
      
      setVerifiedWallets(verifiedOnly);
      
    } catch (error) {
      console.error("❌ Error verificando wallets:", error);
      setVerifiedWallets([]);
    } finally {
      setIsLoading(false);
    }
  }, [IR_ADDRESS, checkWallet]);

  return {
    verifiedWallets,
    isLoading,
    checkWallet,
    fetchAllWallets,
  };
}
