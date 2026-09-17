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
      <div className="relative w-full h-5 bg-[#2B2118] border-2 border-[#7B4BE0] rounded-full p-0.5 overflow-hidden shadow-inner">
        {/* Barra de progreso morada con gradiente */}
        <div
          className="h-full bg-gradient-to-r from-[#7B4BE0] to-[#A06EFF] rounded-full transition-all duration-500 relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {/* Brillo animado diagonal */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite] -skew-x-12"></div>
        </div>

        {/* Divisiones segmentadas (ticks) */}
        <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-30">
          <div className="w-0.5 h-full bg-black"></div>
          <div className="w-0.5 h-full bg-black"></div>
          <div className="w-0.5 h-full bg-black"></div>
        </div>
      </div>
    </div>
  );
};
