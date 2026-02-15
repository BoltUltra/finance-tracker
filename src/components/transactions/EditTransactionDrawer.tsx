"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateTransaction } from "@/services/transactionService";
import { useAuth } from "@/context/AuthContext";
import { Transaction } from "@/types/transaction";

interface EditTransactionDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditTransactionDrawer({
  transaction,
  open,
  onOpenChange,
  onSuccess,
}: EditTransactionDrawerProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction && open) {
      setAmount(transaction.amount.toString());

      const txDate =
        transaction.date instanceof Date
          ? transaction.date
          : (transaction.date as any).toDate();

      setDate(txDate);
      setTime(format(txDate, "HH:mm"));
      setNote(transaction.note || "");
    }
  }, [transaction, open]);

  const handleSave = async () => {
    if (!user || !transaction || !date || !amount) return;

    setLoading(true);
    try {
      // Combine date and time
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);

      await updateTransaction(user.uid, transaction.id!, {
        amount: parseFloat(amount),
        date: newDate,
        note,
      });

      toast.success("Transaction updated");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update transaction", error);
      toast.error("Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] font-outfit">
        <DrawerHeader>
          <DrawerTitle className="text-center">Edit Transaction</DrawerTitle>
        </DrawerHeader>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-lg"
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker (Simple Input) */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
            />
          </div>

          <Button
            className="w-full rounded-full py-6 text-lg font-semibold"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
