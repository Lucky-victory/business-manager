"use client";

import React, { useState, useEffect } from "react";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStore } from "@/lib/store";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { COUNTRY_PRICING } from "@/types/subscription";

// Define the steps in the onboarding flow
type OnboardingStep =
  | "welcome"
  | "profile"
  | "business"
  | "currency"
  | "plan"
  | "trial"
  | "complete";

// Define the form schema for the profile step
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

// Define the form schema for the business step
const businessFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email("Please enter a valid email").optional(),
});

// Define the form schema for the currency step
const currencyFormSchema = z.object({
  countryCode: z.string().min(2, "Please select a country"),
});

export function OnboardingFlow() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useStore();
  const {
    plans,
    pricing,
    fetchSubscriptionData,
    detectedCountryCode,
    country,
  } = useSubscriptionStore();

  // Initialize the forms
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const businessForm = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      companyName: user?.companyName || "",
      companyAddress: user?.companyAddress || "",
      companyPhone: user?.companyPhone || "",
      companyEmail: user?.companyEmail || "",
    },
  });

  const currencyForm = useForm<z.infer<typeof currencyFormSchema>>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      countryCode: detectedCountryCode || "NG",
    },
  });

  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  // Fetch subscription data on component mount
  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  // Handle profile form submission
  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
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
  const onBusinessSubmit = async (data: z.infer<typeof businessFormSchema>) => {
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
  const onCurrencySubmit = async (data: z.infer<typeof currencyFormSchema>) => {
    setIsLoading(true);
    try {
      // Update currency preference
      await updateUser({
        currencyCode:
          COUNTRY_PRICING[data.countryCode as keyof typeof COUNTRY_PRICING]
            ?.currencyCode || "NGN",
        currencySymbol:
          COUNTRY_PRICING[data.countryCode as keyof typeof COUNTRY_PRICING]
            ?.currencySymbol || "₦",
        currencyName:
          data.countryCode === "NG"
            ? "Naira"
            : data.countryCode === "GH"
            ? "Ghana Cedi"
            : data.countryCode === "KE"
            ? "Kenyan Shilling"
            : data.countryCode === "ZAR"
            ? "South African Rand"
            : data.countryCode === "US"
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

  // Handle plan selection
  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
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

      const data = await response.json();

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

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome to Business Manager
              </CardTitle>
              <CardDescription>
                Let's set up your account to get you started quickly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This quick onboarding process will help you:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                  <span>Set up your profile</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                  <span>Configure your business details</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                  <span>Choose your currency preference</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                  <span>Start your free trial</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setCurrentStep("profile")}
                className="w-full"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );

      case "profile":
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Let's start with your basic information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case "business":
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Tell us about your business.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...businessForm}>
                <form
                  onSubmit={businessForm.handleSubmit(onBusinessSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={businessForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="companyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Address (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="123 Business St, City"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="companyPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="info@acme.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("profile")}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case "currency":
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Currency Preference</CardTitle>
              <CardDescription>
                Choose your preferred currency for transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...currencyForm}>
                <form
                  onSubmit={currencyForm.handleSubmit(onCurrencySubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={currencyForm.control}
                    name="countryCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NG">Nigeria (₦)</SelectItem>
                            <SelectItem value="GH">Ghana (₵)</SelectItem>
                            <SelectItem value="KE">Kenya (KSh)</SelectItem>
                            <SelectItem value="ZAR">
                              South Africa (R)
                            </SelectItem>
                            <SelectItem value="US">
                              United States ($)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This will determine the currency used for all
                          transactions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("business")}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case "plan":
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Choose a Plan</CardTitle>
              <CardDescription>
                Select a plan for your free trial.
              </CardDescription>
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
                    );
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("currency")}
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep("trial")}
                disabled={!selectedPlan}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );

      case "trial":
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
                    {pricing.find((p) => p.id === selectedPlan)?.plan?.name}
                  </span>{" "}
                  plan with <span className="font-medium">{billingCycle}</span>{" "}
                  billing.
                </p>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Your free trial includes:
                  </h4>
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
              <Button variant="outline" onClick={() => setCurrentStep("plan")}>
                Back
              </Button>
              <Button onClick={handleStartTrial} disabled={isLoading}>
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

      case "complete":
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <CardTitle className="text-center">Setup Complete!</CardTitle>
              <CardDescription className="text-center">
                Your account is now ready to use.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p>
                  Your free trial has been activated successfully. You now have
                  full access to all features for the next 14 days.
                </p>
                <p>
                  We'll send you a reminder before your trial ends so you can
                  decide if you want to continue with a paid subscription.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button onClick={handleComplete}>Go to Dashboard</Button>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        {currentStep !== "welcome" && currentStep !== "complete" && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <div className="text-sm">
                Step{" "}
                {currentStep === "profile"
                  ? "1"
                  : currentStep === "business"
                  ? "2"
                  : currentStep === "currency"
                  ? "3"
                  : currentStep === "plan"
                  ? "4"
                  : currentStep === "trial"
                  ? "5"
                  : "1"}{" "}
                of 5
              </div>
              <div className="text-sm text-gray-500">
                {currentStep === "profile"
                  ? "Profile"
                  : currentStep === "business"
                  ? "Business"
                  : currentStep === "currency"
                  ? "Currency"
                  : currentStep === "plan"
                  ? "Plan"
                  : currentStep === "trial"
                  ? "Trial"
                  : ""}
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    currentStep === "profile"
                      ? "20%"
                      : currentStep === "business"
                      ? "40%"
                      : currentStep === "currency"
                      ? "60%"
                      : currentStep === "plan"
                      ? "80%"
                      : currentStep === "trial"
                      ? "100%"
                      : "0%"
                  }`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Current step content */}
        {renderStep()}
      </div>
    </div>
  );
}
