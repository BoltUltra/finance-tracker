import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserData } from "@/hooks/useUserData";
import { CreateBudgetDrawer } from "@/components/budget/CreateBudgetDrawer";

export function BudgetPromo() {
  const { userData } = useUserData();

  // Condition: Only render if monthlyBudget is 0 or undefined
  if (userData?.monthlyBudget && userData.monthlyBudget > 0) {
    return null;
  }

  return (
    <div className="px-6 py-4">
      <Card className="overflow-hidden border-0 bg-linear-to-br from-purple-100 to-indigo-50 dark:from-purple-900/40 dark:to-indigo-900/20">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Set a financial budget
              </h3>
              <p className="mt-1 max-w-[160px] text-xs text-gray-600 dark:text-gray-300">
                Setting a budget helps you track your finance easier with
                fintrack
              </p>
            </div>
            <CreateBudgetDrawer>
              <Button className="w-fit rounded-full bg-indigo-600 px-6 font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                Set up now
              </Button>
            </CreateBudgetDrawer>
          </div>

          <div className="relative h-24 w-24 shrink-0 sm:h-32 sm:w-32">
            <Image
              src="/budget-illustration.svg"
              alt="Budget Illustration"
              fill
              className="object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
