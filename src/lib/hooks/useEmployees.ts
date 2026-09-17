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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Employee } from "@/types";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "employees"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Employee[] = [];
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Employee, "id">),
          });
        });
        setEmployees(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error al escuchar empleados en Firestore:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addEmployee = async (
    employeeData: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => {
    const newDoc = {
      ...employeeData,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(collection(db, "employees"), newDoc);
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    const empRef = doc(db, "employees", id);
    await updateDoc(empRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteEmployee = async (id: string) => {
    const empRef = doc(db, "employees", id);
    await updateDoc(empRef, {
      isActive: false,
      updatedAt: serverTimestamp(),
    });
  };

  const activeEmployees = employees.filter((e) => e.isActive);

  return {
    employees: activeEmployees,
    allEmployees: employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
