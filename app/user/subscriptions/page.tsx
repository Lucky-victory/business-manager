"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "@/lib/store";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { SubscriptionTier, SUBSCRIPTION_PLANS } from "@/types/subscription";
import { CheckIcon, CreditCard, Loader2, AlertTriangle } from "lucide-react";

export default function SubscriptionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, fetchUser } = useStore();
  const {
    plans,
    pricing,
    fetchSubscriptionData,
    country,
    detectedCountryCode,
  } = useSubscriptionStore();

  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch user data and subscription data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchUser();
        await fetchSubscriptionData();
        await fetchSubscriptionStatus();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchUser, fetchSubscriptionData, toast]);

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/subscriptions/status");
      if (!response.ok) throw new Error("Failed to fetch subscription status");

      const data = await response.json();
      setSubscription(data.subscription);

      // Set the selected plan based on current subscription
      if (data.subscription?.pricing?.planId) {
        setSelectedPlan(data.subscription.pricing.planId);
        setBillingCycle(data.subscription.billingCycle || "monthly");
      }
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
  };

  // Handle plan selection
  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
  };

  // Handle upgrade/change plan
  const handleUpgrade = async () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "You need to select a plan to continue",
        variant: "destructive",
      });
      return;
    }

    setIsUpgrading(true);
    try {
      // In a real implementation, this would redirect to the checkout page
      router.push(`/checkout?plan=${selectedPlan}&interval=${billingCycle}`);
    } catch (error) {
      console.error("Error upgrading plan:", error);
      toast({
        title: "Error",
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      });
      setIsUpgrading(false);
    }
  };

  // Handle cancel subscription
  const handleCancelSubscription = async () => {
    if (!subscription?.id) return;

    setIsCancelling(true);
    try {
      const response = await fetch(
        `/api/subscriptions/${subscription.id}/cancel`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to cancel subscription");

      await fetchSubscriptionStatus();
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully",
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Get subscription status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500">Active</Badge>;
      case "trial":
        return <Badge className="bg-blue-500">Trial</Badge>;
      case "past_due":
        return <Badge className="bg-amber-500">Past Due</Badge>;
      case "canceled":
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      case "expired":
        return <Badge className="bg-red-500">Expired</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days left in subscription
  const getDaysLeft = () => {
    if (!subscription?.endDate) return null;

    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  // Get current plan tier
  const getCurrentPlanTier = (): SubscriptionTier => {
    if (!subscription) return "free";

    const planName = subscription?.pricing?.plan?.name?.toLowerCase();
    if (planName === "premium") return "premium";
    if (planName === "basic") return "basic";
    return "free";
  };

  // Get current plan features
  const getCurrentPlanFeatures = () => {
    const tier = getCurrentPlanTier();
    return SUBSCRIPTION_PLANS[tier].features;
  };

  // Render subscription details
  const renderSubscriptionDetails = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      );
    }

    if (!subscription) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            You don't have an active subscription.
          </p>
          <Button onClick={() => router.push("/checkout")}>
            Get Started with a Plan
          </Button>
        </div>
      );
    }

    const daysLeft = getDaysLeft();
    const isActive =
      subscription.status === "active" || subscription.status === "trial";
    const isExpired =
      subscription.status === "expired" || subscription.status === "canceled";

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Current Subscription</CardTitle>
              {getStatusBadge(subscription.status)}
            </div>
            <CardDescription>
              {subscription.status === "trial"
                ? "Your free trial is currently active"
                : "Your subscription details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-medium">
                    {subscription.pricing?.plan?.name || "Free"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Billing Cycle</p>
                  <p className="font-medium capitalize">
                    {subscription.billingCycle || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">
                    {formatDate(subscription.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">
                    {formatDate(subscription.endDate)}
                  </p>
                </div>
              </div>

              {daysLeft !== null && isActive && (
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="font-medium">
                    {subscription.status === "trial"
                      ? `Your free trial ends in ${daysLeft} days`
                      : `Your subscription renews in ${daysLeft} days`}
                  </p>
                  {subscription.status === "trial" && (
                    <p className="text-sm text-gray-500 mt-1">
                      Add a payment method to continue your subscription after
                      the trial ends.
                    </p>
                  )}
                </div>
              )}

              {isExpired && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-400">
                      Your subscription has{" "}
                      {subscription.status === "expired"
                        ? "expired"
                        : "been cancelled"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Renew your subscription to regain access to premium
                      features.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {isActive ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  disabled={isCancelling || subscription.status === "trial"}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Cancel Subscription"
                  )}
                </Button>
                <Button onClick={() => router.push("/checkout")}>
                  Change Plan
                </Button>
              </>
            ) : (
              <Button
                className="w-full"
                onClick={() => router.push("/checkout")}
              >
                Renew Subscription
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              Features included in your current plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(
                SUBSCRIPTION_PLANS[getCurrentPlanTier()].features
              ).map(([key, enabled]) => (
                <div key={key} className="flex items-start">
                  {enabled ? (
                    <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                  ) : (
                    <div className="h-5 w-5 border border-gray-300 rounded-full mr-2 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render available plans
  const renderAvailablePlans = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
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
                  billingCycle === "yearly" ? "text-white" : "text-emerald-600"
                }`}
              >
                (Save 16.6%)
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Free Plan */}
          <Card
            className={`border ${
              selectedPlan === "free" ? "border-emerald-500" : "border-gray-200"
            }`}
          >
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Basic sales tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-3xl font-bold">$0</p>
                <p className="text-sm text-gray-500">Forever free</p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>Basic sales tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>Up to 50 transactions/month</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>1 user only</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handlePlanSelection("free")}
                disabled={getCurrentPlanTier() === "free"}
              >
                {getCurrentPlanTier() === "free" ? "Current Plan" : "Downgrade"}
              </Button>
            </CardFooter>
          </Card>

          {/* Render other plans from the database */}
          {pricing
            .filter((plan) => plan.plan?.name?.toLowerCase() !== "free")
            .map((plan) => {
              const isCurrentPlan = subscription?.pricing?.id === plan.id;
              const price =
                billingCycle === "monthly"
                  ? Number(plan.monthlyPrice)
                  : Number(plan.yearlyPrice);

              return (
                <Card
                  key={plan.id}
                  className={`border ${
                    selectedPlan === plan.id
                      ? "border-emerald-500"
                      : "border-gray-200"
                  } ${
                    plan.plan?.name?.toLowerCase() === "premium"
                      ? "bg-emerald-50 dark:bg-emerald-950/20"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{plan.plan?.name}</CardTitle>
                      {isCurrentPlan && (
                        <Badge className="bg-emerald-500">Current</Badge>
                      )}
                    </div>
                    <CardDescription>{plan.plan?.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-3xl font-bold">
                        {country?.currencySymbol}
                        {price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {billingCycle === "monthly" ? "per month" : "per year"}
                      </p>
                    </div>

                    {/* Features based on plan type */}
                    <ul className="space-y-2">
                      {plan.plan?.name?.toLowerCase() === "basic" ? (
                        <>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>All Free features</span>
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>Expense tracking</span>
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>Credit management</span>
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>Basic invoicing</span>
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>Up to 3 users</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>All Basic features</span>
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>Advanced analytics</span>
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>Credit reports & statements</span>
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>Inventory management</span>
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>Unlimited users</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : "default"}
                      onClick={() => handlePlanSelection(plan.id)}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? "Current Plan" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={handleUpgrade}
            disabled={isUpgrading || !selectedPlan}
            className="px-8"
          >
            {isUpgrading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {subscription ? "Change Plan" : "Subscribe"}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
          <p className="text-gray-500">
            Manage your subscription and billing information
          </p>
        </div>

        <Tabs defaultValue="current">
          <TabsList className="mb-6">
            <TabsTrigger value="current">Current Subscription</TabsTrigger>
            <TabsTrigger value="plans">Available Plans</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {renderSubscriptionDetails()}
          </TabsContent>

          <TabsContent value="plans">{renderAvailablePlans()}</TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  Your payment history and invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      No billing history available yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
