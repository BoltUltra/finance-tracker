import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CATEGORY_CONFIG, Category } from "@/constants/categories";
import * as Icons from "lucide-react";

export interface CustomCategory {
  id: string;
  label: string;
  iconName: string;
  color: string;
  type: "expense" | "income";
  subCategories?: string[];
}

export interface AppCategory extends Omit<Category, "icon"> {
  icon: any;
  isCustom?: boolean;
  color?: string;
  iconName?: string; // Helpful for editing
}

export function useCategories() {
  const { user } = useAuth();
  const [customCategories, setCustomCategories] = useState<AppCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCustomCategories([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "categories"),
      (snapshot) => {
        const customs: AppCategory[] = snapshot.docs.map((doc) => {
          const data = doc.data() as CustomCategory;
          // @ts-ignore
          const IconComponent = Icons[data.iconName] || Icons.HelpCircle;

          return {
            id: doc.id,
            label: data.label,
            icon: IconComponent,
            iconName: data.iconName,
            subCategories: data.subCategories
              ? data.subCategories.map((s) =>
                  typeof s === "string" ? { id: s, label: s } : s,
                )
              : [],
            isCustom: true,
            color: data.color,
          };
        });
        setCustomCategories(customs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const addCategory = async (
    data: Omit<CustomCategory, "id" | "type"> & { type?: "expense" | "income" },
  ) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "categories"), {
        ...data,
        type: data.type || "expense",
        subCategories: [],
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  };

  const updateCategory = async (id: string, data: Partial<CustomCategory>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid, "categories", id), data);
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  // Helper to handle subcategory modifications safely
  const modifySubCategories = async (
    categoryId: string,
    modifier: (currentSubs: string[]) => string[],
  ) => {
    if (!user) return;
    try {
      const categoryRef = doc(db, "users", user.uid, "categories", categoryId);
      const categoryDoc = await import("firebase/firestore").then((mod) =>
        mod.getDoc(categoryRef),
      );

      let currentSubs: string[] = [];
      let newData: any = {};

      if (categoryDoc.exists()) {
        const data = categoryDoc.data() as CustomCategory;
        currentSubs = data.subCategories || [];
      } else {
        // Shadow doc logic
        const defaultCat = CATEGORY_CONFIG.find((c) => c.id === categoryId);
        if (!defaultCat) throw new Error("Category not found");

        currentSubs = defaultCat.subCategories.map((s) => s.label);
        newData = {
          label: defaultCat.label,
          color: defaultCat.color,
          type: "expense",
          iconName: "Circle",
          createdAt: serverTimestamp(),
        };
      }

      const newSubs = modifier(currentSubs);

      const setDoc = (await import("firebase/firestore")).setDoc;
      await setDoc(
        categoryRef,
        {
          ...newData,
          subCategories: newSubs,
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error modifying subcategories:", error);
      throw error;
    }
  };

  const addSubCategory = async (categoryId: string, subCategory: string) => {
    await modifySubCategories(categoryId, (subs) => {
      if (subs.includes(subCategory)) return subs;
      return [...subs, subCategory];
    });
  };

  const deleteSubCategory = async (categoryId: string, subCategory: string) => {
    await modifySubCategories(categoryId, (subs) =>
      subs.filter((s) => s !== subCategory),
    );
  };

  const renameSubCategory = async (
    categoryId: string,
    oldSubCategory: string,
    newSubCategory: string,
  ) => {
    await modifySubCategories(categoryId, (subs) =>
      subs.map((s) => (s === oldSubCategory ? newSubCategory : s)),
    );
  };

  // Merge Strategy:
  // 1. Start with Default Categories
  // 2. Override with Custom Categories (Firestore) if ID matches
  const mergedCategories = CATEGORY_CONFIG.map((defaultCat) => {
    const customOverride = customCategories.find((c) => c.id === defaultCat.id);
    if (customOverride) {
      return {
        ...defaultCat,
        ...customOverride,
        // Keep the original icon component from default if available,
        // unless we securely stored a valid iconName for it (which we might not have for defaults)
        icon: defaultCat.icon,
        // Use subcategories from Firestore (which includes the added ones)
        subCategories: customOverride.subCategories,
        // Mark as custom true so we know it's editable in some ways?
        // Actually, default categories even if shadowed shouldn't be fully 'isCustom' renaming wise maybe?
        // But 'isCustom' usually implies "Created by user".
        // Let's use a new flag or just check ID presence in CONFIG to determine "isDefaultOriginally".
        isCustom: false, // It remains a default category fundamentally
      };
    }
    return { ...defaultCat, isCustom: false };
  });

  // Add purely custom categories (those not in CONFIG)
  const purelyCustom = customCategories.filter(
    (c) => !CATEGORY_CONFIG.find((def) => def.id === c.id),
  );

  const allCategories = [...mergedCategories, ...purelyCustom];

  return {
    categories: allCategories,
    loading,
    addCategory,
    updateCategory,
    addSubCategory,
    deleteSubCategory,
    renameSubCategory,
  };
}
