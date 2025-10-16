import { getTw } from "@/lib/thirdweb";
import {
  readContract,
  prepareContractCall,
  type PreparedTransaction,
} from "thirdweb";

const CTRL = process.env.NEXT_PUBLIC_CONTROLLER as `0x${string}`;
const USDC = process.env.NEXT_PUBLIC_USDC as `0x${string}`;

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
  const usdc = getTw(USDC);
  return (await readContract({
    contract: usdc,
    method: "function balanceOf(address) view returns (uint256)",
    params: [walletAddress as `0x${string}`],
  })) as bigint;
}

/** Construye la tx de approve(CTRL, maxUsdcExpected) en USDC (6 decimales) */
export function txApproveUSDC(maxUsdcExpected: bigint): PreparedTransaction {
  const usdc = getTw(USDC);
  return prepareContractCall({
    contract: usdc,
    method: "function approve(address,uint256) returns (bool)",
    params: [CTRL, maxUsdcExpected],
  });
}

/** Construye la tx de invest(tokens, maxUsdcExpected) en el controller */
export function txInvest(tokens: bigint, maxUsdcExpected: bigint): PreparedTransaction {
  const ctrl = getTw(CTRL);
  return prepareContractCall({
    contract: ctrl,
    method: "function invest(uint256,uint256)",
    params: [tokens, maxUsdcExpected],
  });
}
