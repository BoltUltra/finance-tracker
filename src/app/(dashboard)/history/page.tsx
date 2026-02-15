"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/context/AuthContext";
import TransactionFilters from "@/components/history/TransactionFilters";
import ExpenseBarChart from "@/components/stats/ExpenseBarChart";
import ExportButton from "@/components/history/ExportButton";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { EditTransactionDrawer } from "@/components/transactions/EditTransactionDrawer";
import { ViewTransactionDrawer } from "@/components/transactions/ViewTransactionDrawer";
import { deleteTransaction } from "@/services/transactionService";
import { Transaction } from "@/types/transaction";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Filters } from "@/components/history/TransactionFilters";

export default function HistoryPage() {
  const { transactions, loading, error } = useTransactions();
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters>({
    startDate: "",
    endDate: "",
    account: "all",
    category: "",
    type: "all",
  });
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewOpen(false);
    setIsEditOpen(true);
  };

  const handleDelete = async (transaction: Transaction) => {
    if (!user || !transaction.id) return;

    if (!confirm(`Delete this ${transaction.type} of ${transaction.amount}?`)) {
      return;
    }

    try {
      await deleteTransaction(user.uid, transaction.id);
      toast.success("Transaction deleted");
      setIsViewOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction");
    }
  };

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewOpen(true);
  };

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
          <Loader2 className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          Configuration Required
        </h2>
        <p className="mb-4 max-w-md text-gray-500">
          The History page requires a specific database index to support
          filtering and sorting. Please check your browser console for the
          creation link or ask your developer.
        </p>
        <div className="rounded bg-gray-100 p-2 font-mono text-xs text-gray-600">
          {error.message}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Client-side filtering
  const filteredTransactions = transactions.filter((t) => {
    // Date Range
    if (filters.startDate && new Date(t.date) < new Date(filters.startDate))
      return false;
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day
      if (new Date(t.date) > end) return false;
    }

    // Account
    if (filters.account !== "all") {
      if (t.type === "transfer") {
        // For transfer, show if either source or dest matches
        if (
          t.sourceAccount !== filters.account &&
          t.destinationAccount !== filters.account
        )
          return false;
      } else {
        if (t.sourceAccount !== filters.account) return false;
      }
    }

    // Type
    if (filters.type !== "all" && t.type !== filters.type) return false;

    // Category
    if (filters.category && t.category !== filters.category) return false;

    return true;
  });

  return (
    <div className="container mx-auto max-w-5xl space-y-6 pb-24 md:pb-8">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Transaction History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and filter all your transactions
          </p>
        </div>
        <ExportButton transactions={filteredTransactions} />
      </div>

      {/* Grid Layout: Chart on top, then Filters & List */}
      <div className="space-y-6">
        {/* Chart */}
        <ExpenseBarChart transactions={filteredTransactions} />

        {/* Filters */}
        <TransactionFilters filters={filters} setFilters={setFilters as any} />

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-500 dark:bg-gray-900">
              No transactions found matching your filters.
            </div>
          ) : (
            filteredTransactions.map((t) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                showTime={true}
              />
            ))
          )}
        </div>
      </div>

      <EditTransactionDrawer
        transaction={selectedTransaction}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={() => {
          setSelectedTransaction(null);
        }}
      />

      <ViewTransactionDrawer
        transaction={selectedTransaction}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        onEdit={() => handleEdit(selectedTransaction!)}
        onDelete={() => handleDelete(selectedTransaction!)}
      />
    </div>
  );
}
