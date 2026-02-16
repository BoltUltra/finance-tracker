"use client";

import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { CreateBudgetDrawer } from "@/components/budget/CreateBudgetDrawer";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface BudgetOverviewProps {
  totalBudget: number;
  totalSpent: number;
  categorySpending: { name: string; value: number; color: string }[];
  initialAllocations?: Record<string, number>;
}

export function BudgetOverview({
  totalBudget,
  totalSpent,
  categorySpending,
  initialAllocations,
}: BudgetOverviewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const leftToSpend = Math.max(0, totalBudget - totalSpent);

  const data = [
    ...categorySpending.map((c) => ({
      name: c.name,
      value: c.value,
      color: c.color,
    })),
    { name: "Remaining", value: leftToSpend, color: "#F3F4F6" },
  ];

  return (
    <div className="mb-8 font-outfit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Budget overview
        </h2>
        <CreateBudgetDrawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          initialBudget={totalBudget}
          initialAllocations={initialAllocations}
        >
          <Button
            variant="ghost"
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 h-auto text-sm font-medium"
          >
            Adjust <Pencil className="ml-1 h-3 w-3" />
          </Button>
        </CreateBudgetDrawer>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Monthly budget
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalBudget)}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex items-center">
            <div className="bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-sm">
              <BarChart3 className="h-4 w-4 text-gray-900 dark:text-white" />
            </div>
            <div className="p-1.5">
              <PieChartIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center relative mb-8 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Spent
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-full py-2 px-6">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Left to spend:{" "}
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(leftToSpend)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
