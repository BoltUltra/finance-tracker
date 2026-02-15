import { db } from "@/lib/firebase";
import { Transaction, TransactionType, AccountType } from "@/types/transaction";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

/**
 * Adds a transaction to Firestore and atomically updates the user's account balances.
 * @param userId - The user's ID
 * @param transactionData - The transaction details
 */
export const addTransaction = async (
  userId: string,
  transactionData: Omit<Transaction, "id" | "userId" | "createdAt" | "date"> & {
    date: Date;
    isBudgetLinked?: boolean;
  },
) => {
  try {
    await runTransaction(db, async (txn) => {
      // 1. Get references
      const userRef = doc(db, "users", userId);
      const newTransactionRef = doc(collection(db, "transactions"));

      // 2. Read user document (Required for runTransaction)
      const userDoc = await txn.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("User document does not exist!");
      }

      const userData = userDoc.data();
      let { bank = 0, cash = 0, savings = 0 } = userData;

      // 3. Calculate new balances based on transaction type
      const amount = Number(transactionData.amount);
      const source = transactionData.sourceAccount;
      const dest = transactionData.destinationAccount;
      const type = transactionData.type;

      // Update balances
      if (type === "income") {
        if (source === "bank") bank += amount;
        else if (source === "cash") cash += amount;
        else if (source === "savings") savings += amount;
      } else if (type === "expense") {
        if (source === "bank") bank -= amount;
        else if (source === "cash") cash -= amount;
        else if (source === "savings") savings -= amount;
      } else if (type === "transfer") {
        if (source === "bank") bank -= amount;
        else if (source === "cash") cash -= amount;
        else if (source === "savings") savings -= amount;

        if (dest === "bank") bank += amount;
        else if (dest === "cash") cash += amount;
        else if (dest === "savings") savings += amount;
      }

      // 4. Prepare Transaction Document
      const payload: any = {
        userId,
        amount,
        type,
        sourceAccount: source,
        category: transactionData.category,
        note: transactionData.note || "",
        date: Timestamp.fromDate(transactionData.date),
        createdAt: serverTimestamp(),
      };

      // Add optional fields only if they exist
      if (transactionData.subCategory)
        payload.subCategory = transactionData.subCategory;
      if (transactionData.destinationAccount)
        payload.destinationAccount = transactionData.destinationAccount;

      // Explicitly handle isBudgetLinked
      if (type === "expense" && transactionData.isBudgetLinked !== undefined) {
        payload.isBudgetLinked = transactionData.isBudgetLinked;
      }

      // 5. Commit Writes
      txn.set(newTransactionRef, payload);

      txn.update(userRef, {
        bank,
        cash,
        savings,
        updatedAt: serverTimestamp(),
      });
    });

    console.log("Transaction successfully committed!");
  } catch (e) {
    console.error("Transaction failed: ", e);
    throw e;
  }
};

/**
 * Updates an existing transaction and adjusts user balances accordingly.
 */
export const updateTransaction = async (
  userId: string,
  transactionId: string,
  updates: Partial<Omit<Transaction, "id" | "userId" | "createdAt">>,
) => {
  try {
    await runTransaction(db, async (txn) => {
      const userRef = doc(db, "users", userId);
      const transactionRef = doc(db, "transactions", transactionId);

      const userDoc = await txn.get(userRef);
      const transactionDoc = await txn.get(transactionRef);

      if (!userDoc.exists() || !transactionDoc.exists()) {
        throw new Error("Document not found");
      }

      const userData = userDoc.data();
      const oldTx = transactionDoc.data() as Transaction;

      let { bank = 0, cash = 0, savings = 0 } = userData;

      // 1. Revert Old Transaction
      const oldAmount = Number(oldTx.amount);
      if (oldTx.type === "income") {
        if (oldTx.sourceAccount === "bank") bank -= oldAmount;
        else if (oldTx.sourceAccount === "cash") cash -= oldAmount;
        else if (oldTx.sourceAccount === "savings") savings -= oldAmount;
      } else if (oldTx.type === "expense") {
        if (oldTx.sourceAccount === "bank") bank += oldAmount;
        else if (oldTx.sourceAccount === "cash") cash += oldAmount;
        else if (oldTx.sourceAccount === "savings") savings += oldAmount;
      } else if (oldTx.type === "transfer") {
        // Revert transfer: Add back to source, Remove from dest
        if (oldTx.sourceAccount === "bank") bank += oldAmount;
        else if (oldTx.sourceAccount === "cash") cash += oldAmount;
        else if (oldTx.sourceAccount === "savings") savings += oldAmount;

        if (oldTx.destinationAccount === "bank") bank -= oldAmount;
        else if (oldTx.destinationAccount === "cash") cash -= oldAmount;
        else if (oldTx.destinationAccount === "savings") savings -= oldAmount;
      }

      // 2. Apply New Transaction (Merge updates with old data to get full new state)
      const newTx = { ...oldTx, ...updates };
      const newAmount = Number(newTx.amount);

      if (newTx.type === "income") {
        if (newTx.sourceAccount === "bank") bank += newAmount;
        else if (newTx.sourceAccount === "cash") cash += newAmount;
        else if (newTx.sourceAccount === "savings") savings += newAmount;
      } else if (newTx.type === "expense") {
        if (newTx.sourceAccount === "bank") bank -= newAmount;
        else if (newTx.sourceAccount === "cash") cash -= newAmount;
        else if (newTx.sourceAccount === "savings") savings -= newAmount;
      } else if (newTx.type === "transfer") {
        if (newTx.sourceAccount === "bank") bank -= newAmount;
        else if (newTx.sourceAccount === "cash") cash -= newAmount;
        else if (newTx.sourceAccount === "savings") savings -= newAmount;

        if (newTx.destinationAccount === "bank") bank += newAmount;
        else if (newTx.destinationAccount === "cash") cash += newAmount;
        else if (newTx.destinationAccount === "savings") savings += newAmount;
      }

      // 3. Commit Updates
      // Check if date is updated, convert to Timestamp
      const updatePayload: any = { ...updates };
      if (updates.date) {
        updatePayload.date = Timestamp.fromDate(new Date(updates.date));
      }

      txn.update(transactionRef, updatePayload);
      txn.update(userRef, {
        bank,
        cash,
        savings,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (e) {
    console.error("Update failed: ", e);
    throw e;
  }
};

/**
 * Deletes a transaction and reverts its effect on user balances.
 */
export const deleteTransaction = async (
  userId: string,
  transactionId: string,
) => {
  try {
    await runTransaction(db, async (txn) => {
      const userRef = doc(db, "users", userId);
      const transactionRef = doc(db, "transactions", transactionId);

      const userDoc = await txn.get(userRef);
      const transactionDoc = await txn.get(transactionRef);

      if (!userDoc.exists() || !transactionDoc.exists()) {
        throw new Error("Document not found");
      }

      const userData = userDoc.data();
      const tx = transactionDoc.data() as Transaction;

      let { bank = 0, cash = 0, savings = 0 } = userData;

      // Revert the transaction's effect on balances
      const amount = Number(tx.amount);
      if (tx.type === "income") {
        if (tx.sourceAccount === "bank") bank -= amount;
        else if (tx.sourceAccount === "cash") cash -= amount;
        else if (tx.sourceAccount === "savings") savings -= amount;
      } else if (tx.type === "expense") {
        if (tx.sourceAccount === "bank") bank += amount;
        else if (tx.sourceAccount === "cash") cash += amount;
        else if (tx.sourceAccount === "savings") savings += amount;
      } else if (tx.type === "transfer") {
        // Revert transfer: Add back to source, Remove from dest
        if (tx.sourceAccount === "bank") bank += amount;
        else if (tx.sourceAccount === "cash") cash += amount;
        else if (tx.sourceAccount === "savings") savings += amount;

        if (tx.destinationAccount === "bank") bank -= amount;
        else if (tx.destinationAccount === "cash") cash -= amount;
        else if (tx.destinationAccount === "savings") savings -= amount;
      }

      // Delete transaction and update balances
      txn.delete(transactionRef);
      txn.update(userRef, {
        bank,
        cash,
        savings,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (e) {
    console.error("Delete failed: ", e);
    throw e;
  }
};
