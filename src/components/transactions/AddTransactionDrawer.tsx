"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Loader2, Calendar, Clock, ArrowRightLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addTransaction } from "@/services/transactionService";
import { TransactionType, AccountType } from "@/types/transaction";
import { Category, SubCategory } from "@/constants/categories";
import { clsx } from "clsx";
import { useHaptic } from "@/hooks/useHaptic";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useCategories";

export interface AddTransactionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: TransactionType;
}

export function AddTransactionDrawer({
  open,
  onOpenChange,
  initialType = "expense",
}: AddTransactionDrawerProps) {
  const { user } = useAuth();
  const { categories } = useCategories();
  const { trigger } = useHaptic();
  const [loading, setLoading] = useState(false);

  // Form State
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>(initialType);
  const [account, setAccount] = useState<AccountType>("bank"); // Source
  const [destinationAccount, setDestinationAccount] =
    useState<AccountType>("cash"); // Destination (for transfer)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(
    new Date().toTimeString().split(" ")[0].substring(0, 5),
  );
  const [isBudgetLinked, setIsBudgetLinked] = useState(true);

  // Initialize defaults
  useEffect(() => {
    if (open) {
      setAmount("");
      setType(initialType);

      // Smart defaults
      if (initialType === "income") {
        setAccount("bank");
      } else if (initialType === "transfer") {
        setAccount("bank");
        setDestinationAccount("cash");
      } else {
        setAccount("cash");
      }

      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
      setTime(new Date().toTimeString().split(" ")[0].substring(0, 5));
      setIsBudgetLinked(true);
    }
  }, [open, initialType]);

  const handleSubmit = async () => {
    if (!user) return;
    if (!amount || parseFloat(amount) <= 0) {
      trigger("error");
      return;
    }

    // Validation
    if (type !== "transfer" && !selectedCategory) {
      trigger("error");
      return;
    }
    if (type === "transfer" && account === destinationAccount) {
      trigger("error");
      return;
    }

    setLoading(true);

    try {
      const dateTimeString = `${date}T${time}`;
      const transactionDate = new Date(dateTimeString);

      await addTransaction(user.uid, {
        amount: parseFloat(amount),
        type,
        sourceAccount: account,
        destinationAccount:
          type === "transfer" ? destinationAccount : undefined,
        category:
          type === "transfer"
            ? "Transfer"
            : selectedCategory?.id || "uncategorized",
        subCategory: selectedSubCategory?.id,
        note,
        date: transactionDate,
        isBudgetLinked: type === "expense" ? isBudgetLinked : undefined,
      });

      trigger("success");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      trigger("error");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (t: TransactionType) => {
    trigger("selection");
    setType(t);

    // Reset relevant fields
    if (t === "income") setAccount("bank");
    if (t === "expense") setAccount("cash");
    if (t === "transfer") {
      setAccount("bank");
      setDestinationAccount("cash");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[96vh] font-outfit bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-900">
        <div className="mx-auto w-full max-w-md flex flex-col h-full max-h-[96vh]">
          {/* Header */}
          <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <DrawerTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
              New Transaction
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">
              {/* Amount Input */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </label>
                <div className="relative flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400 mr-1">
                    ₦
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="text-6xl font-black text-center bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full max-w-[200px] text-gray-900 dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-800"
                    autoFocus
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm font-medium text-gray-900 dark:text-gray-100 border-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm font-medium text-gray-900 dark:text-gray-100 border-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Transaction Type */}
              <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                <button
                  onClick={() => handleTypeChange("expense")}
                  className={clsx(
                    "py-3 rounded-lg text-sm font-semibold transition-all",
                    type === "expense"
                      ? "bg-white dark:bg-gray-800 text-red-600 shadow-sm"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  Expense
                </button>
                <button
                  onClick={() => handleTypeChange("income")}
                  className={clsx(
                    "py-3 rounded-lg text-sm font-semibold transition-all",
                    type === "income"
                      ? "bg-white dark:bg-gray-800 text-green-600 shadow-sm"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  Income
                </button>
                <button
                  onClick={() => handleTypeChange("transfer")}
                  className={clsx(
                    "py-3 rounded-lg text-sm font-semibold transition-all",
                    type === "transfer"
                      ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  Transfer
                </button>
              </div>

              {/* Conditional Rendering based on Type */}
              {type === "transfer" ? (
                /* Transfer UI: From -> To */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="relative">
                    <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-100 dark:bg-gray-800" />

                    {/* From Account */}
                    <div className="relative z-10 space-y-2 mb-6">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                        From
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["bank", "cash", "savings"] as AccountType[]).map(
                          (acc) => (
                            <button
                              key={`from-${acc}`}
                              onClick={() => {
                                trigger("selection");
                                setAccount(acc);
                                if (destinationAccount === acc) {
                                  // Swap logic or reset dest? Let's just reset or pick another
                                  const others = (
                                    ["bank", "cash", "savings"] as AccountType[]
                                  ).filter((a) => a !== acc);
                                  setDestinationAccount(others[0]);
                                }
                              }}
                              className={clsx(
                                "py-2 px-1 rounded-lg text-sm font-medium border transition-all truncate",
                                account === acc
                                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-500"
                                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 opacity-60 hover:opacity-100",
                              )}
                            >
                              <span className="capitalize">{acc}</span>
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="flex justify-center -my-3 relative z-20">
                      <div className="bg-white dark:bg-gray-950 p-1.5 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
                        <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* To Account */}
                    <div className="relative z-10 space-y-2 mt-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                        To
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["bank", "cash", "savings"] as AccountType[]).map(
                          (acc) => (
                            <button
                              key={`to-${acc}`}
                              disabled={account === acc}
                              onClick={() => {
                                trigger("selection");
                                setDestinationAccount(acc);
                              }}
                              className={clsx(
                                "py-2 px-1 rounded-lg text-sm font-medium border transition-all truncate",
                                destinationAccount === acc
                                  ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-500"
                                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400",
                                account === acc &&
                                  "opacity-30 cursor-not-allowed",
                              )}
                            >
                              <span className="capitalize">{acc}</span>
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Income/Expense UI */
                <>
                  {/* Category Swiper */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100 px-1">
                      Category
                    </label>
                    <div className="flex overflow-x-auto gap-4 py-4 px-1 scrollbar-hide snap-x">
                      {categories
                        .filter((c) =>
                          type === "income"
                            ? c.id === "income"
                            : c.id !== "income",
                        )
                        .map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              trigger("selection");
                              setSelectedCategory(cat);
                              setSelectedSubCategory(null);
                            }}
                            className={clsx(
                              "flex flex-col items-center gap-2 min-w-18 snap-start transition-all",
                              selectedCategory?.id === cat.id
                                ? "scale-110"
                                : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100",
                            )}
                          >
                            <div
                              className={clsx(
                                "h-14 w-14 rounded-full flex items-center justify-center text-white shadow-md transition-shadow",
                                selectedCategory?.id === cat.id
                                  ? "ring-4 ring-gray-100 dark:ring-gray-800 shadow-lg"
                                  : "",
                              )}
                              style={{ backgroundColor: cat.color }}
                            >
                              <cat.icon className="h-6 w-6" />
                            </div>
                            <span
                              className={clsx(
                                "text-xs font-medium text-center truncate w-full",
                                selectedCategory?.id === cat.id
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-500",
                              )}
                            >
                              {cat.label}
                            </span>
                          </button>
                        ))}
                    </div>

                    {/* Subcategories */}
                    {selectedCategory &&
                      selectedCategory.subCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          {selectedCategory.subCategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                trigger("selection");
                                setSelectedSubCategory(sub);
                              }}
                              className={clsx(
                                "px-4 py-1.5 rounded-full text-xs font-medium border transition-colors",
                                selectedSubCategory?.id === sub.id
                                  ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white"
                                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
                              )}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Account Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100 px-1">
                      {type === "expense" ? "Payment Method" : "Deposit To"}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["bank", "cash", "savings"] as AccountType[]).map(
                        (acc) => (
                          <button
                            key={acc}
                            onClick={() => {
                              trigger("selection");
                              setAccount(acc);
                            }}
                            className={clsx(
                              "flex items-center justify-center py-3 px-2 rounded-xl border transition-all",
                              account === acc
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-500"
                                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800",
                            )}
                          >
                            <span className="capitalize font-medium">
                              {acc}
                            </span>
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Budget Link (Expense Only) */}
                  {type === "expense" && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Link to Budget
                        </span>
                        <span className="text-xs text-gray-500">
                          Track against monthly limits
                        </span>
                      </div>
                      <Switch
                        checked={isBudgetLinked}
                        onCheckedChange={setIsBudgetLinked}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Note (Common) */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100 px-1">
                  Note
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  className="min-h-[100px] resize-none bg-gray-50 dark:bg-gray-900 border-none focus:ring-1 ring-gray-200 dark:ring-gray-800 rounded-2xl italic"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-none p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
            <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                !amount ||
                (type === "transfer" && account === destinationAccount)
              }
              className="w-full h-14 rounded-full text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Transaction"
              )}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
