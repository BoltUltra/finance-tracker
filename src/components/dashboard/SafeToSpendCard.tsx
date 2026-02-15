"use client";

import { ShieldCheck, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SafeToSpendCardProps {
  amount: number;
  isDanger?: boolean;
}

export default function SafeToSpendCard({
  amount,
  isDanger = false,
}: SafeToSpendCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 shadow-sm transition-all ${isDanger ? "bg-red-50 border border-red-100 dark:bg-red-900/10 dark:border-red-900" : "bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900"}`}
    >
      <div className="flex items-start justify-between">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            {isDanger ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            )}
            <h3
              className={`text-sm font-medium ${isDanger ? "text-red-600" : "text-emerald-700 dark:text-emerald-300"}`}
            >
              Safe to Spend
            </h3>
          </div>
          <p
            className={`text-3xl font-bold tracking-tight ${isDanger ? "text-red-700 dark:text-red-400" : "text-emerald-800 dark:text-emerald-100"}`}
          >
            {formatCurrency(amount)}
          </p>
          <p
            className={`mt-1 text-xs ${isDanger ? "text-red-500" : "text-emerald-600 dark:text-emerald-400/70"}`}
          >
            (Liquid Assets - Remaining Budget)
          </p>
        </div>
      </div>

      {/* Decorative Blob */}
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-xl ${isDanger ? "bg-red-500" : "bg-emerald-500"}`}
      />
    </div>
  );
}
