import { useState } from "react";
import Link from "next/link";
import { useTransactions } from "@/hooks/useTransactions";
import { useHaptic } from "@/hooks/useHaptic";
import { useAuth } from "@/context/AuthContext";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { EditTransactionDrawer } from "@/components/transactions/EditTransactionDrawer";
import { ViewTransactionDrawer } from "@/components/transactions/ViewTransactionDrawer";
import { AddTransactionDrawer } from "@/components/transactions/AddTransactionDrawer";
import { deleteTransaction } from "@/services/transactionService";
import { Transaction } from "@/types/transaction";
import { toast } from "sonner";

export function RecentTransactions() {
  const { transactions, loading } = useTransactions();
  const { trigger } = useHaptic();
  const { user } = useAuth();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Get last 5 transactions
  const recent = transactions.slice(0, 5);

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

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        Loading transactions...
      </div>
    );
  }

  if (recent.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        No recent transactions
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-6 pb-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Transactions
        </h3>
        <Link
          href="/history"
          onClick={() => trigger("selection")}
          className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
        >
          view all
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {recent.map((t) => (
          <TransactionItem
            key={t.id}
            transaction={t}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            showTime={true}
          />
        ))}
      </div>

      <EditTransactionDrawer
        transaction={selectedTransaction}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={() => {
          setSelectedTransaction(null);
          toast.success("Transaction updated");
        }}
      />

      <ViewTransactionDrawer
        transaction={selectedTransaction}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        onEdit={() => handleEdit(selectedTransaction!)}
        onDelete={() => handleDelete(selectedTransaction!)}
      />

      {/* Kept here if we add an 'Add' button in this component headers later, though currently BalanceCard handles it */}
      {/* <AddTransactionDrawer open={false} onOpenChange={() => {}} /> */}
    </div>
  );
}
