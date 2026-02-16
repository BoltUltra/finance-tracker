"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { BudgetInput } from "@/components/budget/BudgetInput";
import { CategoryAllocationList } from "@/components/budget/CategoryAllocationList";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUserData } from "@/hooks/useUserData";
import { formatCurrency } from "@/lib/utils";

interface CreateBudgetDrawerProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialBudget?: number;
  initialAllocations?: Record<string, number>;
}

export function CreateBudgetDrawer({
  children,
  open,
  onOpenChange,
  initialBudget,
  initialAllocations,
}: CreateBudgetDrawerProps) {
  const { user } = useAuth();
  const { userData } = useUserData();

  const [totalBudget, setTotalBudget] = useState(
    initialBudget ??
      userData?.budget?.amount ??
      userData?.monthlyBudget ??
      6000,
  );
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">(
    userData?.budget?.frequency ?? "monthly",
  );
  const [allocations, setAllocations] = useState<Record<string, number>>(
    initialAllocations ?? userData?.categoryBudgets ?? {},
  );

  // Sync state when drawer opens or props change
  useEffect(() => {
    if (open) {
      if (initialBudget !== undefined) setTotalBudget(initialBudget);
      if (userData?.budget?.amount !== undefined)
        setTotalBudget(userData.budget.amount);
      if (userData?.budget?.frequency !== undefined)
        setFrequency(userData.budget.frequency);
      if (initialAllocations !== undefined) setAllocations(initialAllocations);
    }
  }, [open, initialBudget, initialAllocations, userData]);
  const [loading, setLoading] = useState(false);

  const handleAllocationChange = (categoryId: string, amount: number) => {
    setAllocations((prev) => ({
      ...prev,
      [categoryId]: amount,
    }));
  };

  const totalAllocated = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0,
  );
  const left = totalBudget - totalAllocated;
  const isOverBudget = left < 0;

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        budget: {
          amount: totalBudget,
          frequency: frequency,
        },
        categoryBudgets: allocations,
      });
      setLoading(false);
      toast.success("Budget created successfully!");
      if (onOpenChange) onOpenChange(false);
    } catch (error) {
      console.error("Failed to save budget", error);
      toast.error("Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={false}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        className="fixed inset-x-0 bottom-0 mt-24 flex h-[90vh] flex-col rounded-t-[10px] bg-white dark:bg-gray-900 outline-none"
        onPointerDownOutside={() => onOpenChange?.(false)}
      >
        <div className="flex-none">
          <DrawerHeader>
            <DrawerTitle className="text-center text-lg font-bold text-gray-900 dark:text-gray-100">
              Create Budget
            </DrawerTitle>
          </DrawerHeader>
        </div>

        <div className="flex-none px-6 pb-2">
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {(["daily", "weekly", "monthly"] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => setFrequency(freq)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                  frequency === freq
                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <BudgetInput amount={totalBudget} onChange={setTotalBudget} />
          <div className="mt-6">
            <CategoryAllocationList
              allocations={allocations}
              onAllocate={handleAllocationChange}
            />
          </div>
        </div>

        <div className="flex-none border-t border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto mb-4 flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-gray-50 py-2 dark:bg-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {frequency === "daily"
                ? "Daily"
                : frequency === "weekly"
                  ? "Weekly"
                  : "Monthly"}{" "}
              amount left:
            </span>
            <span
              className={`text-xs font-bold ${isOverBudget ? "text-red-500" : "text-gray-900 dark:text-white"}`}
            >
              {formatCurrency(Math.max(0, left))}
            </span>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading || totalBudget === 0}
            className="w-full rounded-full bg-indigo-600 py-6 text-lg font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save Budget"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
