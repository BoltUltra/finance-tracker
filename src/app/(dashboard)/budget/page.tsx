"use client";

import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useCategories } from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SpendingInsightHeader } from "@/components/budget/SpendingInsightHeader";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { BudgetCategoryList } from "@/components/budget/BudgetCategoryList";

export default function BudgetPage() {
  const { user } = useAuth();
  const { userData, loading: userLoading } = useUserData();
  const { categories, loading: catLoading } = useCategories();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
    );

    setLoading(true);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const txs = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
          .filter((tx) => {
            const txDate = tx.date?.toDate
              ? tx.date.toDate()
              : new Date(tx.date);
            return txDate >= startOfMonth;
          });

        setTransactions(txs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  if (userLoading || catLoading || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Calculate Spending
  // Map category ID -> Spend
  const spendMap: Record<string, number> = {};
  transactions.forEach((tx: any) => {
    if (tx.type === "expense") {
      const catId = tx.category || "other"; // Fixed: use 'category' field
      spendMap[catId] = (spendMap[catId] || 0) + tx.amount;
    }
  });

  const totalSpent = Object.values(spendMap).reduce((a, b) => a + b, 0);
  const totalBudget = userData?.monthlyBudget || 6000;

  // Prepare List Data
  const categoryList = categories
    .map((cat) => {
      const spent = spendMap[cat.id] || 0;
      const allocated = userData?.categoryBudgets?.[cat.id] || 0;
      // Count transactions for this category
      const count = transactions.filter(
        (t) => t.category === cat.id && t.type === "expense",
      ).length;

      return {
        category: cat,
        spent,
        allocated,
        transactionCount: count,
      };
    })
    .filter((item) => item.spent > 0 || item.allocated > 0) // Only show active categories
    .sort((a, b) => b.spent - a.spent); // Sort by highest spend

  // Prepare Chart Data (Top categories + others if too many?)
  // For now, map all active categories
  const chartData = categoryList
    .map((item) => ({
      name: item.category.label,
      value: item.spent,
      color: item.category.color || "#9CA3AF",
    }))
    .filter((i) => i.value > 0);

  return (
    <div className="p-6 pb-24 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      <SpendingInsightHeader />

      <BudgetOverview
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        categorySpending={chartData}
        initialAllocations={userData?.categoryBudgets}
      />

      <BudgetCategoryList data={categoryList} />
    </div>
  );
}
