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
import { CheckCircle, Loader2 } from "lucide-react";
import { useSubscriptionStore } from "@/lib/subscription-store";

interface TrialStepProps {
  onBack: () => void;
  onSubmit: () => Promise<void>;
  selectedPlan: string;
  billingCycle: "monthly" | "yearly";
  isLoading: boolean;
}

export function TrialStep({
  onBack,
  onSubmit,
  selectedPlan,
  billingCycle,
  isLoading,
}: TrialStepProps) {
  const { pricing } = useSubscriptionStore();

  // Find the selected plan details
  const selectedPlanDetails = pricing.find((p) => p.id === selectedPlan);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Start Your Free Trial</CardTitle>
        <CardDescription>
          Try all features free for 14 days, no credit card required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            You've selected the{" "}
            <span className="font-medium">
              {selectedPlanDetails?.plan?.name}
            </span>{" "}
            plan with <span className="font-medium">{billingCycle}</span>{" "}
            billing.
          </p>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Your free trial includes:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                <span>Full access to all features for 14 days</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                <span>No credit card required</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                <span>Cancel anytime</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                <span>Reminder before trial ends</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting trial...
            </>
          ) : (
            "Start Free Trial"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
