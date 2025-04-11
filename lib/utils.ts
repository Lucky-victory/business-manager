import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const IS_DEV = process.env.NODE_ENV !== "production";
export const generateUUID = () => uuidv4();
export const formatCurrency = (val: number) =>
  val && typeof val === "number" ? val.toLocaleString() : "0.00";
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
