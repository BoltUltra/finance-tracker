"use client";

import { useState, useEffect } from "react";
import {
  X,
  Check,
  Search,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addTransaction } from "@/services/transactionService";
import { TransactionType, AccountType } from "@/types/transaction";
import { CATEGORY_CONFIG, Category, SubCategory } from "@/constants/categories";
import { clsx } from "clsx";

export interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  initialType = "expense",
}: AddTransactionModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>(initialType);
  const [sourceAccount, setSourceAccount] = useState<AccountType>("bank");
  const [destinationAccount, setDestinationAccount] =
    useState<AccountType>("cash");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isBudgetLinked, setIsBudgetLinked] = useState(true);

  // Category Selector State
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setAmount("");
      setType(initialType);
      setSourceAccount("bank");
      setDestinationAccount("cash");
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
      setIsBudgetLinked(true);
      setError("");
    }
  }, [isOpen, initialType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      if (!amount || parseFloat(amount) <= 0)
        throw new Error("Enter a valid amount");
      if (type !== "transfer" && !selectedCategory)
        throw new Error("Select a category");

      await addTransaction(user.uid, {
        amount: parseFloat(amount),
        type,
        sourceAccount,
        destinationAccount:
          type === "transfer" ? destinationAccount : undefined,
        category: type !== "transfer" ? selectedCategory?.id : "transfer",
        subCategory: type !== "transfer" ? selectedSubCategory?.id : undefined,
        note,
        date: new Date(date),
        isBudgetLinked: type === "expense" ? isBudgetLinked : undefined,
      });

      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Add Transaction
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Toggle */}
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
              {(["expense", "income", "transfer"] as TransactionType[]).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setType(t);
                      setSelectedCategory(null);
                      setSelectedSubCategory(null);
                    }}
                    className={clsx(
                      "capitalize rounded-md py-1.5 text-sm font-medium transition-all",
                      type === t
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
                    )}
                  >
                    {t}
                  </button>
                ),
              )}
            </div>

            {/* Amount & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                    ₦
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-7 pr-3 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Accounts */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {type === "transfer"
                    ? "From"
                    : type === "income"
                      ? "To Account"
                      : "From Account"}
                </label>
                <select
                  value={sourceAccount}
                  onChange={(e) =>
                    setSourceAccount(e.target.value as AccountType)
                  }
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="bank">Bank</option>
                  <option value="cash">Cash</option>
                  <option value="savings">Savings</option>
                </select>
              </div>

              {type === "transfer" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    To
                  </label>
                  <select
                    value={destinationAccount}
                    onChange={(e) =>
                      setDestinationAccount(e.target.value as AccountType)
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="bank">Bank</option>
                    <option value="cash">Cash</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              )}
            </div>

            {/* Category Selector (Hidden for Transfer) */}
            {type !== "transfer" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-left focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <span
                    className={
                      selectedCategory
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-400 dark:text-gray-500"
                    }
                  >
                    {selectedCategory ? (
                      <span className="flex items-center gap-2">
                        {/* Render Icon dynamically if needed or just label */}
                        {selectedCategory.label}
                        {selectedSubCategory &&
                          ` > ${selectedSubCategory.label}`}
                      </span>
                    ) : (
                      "Select Category"
                    )}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>

                {/* Dropdown */}
                {isCategoryOpen && (
                  <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 absolute w-full max-w-[calc(100%-3rem)]">
                    {CATEGORY_CONFIG.filter((cat) =>
                      type === "income"
                        ? cat.id === "income"
                        : cat.id !== "income",
                    ).map((cat) => (
                      <div key={cat.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setSelectedSubCategory(null);
                          }}
                          className={clsx(
                            "flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors",
                            selectedCategory?.id === cat.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                              : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
                          )}
                        >
                          <cat.icon className="h-4 w-4 opacity-70" />
                          {cat.label}
                        </button>

                        {/* Subcategories (Show if parent selected) */}
                        {selectedCategory?.id === cat.id && (
                          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-1 space-y-1 border-l-4 border-blue-100 dark:border-blue-900 ml-4">
                            {cat.subCategories.length > 0 ? (
                              cat.subCategories.map((sub) => (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedSubCategory(sub);
                                    setIsCategoryOpen(false);
                                  }}
                                  className={clsx(
                                    "w-full text-left text-sm py-1 rounded px-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                                    selectedSubCategory?.id === sub.id
                                      ? "text-blue-600 dark:text-blue-400 font-medium"
                                      : "text-gray-600 dark:text-gray-400",
                                  )}
                                >
                                  {sub.label}
                                </button>
                              ))
                            ) : (
                              <div className="text-xs text-gray-400 dark:text-gray-500 py-1 italic">
                                No subcategories
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Budget Link Toggle (Exclusive to Expense) */}
            {type === "expense" && (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Link to Budget
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Count towards monthly limit
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBudgetLinked(!isBudgetLinked)}
                  className={clsx(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    isBudgetLinked
                      ? "bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-700",
                  )}
                  role="switch"
                  aria-checked={isBudgetLinked}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      isBudgetLinked ? "translate-x-5" : "translate-x-0",
                    )}
                  />
                </button>
              </div>
            )}

            {/* Note */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Optional note..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 dark:disabled:bg-blue-900"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" /> Save Transaction
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
