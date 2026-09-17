"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";
import { SEED_PRODUCTS } from "@/lib/seed-data";
import { calcProductRarity } from "@/lib/gamification";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Product[] = [];
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Product, "id">),
          });
        });
        setProducts(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error al escuchar productos en Firestore:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Función para sembrar los 30+ productos si la colección está vacía
  const seedDatabase = async () => {
    try {
      setSeeding(true);
      const snapshot = await getDocs(collection(db, "products"));
      if (!snapshot.empty) {
        console.log("La base de datos ya tiene productos sembrados.");
        setSeeding(false);
        return;
      }

      const batch = writeBatch(db);
      SEED_PRODUCTS.forEach((prod) => {
        const newDocRef = doc(collection(db, "products"));
        batch.set(newDocRef, {
          ...prod,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      console.log("30+ productos sembrados exitosamente en Firestore.");
    } catch (err) {
      console.error("Error al sembrar productos:", err);
    } finally {
      setSeeding(false);
    }
  };

  const addProduct = async (productData: Omit<Product, "id">) => {
    const rarity = calcProductRarity(productData.price);
    const newDoc = {
      ...productData,
      rarity,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(collection(db, "products"), newDoc);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const productRef = doc(db, "products", id);
    const dataToUpdate: Record<string, unknown> = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    if (updates.price !== undefined) {
      dataToUpdate.rarity = calcProductRarity(updates.price);
    }
    await updateDoc(productRef, dataToUpdate);
  };

  const deleteProduct = async (id: string) => {
    // Borrado lógico preferido (isActive: false)
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, {
      isActive: false,
      updatedAt: serverTimestamp(),
    });
  };

  const activeProducts = products.filter((p) => p.isActive);
  const lowStockProducts = activeProducts.filter((p) => p.stock <= p.minStock);

  return {
    products: activeProducts,
    allProducts: products,
    loading,
    seeding,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    seedDatabase,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
