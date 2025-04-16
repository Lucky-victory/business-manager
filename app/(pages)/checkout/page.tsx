"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { SubscriptionTier } from "@/types/subscription";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCurrencySymbol, plans, pricing } = useSubscriptionStore();
  const currencySymbol = getCurrencySymbol();
  const { user } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get plan and interval from URL params
  const planId = searchParams.get("plan") as SubscriptionTier;
  const interval = searchParams.get("interval") as "monthly" | "yearly";

  // Validate plan and interval
  const isValidPlan = planId && ["basic", "premium"].includes(planId);
  const isValidInterval = interval && ["monthly", "yearly"].includes(interval);

  if (!isValidPlan || !isValidInterval) {
    return (
      <div className="container max-w-md py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Invalid Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              The checkout information is invalid. Please try again.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/plans")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Plans
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Get plan details from the store
  const plan = plans.find((p) => p.name.toLowerCase() === planId);

  if (!plan) {
    return (
      <div className="container max-w-md py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Plan Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              The selected plan could not be found. Please try again.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/plans")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Plans
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Find pricing for this plan
  const planPricing = pricing.find((p) => p.planId === plan.id);

  // Calculate price based on interval
  const price = planPricing
    ? interval === "monthly"
      ? Number(planPricing.monthlyPrice)
      : Number(planPricing.yearlyPrice)
    : 0;

  const handlePaystackCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would make an API call to create a Paystack checkout session
      // For now, we'll just simulate a successful payment after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to success page
      router.push("/checkout/success");
    } catch (err) {
      console.error("Payment error:", err);
      setError("There was an error processing your payment. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            <div className="flex justify-between">
              <span>
                {plan?.name} Plan ({interval})
              </span>
              <span className="font-medium">
                {currencySymbol}
                {price.toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>
                {currencySymbol}
                {price.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Billing Information</h3>
            <div className="text-sm">
              <p>{user?.name || "User"}</p>
              <p>{user?.email || "user@example.com"}</p>
              <p>{user?.companyName || "Company"}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            onClick={handlePaystackCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay with Paystack
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/plans")}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
