import { Timestamp } from "firebase/firestore";

export interface UserData {
  bank: number;
  cash: number;
  savings: number;
  monthlyBudget?: number;
  categoryBudgets?: Record<string, number>;
  displayName?: string;
  updatedAt: Date | Timestamp;
}
