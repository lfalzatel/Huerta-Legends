"use client";

import React, { useState } from "react";
import { ResourceBar } from "@/components/game/ResourceBar";
import { MainNav } from "@/components/layout/main-nav";
import { GamePanel } from "@/components/game/GamePanel";
import { GameButton } from "@/components/game/GameButton";
import { GameTable } from "@/components/game/GameTable";
import { GameModal } from "@/components/game/GameModal";
import { ToastGame } from "@/components/game/ToastGame";
import { CoinBurst } from "@/components/game/CoinBurst";
import { useSales, CreateSaleInput } from "@/lib/hooks/useSales";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useAuth } from "@/components/providers/auth-provider";
import { formatCurrency } from "@/lib/utils";
import { Sale, PaymentMethod } from "@/types";
import {
  ShoppingCart,
  Plus,
  Trash2,
  XCircle,
  Sparkles,
  CheckCircle,
  User,
  Package,
} from "lucide-react";

export default function VentasPage() {
  const { userProfile } = useAuth();
  const { sales, loading: loadingSales, createSaleTransaction, cancelSaleTransaction } = useSales();
  const { products, lowStockCount } = useProducts();
  const { customers } = useCustomers();

  // Estados para Modal de Nueva Venta (3 Pasos)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [cart, setCart] = useState<
    Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      maxStock: number;
    }>
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recompensas Toast & Animaciones
  const [toastData, setToastData] = useState<{
    visible: boolean;
    xp: number;
    coins: number;
    saleNumber: string;
  }>({ visible: false, xp: 0, coins: 0, saleNumber: "" });
  const [showCoinBurst, setShowCoinBurst] = useState(false);

  // Handlers Carrito
  const addToCart = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const existing = cart.find((item) => item.productId === productId);
    if (existing) {
      if (existing.quantity >= prod.stock) {
        alert(`Stock máximo alcanzado para ${prod.name}`);
        return;
      }
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (prod.stock < 1) {
        alert("Producto sin stock disponible");
        return;
      }
      setCart([
        ...cart,
        {
          productId: prod.id!,
          productName: prod.name,
          quantity: 1,
          unitPrice: prod.price,
          maxStock: prod.stock,
        },
      ]);
    }
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(
      cart.map((item) => {
        if (item.productId === productId) {
          if (qty > item.maxStock) {
            alert(`Solo hay ${item.maxStock} unidades disponibles`);
            return item;
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const resetModalForm = () => {
    setStep(1);
    setSelectedCustomerId("");
    setCart([]);
    setPaymentMethod("efectivo");
    setNotes("");
    setErrorMsg(null);
  };

  const handleCreateSale = async () => {
    if (!userProfile) return;
    if (!selectedCustomerId) {
      setErrorMsg("Por favor selecciona un cliente aliado.");
      setStep(1);
      return;
    }
    if (cart.length === 0) {
      setErrorMsg("Debes agregar al menos un producto al carrito.");
      setStep(2);
      return;
    }

    const customerObj = customers.find((c) => c.id === selectedCustomerId);

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const input: CreateSaleInput = {
        customerId: selectedCustomerId,
        customerName: customerObj?.name || "Cliente General",
        employeeId: userProfile.role === "employee" ? userProfile.uid : null,
        employeeName: userProfile.name,
        userId: userProfile.uid,
        paymentMethod,
        notes: notes || null,
        items: cart.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      };

      const result = await createSaleTransaction(input);

      setIsModalOpen(false);
      resetModalForm();

      // Trigger animaciones de recompensa
      setShowCoinBurst(true);
      setToastData({
        visible: true,
        xp: result.xpAwarded,
        coins: result.coinsAwarded,
        saleNumber: result.saleNumber,
      });
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Error al procesar la venta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSale = async (sale: Sale) => {
    if (confirm(`¿Estás seguro de cancelar la venta ${sale.saleNumber}? Se devolverá el stock a la mochila.`)) {
      try {
        await cancelSaleTransaction(sale.id!);
        alert(`Venta ${sale.saleNumber} cancelada exitosamente y stock restituido.`);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Error al cancelar la venta.");
      }
    }
  };

  // Columnas para la GameTable de ventas
  const saleColumns = [
    {
      key: "saleNumber",
      header: "N° Venta",
      render: (s: Sale) => (
        <span className="font-extrabold text-[#8B5A2B]">{s.saleNumber}</span>
      ),
    },
    { key: "customerName", header: "Cliente" },
    {
      key: "totalAmount",
      header: "Total",
      render: (s: Sale) => (
        <span className="font-black text-[#3FA845]">{formatCurrency(s.totalAmount)}</span>
      ),
    },
    {
      key: "paymentMethod",
      header: "Pago",
      render: (s: Sale) => (
        <span className="uppercase text-xs font-bold px-2 py-0.5 rounded-md bg-[#F2B33D]/20 border border-[#F2B33D]">
          {s.paymentMethod}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (s: Sale) => (
        <span
          className={`text-xs font-black uppercase px-2 py-0.5 rounded-full border ${
            s.status === "completada"
              ? "bg-[#3FA845]/20 text-[#22703A] border-[#3FA845]"
              : "bg-[#E0453E]/20 text-[#E0453E] border-[#E0453E]"
          }`}
        >
          {s.status}
        </span>
      ),
    },
    {
      key: "xpAwarded",
      header: "XP",
      render: (s: Sale) => <span className="font-black text-[#7B4BE0]">+{s.xpAwarded} XP</span>,
    },
    {
      key: "actions",
      header: "Acción",
      render: (s: Sale) =>
        s.status === "completada" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelSale(s);
            }}
            className="p-1 text-[#E0453E] hover:bg-[#E0453E]/10 rounded-lg transition-colors cursor-pointer"
            title="Cancelar venta y devolver stock"
          >
            <XCircle className="w-5 h-5" />
          </button>
        ) : null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#5BC8F5] flex flex-col font-game pb-12">
      <ResourceBar lowStockCount={lowStockCount} />
      <MainNav />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-3xl p-6 shadow-[0_8px_0_#C1871F]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#8B5A2B] tracking-wide flex items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-[#3FA845]" /> REGISTRO DE VENTAS
            </h1>
            <p className="text-xs sm:text-sm text-[#2B2118] font-bold">
              Cada venta ejecutada descuenta stock automáticamente y otorga XP y Monedas a tu héroe.
            </p>
          </div>

          <GameButton
            variant="primary"
            size="lg"
            onClick={() => {
              resetModalForm();
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-5 h-5" />}
          >
            Nueva Venta (Mundo 1-1)
          </GameButton>
        </div>

        {/* Tabla de Ventas Registradas */}
        <GamePanel title="📋 Histórico de Transacciones">
          {loadingSales ? (
            <p className="text-center text-sm font-bold text-[#8B5A2B] py-8">
              Cargando transacciones de Firestore...
            </p>
          ) : (
            <GameTable columns={saleColumns} data={sales} emptyMessage="No hay ventas registradas." />
          )}
        </GamePanel>
      </main>

      {/* Modal 3 Pasos de Nueva Venta */}
      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`🛒 Nueva Venta — Paso ${step} de 3`}
        icon={<Sparkles className="w-6 h-6 text-[#F2B33D]" />}
        className="max-w-2xl"
      >
        {/* Barra de progreso Mundo 1-1 */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-black text-[#8B5A2B] mb-1">
            <span>Progreso Mundo 1-{step}</span>
            <span>{step === 1 ? "33%" : step === 2 ? "66%" : "100%"}</span>
          </div>
          <div className="w-full bg-[#8B5A2B]/20 h-3 rounded-full border border-[#8B5A2B] overflow-hidden">
            <div
              className="bg-[#3FA845] h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-[#E0453E]/10 border-2 border-[#E0453E] text-[#E0453E] text-xs font-bold p-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* PASO 1: Selección de Cliente */}
        {step === 1 && (
          <div className="flex flex-col gap-4 py-2">
            <h3 className="font-extrabold text-sm text-[#8B5A2B] uppercase">
              1. Selecciona el Cliente Aliado
            </h3>

            {customers.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#8B5A2B] font-bold">
                No hay clientes registrados. Registra uno primero en el módulo Aliados.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {customers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id!)}
                    className={`p-3 rounded-xl border-3 cursor-pointer transition-all flex items-center justify-between ${
                      selectedCustomerId === c.id
                        ? "bg-[#3FA845]/20 border-[#3FA845] shadow-sm"
                        : "bg-white border-[#F2B33D]/40 hover:bg-[#F2B33D]/10"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#2B2118]">{c.name}</h4>
                      <p className="text-[11px] text-gray-500 font-semibold">{c.dni}</p>
                    </div>
                    {selectedCustomerId === c.id && (
                      <CheckCircle className="w-5 h-5 text-[#3FA845]" />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <GameButton
                variant="primary"
                disabled={!selectedCustomerId}
                onClick={() => setStep(2)}
              >
                Siguiente: Seleccionar Ítems 👉
              </GameButton>
            </div>
          </div>
        )}

        {/* PASO 2: Selección de Productos e Ítems del Carrito */}
        {step === 2 && (
          <div className="flex flex-col gap-4 py-2">
            <h3 className="font-extrabold text-sm text-[#8B5A2B] uppercase">
              2. Agrega Ítems al Carrito
            </h3>

            {/* Selector de Producto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-44 overflow-y-auto border-2 border-[#F2B33D] rounded-2xl p-2 bg-[#FFF6E0]">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addToCart(p.id!)}
                  className="p-2 bg-white rounded-xl border border-gray-200 hover:border-[#3FA845] cursor-pointer flex justify-between items-center text-xs font-bold"
                >
                  <div className="truncate pr-1">
                    <p className="truncate text-[#8B5A2B]">{p.name}</p>
                    <p className="text-[10px] text-gray-500">{formatCurrency(p.price)} | Stock: {p.stock}</p>
                  </div>
                  <Plus className="w-4 h-4 text-[#3FA845] shrink-0" />
                </div>
              ))}
            </div>

            {/* Resumen del Carrito */}
            <h4 className="font-black text-xs text-[#8B5A2B] uppercase mt-2">
              Mochila de Venta ({cart.length} ítems)
            </h4>

            {cart.length === 0 ? (
              <p className="text-xs italic text-gray-500 text-center py-4">
                El carrito está vacío. Haz clic en los productos superiores.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#F2B33D]"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-xs text-[#2B2118]">{item.productName}</p>
                      <p className="text-[11px] font-semibold text-[#8B5A2B]">
                        {formatCurrency(item.unitPrice)} c/u
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={item.maxStock}
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartQuantity(item.productId, parseInt(e.target.value) || 1)
                        }
                        className="w-14 px-2 py-1 border-2 border-[#F2B33D] rounded-lg text-xs font-bold text-center bg-[#FFF6E0]"
                      />
                      <span className="font-extrabold text-xs text-[#3FA845]">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[#E0453E] hover:bg-[#E0453E]/10 p-1 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t-2 border-[#F2B33D]">
              <span className="font-black text-lg text-[#8B5A2B]">
                Total: {formatCurrency(cartTotal)}
              </span>

              <div className="flex gap-2">
                <GameButton variant="ghost" size="sm" onClick={() => setStep(1)}>
                  👈 Atrás
                </GameButton>
                <GameButton
                  variant="primary"
                  size="sm"
                  disabled={cart.length === 0}
                  onClick={() => setStep(3)}
                >
                  Siguiente: Pago 👉
                </GameButton>
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: Método de Pago y Confirmación */}
        {step === 3 && (
          <div className="flex flex-col gap-4 py-2">
            <h3 className="font-extrabold text-sm text-[#8B5A2B] uppercase">
              3. Método de Pago y Notas
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Método de Pago:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(["efectivo", "nequi", "daviplata", "transferencia", "tarjeta"] as PaymentMethod[]).map(
                  (method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded-xl border-2 font-black text-xs uppercase cursor-pointer transition-all ${
                        paymentMethod === method
                          ? "bg-[#F2B33D] text-[#8B5A2B] border-[#C1871F] shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {method}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Notas de Venta:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ej. Entrega a domicilio o descuento especial"
                className="w-full p-2.5 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-[#FFF6E0] focus:outline-none"
              />
            </div>

            {/* Resumen Final */}
            <div className="bg-[#3FA845]/10 border-2 border-[#3FA845] p-3 rounded-xl flex justify-between items-center text-xs font-bold">
              <div>
                <span className="block text-[#22703A]">Recompensa por venta:</span>
                <span className="text-[#7B4BE0]">+{Math.floor(cartTotal / 10000) + 10} XP</span> |{" "}
                <span className="text-[#8B5A2B]">+{Math.floor(cartTotal / 20000)} Monedas</span>
              </div>
              <span className="font-black text-base text-[#3FA845]">
                {formatCurrency(cartTotal)}
              </span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <GameButton variant="ghost" onClick={() => setStep(2)}>
                👈 Atrás
              </GameButton>
              <GameButton
                variant="gold"
                disabled={isSubmitting}
                onClick={handleCreateSale}
              >
                {isSubmitting ? "Procesando Venta..." : "🚀 ¡Completar Venta!"}
              </GameButton>
            </div>
          </div>
        )}
      </GameModal>

      {/* Componentes de Animación y Toast */}
      <ToastGame
        isVisible={toastData.visible}
        onClose={() => setToastData((prev) => ({ ...prev, visible: false }))}
        title={`¡Venta ${toastData.saleNumber} Registrada!`}
        message="¡Stock descontado y experiencia otorgada a tu héroe!"
        type="xp"
        xpAwarded={toastData.xp}
        coinsAwarded={toastData.coins}
      />

      <CoinBurst isActive={showCoinBurst} onComplete={() => setShowCoinBurst(false)} />
    </div>
  );
}
