"use client";

import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getContract, readContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/client";
import { logger } from "@/lib/logger";

interface UserInvestment {
  projectName: string;
  tokenAddress: string;
  tokenSymbol: string;
  balance: bigint;
  balanceFormatted: string;
}

export function useUserInvestments() {
  const account = useActiveAccount();
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!account?.address) {
      setInvestments([]);
      return;
    }

    loadInvestments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address]);

  const loadInvestments = async () => {
    if (!account?.address) return;

    try {
      setIsLoading(true);

      // Check token balance
      const PROJECT_TOKEN = process.env.NEXT_PUBLIC_DEMO_TOKEN;
      if (!PROJECT_TOKEN) {
        logger.warn("⚠️  Project token not configured");
        setInvestments([]);
        return;
      }

      const tokenContract = getContract({
        client,
        chain: polygon,
        address: PROJECT_TOKEN as `0x${string}`,
      });

      // Get balance
      const balance = await readContract({
        contract: tokenContract,
        method: "function balanceOf(address) view returns (uint256)",
        params: [account.address as `0x${string}`],
      }) as bigint;

      // Get symbol
      const symbol = await readContract({
        contract: tokenContract,
        method: "function symbol() view returns (string)",
        params: [],
      }) as string;

      if (balance > 0n) {
        setInvestments([
          {
            projectName: "Proyecto Alzira - Edificio Residencial",
            tokenAddress: PROJECT_TOKEN,
            tokenSymbol: symbol,
            balance,
            balanceFormatted: balance.toString(),
          },
        ]);
      } else {
        setInvestments([]);
      }
    } catch (error) {
      console.error("❌ Error loading investments:", error);
      setInvestments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTokenToWallet = async (tokenAddress: string) => {
    if (!window.ethereum) {
      alert("Por favor instala Metamask");
      return;
    }

    try {
      const tokenContract = getContract({
        client,
        chain: polygon,
        address: tokenAddress as `0x${string}`,
      });

      const symbol = await readContract({
        contract: tokenContract,
        method: "function symbol() view returns (string)",
        params: [],
      }) as string;

      const decimals = await readContract({
        contract: tokenContract,
        method: "function decimals() view returns (uint8)",
        params: [],
      }) as number;

      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: symbol,
            decimals: decimals,
            image: "https://chainx.ch/logo.png",
          },
        },
      });

      logger.info("✅ Token agregado a Metamask");
    } catch (error) {
      console.error("❌ Error agregando token:", error);
      alert("Error al agregar token a Metamask");
    }
  };

  return {
    investments,
    isLoading,
    hasInvestments: investments.length > 0,
    addTokenToWallet,
    refetch: loadInvestments,
  };
}
