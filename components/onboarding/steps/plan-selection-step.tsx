import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  CheckIcon,
  CircleIcon,
  RadioIcon,
} from "lucide-react";
import { useSubscriptionStore } from "@/lib/subscription-store";

interface PlanSelectionStepProps {
  onBack: () => void;
  onContinue: () => void;
  selectedPlan: string;
  setSelectedPlan: (planId: string) => void;
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (cycle: "monthly" | "yearly") => void;
}

export function PlanSelectionStep({
  onBack,
  onContinue,
  selectedPlan,
  setSelectedPlan,
  billingCycle,
  setBillingCycle,
}: PlanSelectionStepProps) {
  const { pricing, country } = useSubscriptionStore();

  // Handle plan selection
  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Choose a Plan</CardTitle>
        <CardDescription>Select a plan for your free trial.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center rounded-full border border-gray-200 p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium ${
                  billingCycle === "monthly"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium ${
                  billingCycle === "yearly"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                Yearly{" "}
                <span
                  className={`ml-1 text-xs ${
                    billingCycle === "yearly"
                      ? "text-white"
                      : "text-emerald-600"
                  }`}
                >
                  (Save 16.6%)
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {pricing.map((plan) => {
              // Skip free plan
              if (plan.plan?.name?.toLowerCase() === "free") return null;

              const isSelected = selectedPlan === plan.id;
              const price =
                billingCycle === "monthly"
                  ? Number(plan.monthlyPrice)
                  : Number(plan.yearlyPrice) / 12;

              return (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => handlePlanSelection(plan.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="mr-2">
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <CircleIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{plan.plan?.name}</h3>
                        <p className="text-sm text-gray-500">
                          {plan.plan?.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {country?.currencySymbol}
                          {price.toFixed(2)}
                          <span className="text-sm font-normal text-gray-500">
                            /mo
                          </span>
                        </div>
                        {billingCycle === "yearly" && (
                          <div className="text-xs text-emerald-600">
                            Billed annually
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue} disabled={!selectedPlan}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
