"use client";

import { AppCategory } from "@/hooks/useCategories";
import { formatCurrency } from "@/lib/utils";
import { clsx } from "clsx";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export interface CategorySpending {
  category: AppCategory;
  spent: number;
  allocated: number;
  transactionCount: number;
}

interface BudgetCategoryListProps {
  data: CategorySpending[];
}

export function BudgetCategoryList({ data }: BudgetCategoryListProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[32px] p-2 pb-4 shadow-sm mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 font-outfit pl-3 pt-3">
        Budget category
      </h3>

      <div className="space-y-6">
        {data.map((item) => {
          const { category, spent, allocated, transactionCount } = item;
          const isOverBudget = spent > allocated;
          const warningThreshold = allocated * 0.9;
          const isNearLimit = spent >= warningThreshold && !isOverBudget;

          return (
            <Link
              key={category.id}
              href={`/budget/${category.id}`}
              className="block group"
            >
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white shrink-0"
                    style={{ backgroundColor: category.color || "#9CA3AF" }}
                  >
                    {category.icon && <category.icon className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {category.label}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {transactionCount} transactions
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    {isNearLimit && (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    {isOverBudget && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(spent)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      / {formatCurrency(allocated)}
                    </span>
                  </div>
                  {/* Optional progress bar line if needed, design doesn't explicitly show it but it's common */}
                </div>
              </div>
            </Link>
          );
        })}

        {data.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
            No categories found.
          </p>
        )}
      </div>
    </div>
  );
}
