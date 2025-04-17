import { create } from "zustand";
import { persist } from "zustand/middleware";
import { credits, debtors, expenses, sales, users } from "./db/schema";
import { formatPrice } from "./utils";

export type SaleSelect = typeof sales.$inferSelect;
export type SaleInsert = typeof sales.$inferInsert;
export type CreditSelect = typeof credits.$inferSelect;
export type CreditInsert = typeof credits.$inferInsert;
export type ExpenseSelect = typeof expenses.$inferSelect;
export type ExpenseInsert = typeof expenses.$inferInsert;

export type DebtorSelect = typeof debtors.$inferSelect;
export type DebtorInsert = typeof debtors.$inferInsert;
export type UserSelect = Omit<typeof users.$inferSelect, "password">;
export type SearchResult = {
  id: string;
  type: "sale" | "credit";
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  path: string;
};

type State = {
  sales: SaleSelect[];
  credits: CreditSelect[];
  debtors: DebtorSelect[];
  expenses: ExpenseSelect[];
  searchResults: SearchResult[];
  user: UserSelect;
  formatCurrency: (amount: number | string) => string;
  currency: string;
  isLoading: {
    sales: boolean;
    credits: boolean;
    debtors: boolean;
    expenses: boolean;
    search: boolean;
    user: boolean;
  };
  error: string | null;

  // Sales operations
  fetchSales: () => Promise<void>;
  addSale: (sale: SaleInsert) => Promise<SaleSelect | null>;
  editSale: (
    saleId: string,
    data: Partial<SaleInsert>
  ) => Promise<SaleSelect | null>;
  deleteSale: (saleId: string) => Promise<void>;

  fetchUser: () => Promise<void>;
  removeUser: () => void;
  // Credit operations
  fetchCredits: () => Promise<void>;
  addCredit: (credit: CreditInsert) => Promise<CreditSelect | null>;
  updateCreditStatus: (creditId: string, isPaid: boolean) => Promise<void>;
  updateMultipleCreditStatus: (
    creditIds: string[],
    isPaid: boolean
  ) => Promise<void>;
  deleteCredit: (creditId: string) => Promise<void>;

  // Debtor operations
  fetchDebtors: () => Promise<void>;
  addDebtor: (debtor: DebtorInsert) => Promise<DebtorSelect | null>;
  updateDebtor: (
    debtorId: string,
    data: Partial<DebtorInsert>
  ) => Promise<void>;
  deleteDebtor: (debtorId: string) => Promise<void>;
  getDebtorById: (debtorId: string) => Promise<DebtorSelect | null>;

  // Search operations
  searchSalesAndCredit: (query: string) => Promise<void>;
  clearSearchResults: () => void;

  // Expense operations
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: ExpenseInsert) => Promise<ExpenseSelect | null>;
  updateExpense: (
    expense: Partial<ExpenseInsert> & { id: string }
  ) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;

  // Analytics
  getTotalOutstandingCredit: () => number;
  getDebtorCredits: (debtorId: string) => CreditSelect[];
  getDebtorBalance: (debtorId: string) => number;
  getTotalExpenses: (period?: "day" | "week" | "month" | "year") => number;

  // State management
  clearError: () => void;
  clearState: () => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      sales: [],
      credits: [],
      debtors: [],
      expenses: [],
      currency: "",
      searchResults: [],
      user: {} as UserSelect,
      isLoading: {
        sales: true,
        credits: true,
        debtors: true,
        expenses: true,
        search: false,
        user: true,
      },
      error: null,
      formatCurrency: (amount: number | string) => {
        const userCurrencySymbol = get().user?.currencySymbol || "₦";
        set(() => ({
          currency: userCurrencySymbol,
        }));
        return formatPrice(amount, userCurrencySymbol, { addPrefix: true });
      },
      fetchUser: async () => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, user: true },
            error: null,
          }));
          const response = await fetch("/api/profile");
          if (!response.ok) throw new Error("Failed to fetch user");
          const { data } = await response.json();
          set((state) => ({
            user: data,
            isLoading: { ...state.isLoading, user: false },
          }));
        } catch (error: any) {
          console.error("Error fetching user:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, user: false },
          }));
        }
      },
      // Sales operations
      fetchSales: async () => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, sales: true },
            error: null,
          }));

          const response = await fetch("/api/sales");
          if (!response.ok) throw new Error("Failed to fetch sales");

          const { data } = await response.json();
          set((state) => ({
            sales: data,
            isLoading: { ...state.isLoading, sales: false },
          }));
        } catch (error: any) {
          console.error("Error fetching sales:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, sales: false },
          }));
        }
      },

      addSale: async (sale: SaleInsert) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, sales: true },
            error: null,
          }));

          const response = await fetch("/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sale),
          });

          if (!response.ok) throw new Error("Failed to add sale");

          const { data } = await response.json();
          set((state) => ({
            sales: [...state.sales, data],
            isLoading: { ...state.isLoading, sales: false },
          }));

          return data;
        } catch (error: any) {
          console.error("Error adding sale:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, sales: false },
          }));
          return null;
        }
      },
      editSale: async (saleId: string, sale: Partial<SaleInsert>) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, sales: true },
            error: null,
          }));

          const response = await fetch(`/api/sales/${saleId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sale),
          });

          if (!response.ok) throw new Error("Failed to add sale");

          const { data } = await response.json();
          set((state) => ({
            sales: state.sales.map((oldSale) =>
              oldSale.id === saleId ? data : oldSale
            ),
            isLoading: { ...state.isLoading, sales: false },
          }));

          return data;
        } catch (error: any) {
          console.error("Error adding sale:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, sales: false },
          }));
          return null;
        }
      },

      deleteSale: async (saleId: string) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, sales: true },
            error: null,
          }));

          const response = await fetch(`/api/sales/${saleId}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Failed to delete sale");

          set((state) => ({
            sales: state.sales.filter((sale) => sale.id !== saleId),
            isLoading: { ...state.isLoading, sales: false },
          }));
        } catch (error: any) {
          console.error("Error deleting sale:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, sales: false },
          }));
        }
      },
      removeUser: () => {
        set({ user: {} as UserSelect });
      },
      // Credit operations
      fetchCredits: async () => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, credits: true },
            error: null,
          }));

          const response = await fetch("/api/credit");
          if (!response.ok) throw new Error("Failed to fetch credit data");

          const { data } = await response.json();
          set((state) => ({
            credits: data,
            isLoading: { ...state.isLoading, credits: false },
          }));
        } catch (error: any) {
          console.error("Error fetching credit data:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, credits: false },
          }));
        }
      },

      addCredit: async (credit: CreditInsert) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, credits: true },
            error: null,
          }));

          const response = await fetch("/api/credit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credit),
          });

          if (!response.ok) throw new Error("Failed to add credit");

          const { data } = await response.json();

          set((state) => ({
            credits: [...state.credits, data],
            isLoading: { ...state.isLoading, credits: false },
          }));

          return data;
        } catch (error: any) {
          console.error("Error adding credit:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, credits: false },
          }));
          return null;
        }
      },

      updateCreditStatus: async (creditId: string, isPaid: boolean) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, credits: true },
            error: null,
          }));

          const response = await fetch(`/api/credit/${creditId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              isPaid,
              paidDate: isPaid ? new Date() : null,
            }),
          });

          if (!response.ok) throw new Error("Failed to update credit status");

          const { data } = await response.json();

          set((state) => ({
            credits: state.credits.map((credit) =>
              credit.id === creditId ? data : credit
            ),
            isLoading: { ...state.isLoading, credits: false },
          }));
        } catch (error: any) {
          console.error("Error updating credit status:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, credits: false },
          }));
        }
      },

      updateMultipleCreditStatus: async (
        creditIds: string[],
        isPaid: boolean
      ) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, credits: true },
            error: null,
          }));

          const response = await fetch(`/api/credit/batch-update`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              creditIds,
              isPaid,
              paidDate: isPaid ? new Date() : null,
            }),
          });

          if (!response.ok)
            throw new Error("Failed to update multiple credit statuses");

          set((state) => ({
            credits: state.credits.map((credit) =>
              creditIds.includes(credit.id)
                ? {
                    ...credit,
                    isPaid,
                    paidDate: isPaid ? new Date() : null,
                    updatedAt: new Date(),
                  }
                : credit
            ),
            isLoading: { ...state.isLoading, credits: false },
          }));
        } catch (error: any) {
          console.error("Error updating multiple credit statuses:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, credits: false },
          }));
        }
      },

      deleteCredit: async (creditId: string) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, credits: true },
            error: null,
          }));

          const response = await fetch(`/api/credit/${creditId}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Failed to delete credit");

          set((state) => ({
            credits: state.credits.filter((credit) => credit.id !== creditId),
            isLoading: { ...state.isLoading, credits: false },
          }));
        } catch (error: any) {
          console.error("Error deleting credit:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, credits: false },
          }));
        }
      },

      // Debtor operations
      fetchDebtors: async () => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, debtors: true },
            error: null,
          }));

          const response = await fetch("/api/debtors");
          if (!response.ok) throw new Error("Failed to fetch debtors");

          const { data } = await response.json();
          set((state) => ({
            debtors: data,
            isLoading: { ...state.isLoading, debtors: false },
          }));
        } catch (error: any) {
          console.error("Error fetching debtors:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, debtors: false },
          }));
        }
      },

      addDebtor: async (debtor: DebtorInsert) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, debtors: true },
            error: null,
          }));

          const response = await fetch("/api/debtors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(debtor),
          });

          if (!response.ok) throw new Error("Failed to add debtor");

          const { data } = await response.json();
          set((state) => ({
            debtors: [...state.debtors, data],
            isLoading: { ...state.isLoading, debtors: false },
          }));

          return data;
        } catch (error: any) {
          console.error("Error adding debtor:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, debtors: false },
          }));
          return null;
        }
      },

      updateDebtor: async (debtorId: string, data: Partial<DebtorInsert>) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, debtors: true },
            error: null,
          }));

          const response = await fetch(`/api/debtors/${debtorId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error("Failed to update debtor");

          const { data: updatedDebtor } = await response.json();

          set((state) => ({
            debtors: state.debtors.map((debtor) =>
              debtor.id === debtorId ? updatedDebtor : debtor
            ),
            isLoading: { ...state.isLoading, debtors: false },
          }));
        } catch (error: any) {
          console.error("Error updating debtor:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, debtors: false },
          }));
        }
      },

      deleteDebtor: async (debtorId: string) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, debtors: true },
            error: null,
          }));

          const response = await fetch(`/api/debtors/${debtorId}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Failed to delete debtor");

          set((state) => ({
            debtors: state.debtors.filter((debtor) => debtor.id !== debtorId),
            credits: state.credits.filter(
              (credit) => credit.debtorId !== debtorId
            ),
            isLoading: { ...state.isLoading, debtors: false },
          }));
        } catch (error: any) {
          console.error("Error deleting debtor:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, debtors: false },
          }));
        }
      },

      getDebtorById: async (debtorId: string) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, debtors: true },
            error: null,
          }));

          // First check if we already have this debtor in state
          const existingDebtor = get().debtors.find((d) => d.id === debtorId);
          if (existingDebtor) {
            set((state) => ({
              isLoading: { ...state.isLoading, debtors: false },
            }));
            return existingDebtor;
          }

          const response = await fetch(`/api/debtors/${debtorId}`);
          if (!response.ok) throw new Error("Failed to fetch debtor");

          const { data } = await response.json();

          // Update the debtors list if we found a new one
          if (data) {
            set((state) => ({
              debtors: [
                ...state.debtors.filter((d) => d.id !== debtorId),
                data,
              ],
              isLoading: { ...state.isLoading, debtors: false },
            }));
          } else {
            set((state) => ({
              isLoading: { ...state.isLoading, debtors: false },
            }));
          }

          return data;
        } catch (error: any) {
          console.error("Error fetching debtor:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, debtors: false },
          }));
          return null;
        }
      },

      // Search operations
      searchSalesAndCredit: async (query: string) => {
        if (!query.trim()) {
          set({ searchResults: [] });
          return;
        }

        try {
          set((state) => ({
            isLoading: { ...state.isLoading, search: true },
            error: null,
          }));

          const response = await fetch(
            `/api/search?q=${encodeURIComponent(query)}`
          );
          if (!response.ok) throw new Error("Search failed");

          const { data } = await response.json();
          set({
            searchResults: data,
            isLoading: { ...get().isLoading, search: false },
          });
        } catch (error: any) {
          console.error("Error searching:", error);
          set({
            searchResults: [],
            error: error.message,
            isLoading: { ...get().isLoading, search: false },
          });
        }
      },

      clearSearchResults: () => {
        set({ searchResults: [] });
      },

      // Analytics
      getTotalOutstandingCredit: () => {
        const { credits } = get();

        // Group credits by debtor to calculate per-debtor balances
        const debtorBalances: Record<string, number> = {};

        // First, calculate unpaid purchases per debtor
        credits
          .filter((credit) => credit.type === "purchase" && !credit.isPaid)
          .forEach((credit) => {
            if (!debtorBalances[credit.debtorId]) {
              debtorBalances[credit.debtorId] = 0;
            }
            debtorBalances[credit.debtorId] += Number(credit.amount);
          });

        // Then, subtract payments per debtor (without going negative for any debtor)
        credits
          .filter((credit) => credit.type === "payment")
          .forEach((credit) => {
            if (!debtorBalances[credit.debtorId]) {
              debtorBalances[credit.debtorId] = 0;
            } else {
              debtorBalances[credit.debtorId] = Math.max(
                0,
                debtorBalances[credit.debtorId] - Number(credit.amount)
              );
            }
          });

        // Sum up all debtor balances for the total outstanding credit
        return Object.values(debtorBalances).reduce(
          (total, balance) => total + balance,
          0
        );
      },

      getDebtorCredits: (debtorId: string) => {
        const { credits } = get();
        return credits.filter((credit) => credit.debtorId === debtorId);
      },

      getDebtorBalance: (debtorId: string) => {
        const debtorCredits = get().getDebtorCredits(debtorId);

        // Only consider unpaid purchases
        const unpaidPurchases = debtorCredits.filter(
          (credit) => credit.type === "purchase" && !credit.isPaid
        );

        const totalUnpaidPurchases = unpaidPurchases.reduce(
          (sum, credit) => sum + Number(credit.amount),
          0
        );

        // Consider all payments
        const totalPayments = debtorCredits
          .filter((credit) => credit.type === "payment")
          .reduce((sum, credit) => sum + Number(credit.amount), 0);

        // Balance is unpaid purchases minus payments (can't be negative)
        return Math.max(0, totalUnpaidPurchases - totalPayments);
      },

      // State management
      clearError: () => {
        set({ error: null });
      },
      // Expense operations
      fetchExpenses: async () => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, expenses: true },
            error: null,
          }));

          const response = await fetch("/api/expenses");
          if (!response.ok) throw new Error("Failed to fetch expenses");

          const { data } = await response.json();
          set((state) => ({
            expenses: data,
            isLoading: { ...state.isLoading, expenses: false },
          }));
        } catch (error: any) {
          console.error("Error fetching expenses:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, expenses: false },
          }));
        }
      },

      addExpense: async (expense: ExpenseInsert) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, expenses: true },
            error: null,
          }));

          const response = await fetch("/api/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense),
          });

          if (!response.ok) throw new Error("Failed to add expense");

          const { data } = await response.json();
          set((state) => ({
            expenses: [...state.expenses, data],
            isLoading: { ...state.isLoading, expenses: false },
          }));

          return data;
        } catch (error: any) {
          console.error("Error adding expense:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, expenses: false },
          }));
          return null;
        }
      },

      updateExpense: async (
        expense: Partial<ExpenseInsert> & { id: string }
      ) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, expenses: true },
            error: null,
          }));

          const { id, ...data } = expense;
          const response = await fetch(`/api/expenses/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error("Failed to update expense");

          const { data: updatedExpense } = await response.json();
          set((state) => ({
            expenses: state.expenses.map((exp) =>
              exp.id === id ? updatedExpense : exp
            ),
            isLoading: { ...state.isLoading, expenses: false },
          }));
        } catch (error: any) {
          console.error("Error updating expense:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, expenses: false },
          }));
        }
      },

      deleteExpense: async (expenseId: string) => {
        try {
          set((state) => ({
            isLoading: { ...state.isLoading, expenses: true },
            error: null,
          }));

          const response = await fetch(`/api/expenses/${expenseId}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Failed to delete expense");

          set((state) => ({
            expenses: state.expenses.filter(
              (expense) => expense.id !== expenseId
            ),
            isLoading: { ...state.isLoading, expenses: false },
          }));
        } catch (error: any) {
          console.error("Error deleting expense:", error);
          set((state) => ({
            error: error.message,
            isLoading: { ...state.isLoading, expenses: false },
          }));
        }
      },

      // Analytics
      getTotalExpenses: (period?: "day" | "week" | "month" | "year") => {
        const { expenses } = get();

        if (!period) {
          return expenses.reduce(
            (total, expense) => total + Number(expense.amount),
            0
          );
        }

        const now = new Date();
        let startDate: Date;

        switch (period) {
          case "day":
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case "week":
            const day = now.getDay();
            startDate = new Date(now.setDate(now.getDate() - day));
            startDate.setHours(0, 0, 0, 0);
            break;
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case "year":
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0); // Beginning of time
        }

        return expenses
          .filter((expense) => new Date(expense.date) >= startDate)
          .reduce((total, expense) => total + Number(expense.amount), 0);
      },

      clearState: () => {
        set({
          user: {} as UserSelect,
          sales: [],
          credits: [],
          debtors: [],
          expenses: [],
          searchResults: [],
          currency: "",
          error: null,
          isLoading: {
            sales: false,
            credits: false,
            debtors: false,
            expenses: false,
            search: false,
            user: false,
          },
        });
      },
    }),
    {
      name: "business-management-storage",
      partialize: (state) => ({
        // Only persist these parts of the state to localStorage
        user: state.user,
        sales: state.sales,
        credits: state.credits,
        debtors: state.debtors,
        expenses: state.expenses,
      }),
    }
  )
);
