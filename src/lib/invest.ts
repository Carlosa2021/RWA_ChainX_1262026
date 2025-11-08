import { getTw } from "@/lib/thirdweb";
import {
  readContract,
  prepareContractCall,
  type PreparedTransaction,
} from "thirdweb";
import { logger } from "@/lib/logger";

const CTRL = process.env.NEXT_PUBLIC_INVESTMENT_CONTROLLER as `0x${string}`;
const USDC = process.env.NEXT_PUBLIC_USDC as `0x${string}`;

// Verificar que las variables estén definidas
if (!CTRL || !USDC) {
  logger.warn('⚠️ Variables de entorno de inversión no configuradas:', {
    CTRL: !!CTRL,
    USDC: !!USDC,
    env: process.env.NODE_ENV,
  });
}

export async function quoteUSDC(tokens: bigint) {
  const ctrl = getTw(CTRL);
  return (await readContract({
    contract: ctrl,
    method: "function quoteUSDC(uint256) view returns (uint256)",
    params: [tokens],
  })) as bigint;
}

/** Obtiene el balance de USDC de una wallet */
export async function getUSDCBalance(walletAddress: string): Promise<bigint> {
  if (!USDC) {
    console.error('❌ NEXT_PUBLIC_USDC no está definido');
    throw new Error('Configuración de USDC faltante');
  }
  
  try {
    const usdc = getTw(USDC);
    const balance = await readContract({
      contract: usdc,
      method: "function balanceOf(address) view returns (uint256)",
      params: [walletAddress as `0x${string}`],
    });
    
    logger.info('✅ Balance USDC obtenido:', balance, 'para wallet:', walletAddress);
    return balance as bigint;
  } catch (error) {
    console.error('❌ Error obteniendo balance USDC:', error);
    throw error;
  }
}

/** Obtiene el allowance actual de USDC para el controller */
export async function getUSDCAllowance(walletAddress: string): Promise<bigint> {
  if (!USDC || !CTRL) {
    console.error('❌ USDC o CTRL no están definidos');
    throw new Error('Configuración faltante');
  }
  
  try {
    const usdc = getTw(USDC);
    const allowance = await readContract({
      contract: usdc,
      method: "function allowance(address owner, address spender) view returns (uint256)",
      params: [walletAddress as `0x${string}`, CTRL],
    });
    
    logger.info('✅ Allowance actual:', allowance, 'USDC');
    return allowance as bigint;
  } catch (error) {
    console.error('❌ Error obteniendo allowance:', error);
    throw error;
  }
}

/** Construye la tx de approve(CTRL, maxUsdcExpected) en USDC (6 decimales) */
export function txApproveUSDC(maxUsdcExpected: bigint): PreparedTransaction {
  if (!USDC || !CTRL) {
    throw new Error('Contracts not configured');
  }
  
  const usdc = getTw(USDC);
  return prepareContractCall({
    contract: usdc,
    method: "function approve(address spender, uint256 amount) returns (bool)",
    params: [CTRL as `0x${string}`, maxUsdcExpected],
  });
}

/** Construye la tx de invest(tokens, maxUsdcExpected) en el controller */
export function txInvest(tokens: bigint, maxUsdcExpected: bigint): PreparedTransaction {
  if (!CTRL) {
    throw new Error('Controller not configured');
  }
  
  const ctrl = getTw(CTRL);
  return prepareContractCall({
    contract: ctrl,
    method: "function invest(uint256 tokenAmount, uint256 maxUsdcExpected)",
    params: [tokens, maxUsdcExpected],
  });
}
