"use client";

import { formatCurrency, getBudgetRange, getPastPeriods } from "@/lib/utils";
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
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SpendingInsightHeader } from "@/components/budget/SpendingInsightHeader";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { BudgetCategoryList } from "@/components/budget/BudgetCategoryList";
import { BudgetHistory } from "@/components/budget/BudgetHistory";

export default function BudgetPage() {
  const { user } = useAuth();
  const { userData, loading: userLoading } = useUserData();
  const { categories, loading: catLoading } = useCategories();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const budget = userData?.budget?.amount ?? userData?.monthlyBudget ?? 6000;
  const frequency = userData?.budget?.frequency ?? "monthly";

  useEffect(() => {
    if (!user) return;

    // Get the start date for the active budget period to calculate "Spent"
    const { start: currentPeriodStart } = getBudgetRange(frequency);

    // Get the start date for history (5 periods back)
    const periods = getPastPeriods(frequency, 5);
    const historyStart = periods[periods.length - 1].start; // Oldest start date

    // Query mostly everything for history
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      where("date", ">=", historyStart), // Fetch enough for history
      orderBy("date", "desc"),
    );

    setLoading(true);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const txs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as any,
        );

        setTransactions(txs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, frequency]);

  if (userLoading || catLoading || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Calculate Spending for CURRENT period
  const { start: currentPeriodStart } = getBudgetRange(frequency);
  const currentPeriodTransactions = transactions.filter((tx) => {
    const txDate = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
    return txDate >= currentPeriodStart;
  });

  // Map category ID -> Spend (Current Period)
  const spendMap: Record<string, number> = {};
  currentPeriodTransactions.forEach((tx: any) => {
    if (tx.type === "expense") {
      const catId = tx.category || "other";
      spendMap[catId] = (spendMap[catId] || 0) + tx.amount;
    }
  });

  const totalSpent = Object.values(spendMap).reduce((a, b) => a + b, 0);

  // Prepare List Data
  const categoryList = categories
    .map((cat) => {
      const spent = spendMap[cat.id] || 0;
      const allocated = userData?.categoryBudgets?.[cat.id] || 0;
      // Count transactions for this category (Current Period)
      const count = currentPeriodTransactions.filter(
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
        totalBudget={budget}
        totalSpent={totalSpent}
        categorySpending={chartData}
        initialAllocations={userData?.categoryBudgets}
        frequency={frequency}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <BudgetHistory
          transactions={transactions}
          totalBudget={budget}
          frequency={frequency}
        />
        <BudgetCategoryList data={categoryList} />
      </div>
    </div>
  );
}
