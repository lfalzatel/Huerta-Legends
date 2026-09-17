"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Coins, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastGameProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "xp" | "coins" | "level" | "achievement";
  xpAwarded?: number;
  coinsAwarded?: number;
}

export const ToastGame: React.FC<ToastGameProps> = ({
  isVisible,
  onClose,
  title,
  message,
  type = "xp",
  xpAwarded,
  coinsAwarded,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const icons = {
    xp: <Award className="w-8 h-8 text-[#7B4BE0]" />,
    coins: <Coins className="w-8 h-8 text-[#F2B33D]" />,
    level: <Sparkles className="w-8 h-8 text-[#3FA845]" />,
    achievement: <Sparkles className="w-8 h-8 text-[#F2B33D]" />,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="fixed top-20 right-4 z-50 max-w-sm w-full bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-4 shadow-[0_8px_0_#C1871F] flex items-center gap-3 select-none"
        >
          <div className="p-2 bg-[#F2B33D]/20 rounded-xl border-2 border-[#F2B33D] shrink-0 animate-bounce">
            {icons[type]}
          </div>

          <div className="flex-1">
            <h4 className="font-extrabold text-sm text-[#8B5A2B] uppercase tracking-wide">
              {title}
            </h4>
            <p className="text-xs text-[#2B2118] font-bold">{message}</p>

            <div className="flex items-center gap-3 mt-1">
              {xpAwarded !== undefined && xpAwarded > 0 && (
                <span className="text-[11px] font-black text-[#7B4BE0]">
                  +{xpAwarded} XP
                </span>
              )}
              {coinsAwarded !== undefined && coinsAwarded > 0 && (
                <span className="text-[11px] font-black text-[#8B5A2B]">
                  +{coinsAwarded} Monedas
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8B5A2B] hover:text-[#E0453E] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
