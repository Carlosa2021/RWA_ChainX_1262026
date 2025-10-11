"use client";

import { useReadContract } from "thirdweb/react";
import { client, chain } from "@/lib/thirdweb";
import { getContract } from "thirdweb";
import { CONTRACTS } from "@/lib/config";

// Project Registry ABI (simplified)
const PROJECT_REGISTRY_ABI = [
  {
    inputs: [],
    name: "getAllProjects",
    outputs: [
      {
        components: [
          { name: "name", type: "string" },
          { name: "securityToken", type: "address" },
          { name: "investmentController", type: "address" },
          { name: "pricePerToken", type: "uint256" },
          { name: "maxCap", type: "uint256" },
          { name: "stablecoin", type: "address" },
          { name: "metadataURI", type: "string" },
          { name: "active", type: "bool" },
          { name: "createdAt", type: "uint256" },
        ],
        internalType: "struct ProjectRegistry.Project[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveProjects",
    outputs: [
      {
        components: [
          { name: "name", type: "string" },
          { name: "securityToken", type: "address" },
          { name: "investmentController", type: "address" },
          { name: "pricePerToken", type: "uint256" },
          { name: "maxCap", type: "uint256" },
          { name: "stablecoin", type: "address" },
          { name: "metadataURI", type: "string" },
          { name: "active", type: "bool" },
          { name: "createdAt", type: "uint256" },
        ],
        internalType: "struct ProjectRegistry.Project[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface Project {
  name: string;
  securityToken: string;
  investmentController: string;
  pricePerToken: bigint;
  maxCap: bigint;
  stablecoin: string;
  metadataURI: string;
  active: boolean;
  createdAt: bigint;
}

/**
 * Hook to fetch all projects
 */
export function useProjects() {
  const contract = getContract({
    client,
    chain,
    address: CONTRACTS.projectRegistry as `0x${string}`,
    abi: PROJECT_REGISTRY_ABI,
  });

  const { data, isLoading, error } = useReadContract({
    contract,
    method: "getActiveProjects",
    params: [],
  });

  return {
    projects: (data as Project[]) || [],
    isLoading,
    error,
  };
}

/**
 * Hook to fetch a specific project
 */
export function useProject(projectId: number) {
  const { projects, isLoading, error } = useProjects();

  return {
    project: projects[projectId],
    isLoading,
    error,
  };
}
