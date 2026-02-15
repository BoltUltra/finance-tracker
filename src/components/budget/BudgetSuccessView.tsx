"use client";

import { AppCategory, useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface BudgetSuccessViewProps {
  allocations: Record<string, number>;
  totalBudget: number;
  onClose: () => void;
}

export function BudgetSuccessView({
  allocations,
  totalBudget,
  onClose,
}: BudgetSuccessViewProps) {
  const { categories } = useCategories();

  // Map allocations to category objects
  const allocatedCategories = Object.entries(allocations)
    .map(([id, amount]) => {
      const cat = categories.find((c) => c.id === id);
      return {
        ...cat,
        amount,
      };
    })
    .filter((c): c is AppCategory & { amount: number } => !!c && c.amount > 0);

  return (
    <div className="flex flex-col items-center px-6 pt-8 pb-10 font-outfit">
      {/* Success Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
          <Check className="h-6 w-6 text-white" />
        </div>
      </div>

      <h2 className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-white">
        Your budget has been set up!
      </h2>
      <p className="mb-8 max-w-xs text-center text-sm text-gray-500 dark:text-gray-400">
        Track your expenses and stay on top of your financial goals. You can
        always adjust your budget if needed.
      </p>

      {/* Summary Card */}
      <div className="mb-8 w-full rounded-3xl bg-gray-50 p-6 dark:bg-gray-900">
        <div className="space-y-6">
          {allocatedCategories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    "flex h-8 w-8 items-center justify-center rounded-full text-white",
                    cat.color ||
                      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
                  )}
                >
                  {cat.icon && <cat.icon className="h-4 w-4" />}
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {cat.label}
                </span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(cat.amount)}
              </span>
            </div>
          ))}
        </div>

        <div className="my-6 border-t border-dashed border-gray-200 dark:border-gray-700" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total budgeted
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalBudget)}
          </span>
        </div>
      </div>

      <Button
        onClick={onClose}
        className="w-full rounded-full bg-indigo-600 py-6 text-lg font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        View my dashboard
      </Button>
    </div>
  );
}
