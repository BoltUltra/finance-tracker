"use client";

import { useMemo } from "react";
import { formatCurrency, getPastPeriods } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface BudgetHistoryProps {
  transactions: any[];
  totalBudget: number;
  frequency: "daily" | "weekly" | "monthly";
}

export function BudgetHistory({
  transactions,
  totalBudget,
  frequency,
}: BudgetHistoryProps) {
  const history = useMemo(() => {
    const periods = getPastPeriods(frequency, 5); // Get last 5 periods

    return periods
      .map((period) => {
        const spent = transactions.reduce((acc, tx) => {
          const txDate = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
          if (
            tx.type === "expense" &&
            tx.isBudgetLinked !== false &&
            txDate >= period.start &&
            txDate <= period.end
          ) {
            return acc + tx.amount;
          }
          return acc;
        }, 0);

        const isSuccess = spent <= totalBudget;

        let label = "";
        if (frequency === "daily") {
          label = period.start.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
          });
        } else if (frequency === "weekly") {
          label = `${period.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${period.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
        } else {
          label = period.start.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });
        }

        return {
          label,
          spent,
          isSuccess,
        };
      })
      .reverse(); // Show oldest to newest
  }, [transactions, totalBudget, frequency]);

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm dark:bg-gray-900">
      <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-gray-100">
        History
      </h3>
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  item.isSuccess
                    ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {item.isSuccess ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(item.spent)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                / {formatCurrency(totalBudget)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
