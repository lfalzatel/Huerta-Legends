"use client";

import React, { useEffect, useState } from "react";
import { ResourceBar } from "@/components/game/ResourceBar";
import { MainNav } from "@/components/layout/main-nav";
import { GamePanel } from "@/components/game/GamePanel";
import { useSales } from "@/lib/hooks/useSales";
import { useProducts } from "@/lib/hooks/useProducts";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Trophy, BarChart3, Crown, Shield, Award, Sparkles } from "lucide-react";

export default function ResumenPage() {
  const { sales, loading: loadingSales } = useSales();
  const { lowStockCount } = useProducts();
  const [usersLeaderboard, setUsersLeaderboard] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Escuchar usuarios para el Podio de Héroes
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("xp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as UserProfile);
      });
      setUsersLeaderboard(list);
      setLoadingUsers(false);
    });

    return () => unsubscribe();
  }, []);

  // Datos para Gráfico 1: Ventas por Método de Pago
  const paymentMethodDataMap: Record<string, number> = {};
  sales.forEach((s) => {
    if (s.status === "completada") {
      paymentMethodDataMap[s.paymentMethod] =
        (paymentMethodDataMap[s.paymentMethod] || 0) + s.totalAmount;
    }
  });

  const paymentChartData = Object.keys(paymentMethodDataMap).map((method) => ({
    name: method.toUpperCase(),
    total: paymentMethodDataMap[method],
  }));

  const COLORS = ["#3FA845", "#F2B33D", "#7B4BE0", "#5BC8F5", "#E0453E"];

  // Top 3 Héroes del Podio
  const top1 = usersLeaderboard[0];
  const top2 = usersLeaderboard[1];
  const top3 = usersLeaderboard[2];

  return (
    <div className="min-h-screen bg-[#5BC8F5] flex flex-col font-game pb-12">
      <ResourceBar lowStockCount={lowStockCount} />
      <MainNav />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-6">
        <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-3xl p-6 shadow-[0_8px_0_#C1871F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#8B5A2B] tracking-wide flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-[#3FA845]" /> REPORTES & PODIO DE HÉROES
            </h1>
            <p className="text-xs sm:text-sm text-[#2B2118] font-bold">
              Estadísticas visuales de rendimiento y tabla de clasificación general por XP.
            </p>
          </div>
        </div>

        {/* PODIO DE LOS 3 PRIMEROS HÉROES */}
        <GamePanel title="🏆 Podio de Héroes de la Huerta" icon={<Trophy className="w-6 h-6 text-[#F2B33D]" />}>
          {loadingUsers ? (
            <p className="text-center text-sm font-bold text-[#8B5A2B] py-8">
              Cargando tabla de posiciones...
            </p>
          ) : usersLeaderboard.length === 0 ? (
            <p className="text-center text-xs italic text-gray-500 py-4">
              Aún no hay usuarios suficientes para el podio.
            </p>
          ) : (
            <div className="flex flex-col gap-8 py-4">
              {/* Estructura del Podio 3D */}
              <div className="flex justify-center items-end gap-3 sm:gap-6 pt-8 pb-2">
                {/* 2do Lugar — Plata */}
                {top2 ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-200 border-2 border-slate-400 rounded-full p-2 mb-2 shadow-md">
                      <Crown className="w-6 h-6 text-slate-500" />
                    </div>
                    <span className="font-extrabold text-xs text-[#2B2118] text-center max-w-[90px] truncate">
                      {top2.name}
                    </span>
                    <span className="text-[11px] font-black text-[#7B4BE0]">
                      {top2.xp} XP
                    </span>
                    <div className="w-20 sm:w-28 h-24 bg-gradient-to-t from-slate-400 to-slate-300 border-4 border-slate-500 rounded-t-2xl shadow-[0_6px_0_#64748b] flex items-center justify-center font-black text-2xl text-slate-700 mt-2">
                      2°
                    </div>
                  </div>
                ) : (
                  <div className="w-20 sm:w-28 h-24 border-2 border-dashed border-gray-300 rounded-t-2xl"></div>
                )}

                {/* 1er Lugar — Oro (Más Alto) */}
                {top1 && (
                  <div className="flex flex-col items-center -mt-6">
                    <div className="bg-[#F2B33D] border-2 border-[#C1871F] rounded-full p-3 mb-2 shadow-lg animate-bounce">
                      <Crown className="w-8 h-8 text-white fill-current" />
                    </div>
                    <span className="font-black text-sm text-[#8B5A2B] text-center max-w-[110px] truncate">
                      {top1.name}
                    </span>
                    <span className="text-xs font-black text-[#7B4BE0]">
                      {top1.xp} XP
                    </span>
                    <div className="w-24 sm:w-32 h-36 bg-gradient-to-t from-[#C1871F] to-[#F2B33D] border-4 border-[#C1871F] rounded-t-2xl shadow-[0_6px_0_#9a6b18] flex flex-col items-center justify-center font-black text-3xl text-white mt-2">
                      <span>1°</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-black/20 px-2 py-0.5 rounded-full mt-1">
                        Campeón
                      </span>
                    </div>
                  </div>
                )}

                {/* 3er Lugar — Bronce */}
                {top3 ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-[#8B5A2B] border-2 border-[#5C3A1A] rounded-full p-2 mb-2 shadow-md">
                      <Crown className="w-6 h-6 text-[#FFF6E0]" />
                    </div>
                    <span className="font-extrabold text-xs text-[#2B2118] text-center max-w-[90px] truncate">
                      {top3.name}
                    </span>
                    <span className="text-[11px] font-black text-[#7B4BE0]">
                      {top3.xp} XP
                    </span>
                    <div className="w-20 sm:w-28 h-16 bg-gradient-to-t from-[#5C3A1A] to-[#8B5A2B] border-4 border-[#5C3A1A] rounded-t-2xl shadow-[0_6px_0_#3d2611] flex items-center justify-center font-black text-xl text-[#FFF6E0] mt-2">
                      3°
                    </div>
                  </div>
                ) : (
                  <div className="w-20 sm:w-28 h-16 border-2 border-dashed border-gray-300 rounded-t-2xl"></div>
                )}
              </div>

              {/* Tabla de Clasificación Completa */}
              <div className="overflow-x-auto rounded-2xl border-4 border-[#F2B33D] bg-white shadow-sm mt-4">
                <table className="w-full text-left border-collapse text-xs font-bold">
                  <thead>
                    <tr className="bg-[#8B5A2B] text-white uppercase border-b-2 border-[#5C3A1A]">
                      <th className="py-2.5 px-4">Posición</th>
                      <th className="py-2.5 px-4">Héroe</th>
                      <th className="py-2.5 px-4">Nivel</th>
                      <th className="py-2.5 px-4">XP Total</th>
                      <th className="py-2.5 px-4">Monedas</th>
                      <th className="py-2.5 px-4">Rol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {usersLeaderboard.map((u, index) => (
                      <tr key={u.uid} className={index % 2 === 0 ? "bg-white" : "bg-[#FFF6E0]/50"}>
                        <td className="py-2.5 px-4 font-black">
                          {index === 0 ? "🥇 1°" : index === 1 ? "🥈 2°" : index === 2 ? "🥉 3°" : `${index + 1}°`}
                        </td>
                        <td className="py-2.5 px-4 text-[#8B5A2B] font-extrabold">{u.name}</td>
                        <td className="py-2.5 px-4">
                          <span className="bg-[#7B4BE0]/20 text-[#7B4BE0] px-2 py-0.5 rounded-full border border-[#7B4BE0]">
                            Niv. {u.level}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-black text-[#7B4BE0]">{u.xp} XP</td>
                        <td className="py-2.5 px-4 font-black text-[#8B5A2B]">{u.coins} 🪙</td>
                        <td className="py-2.5 px-4 uppercase text-[10px] text-[#3FA845] font-black">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </GamePanel>

        {/* GRÁFICOS RECHARTS RE-TEMATIZADOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 1: Ventas por Método de Pago */}
          <GamePanel title="💳 Ventas por Método de Pago">
            {paymentChartData.length === 0 ? (
              <p className="text-center text-xs italic text-gray-500 py-12">
                No hay suficientes transacciones completadas para el gráfico.
              </p>
            ) : (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentChartData}>
                    <XAxis dataKey="name" stroke="#8B5A2B" tick={{ fontSize: 11, fontWeight: "bold" }} />
                    <YAxis stroke="#8B5A2B" tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: "#FFF6E0", borderColor: "#F2B33D", borderRadius: "12px", fontWeight: "bold" }}
                    />
                    <Bar dataKey="total" fill="#3FA845" radius={[8, 8, 0, 0]}>
                      {paymentChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </GamePanel>

          {/* Gráfico 2: Distribución de Ingresos */}
          <GamePanel title="📊 Distribución de Volumen">
            {paymentChartData.length === 0 ? (
              <p className="text-center text-xs italic text-gray-500 py-12">
                No hay datos disponibles.
              </p>
            ) : (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentChartData}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}`}
                    >
                      {paymentChartData.map((_, index) => (
                        <Cell key={`cell-pie-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => formatCurrency(val)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </GamePanel>
        </div>
      </main>
    </div>
  );
}
