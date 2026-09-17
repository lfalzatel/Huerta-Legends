"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface GameTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
}

export function GameTable<T extends { id?: string }>({
  columns,
  data,
  emptyMessage = "No hay registros disponibles en la huerta.",
  className,
  onRowClick,
}: GameTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-2xl border-4 border-[#F2B33D] bg-[#FFF6E0] shadow-[0_6px_0_#C1871F]", className)}>
      <table className="w-full text-left border-collapse">
        {/* Encabezado estilo Banda de Madera */}
        <thead>
          <tr className="bg-[#8B5A2B] text-[#FFF6E0] border-b-4 border-[#5C3A1A] font-extrabold uppercase text-xs sm:text-sm tracking-wider">
            {columns.map((col) => (
              <th key={col.key} className={cn("py-3.5 px-4", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-[#F2B33D]/30 text-sm font-semibold">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 px-4 text-[#8B5A2B] italic"
              >
                🌾 {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id || index}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  "transition-all duration-150 border-b-2 border-[#F2B33D]/20",
                  index % 2 === 0 ? "bg-[#FFF6E0]" : "bg-[#FFF2D1]",
                  onRowClick
                    ? "hover:-translate-y-0.5 hover:bg-[#F2B33D]/20 cursor-pointer shadow-sm"
                    : "hover:bg-[#F2B33D]/10"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("py-3 px-4 text-[#2B2118]", col.className)}>
                    {col.render
                      ? col.render(item)
                      : (item as Record<string, unknown>)[col.key] !== undefined
                      ? String((item as Record<string, unknown>)[col.key])
                      : "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
