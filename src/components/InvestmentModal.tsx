"use client";

import { useState, useEffect } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { quoteUSDC, txApproveUSDC, txInvest } from "@/lib/invest";
import { formatUnits } from "viem";
import { X, Shield, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";

interface InvestmentModalProps {
  projectId: number;
  projectName: string;
  pricePerToken: string;
  isOpen: boolean;
  onClose: () => void;
  isKYCVerified: boolean;
}

export function InvestmentModal({
  projectId,
  projectName,
  pricePerToken,
  isOpen,
  onClose,
  isKYCVerified,
}: InvestmentModalProps) {
  const [step, setStep] = useState<"input" | "kyc" | "approve" | "invest" | "success">("input");
  const [qty, setQty] = useState("1");
  const [need, setNeed] = useState<bigint | null>(null);
  const [err, setErr] = useState<string | null>(null);
  
  const account = useActiveAccount();
  const { mutateAsync: sendTx, isPending } = useSendTransaction();

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

  const handleInvest = async () => {
    if (!account || !need) return;
    
    if (!isKYCVerified) {
      setStep("kyc");
      return;
    }

    try {
      setErr(null);
      
      // Step 1: Approve USDC
      setStep("approve");
      const maxUsdc = (need * 10100n) / 10000n;
      await sendTx(txApproveUSDC(maxUsdc));
      
      // Step 2: Invest
      setStep("invest");
      await sendTx(txInvest(BigInt(qty), maxUsdc));
      
      // Success
      setStep("success");
      
    } catch (e: unknown) {
      const error = e as { message?: string };
      setErr(error?.message || "Error en la transacción");
      setStep("input");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {step === "success" ? "¡Inversión Exitosa!" : "Invertir Ahora"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{projectName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
                  className="w-full rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white font-semibold text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="1"
                />
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Precio por token:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{pricePerToken}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Cantidad:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{qty} tokens</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-orange-300 dark:via-orange-700 to-transparent"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total USDC:</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                      {need !== null ? formatUnits(need, 6) : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {err && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{err}</p>
                </div>
              )}

              <button
                disabled={!account || need === null}
                onClick={handleInvest}
                className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Continuar
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
              <p className="text-gray-600 dark:text-gray-400">
                Confirma la transacción en tu wallet
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
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ¡Inversión Completada!
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Has adquirido {qty} tokens de {projectName}
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition-all"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
