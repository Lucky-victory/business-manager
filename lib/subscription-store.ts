import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PlanFeatures,
  SubscriptionPlanSelect,
  PricingWithPlan,
  CountryCurrencySelect,
  FEATURE_DESCRIPTIONS,
} from "@/types/subscription";

interface SubscriptionState {
  // Data
  plans: SubscriptionPlanSelect[];
  pricing: PricingWithPlan[];
  country: CountryCurrencySelect | null;
  detectedCountryCode: string | null;
  currentPlanId: string; // Plan ID

  // UI state
  showPlansModal: boolean;
  featureClicked: keyof PlanFeatures | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSubscriptionData: () => Promise<void>;
  setShowPlansModal: (show: boolean) => void;
  setFeatureClicked: (feature: keyof PlanFeatures | null) => void;
  isFeatureEnabled: (feature: keyof PlanFeatures) => boolean;
  getPlanPrice: (planId: string, interval: "monthly" | "yearly") => number;
  getCurrencySymbol: () => string;
  getFeatureDescriptions: () => typeof FEATURE_DESCRIPTIONS;
}

// Default features (all disabled)
const defaultFeatures: PlanFeatures = {
  expenses: false,
  expensesAnalytics: false,
  credit: false,
  creditReports: false,
  invoicing: false,
  inventory: false,
};

// Default country
const defaultCountry: Partial<CountryCurrencySelect> = {
  countryCode: "US",
  name: "United States",
  currencyCode: "USD",
  currencySymbol: "$",
  currencyName: "United States Dollar",
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // Initial state
      plans: [],
      pricing: [],
      country: null,
      detectedCountryCode: null,
      currentPlanId: "", // Will be set after fetching data
      showPlansModal: false,
      featureClicked: null,
      isLoading: false,
      error: null,

      // Actions
      fetchSubscriptionData: async () => {
        try {
          set({ isLoading: true, error: null });

          // Fetch subscription data from API
          const response = await fetch("/api/subscriptions");

          if (!response.ok) {
            throw new Error("Failed to fetch subscription data");
          }

          const { data } = await response.json();

          // Find the free plan ID
          const freePlan = data.plans.find(
            (plan: SubscriptionPlanSelect) =>
              plan.name.toLowerCase() === "basic"
          );
          const sortedPlans = (data?.plans as SubscriptionPlanSelect[]).sort(
            (a, b) => (a.name.toLowerCase() === "free" ? -1 : 1)
          );

          // In a real app, we would also fetch the user's current subscription
          // For now, we'll default to free plan
          set({
            plans: sortedPlans,
            pricing: data.pricing,
            country: data.country || defaultCountry,
            detectedCountryCode: data.detectedCountryCode,
            currentPlanId: freePlan?.id || "",
            isLoading: false,
          });
        } catch (error) {
          console.error("Error fetching subscription data:", error);
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      setShowPlansModal: (show) => set({ showPlansModal: show }),

      setFeatureClicked: (feature) => set({ featureClicked: feature }),

      isFeatureEnabled: (feature) => {
        const { pricing, currentPlanId } = get();

        if (!currentPlanId) return false;

        const currentPricing = pricing.find((p) => p.planId === currentPlanId);
        if (!currentPricing) return false;

        // Parse the features JSON
        const features =
          typeof currentPricing.features === "string"
            ? (JSON.parse(currentPricing.features as string) as PlanFeatures)
            : (currentPricing.features as unknown as PlanFeatures);

        return features[feature] || false;
      },

      getPlanPrice: (planId, interval) => {
        const { pricing, country } = get();

        if (!planId) return 0;

        const planPricing = pricing.find((p) => p.planId === planId);
        if (!planPricing) return 0;

        return interval === "monthly"
          ? Number(planPricing.monthlyPrice)
          : Number(planPricing.yearlyPrice);
      },

      getCurrencySymbol: () => {
        return get().country?.currencySymbol || "$";
      },

      getFeatureDescriptions: () => FEATURE_DESCRIPTIONS,
    }),
    {
      name: "subscription-storage",
      partialize: (state) => ({
        // Only persist these parts of the state
        currentPlanId: state.currentPlanId,
        country: state.country,
        detectedCountryCode: state.detectedCountryCode,
      }),
    }
  )
);
