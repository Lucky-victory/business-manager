import { plans } from "@/lib/db/schema";

export const PAYMENT_TYPES = ["cash", "card", "transfer", "other"] as const;
export const MEASUREMENT_UNITS = [
  "set",
  "kg",
  "pcs",
  "dz",
  "bg",
  "pks",
  "ltr",
  "g",
] as const;

export type PlanSelect = typeof plans.$inferSelect;
export type PlanInsert = typeof plans.$inferInsert;
