"use client";

import React, { useState } from "react";
import { ResourceBar } from "@/components/game/ResourceBar";
import { MainNav } from "@/components/layout/main-nav";
import { GamePanel } from "@/components/game/GamePanel";
import { GameButton } from "@/components/game/GameButton";
import { ItemCard } from "@/components/game/ItemCard";
import { GameModal } from "@/components/game/GameModal";
import { useProducts } from "@/lib/hooks/useProducts";
import { Product, ProductCategory } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  Plus,
  Search,
  Sparkles,
  Edit,
  Trash2,
  AlertCircle,
  Filter,
} from "lucide-react";

export default function ProductosPage() {
  const {
    products,
    loading,
    lowStockCount,
    seedDatabase,
    seeding,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterLowStockOnly, setFilterLowStockOnly] = useState<boolean>(false);

  // Estados Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "vegetales" as ProductCategory,
    price: 5000,
    stock: 20,
    minStock: 5,
    image: "",
    sku: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "todos", label: "🎒 Todos" },
    { id: "vegetales", label: "🥦 Vegetales" },
    { id: "frutas", label: "🍎 Frutas" },
    { id: "hierbas", label: "🌿 Hierbas" },
    { id: "plantas", label: "🪴 Plantas" },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "todos" || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLowStock = !filterLowStockOnly || p.stock <= p.minStock;

    return matchesCategory && matchesSearch && matchesLowStock;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      category: "vegetales",
      price: 5000,
      stock: 20,
      minStock: 5,
      image: "",
      sku: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      image: product.image || "",
      sku: product.sku || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingProduct && editingProduct.id) {
        await updateProduct(editingProduct.id, {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock),
          minStock: Number(formData.minStock),
          image: formData.image || null,
          sku: formData.sku || null,
        });
      } else {
        await addProduct({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock),
          minStock: Number(formData.minStock),
          image: formData.image || null,
          sku: formData.sku || null,
          isActive: true,
          rarity: "comun",
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error al guardar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`¿Desactivar "${product.name}" de la mochila de inventario?`)) {
      try {
        await deleteProduct(product.id!);
      } catch (err) {
        console.error(err);
        alert("Error al eliminar el producto.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#5BC8F5] flex flex-col font-game pb-12">
      <ResourceBar lowStockCount={lowStockCount} />
      <MainNav />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-6">
        {/* Banner de Inventario */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-3xl p-6 shadow-[0_8px_0_#C1871F]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#8B5A2B] tracking-wide flex items-center gap-2">
              <Package className="w-8 h-8 text-[#3FA845]" /> MOCHILA DE INVENTARIO
            </h1>
            <p className="text-xs sm:text-sm text-[#2B2118] font-bold">
              Catálogo de ítems de la huerta. La rareza se deriva automáticamente del precio COP.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {products.length === 0 && (
              <GameButton
                variant="gold"
                onClick={seedDatabase}
                disabled={seeding}
                icon={<Sparkles className="w-4 h-4" />}
              >
                {seeding ? "Sembrando..." : "🌱 Sembrar 30+ Productos"}
              </GameButton>
            )}

            <GameButton
              variant="primary"
              onClick={openAddModal}
              icon={<Plus className="w-4 h-4" />}
            >
              Nuevo Ítem
            </GameButton>
          </div>
        </div>

        {/* Pestañas de Categoría & Filtros estilo Pergamino */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#FFF6E0] border-4 border-[#F2B33D] rounded-2xl p-4 shadow-[0_6px_0_#C1871F]">
          {/* Pestañas Patios */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all border-b-4 cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-[#3FA845] text-white border-[#22703A] shadow-sm scale-105"
                    : "bg-[#FFF6E0] text-[#8B5A2B] border-[#F2B33D] hover:bg-[#F2B33D]/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Buscador & Filtro de Alerta */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#8B5A2B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o SKU..."
                className="w-full pl-9 pr-3 py-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
              className={`p-2 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                filterLowStockOnly
                  ? "bg-[#E0453E] text-white border-[#9c2d28]"
                  : "bg-white text-[#8B5A2B] border-[#F2B33D] hover:bg-[#F2B33D]/10"
              }`}
              title="Filtrar solo productos con stock bajo mínimo"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Stock Bajo ({lowStockCount})</span>
            </button>
          </div>
        </div>

        {/* Cuadrícula de Ítems (Mochila de Inventario) */}
        {loading ? (
          <div className="text-center py-12 text-sm font-bold text-[#8B5A2B]">
            Cargando ítems de la mochila...
          </div>
        ) : filteredProducts.length === 0 ? (
          <GamePanel className="text-center py-12">
            <Package className="w-16 h-16 text-[#8B5A2B]/40 mx-auto mb-2" />
            <h3 className="font-extrabold text-lg text-[#8B5A2B]">
              No se encontraron ítems en esta categoría
            </h3>
            <p className="text-xs text-[#2B2118] mt-1 font-semibold">
              Intenta cambiar los filtros o sembrar el catálogo original de 30+ productos.
            </p>
          </GamePanel>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ItemCard product={product} onClick={() => openEditModal(product)} />

                {/* Acciones de edición/eliminación al pasar sobre la tarjeta */}
                <div className="absolute top-2 left-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(product);
                    }}
                    className="p-1.5 bg-[#F2B33D] text-[#8B5A2B] rounded-lg border border-[#C1871F] shadow hover:scale-110 cursor-pointer"
                    title="Editar producto"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product);
                    }}
                    className="p-1.5 bg-[#E0453E] text-white rounded-lg border border-[#9c2d28] shadow hover:scale-110 cursor-pointer"
                    title="Desactivar producto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Agregar/Editar Producto */}
      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "✏️ Editar Ítem de Inventario" : "🌱 Nuevo Ítem de Inventario"}
        icon={<Package className="w-6 h-6 text-[#F2B33D]" />}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-[#8B5A2B]">Nombre del Producto:</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              placeholder="Ej. Tomate Chonto Orgánico"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-[#8B5A2B]">Descripción:</label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              placeholder="Ej. Cultivado sin pesticidas sintéticos en la Sabana."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Categoría:</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ProductCategory })
                }
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              >
                <option value="vegetales">🥦 Vegetales</option>
                <option value="frutas">🍎 Frutas</option>
                <option value="hierbas">🌿 Hierbas</option>
                <option value="plantas">🪴 Plantas</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Precio (COP):</label>
              <input
                type="number"
                required
                min="100"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Stock Actual:</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">Stock Mínimo Alerta:</label>
              <input
                type="number"
                required
                min="1"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">SKU / Código:</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ej. VEG-TOM-001"
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#8B5A2B]">URL Imagen (Opcional):</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="p-2 border-2 border-[#F2B33D] rounded-xl text-xs font-bold bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-[#F2B33D]/20 p-2.5 rounded-xl border border-[#F2B33D] text-[11px] font-bold text-[#8B5A2B]">
            ✨ Rareza Derivada: <span className="uppercase text-[#3FA845] font-black">
              {formData.price < 5000 ? "Común" : formData.price < 15000 ? "Raro" : formData.price < 40000 ? "Épico" : "Legendario"}
            </span>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <GameButton variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </GameButton>
            <GameButton variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Ítem"}
            </GameButton>
          </div>
        </form>
      </GameModal>
    </div>
  );
}
