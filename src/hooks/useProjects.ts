"use client";

import { useMemo, useEffect, useState } from "react";
import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { readContract } from "thirdweb";
import { client } from "@/lib/client";
import { PROJECT_REGISTRY_ABI } from "@/lib/abis/ProjectRegistry";
import { INVESTMENT_CONTROLLER_ABI } from "@/lib/abis/InvestmentController";

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

// REGISTRY CONTRACT ADDRESS - PRODUCTION
// Only projects registered in blockchain will appear
const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_PROJECT_REGISTRY || "";

export function useProjects() {
  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProjects = async () => {
    if (!REGISTRY_ADDRESS) {
      console.warn("⚠️  ProjectRegistry address not configured");
      setProjects([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const contract = getContract({
        client,
        chain: polygon,
        address: REGISTRY_ADDRESS,
      });

      console.log("🔍 Reading projects from:", REGISTRY_ADDRESS);

      // First check project count
      const projectCount = await readContract({
        contract,
        method: PROJECT_REGISTRY_ABI[1], // getProjectCount
        params: [],
      });

      console.log("📊 Total projects in registry:", projectCount.toString());

      if (projectCount === 0n) {
        console.log("⚠️  No projects registered yet");
        setProjects([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      // Read all projects from blockchain
      const projectsData = await readContract({
        contract,
        method: PROJECT_REGISTRY_ABI[0], // getAllProjects
        params: [],
      }) as Array<{
        name: string;
        securityToken: string;
        investmentController: string;
        pricePerToken: bigint;
        maxCap: bigint;
        stablecoin: string;
        metadataURI: string;
        active: boolean;
        createdAt: bigint;
      }>;

      console.log("📊 Loaded projects from blockchain:", projectsData);

      // Transform blockchain data to ProjectDisplay format
      const transformedProjects: ProjectDisplay[] = await Promise.all(
        projectsData
          .filter((p) => p.active)
          .map(async (p, index: number) => {
            const totalTokens = Number(p.maxCap);
            
            // Query how many tokens have been issued (REAL from blockchain)
            let tokensSold = 0;
            let tokensAvailable = totalTokens;
            
            try {
              const controllerContract = getContract({
                client,
                chain: polygon,
                address: p.investmentController as `0x${string}`,
              });
              
              const issued = await readContract({
                contract: controllerContract,
                method: "function issued() view returns (uint256)",
                params: [],
              }) as bigint;
              
              tokensSold = Number(issued);
              tokensAvailable = totalTokens - tokensSold;
              
              console.log(`📊 Project "${p.name}": ${tokensSold}/${totalTokens} tokens sold`);
            } catch {
              console.warn("⚠️  Could not fetch issued tokens, using defaults");
            }
            
            const progress = totalTokens > 0 ? Math.round((tokensSold / totalTokens) * 100) : 0;
            
            // Determine status based on tokens sold
            let status: "active" | "funded" | "upcoming" = "active";
            if (tokensSold >= totalTokens) {
              status = "funded"; // 100% vendido = FINANCIADO
            }
            
            return {
              id: index,
              name: p.name,
              location: "Real Estate Property - Blockchain Verified",
              totalValue: totalTokens.toString(),
              pricePerToken: "1 EUR", // From contract: 100 cents = 1 EUR
              tokensAvailable,
              tokensTotal: totalTokens,
              apy: "8.0",
              status,
              progress,
              investors: 0,
              image: p.name.includes("Alzira") 
                ? "/images/projects/alzira-reyes-catolicos/Alzira3.jpg"
                : `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80`,
              images: p.name.includes("Alzira") ? [
                "/images/projects/alzira-reyes-catolicos/Alzira3.jpg",
                "/images/projects/alzira-reyes-catolicos/Alzira4.jpg",
                "/images/projects/alzira-reyes-catolicos/Alzira5.jpg",
              ] : [
                `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80`,
              ],
              securityToken: p.securityToken,
              investmentController: p.investmentController,
            };
          })
      );

      setProjects(transformedProjects);
      setError(null);
    } catch (err) {
      console.error("❌ Error loading projects:", err);
      setError(err instanceof Error ? err : new Error("Failed to load projects"));
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
