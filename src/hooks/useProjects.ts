"use client";

import { useMemo } from "react";

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
  images?: string[];
  securityToken: string;
  investmentController: string;
}

// Interface para proyectos almacenados localmente (para futuro uso)
/*
interface StoredProject {
  id: number;
  name: string;
  symbol: string;
  description: string;
  location: string;
  totalValue: string;
  pricePerToken: string;
  maxTokens: string;
  expectedReturn: string;
  duration: string;
  propertyType: string;
  metadataURI: string;
  tokenAddress: string;
  controllerAddress: string;
  tokensAvailable: number;
  tokensTotal: number;
  apy: string;
  status: "active" | "funded" | "upcoming";
  progress: number;
  image: string;
  images?: string[];
  investors?: number;
}
*/

// Data estática - no cambiar nunca
const ALZIRA_PROJECT = {
  id: 1,
  name: "Inmueble Reyes Católicos Alzira",
  symbol: "RCA97-001",
  description: "Apartamento de lujo en pleno centro de Alzira. 6 habitaciones, salón, cocina, 2 baños independientes, patio cubierto central y solarium/terraza. Ubicado en las prestigiosas calles del centro histórico.",
  location: "Calle Reyes Católicos 97, 1º y 1ªA, Alzira, Valencia C.P. 46600, España",
  totalValue: "175000",
  pricePerToken: "1000",
  maxTokens: "175",
  expectedReturn: "8",
  duration: "3",
  propertyType: "Residencial - Apartamento",
  metadataURI: "ipfs://QmAlziraProject2025",
  tokenAddress: "0x1234567890123456789012345678901234567890",
  controllerAddress: "0x2345678901234567890123456789012345678901",
  distributorAddress: "0x3456789012345678901234567890123456789012",
  transactionHash: "0x4567890123456789012345678901234567890123456789012345678901234567",
  createdAt: "2025-10-15T15:06:54.986Z",
  status: "active" as const,
  images: [
    "/images/projects/alzira-reyes-catolicos/Alzira3.jpg",
    "/images/projects/alzira-reyes-catolicos/Alzira4.jpg",
    "/images/projects/alzira-reyes-catolicos/Alzira5.jpg",
    "/images/projects/alzira-reyes-catolicos/Alzira6.jpg",
    "/images/projects/alzira-reyes-catolicos/Alzira7.jpg",
    "/images/projects/alzira-reyes-catolicos/PHOTO-2024-07-25-19-10-43.jpg",
    "/images/projects/alzira-reyes-catolicos/PHOTO-2024-07-25-19-10-44.jpg",
    "/images/projects/alzira-reyes-catolicos/PHOTO-2024-07-25-19-10-45.jpg",
    "/images/projects/alzira-reyes-catolicos/PHOTO-2024-07-25-19-10-47.jpg",
    "/images/projects/alzira-reyes-catolicos/PHOTO-2024-07-25-19-10-49.jpg",
    "/images/projects/alzira-reyes-catolicos/Alzira_Planos1.jpg",
    "/images/projects/alzira-reyes-catolicos/Alzira_Planos2.jpg",
    "/images/projects/alzira-reyes-catolicos/PHOTO-2024-07-25-19-10-44%20(1).jpg",
    "/images/projects/alzira-reyes-catolicos/Alzira6%20-%20Kopie.jpg"
  ]
};

export function useProjects() {
  const projects = useMemo(() => {
    const displayProject: ProjectDisplay = {
      id: ALZIRA_PROJECT.id,
      name: ALZIRA_PROJECT.name,
      location: ALZIRA_PROJECT.location,
      totalValue: ALZIRA_PROJECT.totalValue,
      pricePerToken: ALZIRA_PROJECT.pricePerToken,
      tokensAvailable: parseInt(ALZIRA_PROJECT.maxTokens),
      tokensTotal: parseInt(ALZIRA_PROJECT.maxTokens),
      apy: ALZIRA_PROJECT.expectedReturn + "%",
      status: ALZIRA_PROJECT.status,
      progress: 0,
      investors: 0,
      image: ALZIRA_PROJECT.images[0],
      images: ALZIRA_PROJECT.images,
      securityToken: ALZIRA_PROJECT.tokenAddress,
      investmentController: ALZIRA_PROJECT.controllerAddress,
    };
    
    return [displayProject];
  }, []);

  return {
    projects,
    projectsRaw: projects,
    projectCount: projects.length,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
}

export function useProject(projectId: number) {
  const { projects } = useProjects();
  
  const project = useMemo(() => {
    return projects.find(p => p.id === projectId) || null;
  }, [projects, projectId]);
  
  return {
    project,
    projectRaw: project,
    isLoading: false,
    error: null,
  };
}

export function useProjectStats() {
  const stats = useMemo(() => ({
    totalProjects: 1,
    activeProjects: 1,
    totalValueLocked: 175000,
    averageAPY: 8,
    totalInvestors: 0,
  }), []);

  return stats;
}
