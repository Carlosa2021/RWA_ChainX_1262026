"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { 
  Calendar, 
  DollarSign, 
  // Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2,
  Send,
  History
} from "lucide-react";
import { toast } from "sonner";

interface PayoutSchedule {
  projectName: string;
  projectAddress: string;
  fundingCompletedDate: string;
  nextPayoutDate: string;
  monthlyAmount: number;
  totalInvestors: number;
  status: "pending" | "ready" | "distributed";
}

interface PayoutHistory {
  id: number;
  projectName: string;
  amount: number;
  distributedDate: string;
  investorCount: number;
  transactionHash: string;
}

export default function PagosAdmin() {
  const { isOwner } = useAuth();
  const [schedules, setSchedules] = useState<PayoutSchedule[]>([]);
  const [history, setHistory] = useState<PayoutHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 🎭 DEMO MODE: Permitir carga sin verificación de owner
    // if (!isOwner) return;
    
    // Mock data para el inmueble de Reyes Católicos 97, Alzira
    const alzirapayoutSchedule: PayoutSchedule = {
      projectName: "Inmueble Reyes Católicos Alzira",
      projectAddress: "0x...", // Se actualizará cuando se registre el proyecto
      fundingCompletedDate: "2025-03-15", // Estimado cuando se complete la financiación
      nextPayoutDate: "2025-05-15", // 2 meses después
      monthlyAmount: 1166.67, // €175,000 * 8% / 12 meses = €1,166.67/mes
      totalInvestors: 0, // Se actualizará según inversiones
      status: "pending"
    };

    setSchedules([alzirapayoutSchedule]);
  }, [isOwner]);

  const calculateDaysUntilPayout = (nextPayoutDate: string) => {
    const today = new Date();
    const payoutDate = new Date(nextPayoutDate);
    const diffTime = payoutDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "ready": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "distributed": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "ready": return <AlertTriangle className="w-4 h-4" />;
      case "distributed": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleDistributePayout = async (schedule: PayoutSchedule) => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para distribuir el pago usando el contrato PayoutDistributor
      toast.success(`Pago de €${schedule.monthlyAmount.toFixed(2)} distribuido exitosamente`);
      
      // Actualizar el schedule
      setSchedules(prev => prev.map(s => 
        s.projectName === schedule.projectName 
          ? { ...s, status: "distributed" as const } 
          : s
      ));

      // Agregar al historial
      const newHistoryEntry: PayoutHistory = {
        id: history.length + 1,
        projectName: schedule.projectName,
        amount: schedule.monthlyAmount,
        distributedDate: new Date().toISOString().split('T')[0],
        investorCount: schedule.totalInvestors,
        transactionHash: "0x" + Math.random().toString(16).substr(2, 64)
      };
      
      setHistory(prev => [newHistoryEntry, ...prev]);
      
    } catch (error) {
      console.error("Error distribuyendo pago:", error);
      toast.error("Error al distribuir el pago");
    } finally {
      setIsLoading(false);
    }
  };

  // 🎭 DEMO MODE: Acceso completo sin restricciones
  // if (!isOwner) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
  //         <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
  //           Acceso Denegado
  //         </h1>
  //         <p className="text-gray-600 dark:text-gray-400">
  //           Solo el propietario puede acceder a la gestión de pagos.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Pagos
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Administra la distribución de ganancias a inversores
                  </p>
            </div>
          </div>
        </div>

        {/* Programación de Pagos */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Programación de Pagos Mensuales
            </h2>
          </div>

          <div className="space-y-4">
            {schedules.map((schedule, index) => {
              const daysUntil = calculateDaysUntilPayout(schedule.nextPayoutDate);
              const isReady = daysUntil <= 0 && schedule.status === "pending";
              
              return (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {schedule.projectName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Rentabilidad: 8% anual
                        </p>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(isReady ? "ready" : schedule.status)}`}>
                      {getStatusIcon(isReady ? "ready" : schedule.status)}
                      {isReady ? "Listo para distribuir" : 
                       schedule.status === "pending" ? "Pendiente" :
                       schedule.status === "distributed" ? "Distribuido" : "Pendiente"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Financiación Completa</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(schedule.fundingCompletedDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Próximo Pago</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(schedule.nextPayoutDate).toLocaleDateString('es-ES')}
                      </p>
                      <p className={`text-sm ${daysUntil <= 0 ? 'text-green-600' : 'text-gray-500'}`}>
                        {daysUntil <= 0 ? '¡Disponible ahora!' : `En ${daysUntil} días`}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cantidad Mensual</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        €{schedule.monthlyAmount.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Inversores</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {schedule.totalInvestors}
                      </p>
                    </div>
                  </div>

                  {isReady && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleDistributePayout(schedule)}
                        disabled={isLoading}
                        className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Distribuir Pago Mensual
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Historial de Pagos */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Historial de Pagos
            </h2>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No hay pagos distribuidos
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Los pagos distribuidos aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Proyecto</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Cantidad</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Inversores</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Transacción</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                        {payment.projectName}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        €{payment.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {new Date(payment.distributedDate).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {payment.investorCount}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-mono text-sm">
                        {payment.transactionHash.slice(0, 10)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </div>
        </main>
      </div>
    </div>
  );
}