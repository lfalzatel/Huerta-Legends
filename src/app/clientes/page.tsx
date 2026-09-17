"use client";

import React, { useState } from "react";
import { ResourceBar } from "@/components/game/ResourceBar";
import { MainNav } from "@/components/layout/main-nav";
import { GamePanel } from "@/components/game/GamePanel";
import { GameButton } from "@/components/game/GameButton";
import { GameTable } from "@/components/game/GameTable";
import { GameModal } from "@/components/game/GameModal";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useSales } from "@/lib/hooks/useSales";
import { useProducts } from "@/lib/hooks/useProducts";
import { Customer, Sale } from "@/types";
import { calcCustomerTier } from "@/lib/gamification";
import { formatCurrency } from "@/lib/utils";
import { Users, Plus, Shield, Edit, Trash2, ShoppingBag, Mail, Phone, MapPin, CreditCard } from "lucide-react";

export default function ClientesPage() {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { sales } = useSales();
  const { lowStockCount } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dni: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ name: "", email: "", phone: "", address: "", dni: "" });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      dni: customer.dni,
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      if (editingCustomer && editingCustomer.id) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await addCustomer(formData);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Error al guardar cliente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (confirm(`¿Desactivar al aliado "${customer.name}"?`)) {
      try {
        await deleteCustomer(customer.id!);
      } catch (err) {
        console.error(err);
        alert("Error al eliminar cliente.");
      }
    }
  };

  // Calcular total acumulado comprado por cada cliente
  const getCustomerTotalSpent = (customerId: string): number => {
    return sales
      .filter((s) => s.customerId === customerId && s.status === "completada")
      .reduce((acc, s) => acc + s.totalAmount, 0);
  };

  const customerColumns = [
    {
      key: "name",
      header: "Aliado",
      render: (c: Customer) => (
        <div>
          <span className="font-extrabold text-[#8B5A2B] block">{c.name}</span>
          <span className="text-[11px] text-gray-500 font-semibold">{c.email}</span>
        </div>
      ),
    },
    { key: "dni", header: "DNI / NIF" },
    { key: "phone", header: "Teléfono" },
    {
      key: "tier",
      header: "Rango Aliado",
      render: (c: Customer) => {
        const spent = getCustomerTotalSpent(c.id!);
        const { tier, color } = calcCustomerTier(spent);
        return (
          <div className="flex items-center gap-1">
            <Shield className={`w-4 h-4 ${color}`} />
            <span className={`text-xs uppercase ${color}`}>{tier}</span>
          </div>
        );
      },
    },
    {
      key: "totalSpent",
      header: "Compras Acumuladas",
      render: (c: Customer) => {
        const spent = getCustomerTotalSpent(c.id!);
        return <span className="font-black text-[#3FA845]">{formatCurrency(spent)}</span>;
      },
    },
    {
      key: "actions",
      header: "Acciones",
      render: (c: Customer) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedCustomerForHistory(c)}
            className="p-1.5 bg-[#F2B33D] text-[#8B5A2B] rounded-lg hover:scale-105 cursor-pointer"
            title="Ver historial de compras"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(c)}
            className="p-1.5 bg-[#3FA845] text-white rounded-lg hover:scale-105 cursor-pointer"
            title="Editar cliente"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(c)}
            className="p-1.5 bg-[#E0453E] text-white rounded-lg hover:scale-105 cursor-pointer"
            title="Desactivar cliente"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
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
              <Users className="w-8 h-8 text-[#3FA845]" /> ALIADOS DE LA HUERTA
            </h1>
            <p className="text-xs sm:text-sm text-[#2B2118] font-bold">
              Gestión de clientes de la huerta orgánica. Su rango (Bronce/Plata/Oro) evoluciona con sus compras.
            </p>
          </div>

          <GameButton
            variant="primary"
            onClick={openAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Nuevo Aliado
          </GameButton>
        </div>

        <GamePanel title="🛡️ Directorio de Aliados">
          {loading ? (
            <p className="text-center text-sm font-bold text-[#8B5A2B] py-8">
              Cargando aliados desde Firestore...
            </p>
          ) : (
            <GameTable columns={customerColumns} data={customers} emptyMessage="No hay aliados registrados." />
          )}
        </GamePanel>
      </main>

      {/* Modal Agregar / Editar Cliente */}
      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "✏️ Editar Aliado" : "🤝 Registrar Nuevo Aliado"}
        icon={<Users className="w-6 h-6 text-[#F2B33D]" />}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-2">
          {errorMsg && (
            <div className="bg-[#E0453E]/10 border-2 border-[#E0453E] text-[#E0453E] text-xs font-bold p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-[#8B5A2B]">Nombre Completo:</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              placeholder="Ej. Maria Camila Pérez"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Correo Electrónico:</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
                placeholder="maria@ejemplo.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">DNI / Cédula:</label>
              <input
                type="text"
                required
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
                placeholder="1020304050"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Teléfono:</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-[#FFF6E0] focus:outline-none"
                placeholder="300 123 4567"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Dirección:</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-[#FFF6E0] focus:outline-none"
                placeholder="Calle 100 #15-20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <GameButton variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </GameButton>
            <GameButton variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Aliado"}
            </GameButton>
          </div>
        </form>
      </GameModal>

      {/* Modal Historial de Compras */}
      <GameModal
        isOpen={Boolean(selectedCustomerForHistory)}
        onClose={() => setSelectedCustomerForHistory(null)}
        title={`📜 Historial — ${selectedCustomerForHistory?.name}`}
        icon={<ShoppingBag className="w-6 h-6 text-[#F2B33D]" />}
      >
        <div className="flex flex-col gap-3 py-2">
          {sales.filter((s) => s.customerId === selectedCustomerForHistory?.id).length === 0 ? (
            <p className="text-xs italic text-gray-500 text-center py-4">
              Este aliado aún no registra compras en la huerta.
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {sales
                .filter((s) => s.customerId === selectedCustomerForHistory?.id)
                .map((s) => (
                  <div
                    key={s.id}
                    className="p-3 bg-white rounded-xl border border-[#F2B33D] flex justify-between items-center text-xs font-bold"
                  >
                    <div>
                      <span className="text-[#8B5A2B] block">{s.saleNumber}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{s.paymentMethod} | {s.status}</span>
                    </div>
                    <span className="text-[#3FA845] font-black">{formatCurrency(s.totalAmount)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </GameModal>
    </div>
  );
}
