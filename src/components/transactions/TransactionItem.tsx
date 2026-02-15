"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types/transaction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useHaptic } from "@/hooks/useHaptic";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onView?: (transaction: Transaction) => void;
  showTime?: boolean;
}

export function TransactionItem({
  transaction: t,
  onEdit,
  onDelete,
  onView,
  showTime = false,
}: TransactionItemProps) {
  const { trigger } = useHaptic();

  const handleAction = (action: () => void) => {
    trigger("light");
    action();
  };

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full 
            ${
              t.type === "income"
                ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                : t.type === "expense"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
            }`}
        >
          {t.type === "expense" && <ArrowUpRight className="h-6 w-6" />}
          {t.type === "income" && <ArrowDownLeft className="h-6 w-6" />}
          {t.type === "transfer" && <ArrowRightLeft className="h-6 w-6" />}
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-base capitalize">
            {t.category || "Transaction"}
          </p>
          {t.subCategory && (
            <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
              {t.subCategory}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {format(
              t.date instanceof Date ? t.date : (t.date as any).toDate(),
              "MMM d, yyyy • HH:mm",
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`text-base font-semibold ${
            t.type === "income"
              ? "text-green-600"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {t.type === "income" ? "+" : "-"}
          {formatCurrency(t.amount)}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
              onClick={() => trigger("light")}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => handleAction(() => onView(t))}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => handleAction(() => onEdit(t))}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => handleAction(() => onDelete(t))}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
