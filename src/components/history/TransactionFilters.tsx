"use client";

import { TransactionType, AccountType } from "@/types/transaction";
import { useCategories } from "@/hooks/useCategories";
import { Dispatch, SetStateAction, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Filters {
  startDate: string;
  endDate: string;
  account: AccountType | "all";
  category: string;
  type: TransactionType | "all";
}

interface TransactionFiltersProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

export default function TransactionFilters({
  filters,
  setFilters,
}: TransactionFiltersProps) {
  const { categories } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      account: "all",
      category: "",
      type: "all",
    });
  };

  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    filters.account !== "all" ||
    filters.category ||
    filters.type !== "all";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
      {/* Filter Header - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600 dark:bg-purple-500 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h3>
            {hasActiveFilters && (
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {Object.values(filters).filter((v) => v && v !== "all").length}{" "}
                active
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Filter Content - Collapsible */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 pb-6 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-6">
          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleChange("type", "expense")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filters.type === "expense"
                  ? "bg-red-600 text-white shadow-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => handleChange("type", "income")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filters.type === "income"
                  ? "bg-green-600 text-white shadow-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Income
            </button>
            <button
              onClick={() => handleChange("type", "transfer")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filters.type === "transfer"
                  ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Transfers
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900
                  focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all
                  dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900
                  focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all
                  dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-700"
              />
            </div>

            {/* Account */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Account
              </label>
              <select
                value={filters.account}
                onChange={(e) => handleChange("account", e.target.value)}
                className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900
                  focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all cursor-pointer
                  dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-700"
              >
                <option value="all">All Accounts</option>
                <option value="bank">💳 Bank</option>
                <option value="cash">💵 Cash</option>
                <option value="savings">🏦 Savings</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900
                  focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all cursor-pointer
                  dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-700"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
