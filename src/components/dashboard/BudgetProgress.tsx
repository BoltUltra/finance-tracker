"use client";

import { clsx } from "clsx";
import { formatCurrency } from "@/lib/utils";

interface BudgetProgressProps {
  used: number;
  limit: number;
}

export default function BudgetProgress({ used, limit }: BudgetProgressProps) {
  const percentage = Math.min(100, Math.max(0, (used / limit) * 100));
  const isOverBudget = used > limit;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <div>
          {/* <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Monthly Budget
          </h3> */}
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatCurrency(used)}
            <span className="ml-1 text-xs font-normal text-gray-400">
              / {formatCurrency(limit)}
            </span>
          </p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${isOverBudget ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {percentage.toFixed(0)}% used
        </div>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-500",
            isOverBudget ? "bg-red-500" : "bg-blue-600",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-gray-400">
        {isOverBudget ? (
          <span className="text-red-500 font-medium">
            Over budget by {formatCurrency(used - limit)}
          </span>
        ) : (
          <span>{formatCurrency(limit - used)} remaining</span>
        )}
      </p>
    </div>
  );
}
