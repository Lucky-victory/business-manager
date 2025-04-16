"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlanFeatures } from "@/types/subscription";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PlansModal() {
  const router = useRouter();
  const {
    showPlansModal,
    setShowPlansModal,
    featureClicked,
    setFeatureClicked,
    plans,
    pricing,
    getPlanPrice,
    getCurrencySymbol,
    isFeatureEnabled,
    getFeatureDescriptions,
  } = useSubscriptionStore();

  const [billingInterval, setBillingInterval] = React.useState<
    "monthly" | "yearly"
  >("monthly");

  // Get feature descriptions
  const FEATURE_DESCRIPTIONS = getFeatureDescriptions();

  // Filter plans to only show those that include the clicked feature
  const filteredPlans = plans
    .filter((plan) => {
      // If no feature was clicked, show all plans
      if (!featureClicked) return true;

      // Find the pricing for this plan
      const planPricing = pricing.find((p) => p.planId === plan.id);
      if (!planPricing) return false;

      // Parse features
      const features =
        typeof planPricing.features === "string"
          ? (JSON.parse(planPricing.features as string) as PlanFeatures)
          : (planPricing.features as unknown as PlanFeatures);

      // Check if this plan includes the clicked feature
      return features[featureClicked];
    })
    .map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description || "",
      price: getPlanPrice(plan.id, billingInterval),
      interval: billingInterval,
      currencySymbol: getCurrencySymbol(),
    }));

  const handleClose = () => {
    setShowPlansModal(false);
    setFeatureClicked(null);
  };

  const handleUpgrade = (planId: string) => {
    if (planId.includes("free")) {
      handleClose();
      return;
    }

    // In a real app, this would redirect to Paystack checkout
    router.push(`/checkout?plan=${planId}&interval=${billingInterval}`);
    handleClose();
  };

  return (
    <Dialog open={showPlansModal} onOpenChange={setShowPlansModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            {featureClicked
              ? `Upgrade to access ${FEATURE_DESCRIPTIONS[featureClicked]}`
              : "Choose the plan that best fits your business needs"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-center mb-6">
            <Tabs
              defaultValue="monthly"
              value={billingInterval}
              onValueChange={(value) =>
                setBillingInterval(value as "monthly" | "yearly")
              }
              className="w-[300px]"
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

          <div className="grid gap-4 md:grid-cols-2">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-4 flex flex-col"
              >
                <div className="mb-2">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-bold">
                    {plan.price === 0
                      ? "Free"
                      : `${plan.currencySymbol}${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground ml-1 text-sm">
                      /{billingInterval === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>

                {featureClicked && (
                  <div className="mb-4 flex items-center">
                    {/* Find the pricing for this plan */}
                    {(() => {
                      const planPricing = pricing.find(
                        (p) => p.planId === plan.id
                      );
                      if (!planPricing) return null;

                      // Parse features
                      const features =
                        typeof planPricing.features === "string"
                          ? (JSON.parse(
                              planPricing.features as string
                            ) as PlanFeatures)
                          : (planPricing.features as unknown as PlanFeatures);

                      return features[featureClicked] ? (
                        <>
                          <Check className="h-5 w-5 text-emerald-500 mr-2" />
                          <span>
                            Includes {FEATURE_DESCRIPTIONS[featureClicked]}
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="h-5 w-5 text-gray-300 mr-2" />
                          <span className="text-muted-foreground">
                            Does not include{" "}
                            {FEATURE_DESCRIPTIONS[featureClicked]}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                )}

                <div className="mt-auto pt-4">
                  <Button
                    className="w-full"
                    variant={plan.id.includes("free") ? "outline" : "default"}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={
                      featureClicked
                        ? (() => {
                            const planPricing = pricing.find(
                              (p) => p.planId === plan.id
                            );
                            if (!planPricing) return true;

                            // Parse features
                            const features =
                              typeof planPricing.features === "string"
                                ? (JSON.parse(
                                    planPricing.features as string
                                  ) as PlanFeatures)
                                : (planPricing.features as unknown as PlanFeatures);

                            return !features[featureClicked];
                          })()
                        : false
                    }
                  >
                    {plan.id.includes("free")
                      ? "Continue with Free"
                      : "Upgrade"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
