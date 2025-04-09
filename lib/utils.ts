import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const IS_DEV = process.env.NODE_ENV === "development";
export const generateUUID = () => uuidv4();
