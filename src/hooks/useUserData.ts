"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { UserData } from "@/types/user";

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;

          // Migration: If user has old monthlyBudget but no new budget object
          if (data.monthlyBudget && !data.budget) {
            const migratedBudget = {
              amount: data.monthlyBudget,
              frequency: "monthly" as const,
            };

            // Verify we are not in an infinite loop by checking if we already tried
            // In a real app, we'd write to DB here. For now, we'll patch the local state
            // and update the DB asynchronously
            setDoc(userRef, { budget: migratedBudget }, { merge: true }).catch(
              console.error,
            );

            setUserData({ ...data, budget: migratedBudget });
          } else {
            setUserData(data);
          }
          setLoading(false);
        } else {
          // Create default user document if it doesn't exist
          const initialData: UserData = {
            bank: 0,
            cash: 0,
            savings: 0,
            budget: { amount: 0, frequency: "monthly" }, // Default to monthly
            updatedAt: new Date(),
          };
          // Optimistic update: Show dashboard immediately
          setUserData(initialData);
          setLoading(false);

          setDoc(userRef, initialData).catch((err) => {
            console.error("Error creating user doc:", err);
          });
        }
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  return { userData, loading, error };
}
