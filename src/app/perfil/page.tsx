"use client";

import React from "react";
import Image from "next/image";
import { ResourceBar } from "@/components/game/ResourceBar";
import { MainNav } from "@/components/layout/main-nav";
import { GamePanel } from "@/components/game/GamePanel";
import { XPBar } from "@/components/game/XPBar";
import { useAuth } from "@/components/providers/auth-provider";
import { useProducts } from "@/lib/hooks/useProducts";
import { useSales } from "@/lib/hooks/useSales";
import { calcXPForNextLevel } from "@/lib/gamification";
import {
  User,
  Shield,
  Coins,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function PerfilPage() {
  const { userProfile } = useAuth();
  const { lowStockCount } = useProducts();
  const { sales } = useSales();

  const level = userProfile?.level ?? 1;
  const xp = userProfile?.xp ?? 0;
  const nextXP = calcXPForNextLevel(level);

  // Catálogo de Logros del Juego
  const achievementsList = [
    {
      id: "first_sale",
      name: "🌱 Primera Cosecha",
      description: "Registra tu primera venta completada.",
      icon: "🌾",
      unlocked: sales.some((s) => s.userId === userProfile?.uid),
    },
    {
      id: "ten_sales",
      name: "💰 Comerciante Experto",
      description: "Acumula 10 ventas en el sistema.",
      icon: "🛒",
      unlocked: sales.filter((s) => s.userId === userProfile?.uid).length >= 10,
    },
    {
      id: "level_5",
      name: "🛡️ Héroe Consagrado",
      description: "Alcanza el Nivel 5 de experiencia.",
      icon: "⭐",
      unlocked: level >= 5,
    },
    {
      id: "streak_7",
      name: "🔥 Racha Imparable",
      description: "Mantén una racha de 7 días activo.",
      icon: "🔥",
      unlocked: (userProfile?.streakDays ?? 0) >= 7,
    },
    {
      id: "coins_100",
      name: "🪙 Tesoro de la Huerta",
      description: "Acumula 100 monedas en tu balance.",
      icon: "🪙",
      unlocked: (userProfile?.coins ?? 0) >= 100,
    },
  ];

  const mySalesCount = sales.filter((s) => s.userId === userProfile?.uid).length;
  const myTotalVolume = sales
    .filter((s) => s.userId === userProfile?.uid && s.status === "completada")
    .reduce((acc, s) => acc + s.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#5BC8F5] flex flex-col font-game pb-12">
      <ResourceBar lowStockCount={lowStockCount} />
      <MainNav />

      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-6">
        {/* Banner Hoja de Personaje */}
        <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-3xl p-6 shadow-[0_8px_0_#C1871F] flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar con Escudo de Nivel */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full border-4 border-[#F2B33D] overflow-hidden bg-[#5BC8F5] flex items-center justify-center shadow-lg">
              {userProfile?.photoURL ? (
                <Image
                  src={userProfile.photoURL}
                  alt={userProfile.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#7B4BE0] border-2 border-white rounded-xl px-2.5 py-1 text-xs font-black text-white shadow flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 fill-current" />
              <span>Niv. {level}</span>
            </div>
          </div>

          {/* Información del Usuario & Barra de XP */}
          <div className="flex-1 text-center sm:text-left flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#8B5A2B]">
                {userProfile?.name || "Héroe de la Huerta"}
              </h1>
              <span className="bg-[#3FA845] text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full border border-[#22703A]">
                {userProfile?.role === "admin" ? "🛡️ Administrador" : "🌾 Agricultor"}
              </span>
            </div>

            <p className="text-xs font-semibold text-gray-600">{userProfile?.email}</p>

            <div className="w-full max-w-md mt-2">
              <XPBar currentXP={xp} nextLevelXP={nextXP} level={level} showText={true} />
            </div>
          </div>
        </div>

        {/* Cofres de Recursos del Personaje */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-4 shadow-[0_6px_0_#C1871F] flex items-center gap-3">
            <div className="p-3 bg-[#F2B33D]/20 border-2 border-[#F2B33D] text-[#8B5A2B] rounded-xl">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-[#8B5A2B]/70">
                Monedas acumuladas
              </span>
              <h3 className="text-lg font-black text-[#8B5A2B]">
                {userProfile?.coins ?? 0} 🪙
              </h3>
            </div>
          </div>

          <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-4 shadow-[0_6px_0_#C1871F] flex items-center gap-3">
            <div className="p-3 bg-[#E0453E]/20 border-2 border-[#E0453E] text-[#E0453E] rounded-xl animate-pulse">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-[#8B5A2B]/70">
                Racha Activa
              </span>
              <h3 className="text-lg font-black text-[#E0453E]">
                {userProfile?.streakDays ?? 1} Días 🔥
              </h3>
            </div>
          </div>

          <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-4 shadow-[0_6px_0_#C1871F] flex items-center gap-3">
            <div className="p-3 bg-[#3FA845]/20 border-2 border-[#3FA845] text-[#3FA845] rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-[#8B5A2B]/70">
                Ventas Procesadas
              </span>
              <h3 className="text-lg font-black text-[#3FA845]">
                {mySalesCount} Ventas
              </h3>
            </div>
          </div>
        </div>

        {/* LOGROS E INSIGNIAS DESBLOQUEABLES */}
        <GamePanel title="🎖️ Logros & Insignias de Héroe" icon={<Award className="w-6 h-6 text-[#7B4BE0]" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievementsList.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border-3 flex items-start gap-3 transition-all ${
                  ach.unlocked
                    ? "bg-[#3FA845]/10 border-[#3FA845] shadow-sm"
                    : "bg-gray-100/80 border-gray-300 opacity-60"
                }`}
              >
                <div
                  className={`text-2xl p-2 rounded-xl border ${
                    ach.unlocked ? "bg-[#F2B33D]/20 border-[#F2B33D]" : "bg-gray-200 border-gray-300"
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#8B5A2B]">{ach.name}</h4>
                    {ach.unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-[#3FA845]" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 font-semibold mt-0.5">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GamePanel>
      </main>
    </div>
  );
}
