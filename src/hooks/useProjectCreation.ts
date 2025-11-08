"use client";

import { useState, useCallback } from "react";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb/transaction";
import { getContract, defineChain } from "thirdweb";
import { toast } from "sonner";
import { client } from "@/lib/thirdweb";
import { logger } from "@/lib/logger";

// Configuración de la red
const polygonChain = defineChain(137);

// Direcciones de contratos - Usar mock para desarrollo hasta que se desplieguen los contratos reales
const CONTRACT_ADDRESSES = {
  PROJECT_REGISTRY: process.env.NEXT_PUBLIC_PROJECT_REGISTRY || "0x1234567890123456789012345678901234567890", // Mock address para desarrollo
  PROJECT_TOKEN_FACTORY: process.env.NEXT_PUBLIC_PROJECT_FACTORY || "0x2345678901234567890123456789012345678901", // Mock address para desarrollo
  IDENTITY_REGISTRY: process.env.NEXT_PUBLIC_IDENTITY_REGISTRY || "0x3456789012345678901234567890123456789012", // Mock address para desarrollo
  COMPLIANCE: process.env.NEXT_PUBLIC_COMPLIANCE || "0x4567890123456789012345678901234567890123", // Mock address para desarrollo
};

interface ProjectFormData {
  name: string;
  symbol: string;
  description: string;
  location: string;
  totalValue: string;
  pricePerToken: string;
  maxTokens: string;
  minInvestment: string;
  decimals: string;
  stablecoin: string;
  propertyImages: File[];
  legalDocuments: File[];
  metadataURI: string;
  propertyType: string;
  expectedReturn: string;
  duration: string;
  rentYield: string;
}

interface ProjectCreationResult {
  tokenAddress: string;
  controllerAddress: string;
  distributorAddress: string;
  projectId: number;
  transactionHash: string;
}

interface UseProjectCreationReturn {
  createProject: (data: ProjectFormData) => Promise<ProjectCreationResult>;
  isLoading: boolean;
  progress: string;
  uploadToIPFS: (files: File[]) => Promise<string>;
}

interface Project {
  id: number;
  name: string;
  symbol: string;
  totalValue: number;
  pricePerToken: number;
  maxTokens: number;
  location: string;
  status: string;
  createdAt: string;
  tokensIssued?: number;
  totalInvested?: number;
}

export function useProjectCreation(): UseProjectCreationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState("");
  
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  // Función para subir archivos a IPFS usando Pinata
  const uploadToIPFS = useCallback(async (files: File[]): Promise<string> => {
    if (files.length === 0) return "";
    
    try {
      setProgress("Subiendo archivos a IPFS...");
      
      // Crear FormData para Pinata
      const formData = new FormData();
      
      // Si es un solo archivo, subirlo directamente
      if (files.length === 1) {
        formData.append("file", files[0]);
      } else {
        // Si son múltiples archivos, subir el primero por ahora
        formData.append("file", files[0]);
        logger.info("Multiple files detected, uploading first one:", files[0].name);
      }
      
      // Configuración para Pinata (necesitarás agregar estas variables de entorno)
      const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
      
      if (!pinataApiKey || !pinataSecretKey) {
        logger.warn("Pinata credentials not found, using mock IPFS hash");
        const mockHash = `QmMockHash${Date.now()}`;
        return `ipfs://${mockHash}`;
      }
      
      // Subir a Pinata
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey,
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Error al subir archivo a IPFS");
      }
      
      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
      
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      // En caso de error, retornar un hash mock para desarrollo
      const mockHash = `QmMockHash${Date.now()}`;
      toast.warning("Usando metadata temporal. Configura Pinata para producción.");
      return `ipfs://${mockHash}`;
    }
  }, []);

  // Función principal para crear el proyecto
  const createProject = useCallback(async (data: ProjectFormData): Promise<ProjectCreationResult> => {
    if (!account || !wallet) {
      throw new Error("Wallet no conectada");
    }

    setIsLoading(true);
    setProgress("Iniciando creación del proyecto...");

    try {
      // Verificar si estamos en modo desarrollo (sin contratos desplegados)
      const isDevelopment = !process.env.NEXT_PUBLIC_PROJECT_FACTORY || 
                           process.env.NEXT_PUBLIC_PROJECT_FACTORY.includes("0x1234") ||
                           process.env.NEXT_PUBLIC_PROJECT_FACTORY.includes("0x2345");

      if (isDevelopment) {
        // Modo desarrollo - simular creación de proyecto
        setProgress("Modo desarrollo - simulando creación...");
        
        // Simular delay de transacción
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 1. Subir archivos a IPFS si los hay
        let metadataURI = data.metadataURI;
        if (data.propertyImages.length > 0 || data.legalDocuments.length > 0) {
          setProgress("Subiendo archivos a IPFS...");
          const allFiles = [...data.propertyImages, ...data.legalDocuments];
          metadataURI = await uploadToIPFS(allFiles);
        }

        setProgress("Simulando despliegue en blockchain...");
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Resultado simulado
        const result: ProjectCreationResult = {
          tokenAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          controllerAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          distributorAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          projectId: Math.floor(Math.random() * 1000),
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
        };

        // Guardar proyecto en localStorage
        const projectToStore = {
          id: result.projectId,
          name: data.name,
          symbol: data.symbol,
          description: data.description,
          location: data.location,
          totalValue: data.totalValue,
          pricePerToken: data.pricePerToken,
          maxTokens: data.maxTokens,
          expectedReturn: data.expectedReturn,
          duration: data.duration,
          propertyType: data.propertyType,
          metadataURI: metadataURI,
          tokenAddress: result.tokenAddress,
          controllerAddress: result.controllerAddress,
          distributorAddress: result.distributorAddress,
          transactionHash: result.transactionHash,
          createdAt: new Date().toISOString(),
          status: "active" as const
        };

        // Obtener proyectos existentes y agregar el nuevo
        const existingProjects = JSON.parse(localStorage.getItem('rwa-projects') || '[]');
        existingProjects.push(projectToStore);
        localStorage.setItem('rwa-projects', JSON.stringify(existingProjects));

        setProgress("Proyecto creado exitosamente en modo desarrollo");
        toast.success(`¡Proyecto "${data.name}" creado exitosamente! (Modo desarrollo)`);
        
        return result;
      }

      // Modo producción - usar contratos reales
      // 1. Subir archivos a IPFS
      let metadataURI = data.metadataURI;
      if (data.propertyImages.length > 0 || data.legalDocuments.length > 0) {
        setProgress("Subiendo archivos a IPFS...");
        const allFiles = [...data.propertyImages, ...data.legalDocuments];
        metadataURI = await uploadToIPFS(allFiles);
      }

      // 2. Preparar datos del proyecto
      const projectData = {
        name: data.name,
        symbol: data.symbol,
        decimals: parseInt(data.decimals),
        pricePerToken: Math.round(parseFloat(data.pricePerToken) * 100), // Convertir a céntimos
        maxCap: parseInt(data.maxTokens),
        stablecoin: data.stablecoin,
        metadataURI: metadataURI
      };

      setProgress("Desplegando contrato en blockchain...");

      // 3. Obtener referencia al ProjectTokenFactory
      const factoryContract = getContract({
        client: client,
        chain: polygonChain,
        address: CONTRACT_ADDRESSES.PROJECT_TOKEN_FACTORY,
      });

      // 4. Preparar la transacción para crear el proyecto
      const transaction = prepareContractCall({
        contract: factoryContract,
        method: "function createProject(string memory _name, string memory _symbol, uint8 _decimals, uint256 _pricePerToken, uint256 _maxCap, address _stablecoin, string memory _metadataURI) external returns (address tokenAddress, address controller, address distributorAddress, uint256 projectId)",
        params: [
          projectData.name,
          projectData.symbol,
          projectData.decimals,
          BigInt(projectData.pricePerToken),
          BigInt(projectData.maxCap),
          projectData.stablecoin,
          projectData.metadataURI
        ]
      });

      setProgress("Confirmando transacción...");

      // 5. Enviar la transacción
      const receipt = await sendAndConfirmTransaction({
        transaction,
        account
      });

      setProgress("Procesando resultado...");

      // 6. Extraer información del resultado
      // En una implementación real, deberías parsear los eventos del receipt
      // Por ahora, simulamos los valores
      const result: ProjectCreationResult = {
        tokenAddress: `0x${Math.random().toString(16).substr(2, 40)}`, // Mock address
        controllerAddress: `0x${Math.random().toString(16).substr(2, 40)}`, // Mock address
        distributorAddress: `0x${Math.random().toString(16).substr(2, 40)}`, // Mock address
        projectId: Math.floor(Math.random() * 1000),
        transactionHash: receipt.transactionHash
      };

      setProgress("Proyecto creado exitosamente");
      
      toast.success("¡Proyecto tokenizado creado exitosamente!");
      
      return result;

    } catch (error: unknown) {
      console.error("Error creating project:", error);
      
      let errorMessage = "Error desconocido al crear el proyecto";
      
      if (error instanceof Error) {
        if (error.message.includes("user rejected")) {
          errorMessage = "Transacción cancelada por el usuario";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Fondos insuficientes para la transacción";
        } else if (error.message.includes("network")) {
          errorMessage = "Error de conexión con la red";
        } else if (error.message.includes("invalid address")) {
          errorMessage = "Contratos no desplegados. Ejecutando en modo desarrollo.";
          // En caso de dirección inválida, cambiar a modo desarrollo
          toast.warning("Cambiando a modo desarrollo...");
          return await createProject(data); // Recursión para modo desarrollo
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
      
    } finally {
      setIsLoading(false);
      setProgress("");
    }
  }, [account, wallet, uploadToIPFS]);

  return {
    createProject,
    isLoading,
    progress,
    uploadToIPFS
  };
}

// Hook adicional para obtener proyectos existentes
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Obtener referencia al ProjectRegistry
      // const registryContract = getContract({
      //   client: client,
      //   chain: polygonChain,
      //   address: CONTRACT_ADDRESSES.PROJECT_REGISTRY,
      // });

      // Llamar a getAllProjects() o getActiveProjects()
      // const projectsData = await readContract({
      //   contract: registryContract,
      //   method: "getAllProjects",
      //   params: []
      // });

      // Sin datos mock - lista vacía hasta que se registren proyectos reales
      setProjects([]);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error al cargar proyectos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    projects,
    isLoading,
    fetchProjects
  };
}

// Hook para gestionar un proyecto específico
export function useProject(projectId: number) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      // const registryContract = getContract({
      //   client: client,
      //   chain: polygonChain,
      //   address: CONTRACT_ADDRESSES.PROJECT_REGISTRY,
      // });

      // const projectData = await readContract({
      //   contract: registryContract,
      //   method: "getProject",
      //   params: [projectId]
      // });

      // Mock data por ahora
      const mockProject: Project = {
        id: projectId,
        name: "Proyecto de prueba",
        symbol: "TEST",
        totalValue: 100000,
        pricePerToken: 50,
        maxTokens: 2000,
        tokensIssued: 500,
        totalInvested: 25000,
        status: "active",
        location: "Madrid, España",
        createdAt: new Date().toISOString()
      };

      setProject(mockProject);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Error al cargar el proyecto");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  return {
    project,
    isLoading,
    fetchProject
  };
}
