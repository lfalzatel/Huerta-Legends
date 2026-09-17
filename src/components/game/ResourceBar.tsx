"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { XPBar } from "./XPBar";
import { Coins, AlertTriangle, Shield, Volume2, VolumeX, LogOut, User } from "lucide-react";
import { calcXPForNextLevel } from "@/lib/gamification";

interface ResourceBarProps {
  lowStockCount?: number;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({
  lowStockCount = 0,
}) => {
  const { userProfile, logout } = useAuth();
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hh_muted") === "true";
    }
    return false;
  });

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    if (typeof window !== "undefined") {
      localStorage.setItem("hh_muted", String(nextState));
    }
  };

  const level = userProfile?.level ?? 1;
  const xp = userProfile?.xp ?? 0;
  const nextXP = calcXPForNextLevel(level);

  return (
    <header className="sticky top-0 z-40 bg-[#FFF6E0] border-b-4 border-[#F2B33D] shadow-[0_4px_0_#C1871F] px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Sección de Usuario: Avatar + Nivel + Nombre */}
        <div className="flex items-center gap-3">
          <Link href="/perfil" className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-full border-3 border-[#F2B33D] overflow-hidden bg-[#5BC8F5] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              {userProfile?.photoURL ? (
                <Image
                  src={userProfile.photoURL}
                  alt={userProfile.name || "Avatar"}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            {/* Escudo de Nivel en la esquina inferior */}
            <div className="absolute -bottom-1.5 -right-1 bg-[#7B4BE0] border-2 border-white rounded-md px-1.5 py-0.5 text-[10px] font-black text-white shadow flex items-center gap-0.5">
              <Shield className="w-2.5 h-2.5 fill-current" />
              <span>{level}</span>
            </div>
          </Link>

          <div className="hidden sm:flex flex-col">
            <span className="font-extrabold text-sm text-[#8B5A2B] leading-none">
              {userProfile?.name || "Héroe"}
            </span>
            <span className="text-[11px] font-bold text-[#3FA845] uppercase tracking-wider">
              {userProfile?.role === "admin" ? "🛡️ Administrador" : "🌾 Agricultor"}
            </span>
          </div>
        </div>

        {/* Barra de XP central */}
        <div className="flex-1 max-w-xs md:max-w-md mx-2">
          <XPBar currentXP={xp} nextLevelXP={nextXP} level={level} showText={false} />
        </div>

        {/* Indicadores de Recursos: Monedas + Alertas Stock + Audio + Salir */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Monedas */}
          <div className="flex items-center gap-1.5 bg-[#F2B33D]/20 border-2 border-[#F2B33D] px-3 py-1 rounded-xl shadow-sm">
            <Coins className="w-4 h-4 text-[#F2B33D] animate-bounce" />
            <span className="font-black text-sm text-[#8B5A2B]">
              {userProfile?.coins ?? 0}
            </span>
          </div>

          {/* Alertas de Stock */}
          <Link
            href="/productos?filter=low"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 transition-all ${
              lowStockCount > 0
                ? "bg-[#E0453E]/20 border-[#E0453E] text-[#E0453E] animate-pulse"
                : "bg-gray-100 border-gray-300 text-gray-500"
            }`}
            title={`${lowStockCount} productos con stock mínimo`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="font-black text-sm">{lowStockCount}</span>
          </Link>

          {/* Botón Mute Sound */}
          <button
            onClick={toggleSound}
            className="p-1.5 bg-[#FFF6E0] border-2 border-[#F2B33D] rounded-xl text-[#8B5A2B] hover:bg-[#F2B33D]/20 cursor-pointer transition-colors"
            title={isMuted ? "Activar sonido" : "Silenciar sonido"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-[#E0453E]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#3FA845]" />
            )}
          </button>

          {/* Botón Logout */}
          <button
            onClick={() => logout()}
            className="p-1.5 bg-[#E0453E] border-2 border-[#9c2d28] text-white rounded-xl hover:bg-[#c93b35] cursor-pointer transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
