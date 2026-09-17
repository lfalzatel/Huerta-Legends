"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GamePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  variant?: "parchment" | "wood" | "sky";
}

export const GamePanel: React.FC<GamePanelProps> = ({
  children,
  className,
  title,
  icon,
  variant = "parchment",
  ...props
}) => {
  const bgStyles = {
    parchment: "bg-[#FFF6E0] border-[#F2B33D] text-[#2B2118]",
    wood: "bg-[#8B5A2B] border-[#F2B33D] text-[#FFF6E0]",
    sky: "bg-[#5BC8F5] border-[#FFF6E0] text-[#2B2118]",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border-4 p-5 shadow-[0_6px_0_#C1871F] transition-all",
        bgStyles[variant],
        className
      )}
      {...props}
    >
      {/* Remaches de metal dorados en las esquinas */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#F2B33D] border border-[#C1871F] shadow-sm"></div>
      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#F2B33D] border border-[#C1871F] shadow-sm"></div>
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#F2B33D] border border-[#C1871F] shadow-sm"></div>
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#F2B33D] border border-[#C1871F] shadow-sm"></div>

      {/* Cabecera si se proporciona título */}
      {title && (
        <div className="mb-4 flex items-center gap-2 border-b-2 border-[#F2B33D]/40 pb-2">
          {icon && <span className="text-[#F2B33D]">{icon}</span>}
          <h3 className="font-extrabold text-lg sm:text-xl text-[#8B5A2B] tracking-wide uppercase">
            {title}
          </h3>
        </div>
      )}

      {children}
    </div>
  );
};
