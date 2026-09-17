"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Package, AlertCircle } from "lucide-react";

interface ItemCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  className?: string;
  showStockActions?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  product,
  onClick,
  className,
}) => {
  const rarityStyles = {
    comun: {
      border: "border-gray-400",
      bg: "bg-gray-100/90",
      badge: "bg-gray-500 text-white",
      title: "Común",
    },
    raro: {
      border: "border-blue-500",
      bg: "bg-blue-50/90",
      badge: "bg-blue-600 text-white",
      title: "Raro",
    },
    epico: {
      border: "border-purple-600",
      bg: "bg-purple-50/90",
      badge: "bg-purple-700 text-white",
      title: "Épico",
    },
    legendario: {
      border: "border-[#F2B33D]",
      bg: "bg-[#FFF6E0]",
      badge: "bg-[#F2B33D] text-[#8B5A2B] font-black",
      title: "Legendario ✨",
    },
  };

  const currentRarity = rarityStyles[product.rarity || "comun"];
  const isLowStock = product.stock <= product.minStock;

  return (
    <div
      onClick={() => onClick && onClick(product)}
      className={cn(
        "relative group flex flex-col items-center justify-between p-3 rounded-2xl border-4 transition-all duration-200 select-none shadow-[0_6px_0_rgba(0,0,0,0.15)]",
        currentRarity.border,
        currentRarity.bg,
        onClick && "hover:-translate-y-1 hover:shadow-lg cursor-pointer",
        isLowStock && "ring-2 ring-[#E0453E] animate-pulse",
        className
      )}
    >
      {/* Insignia de Categoría arriba a la izquierda */}
      <div className="absolute top-2 left-2 z-10 bg-[#3FA845] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#22703A] uppercase tracking-wider">
        {product.category}
      </div>

      {/* Insignia de Rareza arriba a la derecha */}
      <div
        className={cn(
          "absolute top-2 right-2 z-10 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-black/20 uppercase",
          currentRarity.badge
        )}
      >
        {currentRarity.title}
      </div>

      {/* Imagen del Ítem de Inventario */}
      <div className="w-24 h-24 mt-6 my-2 relative rounded-xl border-2 border-black/10 bg-white/80 p-2 flex items-center justify-center overflow-hidden shadow-inner">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="96px"
            className="object-contain p-1 group-hover:scale-110 transition-transform"
          />
        ) : (
          <Package className="w-12 h-12 text-[#8B5A2B]/40" />
        )}
      </div>

      {/* Detalles: Nombre y Precio */}
      <div className="w-full text-center mt-1">
        <h4 className="font-extrabold text-sm text-[#2B2118] line-clamp-1 group-hover:text-[#3FA845] transition-colors">
          {product.name}
        </h4>
        <p className="font-black text-xs text-[#8B5A2B]">
          {formatCurrency(product.price)}
        </p>
      </div>

      {/* Etiqueta de Stock abajo */}
      <div
        className={cn(
          "w-full mt-2 py-1 px-2 rounded-xl text-center text-xs font-black flex items-center justify-center gap-1 border",
          isLowStock
            ? "bg-[#E0453E]/20 text-[#E0453E] border-[#E0453E]"
            : "bg-[#3FA845]/20 text-[#22703A] border-[#3FA845]"
        )}
      >
        {isLowStock && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
        <span>Stock: {product.stock} u.</span>
      </div>
    </div>
  );
};
