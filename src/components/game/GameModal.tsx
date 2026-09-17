"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  icon,
  className,
}) => {
  // Deshabilitar scroll del cuerpo mientras el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          {/* Backdrop con click afuera para cerrar */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Contenido del modal con animación de despliegue de pergamino */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className={cn(
              "relative z-10 w-full max-w-lg bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-3xl p-6 shadow-[0_10px_0_#C1871F] flex flex-col max-h-[90vh] overflow-hidden",
              className
            )}
          >
            {/* Remaches de metal dorados en las 4 esquinas */}
            <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#F2B33D] border border-[#C1871F]"></div>
            <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#F2B33D] border border-[#C1871F]"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-[#F2B33D] border border-[#C1871F]"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-[#F2B33D] border border-[#C1871F]"></div>

            {/* Cabecera del modal */}
            <div className="flex items-center justify-between border-b-4 border-[#F2B33D] pb-3 mb-4">
              <div className="flex items-center gap-2">
                {icon && <span className="text-[#F2B33D]">{icon}</span>}
                <h2 className="text-xl sm:text-2xl font-black text-[#8B5A2B] uppercase tracking-wide">
                  {title}
                </h2>
              </div>

              {/* Botón X pixelado de cierre */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-[#E0453E] border-2 border-[#9c2d28] text-white flex items-center justify-center font-bold hover:bg-[#c93b35] active:scale-95 cursor-pointer shadow-md transition-all"
                title="Cerrar modal"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            {/* Cuerpo desplazable */}
            <div className="flex-1 overflow-y-auto pr-1 text-[#2B2118]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
