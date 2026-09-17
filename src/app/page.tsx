"use client";

import React from "react";
import { ResourceBar } from "@/components/game/ResourceBar";
import { MainNav } from "@/components/layout/main-nav";
import { GamePanel } from "@/components/game/GamePanel";
import { GameButton } from "@/components/game/GameButton";
import { QuestCard } from "@/components/game/QuestCard";
import { useProducts } from "@/lib/hooks/useProducts";
import { useSales } from "@/lib/hooks/useSales";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useQuests } from "@/lib/hooks/useQuests";
import { useAuth } from "@/components/providers/auth-provider";
import { formatCurrency } from "@/lib/utils";
import {
  Coins,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Sprout,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const { products, lowStockCount, lowStockProducts, seedDatabase, seeding } = useProducts();
  const { sales, loading: loadingSales } = useSales();
  const { customers } = useCustomers();
  const { quests, claimQuestReward } = useQuests(userProfile?.uid);

  // Cálculos de KPIs
  const todayStr = new Date().toISOString().split("T")[0];

  const todaySales = sales.filter((s) => {
    if (!s.createdAt) return false;
    const sDate = s.createdAt.toDate
      ? s.createdAt.toDate().toISOString().split("T")[0]
      : "";
    return sDate === todayStr && s.status === "completada";
  });

  const todayTotalAmount = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#5BC8F5] flex flex-col font-game pb-12">
      <ResourceBar lowStockCount={lowStockCount} />
      <MainNav />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-6">
        {/* Banner de bienvenida al Mapa de la Huerta */}
        <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-3xl p-6 shadow-[0_8px_0_#C1871F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#3FA845] text-white rounded-2xl border-2 border-[#22703A] shadow-md">
              <Sprout className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#8B5A2B] tracking-wide">
                MAPA DE LA HUERTA
              </h1>
              <p className="text-sm text-[#2B2118] font-bold">
                ¡Bienvenido de vuelta, {userProfile?.name || "Héroe"}! Revisa los cofres de rendimiento y tus misiones de hoy.
              </p>
            </div>
          </div>

          {products.length === 0 && (
            <GameButton
              variant="gold"
              onClick={seedDatabase}
              disabled={seeding}
              icon={<Sparkles className="w-5 h-5" />}
            >
              {seeding ? "Sembrando catálogo..." : "🌱 Sembrar 30+ Productos"}
            </GameButton>
          )}
        </div>

        {/* Cofres / Medallas de KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Ventas del día */}
          <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-4 shadow-[0_6px_0_#C1871F] flex items-center gap-4">
            <div className="p-3 bg-[#F2B33D]/20 border-2 border-[#F2B33D] text-[#8B5A2B] rounded-xl">
              <Coins className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase text-[#8B5A2B]/70">
                Ventas Hoy
              </span>
              <h3 className="text-xl font-black text-[#8B5A2B]">
                {formatCurrency(todayTotalAmount)}
              </h3>
              <p className="text-[11px] font-bold text-[#3FA845]">
                {todaySales.length} transacciones
              </p>
            </div>
          </div>

          {/* KPI 2: Total Productos */}
          <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-4 shadow-[0_6px_0_#C1871F] flex items-center gap-4">
            <div className="p-3 bg-[#3FA845]/20 border-2 border-[#3FA845] text-[#3FA845] rounded-xl">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase text-[#8B5A2B]/70">
                Catálogo Activo
              </span>
              <h3 className="text-xl font-black text-[#8B5A2B]">
                {products.length} Ítems
              </h3>
              <p className="text-[11px] font-bold text-[#8B5A2B]/80">
                Disponibles en mochila
              </p>
            </div>
          </div>

          {/* KPI 3: Alertas de Stock */}
          <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-4 shadow-[0_6px_0_#C1871F] flex items-center gap-4">
            <div
              className={`p-3 border-2 rounded-xl ${
                lowStockCount > 0
                  ? "bg-[#E0453E]/20 border-[#E0453E] text-[#E0453E] animate-pulse"
                  : "bg-gray-100 border-gray-300 text-gray-400"
              }`}
            >
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase text-[#8B5A2B]/70">
                Stock Mínimo
              </span>
              <h3 className="text-xl font-black text-[#8B5A2B]">
                {lowStockCount} Alertas
              </h3>
              <p className="text-[11px] font-bold text-[#E0453E]">
                {lowStockCount > 0 ? "¡Requiere reposición!" : "Inventario óptimo"}
              </p>
            </div>
          </div>

          {/* KPI 4: Clientes Aliados */}
          <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-4 shadow-[0_6px_0_#C1871F] flex items-center gap-4">
            <div className="p-3 bg-[#7B4BE0]/20 border-2 border-[#7B4BE0] text-[#7B4BE0] rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase text-[#8B5A2B]/70">
                Aliados Registrados
              </span>
              <h3 className="text-xl font-black text-[#8B5A2B]">
                {customers.length} Clientes
              </h3>
              <p className="text-[11px] font-bold text-[#7B4BE0]">
                Rango acumulado
              </p>
            </div>
          </div>
        </div>

        {/* Sección principal en 2 columnas: Misiones Diarias y Alertas de Peligro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Misiones Diarias (2 columnas) */}
          <div className="lg:col-span-2">
            <GamePanel
              title="🎯 Misiones Diarias de la Huerta"
              icon={<Sparkles className="w-6 h-6" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quests.map((q) => (
                  <QuestCard key={q.id} quest={q} onClaim={(quest) => claimQuestReward(quest.id)} />
                ))}
              </div>
            </GamePanel>

            {/* Accesos rápidos a operaciones */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/ventas">
                <GamePanel
                  variant="wood"
                  className="hover:scale-102 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-[#F2B33D]" />
                    <div>
                      <h4 className="font-extrabold text-lg">Registrar Nueva Venta</h4>
                      <p className="text-xs text-[#FFF6E0]/80 font-medium">
                        Abre la caja y gana XP por cada transacción.
                      </p>
                    </div>
                  </div>
                </GamePanel>
              </Link>

              <Link href="/productos">
                <GamePanel
                  variant="wood"
                  className="hover:scale-102 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-[#3FA845]" />
                    <div>
                      <h4 className="font-extrabold text-lg">Gestionar Mochila</h4>
                      <p className="text-xs text-[#FFF6E0]/80 font-medium">
                        Revisa el catálogo de 30+ productos y stock.
                      </p>
                    </div>
                  </div>
                </GamePanel>
              </Link>
            </div>
          </div>

          {/* Panel Lateral: Alertas de Peligro (Stock bajo) y Últimas Ventas */}
          <div className="flex flex-col gap-6">
            {/* Alerta de peligro */}
            <GamePanel
              title="⚠️ Alertas de Reposición"
              icon={<AlertTriangle className="w-6 h-6 text-[#E0453E]" />}
            >
              {lowStockProducts.length === 0 ? (
                <p className="text-xs font-bold text-[#3FA845] py-2 text-center">
                  🌱 ¡Excelente! Todos los productos están por encima del stock mínimo.
                </p>
              ) : (
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#E0453E]/10 border-2 border-[#E0453E] p-2.5 rounded-xl flex items-center justify-between text-xs font-bold"
                    >
                      <div>
                        <p className="text-[#8B5A2B]">{p.name}</p>
                        <p className="text-[#E0453E] text-[10px]">
                          Quedan sólo {p.stock} u. (Mín: {p.minStock})
                        </p>
                      </div>
                      <Link href="/productos">
                        <GameButton size="sm" variant="danger">
                          Reponer
                        </GameButton>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </GamePanel>

            {/* Actividad Reciente */}
            <GamePanel
              title="📜 Últimas Transacciones"
              icon={<TrendingUp className="w-6 h-6" />}
            >
              {loadingSales ? (
                <p className="text-xs italic text-[#8B5A2B] text-center py-4">
                  Cargando ventas en tiempo real...
                </p>
              ) : sales.length === 0 ? (
                <p className="text-xs italic text-[#8B5A2B] text-center py-4">
                  Aún no hay ventas registradas.
                </p>
              ) : (
                <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
                  {sales.slice(0, 4).map((s) => (
                    <div
                      key={s.id}
                      className="bg-white/60 p-2 rounded-xl border border-[#F2B33D]/40 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-[#8B5A2B] block">
                          {s.saleNumber}
                        </span>
                        <span className="text-[10px] text-gray-600 font-semibold">
                          {s.customerName}
                        </span>
                      </div>
                      <span className="font-black text-[#3FA845]">
                        {formatCurrency(s.totalAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </GamePanel>
          </div>
        </div>
      </main>
    </div>
  );
}
