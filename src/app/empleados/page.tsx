"use client";

import React, { useState } from "react";
import { ResourceBar } from "@/components/game/ResourceBar";
import { MainNav } from "@/components/layout/main-nav";
import { GamePanel } from "@/components/game/GamePanel";
import { GameButton } from "@/components/game/GameButton";
import { GameTable } from "@/components/game/GameTable";
import { GameModal } from "@/components/game/GameModal";
import { useEmployees } from "@/lib/hooks/useEmployees";
import { useProducts } from "@/lib/hooks/useProducts";
import { useAuth } from "@/components/providers/auth-provider";
import { Employee } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { UserCheck, Plus, ShieldAlert, Edit, Trash2, Swords } from "lucide-react";
import Link from "next/link";

export default function EmpleadosPage() {
  const { userProfile } = useAuth();
  const { employees, loading, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { lowStockCount } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "Cosechador Experto",
    salary: 1500000,
    hireDate: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protección de acceso: solo Administradores
  if (userProfile && userProfile.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#5BC8F5] flex flex-col font-game">
        <ResourceBar lowStockCount={lowStockCount} />
        <MainNav />
        <main className="max-w-2xl mx-auto my-12 p-8 bg-[#FFF6E0] border-4 border-[#E0453E] rounded-3xl text-center shadow-[0_8px_0_#9c2d28] flex flex-col items-center gap-4">
          <ShieldAlert className="w-16 h-16 text-[#E0453E] animate-bounce" />
          <h2 className="text-2xl font-black text-[#8B5A2B]">ACCESO RESTRINGIDO — SOLO ADMINS</h2>
          <p className="text-sm font-bold text-[#2B2118]">
            Tu rol actual de usuario es <span className="uppercase text-[#3FA845] font-black">{userProfile.role}</span>. Únicamente los Administradores de la huerta pueden gestionar las fichas de los Héroes del Equipo.
          </p>
          <Link href="/">
            <GameButton variant="primary">Volver al Mapa de la Huerta</GameButton>
          </Link>
        </main>
      </div>
    );
  }

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "Cosechador Experto",
      salary: 1500000,
      hireDate: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      position: emp.position,
      salary: emp.salary,
      hireDate: emp.hireDate,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingEmployee && editingEmployee.id) {
        await updateEmployee(editingEmployee.id, {
          ...formData,
          salary: Number(formData.salary),
        });
      } else {
        await addEmployee({
          ...formData,
          salary: Number(formData.salary),
          isActive: true,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error al guardar el héroe del equipo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (emp: Employee) => {
    if (confirm(`¿Desactivar la ficha de héroe de "${emp.name}"?`)) {
      try {
        await deleteEmployee(emp.id!);
      } catch (err) {
        console.error(err);
        alert("Error al eliminar empleado.");
      }
    }
  };

  const employeeColumns = [
    {
      key: "name",
      header: "Héroe del Equipo",
      render: (e: Employee) => (
        <div>
          <span className="font-extrabold text-[#8B5A2B] block">{e.name}</span>
          <span className="text-[11px] text-gray-500 font-semibold">{e.email}</span>
        </div>
      ),
    },
    {
      key: "position",
      header: "Clase / Cargo",
      render: (e: Employee) => (
        <span className="bg-[#7B4BE0]/20 text-[#7B4BE0] border border-[#7B4BE0] px-2.5 py-0.5 rounded-full text-xs font-black">
          ⚔️ {e.position}
        </span>
      ),
    },
    { key: "phone", header: "Contacto" },
    {
      key: "salary",
      header: "Salario (COP)",
      render: (e: Employee) => (
        <span className="font-black text-[#3FA845]">{formatCurrency(e.salary)}</span>
      ),
    },
    { key: "hireDate", header: "Ingreso" },
    {
      key: "actions",
      header: "Acciones",
      render: (e: Employee) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditModal(e)}
            className="p-1.5 bg-[#3FA845] text-white rounded-lg hover:scale-105 cursor-pointer"
            title="Editar héroe"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(e)}
            className="p-1.5 bg-[#E0453E] text-white rounded-lg hover:scale-105 cursor-pointer"
            title="Desactivar héroe"
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
              <UserCheck className="w-8 h-8 text-[#3FA845]" /> HÉROES DEL EQUIPO (EMPLEADOS)
            </h1>
            <p className="text-xs sm:text-sm text-[#2B2118] font-bold">
              Gestión del personal de la huerta. Cada miembro cuenta con su clase de personaje y salario asignado.
            </p>
          </div>

          <GameButton
            variant="primary"
            onClick={openAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Nuevo Héroe
          </GameButton>
        </div>

        <GamePanel title="⚔️ Nómina de Personajes del Equipo">
          {loading ? (
            <p className="text-center text-sm font-bold text-[#8B5A2B] py-8">
              Cargando héroes desde Firestore...
            </p>
          ) : (
            <GameTable columns={employeeColumns} data={employees} emptyMessage="No hay héroes del equipo registrados." />
          )}
        </GamePanel>
      </main>

      {/* Modal Agregar / Editar Empleado */}
      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? "✏️ Editar Héroe del Equipo" : "🛡️ Registrar Nuevo Héroe"}
        icon={<Swords className="w-6 h-6 text-[#F2B33D]" />}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-[#8B5A2B]">Nombre del Héroe:</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              placeholder="Ej. Juan Manuel Cosechador"
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
                placeholder="juan@huerta.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Clase / Cargo:</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              >
                <option value="Cosechador Experto">🌾 Cosechador Experto</option>
                <option value="Maestro Botánico">🪴 Maestro Botánico</option>
                <option value="Guardián de Inventario">🎒 Guardián de Inventario</option>
                <option value="Administrador General">🛡️ Administrador General</option>
              </select>
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
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Salario Mensual (COP):</label>
              <input
                type="number"
                required
                min="0"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-[#8B5A2B]">Fecha de Contratación:</label>
            <input
              type="date"
              required
              value={formData.hireDate}
              onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
              className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <GameButton variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </GameButton>
            <GameButton variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Héroe"}
            </GameButton>
          </div>
        </form>
      </GameModal>
    </div>
  );
}
