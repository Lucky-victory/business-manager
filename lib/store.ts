import { create } from "zustand";
import { persist } from "zustand/middleware";
import { credits, debtors, sales, users } from "./db/schema";

export type SaleSelect = typeof sales.$inferSelect;
export type SaleInsert = typeof sales.$inferInsert;
export type CreditSelect = typeof credits.$inferSelect;
export type CreditInsert = typeof credits.$inferInsert;

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
  searchResults: SearchResult[];
  user: UserSelect;
  formatCurrency: (amount: number | string) => string;
  isLoading: {
    sales: boolean;
    credits: boolean;
    debtors: boolean;
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

  // Analytics
  getTotalOutstandingCredit: () => number;
  getDebtorCredits: (debtorId: string) => CreditSelect[];
  getDebtorBalance: (debtorId: string) => number;

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
      searchResults: [],
      user: {} as UserSelect,
      isLoading: {
        sales: true,
        credits: true,
        debtors: true,
        search: false,
        user: true,
      },
      error: null,
      formatCurrency: (amount: number | string) => {
        const amountNumber =
          typeof amount === "string" ? parseFloat(amount || "0.00") : amount;
        const userCurrencySymbol = get().user?.currencySymbol || "₦";
        const formatted = (amountNumber || 0.0).toLocaleString("en-US");
        return `${userCurrencySymbol}${formatted}`;
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

        // Calculate total outstanding credit
        const totalPurchases = credits
          .filter((credit) => credit.type === "purchase" && !credit.isPaid)
          .reduce((sum, credit) => sum + Number(credit.amount), 0);

        const totalPayments = credits
          .filter((credit) => credit.type === "payment")
          .reduce((sum, credit) => sum + Number(credit.amount), 0);

        return Math.max(0, totalPurchases - totalPayments);
      },

      getDebtorCredits: (debtorId: string) => {
        const { credits } = get();
        return credits.filter((credit) => credit.debtorId === debtorId);
      },

      getDebtorBalance: (debtorId: string) => {
        const debtorCredits = get().getDebtorCredits(debtorId);

        const totalPurchases = debtorCredits
          .filter((credit) => credit.type === "purchase" && !credit.isPaid)
          .reduce((sum, credit) => sum + Number(credit.amount), 0);

        const totalPayments = debtorCredits
          .filter((credit) => credit.type === "payment")
          .reduce((sum, credit) => sum + Number(credit.amount), 0);

        return Math.max(0, totalPurchases - totalPayments);
      },

      // State management
      clearError: () => {
        set({ error: null });
      },
      clearState: () => {
        set({
          user: {} as UserSelect,
          sales: [],
          credits: [],
          debtors: [],
          searchResults: [],
          error: null,
          isLoading: {
            sales: false,
            credits: false,
            debtors: false,
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
      }),
    }
  )
);
