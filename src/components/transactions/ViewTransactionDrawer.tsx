"use client";

import { X } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types/transaction";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface ViewTransactionDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewTransactionDrawer({
  transaction,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ViewTransactionDrawerProps) {
  if (!transaction) return null;

  const txDate =
    transaction.date instanceof Date
      ? transaction.date
      : (transaction.date as any).toDate();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] font-outfit bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-center">Transaction Details</DrawerTitle>
        </DrawerHeader>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Amount */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Amount</p>
            <p
              className={`text-4xl font-bold ${
                transaction.type === "income"
                  ? "text-green-600"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
          </div>

          {/* Type */}
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-sm font-medium text-gray-500">Type</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {transaction.type}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-sm font-medium text-gray-500">Category</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {transaction.category}
            </span>
          </div>

          {/* Subcategory */}
          {transaction.subCategory && (
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium text-gray-500">
                Subcategory
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {transaction.subCategory}
              </span>
            </div>
          )}

          {/* Account */}
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-sm font-medium text-gray-500">Account</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {transaction.sourceAccount}
              {transaction.destinationAccount &&
                ` → ${transaction.destinationAccount}`}
            </span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-sm font-medium text-gray-500">
              Date & Time
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {format(txDate, "MMM d, yyyy 'at' HH:mm")}
            </span>
          </div>

          {/* Note */}
          {transaction.note && (
            <div className="py-3 border-b">
              <span className="text-sm font-medium text-gray-500 block mb-2">
                Note
              </span>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {transaction.note}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onEdit}
              className="rounded-full py-6"
            >
              Edit Transaction
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              className="rounded-full py-6"
            >
              Delete
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
