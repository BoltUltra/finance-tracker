"use client";

import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns"; // Check if date-fns is installed, logically it should be given the imports in other files
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

// Minimal interface for what we need
interface TransactionItem {
  id: string;
  amount: number;
  type: "expense" | "income" | "transfer";
  date: any; // specific date type handling might be needed
  note?: string;
  subCategory?: string; // ID
}

interface CategoryTransactionListProps {
  transactions: TransactionItem[];
  subCategories: { id: string; label: string }[];
  onTransactionClick?: (tx: TransactionItem) => void;
}

export function CategoryTransactionList({
  transactions,
  subCategories,
  onTransactionClick,
}: CategoryTransactionListProps) {
  const getSubCategoryLabel = (id?: string) => {
    if (!id) return "General";
    return subCategories.find((s) => s.id === id)?.label || "Other";
  };

  return (
    <div className="mb-20 font-outfit">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h3>

      <div className="bg-white rounded-[24px] p-2 shadow-sm">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No transactions yet
          </div>
        ) : (
          transactions.map((tx) => {
            const txDate = tx.date?.toDate
              ? tx.date.toDate()
              : new Date(tx.date);
            return (
              <div
                key={tx.id}
                onClick={() => onTransactionClick?.(tx)}
                className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    {/* Simplified icon logic - could use generic category icon or specific subcat icon */}
                    <ArrowUpRight className="h-5 w-5 text-gray-500 transform rotate-45" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {getSubCategoryLabel(tx.subCategory)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(txDate, "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  - {formatCurrency(tx.amount)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
