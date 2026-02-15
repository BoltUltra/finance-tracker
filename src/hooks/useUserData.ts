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
          setUserData(docSnap.data() as UserData);
          setLoading(false);
        } else {
          // Create default user document if it doesn't exist
          const initialData: UserData = {
            bank: 0,
            cash: 0,
            savings: 0,
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
