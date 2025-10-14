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
  {
    inputs: [],
    name: "getProjectCount",
    outputs: [
      { name: "", type: "uint256" }
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

export interface ProjectDisplay {
  id: number;
  name: string;
  location: string;
  totalValue: string;
  pricePerToken: string;
  tokensAvailable: number;
  tokensTotal: number;
  apy: string;
  status: "active" | "funded" | "upcoming";
  progress: number;
  investors: number;
  image: string;
  securityToken: string;
  investmentController: string;
}

// Mapeo de metadataURI a datos adicionales
// En producción, estos datos vendrían de IPFS o un servidor
const PROJECT_METADATA: Record<string, {
  location: string;
  apy: string;
  image: string;
  investors: number;
}> = {
  // Agregar metadata aquí cuando tengas proyectos reales registrados
};

/**
 * Hook to fetch all projects from blockchain
 */
export function useProjects() {
  // Validate contract address before creating contract instance
  const contractAddress = CONTRACTS.projectRegistry;
  const hasValidAddress = Boolean(contractAddress && contractAddress !== "");

  // Create contract only if address is valid
  const contract = hasValidAddress ? getContract({
    client,
    chain,
    address: contractAddress as `0x${string}`,
    abi: PROJECT_REGISTRY_ABI,
  }) : null;

  // Call hooks unconditionally but with queryOptions to disable when no contract
  const { data, isLoading, error, refetch } = useReadContract({
    contract: contract!,
    method: "getActiveProjects",
    params: [],
    queryOptions: {
      enabled: hasValidAddress,
    },
  });

  const { data: projectCount } = useReadContract({
    contract: contract!,
    method: "getProjectCount",
    params: [],
    queryOptions: {
      enabled: hasValidAddress,
    },
  });

  // Transformar datos del contrato a formato de UI
  const projectsDisplay: ProjectDisplay[] = data && (data as Project[]).length > 0 
    ? (data as Project[]).map((project, index) => {
        const metadata = PROJECT_METADATA[project.metadataURI] || {
          location: "Ubicación desconocida",
          apy: "8%",
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
          investors: 0
        };

        // Convertir pricePerToken de eurocents a euros
        const priceInEuros = Number(project.pricePerToken) / 100;
        
        // Los tokens tienen 18 decimals pero son indivisibles
        // maxCap viene como BigInt con 18 decimales (ej: 5000000000000000000000000 = 5M tokens)
        // Necesitamos dividir por 10^18 para obtener el número real de tokens
        const maxCapTokens = Number(project.maxCap) / 1e18;
        
        // Calcular valor total (tokens * precio en euros)
        const totalValueEuros = maxCapTokens * priceInEuros;

        // Mock: calcular tokens vendidos (en producción leer de InvestmentController.issued)
        const mockTokensSold = Math.floor(maxCapTokens * (0.3 + Math.random() * 0.4));
        const tokensAvailable = maxCapTokens - mockTokensSold;
        const progress = Math.round((mockTokensSold / maxCapTokens) * 100);

        return {
          id: index,
          name: project.name,
          location: metadata.location,
          totalValue: `€${totalValueEuros.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
          pricePerToken: `€${priceInEuros.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
          tokensAvailable: Math.floor(tokensAvailable),
          tokensTotal: Math.floor(maxCapTokens),
          apy: metadata.apy,
          status: tokensAvailable > 0 ? "active" : "funded",
          progress,
          investors: metadata.investors,
          image: metadata.image,
          securityToken: project.securityToken,
          investmentController: project.investmentController,
        };
      })
    : [
        // Fallback: Mostrar campaña real cuando ProjectRegistry está vacío
        {
          id: 0,
          name: "Test Campaign - Apartamento Testing",
          location: "Madrid, España",
          totalValue: "€5",
          pricePerToken: "€1",
          tokensAvailable: 2,
          tokensTotal: 5,
          apy: "8%",
          status: "active" as const,
          progress: 60,
          investors: 1,
          image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
          securityToken: "0xA15b7BFdc26eEE1e4687D45cd2C9d6049956fd45",
          investmentController: "0xYourInvestmentControllerAddress", // Reemplazar con dirección real
        }
      ];

  return {
    projects: projectsDisplay,
    projectsRaw: (data as Project[]) || [],
    projectCount: projectCount ? Number(projectCount) : 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch a specific project
 */
export function useProject(projectId: number) {
  const { projects, projectsRaw, isLoading, error } = useProjects();

  return {
    project: projects[projectId],
    projectRaw: projectsRaw[projectId],
    isLoading,
    error,
  };
}

/**
 * Hook para obtener estadísticas agregadas de todos los proyectos
 */
export function useProjectStats() {
  const { projects, projectCount } = useProjects();

  const stats = {
    totalProjects: projectCount,
    activeProjects: projects.filter(p => p.status === "active").length,
    totalValueLocked: projects.reduce((sum, p) => {
      const value = parseInt(p.totalValue.replace(/[€,.]/g, ""));
      return sum + (value * p.progress / 100);
    }, 0),
    averageAPY: projects.length > 0
      ? projects.reduce((sum, p) => sum + parseFloat(p.apy), 0) / projects.length
      : 0,
    totalInvestors: projects.reduce((sum, p) => sum + p.investors, 0),
  };

  return stats;
}
