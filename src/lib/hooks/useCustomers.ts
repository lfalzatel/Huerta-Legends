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
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Customer } from "@/types";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Customer[] = [];
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Customer, "id">),
          });
        });
        setCustomers(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error al escuchar clientes en Firestore:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Validar unicidad de email y dni con consulta previa
  const checkUniqueness = async (
    email: string,
    dni: string,
    excludeId?: string
  ): Promise<{ emailExists: boolean; dniExists: boolean }> => {
    const emailQ = query(
      collection(db, "customers"),
      where("email", "==", email.toLowerCase().trim())
    );
    const emailSnap = await getDocs(emailQ);

    const dniQ = query(
      collection(db, "customers"),
      where("dni", "==", dni.trim())
    );
    const dniSnap = await getDocs(dniQ);

    const emailExists = emailSnap.docs.some((doc) => doc.id !== excludeId);
    const dniExists = dniSnap.docs.some((doc) => doc.id !== excludeId);

    return { emailExists, dniExists };
  };

  const addCustomer = async (
    customerData: Omit<Customer, "id" | "createdAt" | "updatedAt" | "isActive">
  ) => {
    const { emailExists, dniExists } = await checkUniqueness(
      customerData.email,
      customerData.dni
    );

    if (emailExists) {
      throw new Error("Ya existe un cliente registrado con este correo electrónico.");
    }
    if (dniExists) {
      throw new Error("Ya existe un cliente registrado con este documento DNI.");
    }

    const newDoc = {
      ...customerData,
      email: customerData.email.toLowerCase().trim(),
      dni: customerData.dni.trim(),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(collection(db, "customers"), newDoc);
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    if (updates.email || updates.dni) {
      const targetEmail = updates.email || "";
      const targetDni = updates.dni || "";
      const { emailExists, dniExists } = await checkUniqueness(
        targetEmail,
        targetDni,
        id
      );
      if (updates.email && emailExists) {
        throw new Error("El correo ingresado ya pertenece a otro cliente.");
      }
      if (updates.dni && dniExists) {
        throw new Error("El DNI ingresado ya pertenece a otro cliente.");
      }
    }

    const customerRef = doc(db, "customers", id);
    await updateDoc(customerRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteCustomer = async (id: string) => {
    const customerRef = doc(db, "customers", id);
    await updateDoc(customerRef, {
      isActive: false,
      updatedAt: serverTimestamp(),
    });
  };

  const activeCustomers = customers.filter((c) => c.isActive);

  return {
    customers: activeCustomers,
    allCustomers: customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
