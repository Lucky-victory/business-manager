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
import {
  SUBSCRIPTION_PLANS,
  FEATURE_DESCRIPTIONS,
  COUNTRY_PRICING,
  DEFAULT_COUNTRY_PRICING,
  CountryPricing,
} from "@/types/subscription";
import { useSubscription } from "@/lib/subscription-context";
import { useStore } from "@/lib/store";

export default function PlansPage() {
  const router = useRouter();
  const { currentPlan } = useSubscription();
  const { user } = useStore();
  const [billingInterval, setBillingInterval] = React.useState<
    "monthly" | "yearly"
  >("monthly");

  // Get country code from user or default to Nigeria
  const countryCode = user?.currencyCode?.slice(0, 2) || "NG";

  // Get pricing for the user's country or default to Nigerian pricing
  const pricing: CountryPricing =
    COUNTRY_PRICING[countryCode] || DEFAULT_COUNTRY_PRICING;

  const getPlanPrice = (planId: string, interval: "monthly" | "yearly") => {
    if (planId === "free") return 0;

    if (planId === "basic") {
      return interval === "monthly"
        ? pricing.basicMonthly
        : pricing.basicYearly;
    }

    if (planId === "premium") {
      return interval === "monthly"
        ? pricing.premiumMonthly
        : pricing.premiumYearly;
    }

    return 0;
  };

  const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
    id: key,
    ...plan,
    price: getPlanPrice(key, billingInterval),
    interval: billingInterval,
    currencySymbol: pricing.currencySymbol,
    currencyCode: pricing.currencyCode,
  }));

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
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={
              currentPlan === plan.id
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
                variant={currentPlan === plan.id ? "outline" : "default"}
                disabled={currentPlan === plan.id}
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
                {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
