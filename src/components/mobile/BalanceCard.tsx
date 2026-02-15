import { useState } from "react";
import { Eye, EyeOff, Plus, ArrowUpRight, Grid } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/useUserData";
import { formatCurrency } from "@/lib/utils";

interface BalanceCardProps {
  onAdd: () => void;
  onTransfer: () => void;
}

export function BalanceCard({ onAdd, onTransfer }: BalanceCardProps) {
  const { userData } = useUserData();
  const [isVisible, setIsVisible] = useState(true);

  // Calculate total balance from user data
  const totalBalance = (userData?.bank || 0) + (userData?.cash || 0);

  return (
    <div className="px-6 py-2">
      <Card className="overflow-hidden border-0 bg-gray-900 text-white shadow-xl dark:bg-black dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm font-medium">Total balance</span>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="rounded-full p-1 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {isVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="mt-2 mb-8">
            <h2 className="text-4xl font-bold tracking-tight">
              {isVisible
                ? formatCurrency(totalBalance)
                : formatCurrency(12345.67).replace(/[0-9]/g, "•")}
            </h2>
            {/* Note: Hardcoded USD as per design request, though app logic supports NGN. We should check if User wants multi-currency or if NGN is the only one. 
                Wait, user asked for NGN earlier. The design shows USD.
                I will stick to formatCurrency (which is NGN) but the design shows USD.
                I'll remove the hardcoded USD span and let formatCurrency handle the symbol.
            */}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <ActionButton
              icon={<Plus className="h-6 w-6" />}
              label="Add"
              onClick={onAdd}
            />
            <ActionButton
              icon={<ArrowUpRight className="h-6 w-6" />}
              label="Transfer"
              onClick={onTransfer}
            />
            <ActionButton
              icon={<Grid className="h-6 w-6" />}
              label="More"
              onClick={() => {}} // Placeholder for now
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={onClick}
        variant="outline"
        className="h-14 w-14 rounded-2xl border-gray-700 bg-gray-800 p-0 text-white hover:bg-gray-700 hover:text-white border-0 transition-transform active:scale-95"
      >
        {icon}
      </Button>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}
