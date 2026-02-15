"use client";

import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useCategories } from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import { CategoryDetailHeader } from "@/components/budget/CategoryDetailHeader";
import { SpendingBreakdownCard } from "@/components/budget/SpendingBreakdownCard";
import { CategoryTransactionList } from "@/components/budget/CategoryTransactionList";
import { EditTransactionDrawer } from "@/components/transactions/EditTransactionDrawer";

export default function CategoryDetailPage() {
  const { user } = useAuth();
  const { userData, loading: userLoading } = useUserData();
  const { categories, loading: catLoading } = useCategories();
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New state for editing
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fetch transactions for this user + category
    // Note: We can filter by category in the query or in memory.
    // In-memory (like dashboard) is safer for indexes, but for a specific drill-down,
    // a composite index for [userId, category, date] might be needed if we filter by date.
    // Let's rely on the global fetch + filter approach to be consistent and safe.

    // Actually, reusing the efficiency of the dashboard approach:

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
    );

    setLoading(true);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
        .filter((tx) => {
          const txDate = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
          // Filter by Date (Current Month) and Category
          return (
            txDate >= startOfMonth &&
            tx.category === categoryId &&
            tx.type === "expense"
          );
        })
        .sort((a, b) => b.date - a.date); // Newest first

      setTransactions(txs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, categoryId]);

  if (userLoading || catLoading || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="p-6 text-center text-gray-500">Category not found</div>
    );
  }

  const spent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const allocated = userData?.categoryBudgets?.[categoryId] || 0;

  // Prepare subcategories for lookup
  const subCategories = category.subCategories || [];

  return (
    <div className="p-6 pb-24 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      <CategoryDetailHeader />

      <div className="flex flex-col items-center mb-6">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-white mb-2 shadow-sm"
          style={{ backgroundColor: category.color || "#9CA3AF" }}
        >
          {category.icon && <category.icon className="h-8 w-8" />}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{category.label}</h2>
        <p className="text-sm text-gray-500">
          {transactions.length} transactions
        </p>
      </div>

      <SpendingBreakdownCard
        spent={spent}
        allocated={allocated}
        categoryColor={category.color || "#9CA3AF"}
        totalBudget={userData?.monthlyBudget}
        initialAllocations={userData?.categoryBudgets}
      />

      <CategoryTransactionList
        transactions={transactions}
        subCategories={subCategories}
        onTransactionClick={(tx) => {
          setSelectedTransaction(tx);
          setIsEditDrawerOpen(true);
        }}
      />

      <EditTransactionDrawer
        transaction={selectedTransaction}
        open={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
      />
    </div>
  );
}
