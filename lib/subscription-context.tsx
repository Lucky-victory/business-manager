"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PlanFeatures,
  SubscriptionTier,
  SUBSCRIPTION_PLANS,
  COUNTRY_PRICING,
  DEFAULT_COUNTRY_PRICING,
  CountryPricing,
} from "@/types/subscription";
import { useStore } from "@/lib/store";

interface SubscriptionContextType {
  currentPlan: SubscriptionTier;
  features: PlanFeatures;
  isFeatureEnabled: (feature: keyof PlanFeatures) => boolean;
  isPro: boolean;
  isLoading: boolean;
  countryPricing: CountryPricing;
  showPlansModal: boolean;
  setShowPlansModal: (show: boolean) => void;
  featureClicked: keyof PlanFeatures | null;
  setFeatureClicked: (feature: keyof PlanFeatures | null) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useStore();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>("free");
  const [isLoading, setIsLoading] = useState(true);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [featureClicked, setFeatureClicked] = useState<
    keyof PlanFeatures | null
  >(null);

  // Get country code from user or default to Nigeria
  const countryCode = user?.currencyCode?.slice(0, 2) || "NG";

  // Get pricing for the user's country or default to Nigerian pricing
  const countryPricing =
    COUNTRY_PRICING[countryCode] || DEFAULT_COUNTRY_PRICING;

  useEffect(() => {
    // In a real app, this would fetch the user's subscription from the API
    // For now, we'll just simulate a loading state and set to free plan
    const fetchSubscription = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For now, hardcode to free plan
        // In a real implementation, this would come from the API
        setCurrentPlan("free");
      } catch (error) {
        console.error("Error fetching subscription:", error);
        // Default to free plan on error
        setCurrentPlan("free");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Get features for the current plan
  const features = SUBSCRIPTION_PLANS[currentPlan].features;

  // Check if a specific feature is enabled for the current plan
  const isFeatureEnabled = (feature: keyof PlanFeatures) => {
    return features[feature];
  };

  // Check if user has any paid plan
  const isPro = currentPlan !== "free";

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        features,
        isFeatureEnabled,
        isPro,
        isLoading,
        countryPricing,
        showPlansModal,
        setShowPlansModal,
        featureClicked,
        setFeatureClicked,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}
