import { Timestamp } from "firebase/firestore";

export type TransactionType = "income" | "expense" | "transfer";
export type AccountType = "bank" | "cash" | "savings";

export interface Transaction {
  id?: string;
  userId: string;
  amount: number;
  type: TransactionType;
  date: Date;

  // For Income/Expense
  category?: string;
  subCategory?: string;

  // Account details
  sourceAccount: AccountType;
  destinationAccount?: AccountType; // For Transfer

  note?: string;
  isBudgetLinked?: boolean;
  createdAt: Date;
}
