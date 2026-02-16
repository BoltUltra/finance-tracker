"use client";

import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ExpenseBarChartProps {
  transactions: Transaction[];
}

export default function ExpenseBarChart({
  transactions,
}: ExpenseBarChartProps) {
  // Filter only expense transactions
  const expenses = transactions.filter((t) => t.type === "expense");

  // Group by category and sum amounts
  const categoryData = expenses.reduce(
    (acc, t) => {
      const cat = t.category || "Other";
      if (!acc[cat]) {
        acc[cat] = 0;
      }
      acc[cat] += t.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Convert to array and sort by amount
  const chartData = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Color palette
  const COLORS = [
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#f59e0b", // amber
    "#3b82f6", // blue
    "#10b981", // green
    "#ef4444", // red
    "#6366f1", // indigo
    "#14b8a6", // teal
  ];

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-center dark:bg-gray-900 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No expense data to display
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white py-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100 px-4">
        Expenses by Category
      </h3>
      <div className="pr-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            {/* <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> */}
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 10 }}
              angle={0}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 10 }}
              tickFormatter={(value) => `₦${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3 px-4">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate capitalize">
                {entry.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatCurrency(entry.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
