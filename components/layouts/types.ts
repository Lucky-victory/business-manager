export const tabs = ["sales", "credit", "expenses", "search"] as const;
export type TabType = (typeof tabs)[number];