"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { OnboardingProgress } from "./onboarding-progress";
import { useSubscriptionStore } from "@/lib/subscription-store";

// Import step components
import { WelcomeStep } from "./steps/welcome-step";
import { ProfileStep } from "./steps/profile-step";
import { BusinessStep } from "./steps/business-step";
import { CurrencyStep } from "./steps/currency-step";
import { PlanSelectionStep } from "./steps/plan-selection-step";
import { TrialStep } from "./steps/trial-step";
import { CompleteStep } from "./steps/complete-step";

// Import custom hooks
import { useOnboardingState } from "./hooks/use-onboarding-state";
import { useOnboardingActions } from "./hooks/use-onboarding-actions";
// Define the steps in the onboarding flow
export type OnboardingStep =
  | "welcome"
  | "profile"
  | "business"
  | "currency"
  | "plan"
  | "trial"
  | "complete";

export function OnboardingFlow() {
  const router = useRouter();
  const { toast } = useToast();
  const { fetchSubscriptionData } = useSubscriptionStore();

  // Custom hooks for state and actions
  const {
    currentStep,
    setCurrentStep,
    isLoading,
    selectedPlan,
    setSelectedPlan,
    billingCycle,
    setBillingCycle,
  } = useOnboardingState();

  const {
    handleProfileSubmit,
    handleBusinessSubmit,
    handleCurrencySubmit,
    handleStartTrial,
    handleComplete,
  } = useOnboardingActions({
    setCurrentStep,
    selectedPlan,
    billingCycle,
    toast,
    router,
  });

  // Fetch subscription data on component mount
  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep onContinue={() => setCurrentStep("profile")} />;

      case "profile":
        return (
          <ProfileStep
            onBack={() => setCurrentStep("welcome")}
            onSubmit={handleProfileSubmit}
            isLoading={isLoading}
          />
        );

      case "business":
        return (
          <BusinessStep
            onBack={() => setCurrentStep("profile")}
            onSubmit={handleBusinessSubmit}
            isLoading={isLoading}
          />
        );

      case "currency":
        return (
          <CurrencyStep
            onBack={() => setCurrentStep("business")}
            onSubmit={handleCurrencySubmit}
            isLoading={isLoading}
          />
        );

      case "plan":
        return (
          <PlanSelectionStep
            onBack={() => setCurrentStep("currency")}
            onContinue={() => setCurrentStep("trial")}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
          />
        );

      case "trial":
        return (
          <TrialStep
            onBack={() => setCurrentStep("plan")}
            onSubmit={handleStartTrial}
            selectedPlan={selectedPlan}
            billingCycle={billingCycle}
            isLoading={isLoading}
          />
        );

      case "complete":
        return <CompleteStep onComplete={handleComplete} />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        {currentStep !== "welcome" && currentStep !== "complete" && (
          <OnboardingProgress currentStep={currentStep} />
        )}

        {/* Current step content */}
        {renderStep()}
      </div>
    </div>
  );
}
