"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  runTransaction,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Sale, SaleItem, PaymentMethod } from "@/types";
import { calcSaleXP, calcSaleCoins, checkLevelUp } from "@/lib/gamification";

export interface CreateSaleInput {
  customerId: string;
  customerName: string;
  employeeId: string | null;
  employeeName: string | null;
  userId: string;
  paymentMethod: PaymentMethod;
  notes: string | null;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "sales"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Sale[] = [];
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Sale, "id">),
          });
        });
        setSales(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error al escuchar ventas en Firestore:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Función para obtener los ítems de una subcolección sales/{id}/items
  const getSaleItems = async (saleId: string): Promise<SaleItem[]> => {
    const itemsSnap = await getDocs(collection(db, "sales", saleId, "items"));
    const items: SaleItem[] = [];
    itemsSnap.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<SaleItem, "id">),
      });
    });
    return items;
  };

  /**
   * Registro atómico de una venta en Firestore con runTransaction
   */
  const createSaleTransaction = async (
    input: CreateSaleInput
  ): Promise<{ saleId: string; saleNumber: string; xpAwarded: number; coinsAwarded: number }> => {
    return await runTransaction(db, async (transaction) => {
      // 1. Leer y verificar el stock de todos los productos involucrados
      const productDocs: Array<{
        ref: ReturnType<typeof doc>;
        currentStock: number;
        name: string;
        quantityNeeded: number;
      }> = [];

      for (const item of input.items) {
        const productRef = doc(db, "products", item.productId);
        const productSnap = await transaction.get(productRef);

        if (!productSnap.exists()) {
          throw new Error(`El producto "${item.productName}" no existe en el catálogo.`);
        }

        const productData = productSnap.data();
        const currentStock = productData.stock ?? 0;

        if (currentStock < item.quantity) {
          throw new Error(
            `Stock insuficiente para "${item.productName}". Disponible: ${currentStock}, Solicitado: ${item.quantity}`
          );
        }

        productDocs.push({
          ref: productRef,
          currentStock,
          name: item.productName,
          quantityNeeded: item.quantity,
        });
      }

      // 2. Leer y actualizar el contador de ventas counters/sales
      const counterRef = doc(db, "counters", "sales");
      const counterSnap = await transaction.get(counterRef);
      let currentCounter = 1;

      if (counterSnap.exists()) {
        currentCounter = (counterSnap.data().current ?? 0) + 1;
        transaction.update(counterRef, { current: currentCounter });
      } else {
        transaction.set(counterRef, { current: 1 });
      }

      const saleNumber = `HH-${String(currentCounter).padStart(6, "0")}`;

      // 3. Leer perfil del usuario para otorgar XP y Monedas
      const userRef = doc(db, "users", input.userId);
      const userSnap = await transaction.get(userRef);

      const totalAmount = input.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      const itemsCount = input.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const xpAwarded = calcSaleXP(totalAmount);
      const coinsAwarded = calcSaleCoins(totalAmount);

      let newLevel = 1;
      let newXP = 0;
      let currentCoins = 0;

      if (userSnap.exists()) {
        const userData = userSnap.data();
        currentCoins = (userData.coins ?? 0) + coinsAwarded;
        const levelCheck = checkLevelUp(
          userData.level ?? 1,
          userData.xp ?? 0,
          xpAwarded
        );
        newLevel = levelCheck.newLevel;
        newXP = levelCheck.newXP;

        // Si sube de nivel, otorgar +50 monedas extra como recompensa
        if (levelCheck.leveledUp) {
          currentCoins += 50;
        }

        transaction.update(userRef, {
          level: newLevel,
          xp: newXP,
          coins: currentCoins,
          updatedAt: serverTimestamp(),
        });
      }

      // 4. Crear el documento de la venta sales/{id}
      const newSaleRef = doc(collection(db, "sales"));

      transaction.set(newSaleRef, {
        saleNumber,
        customerId: input.customerId,
        customerName: input.customerName,
        employeeId: input.employeeId,
        employeeName: input.employeeName,
        userId: input.userId,
        totalAmount,
        itemsCount,
        paymentMethod: input.paymentMethod,
        status: "completada",
        notes: input.notes,
        xpAwarded,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 5. Crear los ítems en la subcolección sales/{id}/items
      for (const item of input.items) {
        const itemRef = doc(collection(db, "sales", newSaleRef.id, "items"));
        transaction.set(itemRef, {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
        });
      }

      // 6. Descontar el stock de cada producto
      for (const prod of productDocs) {
        transaction.update(prod.ref, {
          stock: prod.currentStock - prod.quantityNeeded,
          updatedAt: serverTimestamp(),
        });
      }

      return {
        saleId: newSaleRef.id,
        saleNumber,
        xpAwarded,
        coinsAwarded,
      };
    });
  };

  /**
   * Cancelación atómica de una venta que devuelve el stock
   */
  const cancelSaleTransaction = async (saleId: string): Promise<void> => {
    return await runTransaction(db, async (transaction) => {
      const saleRef = doc(db, "sales", saleId);
      const saleSnap = await transaction.get(saleRef);

      if (!saleSnap.exists()) {
        throw new Error("La venta especificada no existe.");
      }

      const saleData = saleSnap.data();
      if (saleData.status === "cancelada") {
        throw new Error("La venta ya se encuentra cancelada.");
      }

      // Leer los ítems de la subcolección
      const itemsSnap = await getDocs(collection(db, "sales", saleId, "items"));

      // Devolver el stock de cada producto en la transacción
      for (const itemDoc of itemsSnap.docs) {
        const itemData = itemDoc.data();
        const productRef = doc(db, "products", itemData.productId);
        const productSnap = await transaction.get(productRef);

        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock ?? 0;
          transaction.update(productRef, {
            stock: currentStock + itemData.quantity,
            updatedAt: serverTimestamp(),
          });
        }
      }

      // Actualizar estado de la venta a cancelada
      transaction.update(saleRef, {
        status: "cancelada",
        updatedAt: serverTimestamp(),
      });
    });
  };

  return {
    sales,
    loading,
    getSaleItems,
    createSaleTransaction,
    cancelSaleTransaction,
  };
}
