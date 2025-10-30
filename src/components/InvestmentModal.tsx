"use client";

import { useState, useEffect } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { quoteUSDC, txApproveUSDC, txInvest, getUSDCBalance, getUSDCAllowance } from "@/lib/invest";
import { formatUnits } from "viem";
import { X, Shield, CheckCircle, AlertCircle, Loader2, ArrowRight, Wallet, Plus } from "lucide-react";

interface InvestmentModalProps {
  projectName: string;
  pricePerToken: string;
  tokenAddress: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback to refresh projects
  isKYCVerified: boolean;
}

export function InvestmentModal({
  projectName,
  pricePerToken,
  tokenAddress,
  isOpen,
  onClose,
  onSuccess,
  isKYCVerified,
}: InvestmentModalProps) {
  const [step, setStep] = useState<"input" | "kyc" | "approve" | "invest" | "success">("input");
  const [qty, setQty] = useState("1");
  const [need, setNeed] = useState<bigint | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<bigint | null>(null);
  
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();

  const addTokenToWallet = async () => {
    if (!window.ethereum || !tokenAddress) {
      console.log("Metamask not available or token address missing");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: "RET",
            decimals: 0,
            image: "https://chainx.ch/logo.png",
          },
        },
      });
      console.log("✅ Token added to wallet");
    } catch (error) {
      console.log("Token not added:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setStep("input");
      setErr(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const t = BigInt(qty || "0");
    if (t > 0n) {
      quoteUSDC(t).then(setNeed).catch(() => setNeed(null));
    }
  }, [qty]);

  // Cargar balance de USDC cuando se conecta una wallet
  useEffect(() => {
    if (account?.address && isOpen) {
      getUSDCBalance(account.address).then(setUsdcBalance).catch(() => setUsdcBalance(null));
    }
  }, [account?.address, isOpen]);

  const handleInvest = async () => {
    if (!account || !need) return;
    
    if (!isKYCVerified) {
      setStep("kyc");
      return;
    }

    try {
      setErr(null);
      
      // Calcular USDC necesario con 5% slippage (máximo del contrato)
      const maxUsdc = (need * 10500n) / 10000n;
      
      // Verificar allowance actual
      const currentAllowance = await getUSDCAllowance(account.address);
      console.log("🔍 Allowance actual:", currentAllowance.toString(), "USDC (6 decimales)");
      console.log("🔍 Necesario:", maxUsdc.toString(), "USDC (6 decimales)");
      
      // Solo aprobar si el allowance es insuficiente
      if (currentAllowance < maxUsdc) {
        console.log("⚠️ Allowance insuficiente, aprobando...");
        setStep("approve");
        const txReceipt = await sendTx(txApproveUSDC(maxUsdc));
        console.log("✅ Approve enviado, esperando confirmación en Polygon...");
        console.log("📝 TX Hash:", txReceipt.transactionHash);
        
        // Esperar 15 segundos para ASEGURAR confirmación en Polygon
        // Polygon tarda ~2-3 segundos por bloque, esperamos ~5-6 bloques
        console.log("⏳ Esperando 15 segundos para confirmación total...");
        await new Promise(resolve => setTimeout(resolve, 15000));
        console.log("✅ Approve 100% confirmado en blockchain");
      } else {
        console.log("✅ Ya hay suficiente allowance, omitiendo approve");
      }
      
      // Step 2: Invest
      console.log("💰 Iniciando invest...");
      setStep("invest");
      await sendTx(txInvest(BigInt(qty), maxUsdc));
      
      // Success - Agregar token automáticamente
      setStep("success");
      
      // Auto-agregar token a Metamask
      setTimeout(async () => {
        try {
          await addTokenToWallet();
        } catch {
          console.log("Token not added to wallet");
        }
      }, 1000);
      
      // Refrescar proyectos después de 3 segundos
      if (onSuccess) {
        setTimeout(() => onSuccess(), 3000);
      }
      
    } catch (e: unknown) {
      const error = e as { message?: string };
      setErr(error?.message || "Error en la transacción");
      setStep("input");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200/50 dark:border-gray-800/50 animate-in zoom-in-95 duration-200">
        {/* Header - Apple style */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {step === "success" ? "¡Inversión Exitosa!" : "Invertir Ahora"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{projectName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* KYC Warning */}
          {step === "kyc" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Verificación KYC Requerida
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Para cumplir con MiCA, debes completar tu KYC antes de invertir
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("input")}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => window.location.href = "/kyc"}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Completar KYC
                </button>
              </div>
            </div>
          )}

          {/* Input Amount */}
          {step === "input" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de tokens
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-5 py-4 text-gray-900 dark:text-white font-semibold text-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                  placeholder="1"
                />
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/30">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Precio por token:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{pricePerToken}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Cantidad:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{qty} tokens</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800 to-transparent"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total USDC:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {need !== null ? formatUnits(need, 6) : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Balance de USDC en wallet */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Tu balance USDC:
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                    {usdcBalance !== null ? formatUnits(usdcBalance, 6) : "..."} USDC
                  </span>
                </div>
                {need !== null && usdcBalance !== null && need > usdcBalance && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                    ⚠️ Balance insuficiente para esta inversión
                  </div>
                )}
              </div>

              {err && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{err}</p>
                </div>
              )}

              <button
                disabled={!account || need === null || (usdcBalance !== null && need !== null && need > usdcBalance)}
                onClick={handleInvest}
                className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {usdcBalance !== null && need !== null && need > usdcBalance ? "Balance Insuficiente" : "Continuar"}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                💱 Conversión EUR→USDC vía Chainlink • 🔒 ERC-3643 Compliance
              </p>
            </div>
          )}

          {/* Approve Step */}
          {step === "approve" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Aprobando USDC...
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Confirma la transacción en tu wallet
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                ⏳ Esperando confirmación en Polygon (~15 segundos)
              </p>
            </div>
          )}

          {/* Invest Step */}
          {step === "invest" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Procesando Inversión...
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Emitiendo tokens ERC-3643 a tu wallet
              </p>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ¡Inversión Completada!
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Has adquirido {qty} tokens de {projectName}
              </p>
              
              {/* Botón para agregar token a Metamask */}
              <button
                onClick={addTokenToWallet}
                className="w-full mb-3 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar Token a Metamask
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition-all"
              >
                Ver Mi Inversión
              </button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                💡 Agrega el token a tu wallet para ver tu balance fácilmente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
