"use client";

import { useState, useEffect } from "react";
import { useUserData } from "@/hooks/useUserData";
import {
  Wallet,
  Landmark,
  Vault,
  Plus,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { AddTransactionDrawer } from "@/components/transactions/AddTransactionDrawer";
import { clsx } from "clsx";
import SafeToSpendCard from "@/components/dashboard/SafeToSpendCard";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Transaction } from "@/types/transaction";
import { formatCurrency, getBudgetRange } from "@/lib/utils";

import { MobileHeader } from "@/components/mobile/MobileHeader";
import { HomeBalanceCarousel } from "@/components/mobile/HomeBalanceCarousel";
import { BudgetPromo } from "@/components/mobile/BudgetPromo";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export default function DashboardPage() {
  const { user } = useAuth();
  const { userData, loading, error } = useUserData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<
    "expense" | "income" | "transfer"
  >("expense");

  // Budget State
  const [budgetUsed, setBudgetUsed] = useState(0);

  const budget = userData?.budget?.amount ?? userData?.monthlyBudget ?? 0;
  const frequency = userData?.budget?.frequency ?? "monthly";

  // Fetch current period's linked expenses
  useEffect(() => {
    async function fetchBudgetUsage() {
      if (!user) return;

      const { start } = getBudgetRange(frequency);

      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
        );

        const snapshot = await getDocs(q);
        let used = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          const txDate = data.date.toDate();

          if (
            data.type === "expense" &&
            data.isBudgetLinked !== false &&
            txDate >= start
          ) {
            used += data.amount;
          }
        });
        setBudgetUsed(used);
      } catch (err) {
        console.error("Failed to fetch budget usage", err);
      }
    }

    if (user) {
      fetchBudgetUsage();
    }
  }, [user, isDrawerOpen, frequency]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ... (keep error handling)

  return (
    <div className=" min-h-screen">
      <MobileHeader />

      <div className="space-y-4">
        <HomeBalanceCarousel
          onAdd={() => {
            setDrawerType("expense");
            setIsDrawerOpen(true);
          }}
          onTransfer={() => {
            setDrawerType("transfer");
            setIsDrawerOpen(true);
          }}
        />

        {/* Show Budget Promo if no budget set, otherwise show Progress */}
        {budget > 0 ? (
          <div className="px-6">
            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100 capitalize">
              {frequency} Budget
            </h3>
            <BudgetProgress
              used={budgetUsed}
              limit={budget}
              frequency={frequency}
            />
          </div>
        ) : (
          <BudgetPromo />
        )}

        <RecentTransactions />
      </div>

      <AddTransactionDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        initialType={drawerType}
      />
    </div>
  );
}
