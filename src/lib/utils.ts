import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getBudgetRange(
  frequency: "daily" | "weekly" | "monthly" = "monthly",
) {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (frequency === "daily") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (frequency === "weekly") {
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else {
    // Monthly
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setMonth(start.getMonth() + 1); // Next month
    end.setDate(0); // Last day of previous month (which is current month)
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
}

export function getPastPeriods(
  frequency: "daily" | "weekly" | "monthly",
  count = 5,
) {
  const periods = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const end = new Date(now);
    const start = new Date(now);

    if (frequency === "daily") {
      // Go back i days
      start.setDate(now.getDate() - i);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - i);
      end.setHours(23, 59, 59, 999);
    } else if (frequency === "weekly") {
      // Go back i weeks
      // First find start of current week
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(diff);

      start.setDate(currentWeekStart.getDate() - i * 7);
      start.setHours(0, 0, 0, 0);

      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else {
      // Monthly
      // Go back i months
      start.setMonth(now.getMonth() - i);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
    }

    periods.push({ start, end });
  }
  return periods;
}
