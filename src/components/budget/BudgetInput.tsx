import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { clsx } from "clsx";

interface BudgetInputProps {
  amount: number;
  onChange: (amount: number) => void;
}

const QUICK_AMOUNTS = [50000, 100000, 150000, 200000, 250000, 300000];

export function BudgetInput({ amount, onChange }: BudgetInputProps) {
  return (
    <div className="flex flex-col items-center space-y-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="text-center">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Set budget amount
        </label>
        <div className="relative mt-2 flex items-center justify-center">
          {/* We use a large text input but style it to look like a display */}
          <span className="text-4xl font-bold text-gray-900 dark:text-white mr-1">
            ₦
          </span>
          <Input
            type="number"
            value={amount === 0 ? "" : amount}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-auto w-52 border-0 bg-transparent p-0 text-center text-5xl font-bold text-gray-900 focus-visible:ring-0 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700"
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-3">
        {QUICK_AMOUNTS.map((val) => (
          <button
            key={val}
            onClick={() => onChange(val)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95",
              amount === val
                ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            {formatCurrency(val).replace(".00", "")}
          </button>
        ))}
      </div>
    </div>
  );
}
