import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface BudgetFooterProps {
  total: number;
  allocated: number;
  onSave: () => void;
  loading: boolean;
}

export function BudgetFooter({
  total,
  allocated,
  onSave,
  loading,
}: BudgetFooterProps) {
  const left = total - allocated;
  const isOverBudget = left < 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:bg-gray-950 dark:shadow-[0_-4px_6px_-1px_rgba(255,255,255,0.05)]">
      <div className="mb-4 flex items-center justify-center gap-2 rounded-full bg-gray-50 py-2 dark:bg-gray-900">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Amount left:
        </span>
        <span
          className={`text-base font-bold ${isOverBudget ? "text-red-500" : "text-gray-900 dark:text-white"}`}
        >
          {formatCurrency(Math.max(0, left))}
        </span>
      </div>

      <Button
        onClick={onSave}
        disabled={loading || total === 0}
        className="w-full rounded-full bg-indigo-600 py-6 text-lg font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Get Started"}
      </Button>
    </div>
  );
}
