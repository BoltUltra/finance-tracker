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
import AddTransactionModal from "@/components/transactions/AddTransactionModal";
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
import { formatCurrency } from "@/lib/utils";

import { MobileHeader } from "@/components/mobile/MobileHeader";
import { HomeBalanceCarousel } from "@/components/mobile/HomeBalanceCarousel";
import { BudgetPromo } from "@/components/mobile/BudgetPromo";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export default function DashboardPage() {
  const { user } = useAuth();
  const { userData, loading, error } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"expense" | "income" | "transfer">(
    "expense",
  );

  // Budget State
  const [budgetUsed, setBudgetUsed] = useState(0);

  // Fetch current month's linked expenses
  useEffect(() => {
    async function fetchBudgetUsage() {
      if (!user) return;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

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
            txDate >= startOfMonth
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
  }, [user, isModalOpen]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    // ... keep error handling ...
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center gap-4 text-center px-4">
        <p>Error loading dashboard</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const monthlyBudget = userData?.monthlyBudget || 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <MobileHeader />

      <div className="space-y-4">
        <HomeBalanceCarousel
          onAdd={() => {
            setModalType("expense");
            setIsModalOpen(true);
          }}
          onTransfer={() => {
            setModalType("transfer");
            setIsModalOpen(true);
          }}
        />

        {/* Show Budget Promo if no budget set, otherwise show Progress */}
        {monthlyBudget > 0 ? (
          <div className="px-6">
            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
              Monthly Budget
            </h3>
            <BudgetProgress used={budgetUsed} limit={monthlyBudget} />
          </div>
        ) : (
          <BudgetPromo />
        )}

        <RecentTransactions />
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialType={modalType}
      />
    </div>
  );
}
