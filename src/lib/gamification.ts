import { ProductRarity } from "@/types";

/**
 * Experiencia requerida para pasar de nivel n:
 * xpParaNivel(n) = round(100 * n^1.5)
 */
export function calcXPForNextLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5));
}

/**
 * Rareza derivada automáticamente según el precio del producto:
 * precio < 5.000 -> común
 * precio < 15.000 -> raro
 * precio < 40.000 -> épico
 * resto -> legendario
 */
export function calcProductRarity(price: number): ProductRarity {
  if (price < 5000) return "comun";
  if (price < 15000) return "raro";
  if (price < 40000) return "epico";
  return "legendario";
}

/**
 * Cálculo de XP por registrar una venta completada:
 * +10 XP base + 1 XP por cada 10.000 COP del total
 */
export function calcSaleXP(totalAmount: number): number {
  const baseXP = 10;
  const bonusXP = Math.floor(totalAmount / 10000);
  return baseXP + bonusXP;
}

/**
 * Monedas otorgadas por venta completada:
 * floor(totalVenta / 20000)
 */
export function calcSaleCoins(totalAmount: number): number {
  return Math.floor(totalAmount / 20000);
}

/**
 * Comprueba si al sumar nueva XP el usuario sube de nivel y calcula el remanente/nuevo nivel.
 */
export function checkLevelUp(
  currentLevel: number,
  currentXP: number,
  addedXP: number
): { newLevel: number; newXP: number; leveledUp: boolean } {
  let totalXP = currentXP + addedXP;
  let level = currentLevel;
  let leveledUp = false;

  while (totalXP >= calcXPForNextLevel(level)) {
    totalXP -= calcXPForNextLevel(level);
    level += 1;
    leveledUp = true;
  }

  return {
    newLevel: level,
    newXP: totalXP,
    leveledUp,
  };
}

/**
 * Nivel de cliente según volumen total de compras acumulado:
 * Bronce (< 100.000 COP), Plata (< 500.000 COP), Oro (>= 500.000 COP)
 */
export function calcCustomerTier(totalSpent: number): {
  tier: "Bronce" | "Plata" | "Oro";
  color: string;
} {
  if (totalSpent >= 500000) {
    return { tier: "Oro", color: "text-[#F2B33D] font-black" };
  }
  if (totalSpent >= 100000) {
    return { tier: "Plata", color: "text-slate-400 font-bold" };
  }
  return { tier: "Bronce", color: "text-[#8B5A2B] font-semibold" };
}
