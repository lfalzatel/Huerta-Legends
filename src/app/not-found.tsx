"use client";

import Link from "next/link";
import { GameButton } from "@/components/game/GameButton";
import { Home, Sprout } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#5BC8F5] flex flex-col items-center justify-center p-4 text-center font-game select-none">
      <div className="bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-3xl p-8 max-w-md w-full shadow-[0_10px_0_#C1871F] flex flex-col items-center gap-4">
        <div className="bg-[#E0453E] text-white p-3 rounded-full border-4 border-[#9c2d28] animate-bounce">
          <Sprout className="w-12 h-12" />
        </div>

        <h1 className="text-4xl font-black text-[#E0453E] tracking-wider uppercase drop-shadow-[0_2px_0_#9c2d28]">
          GAME OVER (404)
        </h1>

        <p className="text-[#8B5A2B] font-extrabold text-sm sm:text-base">
          ¡Te has desviado del camino de la huerta! La parcela o zona que buscas no existe en este mapa.
        </p>

        <div className="w-full bg-[#8B5A2B]/10 p-3 rounded-xl border border-[#8B5A2B]/20 text-xs font-semibold text-[#2B2118]">
          Error 404: Parcela No Encontrada
        </div>

        <Link href="/" className="w-full mt-2">
          <GameButton variant="primary" size="lg" className="w-full" icon={<Home className="w-5 h-5" />}>
            Volver al Mapa de la Huerta
          </GameButton>
        </Link>
      </div>
    </div>
  );
}
