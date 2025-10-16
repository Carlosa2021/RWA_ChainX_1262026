import { createThirdwebClient } from "thirdweb";

// Crear cliente thirdweb para AI y Payments
export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id-here",
  secretKey: process.env.THIRDWEB_SECRET_KEY, // Solo para server-side
});

// Configuración para el entorno
export const clientConfig = {
  // Usar client ID de demo por ahora - deberás reemplazarlo
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id",
  
  // Configuración de AI
  ai: {
    model: "blockchain-llm",
    maxTokens: 2048,
    temperature: 0.7,
  },
  
  // Configuración de pagos
  payments: {
    supportedCurrencies: ["EUR", "USD", "USDC", "USDT"],
    supportedChains: [1, 137, 8453], // Ethereum, Polygon, Base
    defaultChain: 137, // Polygon por defecto
  }
};

// Helper para crear cliente con configuración específica
export function createRWAClient(config?: Partial<typeof clientConfig>) {
  return createThirdwebClient({
    clientId: config?.clientId || clientConfig.clientId,
  });
}