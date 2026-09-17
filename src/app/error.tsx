"use client";

import { useEffect } from "react";
import { GameButton } from "@/components/game/GameButton";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error capturado en ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#5BC8F5] flex flex-col items-center justify-center p-4 text-center font-game select-none">
      <div className="bg-[#FFF6E0] border-4 border-[#E0453E] rounded-3xl p-8 max-w-md w-full shadow-[0_10px_0_#9c2d28] flex flex-col items-center gap-4">
        <div className="bg-[#E0453E] text-white p-3 rounded-full border-2 border-[#9c2d28] animate-pulse">
          <AlertTriangle className="w-12 h-12" />
        </div>

        <h1 className="text-2xl font-black text-[#E0453E] tracking-wider uppercase">
          ¡OBSTÁCULO INESPERADO!
        </h1>

        <p className="text-[#8B5A2B] font-extrabold text-xs sm:text-sm">
          Ha ocurrido un contratiempo temporal en la huerta. Los datos están a salvo.
        </p>

        <div className="bg-[#E0453E]/10 border border-[#E0453E] p-3 rounded-xl text-xs font-bold text-[#E0453E] w-full">
          Inténtalo de nuevo o vuelve a cargar el mapa.
        </div>

        <GameButton
          variant="primary"
          onClick={() => reset()}
          icon={<RefreshCw className="w-4 h-4" />}
          className="w-full"
        >
          Reintentar Carga
        </GameButton>
      </div>
    </div>
  );
}
