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
