import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const IS_DEV = process.env.NODE_ENV !== "production";
export const generateUUID = () => uuidv4();

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
export const getCurrentDateTime = (date: string | Date) => {
  const currentDate = new Date(date as Date);
  const now = new Date();
  currentDate.setHours(now.getHours());
  currentDate.setMinutes(now.getMinutes());
  currentDate.setSeconds(now.getSeconds());
  currentDate.setMilliseconds(now.getMilliseconds());

  return currentDate;
};
export function calculateProfitMargin(
  totalSales: number,
  totalProfit: number
): number {
  /**
   * Calculate the profit margin as a percentage.
   *
   * @param totalSales - The total sales amount
   * @param totalProfit - The total profit amount
   * @returns The profit margin as a percentage
   */
  if (totalSales === 0) {
    return 0; // Prevent division by zero
  }

  const profitMargin = (totalProfit / totalSales) * 100;
  return profitMargin;
}
/**
 * Returns a time-based greeting message for a user
 * @param userName The name of the user to greet
 * @returns A greeting string appropriate for the current time of day
 */
export function greetUser(userName: string): string {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return `Good morning, ${userName}!`;
  } else if (currentHour >= 12 && currentHour < 18) {
    return `Good afternoon, ${userName}!`;
  } else if (currentHour >= 18 && currentHour < 22) {
    return `Good evening, ${userName}!`;
  } else {
    return `Good night, ${userName}!`;
  }
}
export interface FormatPriceOptions {
  addPrefix?: boolean;
  addDecimals?: boolean;
  formatted?: boolean;
}

export function formatPrice(
  amount: string | number,
  currencyPrefix: string = "$",
  options: FormatPriceOptions = {}
): string {
  const { addPrefix = false, addDecimals = true, formatted = true } = options;

  const num = parseFloat(String(amount));

  if (isNaN(num)) {
    const fallback = addDecimals ? "0.00" : "0";
    return addPrefix ? `${currencyPrefix}${fallback}` : fallback;
  }

  const rounded = Math.round(num * 100) / 100;

  let formattedNumber: string;

  if (formatted) {
    formattedNumber = rounded.toLocaleString(undefined, {
      minimumFractionDigits: addDecimals ? 2 : 0,
      maximumFractionDigits: addDecimals ? 2 : 0,
    });
  } else {
    formattedNumber = addDecimals
      ? rounded.toFixed(2)
      : Math.round(rounded).toString();
  }

  return addPrefix ? `${currencyPrefix}${formattedNumber}` : formattedNumber;
}
