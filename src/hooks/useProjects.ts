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

// Mapeo de metadataURI a datos adicionales (ubicación, APY, imágenes profesionales)
const PROJECT_METADATA: Record<string, {
  location: string;
  apy: string;
  image: string;
  investors: number;
}> = {
  "ipfs://QmApartamentoMadrid": {
    location: "Madrid, Calle Gran Vía 28",
    apy: "7.5%",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", // Apartamento moderno Madrid
    investors: 23
  },
  "ipfs://QmCasaBarcelona": {
    location: "Barcelona, Passeig de Gràcia 92",
    apy: "6.8%",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", // Casa moderna Barcelona
    investors: 35
  },
  "ipfs://QmLocalValencia": {
    location: "Valencia, Avenida del Puerto 15",
    apy: "8.2%",
    image: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80", // Local comercial moderno
    investors: 18
  }
};

/**
 * Hook to fetch all projects from blockchain
 */
export function useProjects() {
  const contract = getContract({
    client,
    chain,
    address: CONTRACTS.projectRegistry as `0x${string}`,
    abi: PROJECT_REGISTRY_ABI,
  });

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "getActiveProjects",
    params: [],
  });

  const { data: projectCount } = useReadContract({
    contract,
    method: "getProjectCount",
    params: [],
  });

  // Transformar datos del contrato a formato de UI
  const projectsDisplay: ProjectDisplay[] = data ? (data as Project[]).map((project, index) => {
    const metadata = PROJECT_METADATA[project.metadataURI] || {
      location: "Ubicación desconocida",
      apy: "8%",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      investors: 0
    };

    // Convertir pricePerToken de eurocents a euros
    const priceInEuros = Number(project.pricePerToken) / 100;
    
    // Calcular valor total (maxCap tokens * precio en euros)
    const totalValueEuros = Number(project.maxCap) * priceInEuros;

    // Mock: calcular tokens vendidos (en producción leer de InvestmentController.issued)
    const mockTokensSold = Math.floor(Number(project.maxCap) * (0.3 + Math.random() * 0.4));
    const tokensAvailable = Number(project.maxCap) - mockTokensSold;
    const progress = Math.round((mockTokensSold / Number(project.maxCap)) * 100);

    return {
      id: index,
      name: project.name,
      location: metadata.location,
      totalValue: `€${totalValueEuros.toLocaleString("es-ES")}`,
      pricePerToken: `€${priceInEuros.toLocaleString("es-ES")}`,
      tokensAvailable,
      tokensTotal: Number(project.maxCap),
      apy: metadata.apy,
      status: tokensAvailable > 0 ? "active" : "funded",
      progress,
      investors: metadata.investors,
      image: metadata.image,
      securityToken: project.securityToken,
      investmentController: project.investmentController,
    };
  }) : [];

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
