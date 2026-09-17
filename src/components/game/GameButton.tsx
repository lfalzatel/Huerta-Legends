"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const GameButton: React.FC<GameButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      "bg-[#3FA845] hover:bg-[#46C46A] text-white border-[#22703A] shadow-md",
    gold: "bg-[#F2B33D] hover:bg-[#f5c463] text-[#2B2118] border-[#C1871F] shadow-md",
    danger:
      "bg-[#E0453E] hover:bg-[#eb564f] text-white border-[#9c2d28] shadow-md",
    ghost:
      "bg-[#FFF6E0] hover:bg-[#fcecc5] text-[#8B5A2B] border-[#F2B33D] shadow-sm",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-bold rounded-xl border-b-4",
    md: "px-5 py-2.5 text-sm font-extrabold rounded-2xl border-b-6",
    lg: "px-7 py-3.5 text-base font-black rounded-2xl border-b-6 tracking-wide",
  };

  return (
    <button
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 cursor-pointer transition-all select-none font-sans active:translate-y-1 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-6",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
