"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types/transaction";
import { useHaptic } from "@/hooks/useHaptic";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onView?: (transaction: Transaction) => void;
  showTime?: boolean;
}

export function TransactionItem({
  transaction: t,
  onView,
  showTime = false,
}: TransactionItemProps) {
  const { trigger } = useHaptic();

  return (
    <div
      onClick={() => {
        trigger("light");
        onView?.(t);
      }}
      className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98]"
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full 
            ${
              t.type === "income"
                ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                : t.type === "expense"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
            }`}
        >
          {t.type === "expense" && <ArrowUpRight className="h-4 w-4" />}
          {t.type === "income" && <ArrowDownLeft className="h-4 w-4" />}
          {t.type === "transfer" && <ArrowRightLeft className="h-4 w-4" />}
        </div>
        <div className="flex flex-col items-start">
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm capitalize">
            {t.category || "Transaction"}
          </p>
          {t.subCategory && (
            <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
              {t.subCategory}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {format(
              t.date instanceof Date ? t.date : (t.date as any).toDate(),
              "MMM d, yyyy • HH:mm",
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div
          className={`text-sm font-semibold ${
            t.type === "income"
              ? "text-green-600"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {t.type === "income" ? "+" : "-"}
          {formatCurrency(t.amount)}
        </div>
      </div>
    </div>
  );
}
