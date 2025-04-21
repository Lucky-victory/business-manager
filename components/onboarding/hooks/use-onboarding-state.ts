import { useState } from "react";
import type { OnboardingStep } from "../onboarding-flow";

export function useOnboardingState() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  return {
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,
    selectedPlan,
    setSelectedPlan,
    billingCycle,
    setBillingCycle,
  };
}
