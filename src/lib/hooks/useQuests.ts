"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DailyQuest } from "@/types";
import { checkLevelUp } from "@/lib/gamification";

export function useQuests(userId: string | undefined) {
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [loading, setLoading] = useState(true);

  const getTodayKey = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!userId) {
      setQuests([]);
      setLoading(false);
      return;
    }

    const todayKey = getTodayKey();
    const questsColRef = collection(db, "users", userId, "quests");

    const initializeQuests = async () => {
      try {
        const snapshot = await getDocs(questsColRef);

        // Si no existen misiones para el día actual, generarlas
        const todayQuests = snapshot.docs.filter((d) => d.id.startsWith(todayKey));

        if (todayQuests.length === 0) {
          const defaultQuests: DailyQuest[] = [
            {
              id: `${todayKey}-q1`,
              title: "🌱 Cosechador Entusiasta",
              description: "Registra al menos 3 ventas completadas hoy.",
              rewardXP: 40,
              rewardCoins: 20,
              progress: 0,
              target: 3,
              isCompleted: false,
              type: "sales",
            },
            {
              id: `${todayKey}-q2`,
              title: "🤝 Sembrador de Aliados",
              description: "Registra 1 nuevo cliente en el sistema.",
              rewardXP: 30,
              rewardCoins: 15,
              progress: 0,
              target: 1,
              isCompleted: false,
              type: "customer",
            },
            {
              id: `${todayKey}-q3`,
              title: "🎒 Guardián de la Mochila",
              description: "Revisa o actualiza el stock del inventario.",
              rewardXP: 25,
              rewardCoins: 10,
              progress: 1,
              target: 1,
              isCompleted: false,
              type: "inventory",
            },
          ];

          for (const q of defaultQuests) {
            await setDoc(doc(questsColRef, q.id), q);
          }
        }
      } catch (err) {
        console.error("Error al inicializar misiones diarias:", err);
      }
    };

    initializeQuests();

    const unsubscribe = onSnapshot(
      questsColRef,
      (snapshot) => {
        const list: DailyQuest[] = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.id.startsWith(todayKey)) {
            list.push(docSnap.data() as DailyQuest);
          }
        });
        setQuests(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error al escuchar misiones:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Reclamar recompensa de misión
  const claimQuestReward = async (questId: string) => {
    if (!userId) return;

    await runTransaction(db, async (transaction) => {
      const questRef = doc(db, "users", userId, "quests", questId);
      const userRef = doc(db, "users", userId);

      const questSnap = await transaction.get(questRef);
      const userSnap = await transaction.get(userRef);

      if (!questSnap.exists() || !userSnap.exists()) return;

      const questData = questSnap.data() as DailyQuest;
      const userData = userSnap.data();

      if (questData.isCompleted) return;

      const xpCheck = checkLevelUp(
        userData.level ?? 1,
        userData.xp ?? 0,
        questData.rewardXP
      );

      let newCoins = (userData.coins ?? 0) + questData.rewardCoins;
      if (xpCheck.leveledUp) {
        newCoins += 50;
      }

      transaction.update(userRef, {
        level: xpCheck.newLevel,
        xp: xpCheck.newXP,
        coins: newCoins,
        updatedAt: serverTimestamp(),
      });

      transaction.update(questRef, {
        isCompleted: true,
      });
    });
  };

  return {
    quests,
    loading,
    claimQuestReward,
  };
}
