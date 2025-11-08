"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { readContract } from "thirdweb";
import { getTw } from "@/lib/thirdweb";
import { useProjects } from "./useProjects";
import { logger } from "@/lib/logger";
import { useAuth } from "@/contexts/AuthContext";
import { ethers } from "ethers";

// ABIs
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

const SECURITY_TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

// Contratos
const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
const CHAINLINK_EUR_USD = "0x73366Fe0AA0Ded304479862808e02506FE556a98";

// Proyectos reales desplegados en Polygon
// NOTA: Estos son los mismos tokens que se muestran en el dashboard
// Para producción, solo mostrar tokens que realmente existen en blockchain
const PROJECTS = [
  {
    name: "Apartamento Moderno Madrid Centro",
    symbol: "RMAD",
    tokenAddress: "0xA15b7BFdc26eEE1e4687D45cd2C9d6049956fd45",
    priceEur: 500,
    image: "🏢"
  },
  {
    name: "Proyecto Alzira - Edificio Residencial",
    symbol: "RET",
    tokenAddress: "0x1c807Bd375a79249F34DC8EBfB6B426B8ffe4ca4", // Token desplegado Oct 29
    priceEur: 1,
    image: "🏠"
  }
];

interface TokenBalance {
  name: string;
  symbol: string;
  amount: number;
  valueEur: number;
  valueUsd: number;
  image: string;
  address: string;
}

interface WalletData {
  usdcBalance: number;
  tokens: TokenBalance[];
  totalValueUsd: number;
  totalValueEur: number;
  eurUsdRate: number;
  loading: boolean;
  error: string | null;
}

export function useWallet(): WalletData {
  const { address } = useAuth();
  const [data, setData] = useState<WalletData>({
    usdcBalance: 0,
    tokens: [],
    totalValueUsd: 0,
    totalValueEur: 0,
    eurUsdRate: 1.16,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!address) {
      setData({
        usdcBalance: 0,
        tokens: [],
        totalValueUsd: 0,
        totalValueEur: 0,
        eurUsdRate: 1.16,
        loading: false,
        error: "Wallet not connected"
      });
      return;
    }

    let mounted = true;

    async function fetchWalletData() {
      try {
        // Provider de Polygon
        const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");

        // 1. Get EUR/USD rate
        const priceFeedAbi = [
          "function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)",
          "function decimals() view returns (uint8)"
        ];
        const priceFeed = new ethers.Contract(CHAINLINK_EUR_USD, priceFeedAbi, provider);
        const [, answer] = await priceFeed.latestRoundData();
        const feedDecimals = await priceFeed.decimals();
        const eurUsdRate = Number(answer) / Math.pow(10, Number(feedDecimals));

        // 2. Get USDC balance
        const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
        const usdcBalanceRaw = await usdcContract.balanceOf(address);
        const usdcBalance = Number(ethers.formatUnits(usdcBalanceRaw, 6));

        // 3. Get token balances
        const tokenBalances: TokenBalance[] = [];
        
        for (const project of PROJECTS) {
          try {
            const tokenContract = new ethers.Contract(
              project.tokenAddress,
              SECURITY_TOKEN_ABI,
              provider
            );
            
            const balance = await tokenContract.balanceOf(address);
            const amount = Number(balance); // Tokens son indivisibles (sin decimales)
            
            logger.info(`🔍 ${project.symbol} balance:`, balance.toString(), "→", amount);
            
            if (amount > 0) {
              const valueEur = amount * project.priceEur;
              const valueUsd = valueEur * eurUsdRate;
              
              logger.info(`✅ ${project.symbol}: ${amount} tokens = ${valueEur} EUR = ${valueUsd.toFixed(2)} USD`);
              
              tokenBalances.push({
                name: project.name,
                symbol: project.symbol,
                amount,
                valueEur,
                valueUsd,
                image: project.image,
                address: project.tokenAddress
              });
            }
          } catch (err) {
            console.error(`❌ Error fetching balance for ${project.symbol}:`, err);
          }
        }

        // 4. Calculate totals
        const tokensTotalUsd = tokenBalances.reduce((sum, t) => sum + t.valueUsd, 0);
        const totalValueUsd = usdcBalance + tokensTotalUsd;
        const totalValueEur = totalValueUsd / eurUsdRate;

        if (mounted) {
          setData({
            usdcBalance,
            tokens: tokenBalances,
            totalValueUsd,
            totalValueEur,
            eurUsdRate,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        if (mounted) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Error loading wallet data"
          }));
        }
      }
    }

    fetchWalletData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchWalletData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [address]);

  return data;
}
