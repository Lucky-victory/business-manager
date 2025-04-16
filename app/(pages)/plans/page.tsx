"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FEATURE_DESCRIPTIONS } from "@/types/subscription";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { useStore } from "@/lib/store";

export default function PlansPage() {
  const router = useRouter();
  const {
    currentPlanId,
    plans,
    pricing,
    getPlanPrice,
    getCurrencySymbol,
    fetchSubscriptionData,
    getFeatureDescriptions,
  } = useSubscriptionStore();

  const [billingInterval, setBillingInterval] = React.useState<
    "monthly" | "yearly"
  >("monthly");

  // Fetch subscription data on component mount
  React.useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  // Get feature descriptions
  const FEATURE_DESCRIPTIONS = getFeatureDescriptions();

  // Map plans with pricing information
  const plansWithPricing = plans.map((plan) => {
    // Find pricing for this plan
    const planPricing = pricing.find((p) => p.planId === plan.id);

    // Parse features if available
    const features = planPricing
      ? typeof planPricing.features === "string"
        ? JSON.parse(planPricing.features as string)
        : planPricing.features
      : {};

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description || "",
      features: features,
      price: getPlanPrice(plan.id, billingInterval),
      interval: billingInterval,
      currencySymbol: getCurrencySymbol(),
    };
  });

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground mt-2">
          Choose the perfect plan for your business needs
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Tabs
          defaultValue="monthly"
          value={billingInterval}
          onValueChange={(value) =>
            setBillingInterval(value as "monthly" | "yearly")
          }
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly{" "}
              <span className="ml-1 text-xs text-emerald-600">(Save 15%)</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plansWithPricing.map((plan) => (
          <Card
            key={plan.id}
            className={
              currentPlanId === plan.id
                ? "border-2 border-primary shadow-md"
                : "border shadow"
            }
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {plan.price === 0
                    ? "Free"
                    : `${plan.currencySymbol}${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground ml-1">
                    /{billingInterval === "monthly" ? "month" : "year"}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {Object.entries(FEATURE_DESCRIPTIONS).map(
                  ([key, description]) => {
                    const isIncluded =
                      plan.features[key as keyof typeof plan.features];
                    return (
                      <li key={key} className="flex items-start">
                        {isIncluded ? (
                          <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mr-2 shrink-0" />
                        )}
                        <span
                          className={!isIncluded ? "text-muted-foreground" : ""}
                        >
                          {description}
                        </span>
                      </li>
                    );
                  }
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={currentPlanId === plan.id ? "outline" : "default"}
                disabled={currentPlanId === plan.id}
                onClick={() => {
                  if (plan.id === "free") {
                    alert("You are now on the Free plan");
                    return;
                  }

                  // In a real app, this would redirect to Paystack checkout
                  router.push(
                    `/checkout?plan=${plan.id}&interval=${billingInterval}`
                  );
                }}
              >
                {currentPlanId === plan.id ? "Current Plan" : "Upgrade"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
