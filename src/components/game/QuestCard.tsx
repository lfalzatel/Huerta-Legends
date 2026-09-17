"use client";

import React from "react";
import { DailyQuest } from "@/types";
import { CheckCircle2, Coins, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { GameButton } from "./GameButton";

interface QuestCardProps {
  quest: DailyQuest;
  onClaim?: (quest: DailyQuest) => void;
  className?: string;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onClaim,
  className,
}) => {
  const percentage = Math.min(
    100,
    Math.round((quest.progress / quest.target) * 100)
  );

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between p-4 rounded-2xl border-4 transition-all shadow-[0_4px_0_#C1871F]",
        quest.isCompleted
          ? "bg-[#3FA845]/15 border-[#3FA845]"
          : "bg-[#FFF6E0] border-[#F2B33D]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[#F2B33D] text-[#8B5A2B] font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#8B5A2B] leading-tight">
              {quest.title}
            </h4>
            <p className="text-xs text-[#2B2118]/80 font-medium">
              {quest.description}
            </p>
          </div>
        </div>

        {quest.isCompleted && (
          <div className="bg-[#3FA845] text-white p-1 rounded-full border border-[#22703A]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Progreso */}
      <div className="my-2">
        <div className="flex justify-between text-xs font-bold text-[#8B5A2B] mb-1">
          <span>Progreso</span>
          <span>
            {quest.progress} / {quest.target} ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-[#2B2118]/20 h-3 rounded-full overflow-hidden border border-[#8B5A2B]">
          <div
            className="bg-[#3FA845] h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Recompensas y Botón de Reclamar */}
      <div className="flex items-center justify-between pt-2 border-t-2 border-[#F2B33D]/30 mt-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-black text-[#7B4BE0]">
            <Award className="w-4 h-4" />
            <span>+{quest.rewardXP} XP</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-black text-[#8B5A2B]">
            <Coins className="w-4 h-4 text-[#F2B33D]" />
            <span>+{quest.rewardCoins}</span>
          </div>
        </div>

        {quest.progress >= quest.target && !quest.isCompleted && onClaim && (
          <GameButton
            size="sm"
            variant="gold"
            onClick={() => onClaim(quest)}
            className="animate-bounce"
          >
            Reclamar 🎁
          </GameButton>
        )}
      </div>
    </div>
  );
};
