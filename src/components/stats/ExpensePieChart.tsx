"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Transaction } from "@/types/transaction";
import { CATEGORY_CONFIG } from "@/constants/categories";
import { formatCurrency } from "@/lib/utils";

interface ExpensePieChartProps {
  transactions: Transaction[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
];

export default function ExpensePieChart({
  transactions,
}: ExpensePieChartProps) {
  // Aggregate expenses by category
  const data = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const categoryId = t.category || "other";
        const amount = t.amount;
        const existing = acc.find((item) => item.id === categoryId);

        if (existing) {
          existing.value += amount;
        } else {
          const config = CATEGORY_CONFIG.find((c) => c.id === categoryId);
          acc.push({
            id: categoryId,
            name: config?.label || "Other",
            value: amount,
          });
        }
        return acc;
      },
      [] as { id: string; name: string; value: number }[],
    )
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-white p-6 text-gray-400 shadow-sm border border-gray-100 italic">
        No expense data for this period
      </div>
    );
  }

  return (
    <div className="h-80 w-full rounded-xl bg-white p-4 shadow-sm border border-gray-100">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Expenses by Category
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | undefined) => [
              formatCurrency(value || 0),
              "Amount",
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
