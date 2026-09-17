"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  className?: string;
  showText?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  nextLevelXP,
  level,
  className,
  showText = true,
}) => {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((currentXP / nextLevelXP) * 100))
  );

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      {showText && (
        <div className="flex justify-between items-center text-xs font-black text-[#7B4BE0] px-1">
          <span>XP (Niv. {level})</span>
          <span>
            {currentXP} / {nextLevelXP} ({percentage}%)
          </span>
        </div>
      )}
      <div className="relative w-full h-5.5 bg-[#2B2118] border-2 border-[#7B4BE0] rounded-full p-0.5 overflow-hidden shadow-inner flex items-center justify-center select-none">
        {/* Barra de progreso morada con gradiente */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#7B4BE0] to-[#A06EFF] rounded-full transition-all duration-500 overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {/* Brillo animado diagonal */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite] -skew-x-12"></div>
        </div>

        {/* Texto superpuesto de XP legible siempre */}
        <span className="relative z-10 text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] uppercase tracking-wider">
          {currentXP} / {nextLevelXP} XP
        </span>
      </div>
    </div>
  );
};
