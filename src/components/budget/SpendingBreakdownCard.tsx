import { CreateBudgetDrawer } from "@/components/budget/CreateBudgetDrawer";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SpendingBreakdownCardProps {
  spent: number;
  allocated: number;
  categoryColor: string;
  totalBudget?: number;
  initialAllocations?: Record<string, number>;
}

export function SpendingBreakdownCard({
  spent,
  allocated,
  categoryColor,
  totalBudget,
  initialAllocations,
}: SpendingBreakdownCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const percentage = Math.min(100, (spent / allocated) * 100);
  const isOverBudget = spent > allocated;
  const overAmount = spent - allocated;

  const AdjustButton = (
    <Button
      variant="ghost"
      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 h-auto text-sm font-medium"
      onClick={() => setIsDrawerOpen(true)}
    >
      Adjust <Pencil className="ml-1 h-3 w-3" />
    </Button>
  );

  return (
    <div className="mb-8 font-outfit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Spending breakdown
        </h2>
        {totalBudget !== undefined ? (
          <CreateBudgetDrawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            initialBudget={totalBudget}
            initialAllocations={initialAllocations}
          >
            {AdjustButton}
          </CreateBudgetDrawer>
        ) : (
          AdjustButton
        )}
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-[24px] p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-bold text-gray-900 dark:text-gray-50">
            {isOverBudget
              ? `${formatCurrency(overAmount)} over`
              : formatCurrency(spent)}
          </span>
          {isOverBudget && (
            <div className="flex items-center text-xs text-orange-500 font-medium bg-orange-50 dark:bg-orange-900 px-2 py-1 rounded-full">
              <AlertCircle className="h-3 w-3 mr-1" /> Limit exceeded
            </div>
          )}
        </div>

        <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-500 rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: categoryColor,
            }}
          />
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-bold text-gray-900 dark:text-gray-50">
            {formatCurrency(spent)}
          </span>{" "}
          of {formatCurrency(allocated)}
        </div>
      </div>
    </div>
  );
}
