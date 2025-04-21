import React from "react";
import { OnboardingStep } from "./onboarding-flow";

interface OnboardingProgressProps {
  currentStep: OnboardingStep;
}

export function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  // Get step number and label based on current step
  const getStepInfo = () => {
    switch (currentStep) {
      case "profile":
        return { number: "1", label: "Profile" };
      case "business":
        return { number: "2", label: "Business" };
      case "currency":
        return { number: "3", label: "Currency" };
      case "plan":
        return { number: "4", label: "Plan" };
      case "trial":
        return { number: "5", label: "Trial" };
      default:
        return { number: "1", label: "" };
    }
  };

  // Get progress percentage based on current step
  const getProgressPercentage = () => {
    switch (currentStep) {
      case "profile":
        return "20%";
      case "business":
        return "40%";
      case "currency":
        return "60%";
      case "plan":
        return "80%";
      case "trial":
        return "100%";
      default:
        return "0%";
    }
  };

  const { number, label } = getStepInfo();
  const progressWidth = getProgressPercentage();

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <div className="text-sm">Step {number} of 5</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-emerald-500 h-2 rounded-full transition-all"
          style={{ width: progressWidth }}
        ></div>
      </div>
    </div>
  );
}
