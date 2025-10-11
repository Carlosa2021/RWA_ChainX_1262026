"use client";

import { useReadContract } from "thirdweb/react";
import { client, chain } from "@/lib/thirdweb";
import { getContract } from "thirdweb";

// Investment Controller ABI
const INVESTMENT_CONTROLLER_ABI = [
  {
    inputs: [{ name: "_tokens", type: "uint256" }],
    name: "quote",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_investor", type: "address" }],
    name: "getInvestorInfo",
    outputs: [
      { name: "isVerified", type: "bool" },
      { name: "canInvest", type: "bool" },
      { name: "tokenBalance", type: "uint256" },
      { name: "investorCountryCode", type: "uint16" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProjectStats",
    outputs: [
      { name: "raised", type: "uint256" },
      { name: "cap", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "active", type: "bool" },
      { name: "tokenSupply", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_tokens", type: "uint256" }],
    name: "invest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/**
 * Hook to get quote for investment
 */
export function useQuote(controllerAddress: string, tokens: bigint) {
  const contract = getContract({
    client,
    chain,
    address: controllerAddress as `0x${string}`,
    abi: INVESTMENT_CONTROLLER_ABI,
  });

  const { data, isLoading, error } = useReadContract({
    contract,
    method: "quote",
    params: [tokens],
  });

  return {
    quote: data || 0n,
    isLoading,
    error,
  };
}

/**
 * Hook to get investor info
 */
export function useInvestorInfo(controllerAddress: string, investorAddress?: string) {
  const contract = getContract({
    client,
    chain,
    address: controllerAddress as `0x${string}`,
    abi: INVESTMENT_CONTROLLER_ABI,
  });

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "getInvestorInfo",
    params: investorAddress ? [investorAddress as `0x${string}`] : undefined,
  });

  const investorData = Array.isArray(data) ? data : [false, false, 0n, 0];

  return {
    isVerified: investorData[0] as boolean || false,
    canInvest: investorData[1] as boolean || false,
    tokenBalance: investorData[2] as bigint || 0n,
    countryCode: investorData[3] as number || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get project stats
 */
export function useProjectStats(controllerAddress: string) {
  const contract = getContract({
    client,
    chain,
    address: controllerAddress as `0x${string}`,
    abi: INVESTMENT_CONTROLLER_ABI,
  });

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "getProjectStats",
    params: [],
  });

  const statsData = Array.isArray(data) ? data : [0n, 0n, 0n, false, 0n];

  return {
    raised: statsData[0] as bigint || 0n,
    cap: statsData[1] as bigint || 0n,
    price: statsData[2] as bigint || 0n,
    active: statsData[3] as boolean || false,
    tokenSupply: statsData[4] as bigint || 0n,
    isLoading,
    error,
    refetch,
  };
}
