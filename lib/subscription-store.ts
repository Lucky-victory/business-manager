import { create } from "zustand";
import { SubscriptionService } from "./subscription/subscription-service";
import {
  PlanFeatures,
  SubscriptionTier,
  SUBSCRIPTION_PLANS,
  COUNTRY_PRICING,
  CountryPricing,
  DEFAULT_COUNTRY_PRICING,
  FEATURE_DESCRIPTIONS,
} from "@/types/subscription";

export type SubscriptionState = {
  // Subscription data
  subscription: any | null;
  tier: SubscriptionTier;
  isActive: boolean;
  isTrial: boolean;
  isExpired: boolean;
  daysLeft: number | null;
  features: PlanFeatures;

  // Plans and pricing data
  plans: any[];
  pricing: any[];

  // Country and currency data
  country: CountryPricing | null;
  detectedCountryCode: string | null;

  // UI state
  showPlansModal: boolean;
  featureClicked: keyof PlanFeatures | null;

  // Loading state
  isLoading: boolean;
  error: string | null;

  // Methods
  fetchSubscriptionData: () => Promise<void>;
  hasFeatureAccess: (featureKey: string) => boolean;
  getUpgradeSuggestion: (limitType: "transaction" | "user" | "storage") => any;
  setShowPlansModal: (show: boolean) => void;
  setFeatureClicked: (feature: keyof PlanFeatures | null) => void;
  getPlanPrice: (planId: string, interval: "monthly" | "yearly") => number;
  getCurrencySymbol: () => string;
  getFeatureDescriptions: () => Record<keyof PlanFeatures, string>;
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // Default state
  subscription: null,
  tier: "free",
  isActive: false,
  isTrial: false,
  isExpired: false,
  daysLeft: null,
  features: SUBSCRIPTION_PLANS.free.features,

  plans: [],
  pricing: [],

  country: null,
  detectedCountryCode: "NG", // Default to Nigeria

  // UI state
  showPlansModal: false,
  featureClicked: null,

  isLoading: false,
  error: null,

  // Fetch subscription data from the server
  fetchSubscriptionData: async () => {
    try {
      set({ isLoading: true, error: null });

      // Detect country (in a real app, this would use geolocation or IP detection)
      const detectedCountryCode = "NG"; // Default to Nigeria

      // Get country data
      const country =
        COUNTRY_PRICING[detectedCountryCode as keyof typeof COUNTRY_PRICING] ||
        DEFAULT_COUNTRY_PRICING;

      // Fetch subscription status
      const subscriptionResponse = await fetch("/api/subscriptions/status");
      if (!subscriptionResponse.ok) {
        throw new Error("Failed to fetch subscription status");
      }

      const { subscription, pricing: pricingDetails } =
        await subscriptionResponse.json();

      // Determine tier based on subscription
      let tier: SubscriptionTier = "free";
      let isActive = false;
      let isTrial = false;
      let isExpired = false;
      let daysLeft: number | null = null;

      if (subscription && pricingDetails) {
        // Determine tier based on plan name
        const planName = pricingDetails.plan?.name?.toLowerCase();
        if (planName === "premium") {
          tier = "premium";
        } else if (planName === "basic") {
          tier = "basic";
        }

        // Check subscription status
        isActive = subscription.status === "active";
        isTrial = subscription.status === "trial";
        isExpired = ["expired", "canceled"].includes(subscription.status);

        // Calculate days left
        if (subscription.endDate) {
          const now = new Date();
          const endDate = new Date(subscription.endDate);
          daysLeft = Math.max(
            0,
            Math.ceil(
              (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )
          );
        }
      }

      // Fetch plans and pricing options
      const plansResponse = await fetch(
        `/api/plans?countryCode=${detectedCountryCode}`
      ).catch(() => null);
      let plans: any[] = [];
      let pricingOptions: any[] = [];

      if (plansResponse?.ok) {
        const plansData = await plansResponse.json();
        plans = plansData.plans || [];
        pricingOptions = plansData.pricing || [];
      }

      // Update state
      set({
        subscription,
        tier,
        isActive,
        isTrial,
        isExpired,
        daysLeft,
        features: SUBSCRIPTION_PLANS[tier].features,
        plans,
        pricing: pricingOptions,
        country,
        detectedCountryCode,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      });
    }
  },

  // Check if user has access to a specific feature
  hasFeatureAccess: (featureKey: string) => {
    const { tier, isActive, isTrial } = get();

    // If the subscription is not active or in trial, only allow free features
    if (!isActive && !isTrial && tier !== "free") {
      return (
        SUBSCRIPTION_PLANS.free.features[featureKey as keyof PlanFeatures] ||
        false
      );
    }

    return (
      SUBSCRIPTION_PLANS[tier].features[featureKey as keyof PlanFeatures] ||
      false
    );
  },

  // Get upgrade suggestion when limits are reached
  getUpgradeSuggestion: (limitType: "transaction" | "user" | "storage") => {
    const { tier } = get();

    if (tier === "premium") return null; // Already on highest tier

    if (tier === "free") {
      return {
        title: "Upgrade to Basic",
        description: `Get higher ${limitType} limits and unlock expenses & credit tracking`,
        targetTier: "basic",
      };
    } else {
      return {
        title: "Upgrade to Premium",
        description: `Get unlimited ${limitType}s and unlock all advanced features`,
        targetTier: "premium",
      };
    }
  },

  // UI state management
  setShowPlansModal: (show) => set({ showPlansModal: show }),
  setFeatureClicked: (feature) => set({ featureClicked: feature }),

  // Helper methods for plans modal
  getPlanPrice: (planId, interval) => {
    const { pricing } = get();
    const plan = pricing.find((p) => p.planId === planId);
    if (!plan) return 0;

    return interval === "monthly"
      ? Number(plan.monthlyPrice || 0)
      : Number(plan.yearlyPrice || 0);
  },

  getCurrencySymbol: () => {
    const { country } = get();
    return country?.currencySymbol || "₦";
  },

  getFeatureDescriptions: () => FEATURE_DESCRIPTIONS,
}));
