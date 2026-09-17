"use client";

import React, { useState } from "react";
import { GamePanel } from "@/components/game/GamePanel";
import { GameButton } from "@/components/game/GameButton";
import { ResourceBar } from "@/components/game/ResourceBar";
import { XPBar } from "@/components/game/XPBar";
import { GameTable } from "@/components/game/GameTable";
import { GameModal } from "@/components/game/GameModal";
import { ItemCard } from "@/components/game/ItemCard";
import { QuestCard } from "@/components/game/QuestCard";
import { ToastGame } from "@/components/game/ToastGame";
import { CoinBurst } from "@/components/game/CoinBurst";
import { Product, DailyQuest } from "@/types";
import { Sparkles, Package, Shield, Swords, Home } from "lucide-react";
import Link from "next/link";

export default function KitchenSinkPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isCoinBurstActive, setIsCoinBurstActive] = useState(false);

  // Datos mock para demo visual
  const sampleProducts: Product[] = [
    {
      id: "1",
      name: "Tomate Chonto Orgánico",
      description: "Tomate fresco recién cosechado.",
      category: "vegetales",
      price: 4500,
      stock: 25,
      minStock: 5,
      image: null,
      sku: "TOM-001",
      isActive: true,
      rarity: "comun",
    },
    {
      id: "2",
      name: "Fresa Selva Dulce",
      description: "Fresa premium de la huerta.",
      category: "frutas",
      price: 12000,
      stock: 3,
      minStock: 5,
      image: null,
      sku: "FRE-002",
      isActive: true,
      rarity: "raro",
    },
    {
      id: "3",
      name: "Menta Piperita Sagrada",
      description: "Menta aromática medicinal.",
      category: "hierbas",
      price: 25000,
      stock: 12,
      minStock: 5,
      image: null,
      sku: "MEN-003",
      isActive: true,
      rarity: "epico",
    },
    {
      id: "4",
      name: "Orquídea Dorada Huerta",
      description: "Planta mística ornamental.",
      category: "plantas",
      price: 65000,
      stock: 2,
      minStock: 5,
      image: null,
      sku: "ORQ-004",
      isActive: true,
      rarity: "legendario",
    },
  ];

  const sampleQuest: DailyQuest = {
    id: "q1",
    title: "Cosechador del Día",
    description: "Registra 3 ventas completadas en la jornada.",
    rewardXP: 50,
    rewardCoins: 25,
    progress: 3,
    target: 3,
    isCompleted: false,
    type: "sales",
  };

  const sampleColumns = [
    { key: "name", header: "Producto" },
    { key: "category", header: "Categoría" },
    { key: "price", header: "Precio (COP)", render: (p: Product) => `$${p.price.toLocaleString("es-CO")}` },
    { key: "stock", header: "Stock", render: (p: Product) => `${p.stock} u.` },
    { key: "rarity", header: "Rareza", render: (p: Product) => <span className="uppercase text-xs font-black">{p.rarity}</span> },
  ];

  const triggerBurst = () => {
    setIsCoinBurstActive(true);
    setIsToastVisible(true);
  };

  return (
    <div className="min-h-screen bg-[#5BC8F5] pb-12 font-game">
      {/* 1. Componente ResourceBar */}
      <ResourceBar lowStockCount={1} />

      <main className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-8">
        <div className="flex items-center justify-between bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-4 shadow-[0_6px_0_#C1871F]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#8B5A2B] tracking-wide">
              🎨 KITCHEN SINK — Componentes de Juego (Fase 2)
            </h1>
            <p className="text-xs sm:text-sm text-[#2B2118] font-bold">
              Catálogo demostrativo del sistema de diseño estilo Top Heroes / Super Mario.
            </p>
          </div>
          <Link href="/">
            <GameButton variant="ghost" size="sm" icon={<Home className="w-4 h-4" />}>
              Dashboard
            </GameButton>
          </Link>
        </div>

        {/* 2. GamePanel y GameButton */}
        <GamePanel title="1. Botones 3D (GameButton)" icon={<Swords className="w-6 h-6" />}>
          <div className="flex flex-wrap gap-4 items-center">
            <GameButton variant="primary" size="md">
              Primary (Verde)
            </GameButton>
            <GameButton variant="gold" size="md" onClick={triggerBurst}>
              Gold + Coin Burst 🎉
            </GameButton>
            <GameButton variant="danger" size="md">
              Danger (Rojo)
            </GameButton>
            <GameButton variant="ghost" size="md">
              Ghost (Pergamino)
            </GameButton>
            <GameButton variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />}>
              Con Ícono
            </GameButton>
          </div>
        </GamePanel>

        {/* 3. XPBar */}
        <GamePanel title="2. Barra de Experiencia (XPBar)" icon={<Shield className="w-6 h-6" />}>
          <div className="flex flex-col gap-4 max-w-lg">
            <XPBar currentXP={340} nextLevelXP={500} level={3} showText={true} />
          </div>
        </GamePanel>

        {/* 4. ItemCards por rareza */}
        <GamePanel title="3. Ítems de Inventario (ItemCard por Rareza)" icon={<Package className="w-6 h-6" />}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sampleProducts.map((p) => (
              <ItemCard key={p.id} product={p} onClick={(prod) => alert(`Seleccionado: ${prod.name}`)} />
            ))}
          </div>
        </GamePanel>

        {/* 5. QuestCard */}
        <GamePanel title="4. Misiones Diarias (QuestCard)">
          <div className="max-w-md">
            <QuestCard
              quest={sampleQuest}
              onClaim={() => {
                triggerBurst();
                alert("¡Misión Reclamada! +50 XP y +25 Monedas otorgadas.");
              }}
            />
          </div>
        </GamePanel>

        {/* 6. GameTable */}
        <GamePanel title="5. Tabla Tipo Bloque (GameTable)">
          <GameTable columns={sampleColumns} data={sampleProducts} />
        </GamePanel>

        {/* 7. GameModal y CoinBurst triggers */}
        <GamePanel title="6. Modal de Pergamino (GameModal)">
          <div className="flex gap-4">
            <GameButton variant="gold" onClick={() => setIsModalOpen(true)}>
              Abrir Modal Pergamino 📜
            </GameButton>
          </div>
        </GamePanel>
      </main>

      {/* Componente Modal */}
      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="📜 Pergamino Secreto"
        icon={<Sparkles className="w-6 h-6" />}
      >
        <div className="flex flex-col gap-4 py-2">
          <p className="font-bold text-sm">
            ¡Has abierto una ventana emergente de videojuego con animación de rebote y remaches dorados!
          </p>
          <div className="bg-[#F2B33D]/20 p-4 rounded-xl border-2 border-[#F2B33D] text-xs font-semibold">
            Todas las confirmaciones, formularios y detalles de ventas/productos utilizarán esta experiencia.
          </div>
          <GameButton variant="primary" onClick={() => setIsModalOpen(false)}>
            Entendido, Héroe
          </GameButton>
        </div>
      </GameModal>

      {/* Componentes de Recompensa Toast y CoinBurst */}
      <ToastGame
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        title="¡Gran Recompensa!"
        message="¡Has obtenido XP y Monedas por completar la demostración!"
        type="coins"
        xpAwarded={50}
        coinsAwarded={25}
      />

      <CoinBurst isActive={isCoinBurstActive} onComplete={() => setIsCoinBurstActive(false)} />
    </div>
  );
}
