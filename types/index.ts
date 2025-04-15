export interface Expense {
  id: string;
  item: string;
  amount: number;
  paymentType: string;
  category?: string;
  notes?: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseInsert = Omit<Expense, "id" | "createdAt" | "updatedAt">;
export type ExpenseUpdate = Partial<ExpenseInsert>;
