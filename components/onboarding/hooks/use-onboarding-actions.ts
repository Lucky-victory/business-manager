import { useStore } from "@/lib/store";
import { COUNTRY_PRICING } from "@/types/subscription";
import type { ProfileFormData } from "../steps/profile-step";
import type { BusinessFormData } from "../steps/business-step";
import type { CurrencyFormData } from "../steps/currency-step";
import type { OnboardingStep } from "../onboarding-flow";
import { useState } from "react";

interface OnboardingActionsProps {
  setCurrentStep: (step: OnboardingStep) => void;
  selectedPlan: string;
  billingCycle: "monthly" | "yearly";
  toast: any; // Replace with proper type from your toast library
  router: any; // Replace with proper type from your router
}

export function useOnboardingActions({
  setCurrentStep,
  selectedPlan,
  billingCycle,
  toast,
  router,
}: OnboardingActionsProps) {
  const { updateUser } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  // Handle profile form submission
  const handleProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Update user profile
      await updateUser({
        name: data.name,
        email: data.email,
      });

      // Move to next step
      setCurrentStep("business");
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle business form submission
  const handleBusinessSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);
    try {
      // Update business information
      await updateUser({
        companyName: data.companyName,
        companyAddress: data.companyAddress || "",
        companyPhone: data.companyPhone || "",
        companyEmail: data.companyEmail || "",
      });

      // Move to next step
      setCurrentStep("currency");
      toast({
        title: "Business information updated",
        description: "Your business information has been saved.",
      });
    } catch (error) {
      console.error("Error updating business information:", error);
      toast({
        title: "Error",
        description: "Failed to update business information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle currency form submission
  const handleCurrencySubmit = async (data: CurrencyFormData) => {
    setIsLoading(true);
    try {
      const countryCode = data.countryCode;
      // Update currency preference
      await updateUser({
        currencyCode:
          COUNTRY_PRICING[countryCode as keyof typeof COUNTRY_PRICING]
            ?.currencyCode || "NGN",
        currencySymbol:
          COUNTRY_PRICING[countryCode as keyof typeof COUNTRY_PRICING]
            ?.currencySymbol || "₦",
        currencyName:
          countryCode === "NG"
            ? "Naira"
            : countryCode === "GH"
            ? "Ghana Cedi"
            : countryCode === "KE"
            ? "Kenyan Shilling"
            : countryCode === "ZAR"
            ? "South African Rand"
            : countryCode === "US"
            ? "US Dollar"
            : "Naira",
      });

      // Move to next step
      setCurrentStep("plan");
      toast({
        title: "Currency preference updated",
        description: "Your currency preference has been saved.",
      });
    } catch (error) {
      console.error("Error updating currency preference:", error);
      toast({
        title: "Error",
        description: "Failed to update currency preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle trial activation
  const handleStartTrial = async () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "You need to select a plan to start your free trial.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Start the free trial
      const response = await fetch("/api/subscriptions/trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pricingId: selectedPlan,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to start trial");
      }

      // Move to next step
      setCurrentStep("complete");
      toast({
        title: "Trial started",
        description: "Your free trial has been activated successfully.",
      });
    } catch (error) {
      console.error("Error starting trial:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start trial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle completion
  const handleComplete = () => {
    router.push("/app");
  };

  return {
    handleProfileSubmit,
    handleBusinessSubmit,
    handleCurrencySubmit,
    handleStartTrial,
    handleComplete,
    isLoading,
  };
}
