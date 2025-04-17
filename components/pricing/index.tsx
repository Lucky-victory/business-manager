"use client";

import React, { useEffect } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { useAuth } from "@/lib/auth-client";

export default function PricingSection({ isHome = true }: { isHome: boolean }) {
  const router = useRouter();
  const auth = useAuth();
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
  useEffect(() => {
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
      isPopular: plan.name.toLowerCase() === "premium" || plan.id === "pro",
    };
  });

  return (
    <section
      id="pricing"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container px-4 md:px-6 max-w-5xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-800/30 dark:text-emerald-400">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Choose the perfect plan for your business needs
            </p>
          </div>
        </div>

        <div className="flex justify-center my-8">
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
                <span className="ml-1 text-xs text-emerald-600">
                  (Save 15%)
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {plansWithPricing.map((plan) => (
            <Card
              key={plan.id}
              className={
                plan.isPopular
                  ? "border-2 border-emerald-600 relative"
                  : !isHome && auth?.user && currentPlanId === plan.id
                  ? "border-2 border-emerald-600/20 transition-all"
                  : "border-2 border-transparent hover:border-emerald-600/20 transition-all"
              }
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-0 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-4xl font-bold mt-2">
                  {plan.price === 0
                    ? "Free Forever"
                    : `${plan.currencySymbol}${plan.price.toLocaleString()}`}
                  {plan.price > 0 && (
                    <span className="text-lg font-normal text-gray-500">
                      /{billingInterval === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  {Object.entries(FEATURE_DESCRIPTIONS).map(
                    ([key, description]) => {
                      const isIncluded =
                        plan.features[key as keyof typeof plan.features];
                      return (
                        <li key={key} className="flex items-center">
                          {isIncluded ? (
                            <div className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                          ) : (
                            <X className="h-4 w-4 text-gray-300 mr-2 shrink-0" />
                          )}
                          <span className={!isIncluded ? "text-gray-300" : ""}>
                            {description}
                          </span>
                        </li>
                      );
                    }
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                {isHome ? (
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      if (auth?.user) {
                        router.push(
                          `/checkout?plan=${plan.id}&interval=${billingInterval}`
                        );
                      } else {
                        router.push("/auth/login");
                      }
                    }}
                  >
                    Get Started
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      currentPlanId === plan.id
                        ? "bg-white text-emerald-600 border border-emerald-600"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
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
                    {currentPlanId === plan.id
                      ? "Current Plan"
                      : plan.id === "enterprise"
                      ? "Contact Sales"
                      : "Upgrade"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
