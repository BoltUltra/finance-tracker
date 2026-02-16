import { Timestamp } from "firebase/firestore";

export interface UserData {
  bank: number;
  cash: number;
  savings: number;
  /** @deprecated use budget.amount instead */
  monthlyBudget?: number;
  budget?: {
    amount: number;
    frequency: "daily" | "weekly" | "monthly";
  };
  categoryBudgets?: Record<string, number>;
  displayName?: string;
  photoURL?: string; // Add photoURL type definition here as well
  updatedAt: Date | Timestamp;
}
