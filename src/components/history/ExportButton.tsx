"use client";

import { Transaction } from "@/types/transaction";
import { format } from "date-fns";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/useHaptic";

interface ExportButtonProps {
  transactions: Transaction[];
}

export default function ExportButton({ transactions }: ExportButtonProps) {
  const { trigger } = useHaptic();

  const exportToCSV = () => {
    trigger("success");

    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const headers = [
      "Date",
      "Type",
      "Category",
      "Subcategory",
      "Amount",
      "Source Account",
      "Destination Account",
      "Note",
    ];

    const csvData = transactions.map((t) => [
      format(
        t.date instanceof Date ? t.date : (t.date as any).toDate(),
        "yyyy-MM-dd HH:mm",
      ),
      t.type,
      t.category || "",
      t.subCategory || "",
      t.amount,
      t.sourceAccount,
      t.destinationAccount || "",
      t.note || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${transactions.length} transactions`);
  };

  return (
    <Button
      onClick={exportToCSV}
      disabled={transactions.length === 0}
      className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg 
        hover:shadow-xl transition-all duration-300 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none px-6 py-6
        dark:bg-purple-500 dark:hover:bg-purple-600"
    >
      <span className="flex items-center gap-2 font-semibold">
        <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
        <span className="hidden sm:inline">Export CSV</span>
        <span className="sm:hidden">Export</span>
      </span>
    </Button>
  );
}
