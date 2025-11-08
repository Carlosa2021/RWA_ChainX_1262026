"use client";

import { useMemo, useEffect, useState } from "react";
import { getContract, defineChain } from "thirdweb";
import { readContract } from "thirdweb";
import { client } from "@/lib/client";
import { logger } from "@/lib/logger";

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

// DIRECT PROJECT CONFIGURATION (No Registry Needed)
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN || "";
const INVESTMENT_CONTROLLER = process.env.NEXT_PUBLIC_INVESTMENT_CONTROLLER || "";
const polygon = defineChain(137);

export function useProjects() {
  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProjects = async () => {
    if (!SECURITY_TOKEN || !INVESTMENT_CONTROLLER) {
      logger.warn("??  Contract addresses not configured");
      setProjects([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Load project data from InvestmentController
      const investmentContract = getContract({
        client,
        chain: polygon,
        address: INVESTMENT_CONTROLLER as `0x${string}`,
      });

      logger.info("?? Loading project from InvestmentController:", INVESTMENT_CONTROLLER);

      // Get project data from InvestmentController
      const [hardCap, priceEuroCents, issued] = await Promise.all([
        readContract({
          contract: investmentContract,
          method: "function hardCap() view returns (uint256)",
          params: [],
        }) as Promise<bigint>,
        readContract({
          contract: investmentContract,
          method: "function priceEuroCents() view returns (uint256)",
          params: [],
        }) as Promise<bigint>,
        readContract({
          contract: investmentContract,
          method: "function issued() view returns (uint256)",
          params: [],
        }) as Promise<bigint>,
      ]);

      const totalTokens = Number(hardCap);
      const tokensSold = Number(issued);
      const tokensAvailable = totalTokens - tokensSold;
      const progress = totalTokens > 0 ? Math.round((tokensSold / totalTokens) * 100) : 0;
      const priceEur = Number(priceEuroCents) / 100;
      
      // Determine status
      let status: "active" | "funded" | "upcoming" = "active";
      if (tokensSold >= totalTokens) {
        status = "funded";
      }

      logger.info(`?? Project: ${tokensSold}/${totalTokens} tokens sold (${progress}%)`);

      const project: ProjectDisplay = {
        id: 0,
        name: "ChainX Test InmoToken",
        location: "Test Property - Polygon Mainnet",
        totalValue: (totalTokens * priceEur).toString(),
        pricePerToken: `${priceEur} EUR`,
        tokensAvailable,
        tokensTotal: totalTokens,
        apy: "0.0",
        status,
        progress,
        investors: 0,
        image: "/images/projects/alzira-reyes-catolicos/Alzira3.jpg",
        images: [
          "/images/projects/alzira-reyes-catolicos/Alzira3.jpg",
          "/images/projects/alzira-reyes-catolicos/Alzira4.jpg",
          "/images/projects/alzira-reyes-catolicos/Alzira5.jpg",
          "/images/projects/alzira-reyes-catolicos/Alzira6.jpg",
          "/images/projects/alzira-reyes-catolicos/Alzira7.jpg",
          "/images/projects/alzira-reyes-catolicos/Alzira_Planos1.jpg",
          "/images/projects/alzira-reyes-catolicos/Alzira_Planos2.jpg"
        ],
        securityToken: SECURITY_TOKEN,
        investmentController: INVESTMENT_CONTROLLER,
      };

      setProjects([project]);
      setError(null);
    } catch (err) {
      console.error("? Error loading project:", err);
      setError(err instanceof Error ? err : new Error("Failed to load project"));
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    projectsRaw: projects,
    projectCount: projects.length,
    isLoading,
    error,
    refetch: loadProjects,
  };
}

export function useProject(projectId: number) {
  const { projects, isLoading, error } = useProjects();
  
  const project = useMemo(() => {
    return projects.find(p => p.id === projectId) || null;
  }, [projects, projectId]);
  
  return {
    project,
    projectRaw: project,
    isLoading,
    error,
  };
}

export function useProjectStats() {
  const { projects, isLoading } = useProjects();
  
  const stats = useMemo(() => {
    if (isLoading || projects.length === 0) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        totalValueLocked: 0,
        averageAPY: 0,
        totalInvestors: 0,
      };
    }

    const activeProjects = projects.filter(p => p.status === "active");
    const totalValue = projects.reduce((sum, p) => sum + Number(p.totalValue), 0);
    const avgAPY = projects.reduce((sum, p) => sum + Number(p.apy), 0) / projects.length;
    const totalInvestors = projects.reduce((sum, p) => sum + p.investors, 0);

    return {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      totalValueLocked: totalValue,
      averageAPY: Number(avgAPY.toFixed(1)),
      totalInvestors,
    };
  }, [projects, isLoading]);

  return stats;
}
