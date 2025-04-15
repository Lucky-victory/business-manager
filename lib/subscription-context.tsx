"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PlanFeatures,
  SubscriptionTier,
  SUBSCRIPTION_PLANS,
} from "@/types/subscription";

interface SubscriptionContextType {
  currentPlan: SubscriptionTier;
  features: PlanFeatures;
  isFeatureEnabled: (feature: keyof PlanFeatures) => boolean;
  isPro: boolean;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>("free");
  const [isLoading, setIsLoading] = useState(true);

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
