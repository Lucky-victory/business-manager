import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export type Sale = {
  id: string
  item: string
  quantity: number
  price: number
  amount: number
  paymentType: string
  date: string
}

export type Credit = {
  id: string
  debtorId: string
  debtorName: string
  type: "purchase" | "payment"
  item?: string
  quantity?: number
  price?: number
  amount: number
  paymentType?: string
  date: string
  isPaid?: boolean
  paidDate?: string
  invoiceId?: string
}

export type Debtor = {
  id: string
  name: string
}

export type SearchResult = {
  id: string
  type: "sale" | "credit"
  title: string
  subtitle: string
  amount: number
  date: string
  path: string
}

type State = {
  sales: Sale[]
  credits: Credit[]
  debtors: Debtor[]
  searchResults: SearchResult[]
  fetchSales: () => Promise<void>
  addSale: (sale: Sale) => Promise<void>
  fetchCredits: () => Promise<void>
  addCredit: (credit: Credit) => Promise<void>
  updateCreditStatus: (creditId: string, isPaid: boolean) => Promise<void>
  updateMultipleCreditStatus: (creditIds: string[], isPaid: boolean) => Promise<void>
  searchSalesAndCredit: (query: string) => Promise<void>
  getTotalOutstandingCredit: () => number
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      sales: [],
      credits: [],
      debtors: [],
      searchResults: [],

      fetchSales: async () => {
        try {
          const response = await fetch("/api/sales")
          if (!response.ok) throw new Error("Failed to fetch sales")

          const data = await response.json()
          set({ sales: data })
        } catch (error) {
          console.error("Error fetching sales:", error)
        }
      },

      addSale: async (sale: Sale) => {
        try {
          const response = await fetch("/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sale),
          })

          if (!response.ok) throw new Error("Failed to add sale")

          const newSale = await response.json()
          set((state) => ({
            sales: [...state.sales, newSale],
          }))
        } catch (error) {
          console.error("Error adding sale:", error)
        }
      },

      fetchCredits: async () => {
        try {
          const response = await fetch("/api/credit")
          if (!response.ok) throw new Error("Failed to fetch credit data")

          const data = await response.json()
          set({
            credits: data.credits,
            debtors: data.debtors,
          })
        } catch (error) {
          console.error("Error fetching credit data:", error)
        }
      },

      addCredit: async (credit: Credit) => {
        try {
          const response = await fetch("/api/credit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credit),
          })

          if (!response.ok) throw new Error("Failed to add credit")

          const newCredit = await response.json()

          // Update local state
          set((state) => {
            // Check if this is a new debtor
            const updatedDebtors = [...state.debtors]
            const existingDebtor = updatedDebtors.find((d) => d.id === credit.debtorId)

            if (!existingDebtor && credit.debtorName) {
              updatedDebtors.push({
                id: credit.debtorId,
                name: credit.debtorName,
              })
            }

            return {
              credits: [...state.credits, newCredit],
              debtors: updatedDebtors,
            }
          })
        } catch (error) {
          console.error("Error adding credit:", error)
        }
      },

      updateCreditStatus: async (creditId: string, isPaid: boolean) => {
        try {
          const response = await fetch(`/api/credit/${creditId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              isPaid,
              paidDate: isPaid ? new Date().toISOString() : undefined,
            }),
          })

          if (!response.ok) throw new Error("Failed to update credit status")

          // Update local state
          set((state) => ({
            credits: state.credits.map((credit) =>
              credit.id === creditId
                ? {
                    ...credit,
                    isPaid,
                    paidDate: isPaid ? new Date().toISOString() : undefined,
                  }
                : credit,
            ),
          }))
        } catch (error) {
          console.error("Error updating credit status:", error)
        }
      },

      updateMultipleCreditStatus: async (creditIds: string[], isPaid: boolean) => {
        try {
          const response = await fetch(`/api/credit/batch-update`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              creditIds,
              isPaid,
              paidDate: isPaid ? new Date().toISOString() : undefined,
            }),
          })

          if (!response.ok) throw new Error("Failed to update multiple credit statuses")

          // Update local state
          set((state) => ({
            credits: state.credits.map((credit) =>
              creditIds.includes(credit.id)
                ? {
                    ...credit,
                    isPaid,
                    paidDate: isPaid ? new Date().toISOString() : undefined,
                  }
                : credit,
            ),
          }))
        } catch (error) {
          console.error("Error updating multiple credit statuses:", error)
        }
      },

      searchSalesAndCredit: async (query: string) => {
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          if (!response.ok) throw new Error("Search failed")

          const data = await response.json()
          set({ searchResults: data.results })
        } catch (error) {
          console.error("Error searching:", error)
          set({ searchResults: [] })
        }
      },

      getTotalOutstandingCredit: () => {
        const { credits } = get()

        // Calculate total outstanding credit
        const totalPurchases = credits
          .filter((credit) => credit.type === "purchase" && !credit.isPaid)
          .reduce((sum, credit) => sum + credit.amount, 0)

        const totalPayments = credits
          .filter((credit) => credit.type === "payment")
          .reduce((sum, credit) => sum + credit.amount, 0)

        return Math.max(0, totalPurchases - totalPayments)
      },
    }),
    {
      name: "business-management-storage",
    },
  ),
)

