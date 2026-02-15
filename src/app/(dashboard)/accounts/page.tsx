"use client";

import { formatCurrency } from "@/lib/utils";
import { useUserData } from "@/hooks/useUserData";
import { Loader2 } from "lucide-react";

export default function AccountsPage() {
  const { userData, loading } = useUserData();

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const bank = userData?.bank || 0;
  const cash = userData?.cash || 0;
  const savings = userData?.savings || 0;
  const total = bank + cash + savings;

  return (
    <div className="p-6 pb-24 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-outfit">
        Accounts
      </h1>

      <div className="grid gap-4">
        <AccountCard name="Bank Account" amount={bank} />
        <AccountCard name="Cash On Hand" amount={cash} />
        <AccountCard name="Savings" amount={savings} />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Total Net Worth</span>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

function AccountCard({ name, amount }: { name: string; amount: number }) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center">
      <span className="font-medium text-gray-700 dark:text-gray-300">
        {name}
      </span>
      <span className="font-semibold text-gray-900 dark:text-gray-100">
        {formatCurrency(amount)}
      </span>
    </div>
  );
}
