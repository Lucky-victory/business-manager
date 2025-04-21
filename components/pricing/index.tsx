import { useState, useEffect } from "react";
import { CheckIcon } from "lucide-react";
import {
  CountryPricing,
  COUNTRY_PRICING,
  SUBSCRIPTION_PLANS,
} from "@/types/subscription";
import { cn } from "@/lib/utils";

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [countryCode, setCountryCode] = useState<string>("US"); // Default to US
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch user's location based on IP address
    const fetchUserLocation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/subscriptions");
        const data = await response.json();

        if (data.success && data.data.detectedCountryCode) {
          setCountryCode(data.data.detectedCountryCode);
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
        // Keep default US if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLocation();
  }, []);

  const pricing = COUNTRY_PRICING[countryCode] || COUNTRY_PRICING.US;

  const annualSavingsBasic = pricing.basicMonthly * 12 - pricing.basicYearly;
  const annualSavingsPremium =
    pricing.premiumMonthly * 12 - pricing.premiumYearly;

  return (
    <section
      id="pricing"
      className="py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Choose the Right Plan for Your Business
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Start with a 14-day free trial. No credit card required.
            </p>
            {!isLoading && (
              <p className="text-sm text-emerald-600 mt-2">
                Showing pricing for{" "}
                {COUNTRY_PRICING[countryCode]?.currencyCode || "USD"} (
                {pricing.currencySymbol})
              </p>
            )}
          </div>

          <div className="inline-flex items-center rounded-full border border-gray-200 p-1 mt-6">
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
                className={cn(
                  "ml-1 text-emerald-600 dark:text-emerald-400",
                  billingCycle === "yearly" && "text-white"
                )}
              >
                (Save 16.6%)
              </span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Free Plan */}
            <div className="flex flex-col p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
              <div className="mb-5">
                <h3 className="text-lg font-bold">Free</h3>
                <div className="mt-2 text-3xl font-bold">
                  {pricing.currencySymbol}0
                </div>
                <p className="text-sm text-gray-500 mt-1">Forever free</p>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>Basic sales tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>
                    Up to {SUBSCRIPTION_PLANS.free?.limits?.transactionLimit}{" "}
                    transactions/month
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>
                    {SUBSCRIPTION_PLANS.free?.limits?.userLimit} user only
                  </span>
                </li>
              </ul>

              <button className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-4 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-gray-300">
                Get Started
              </button>
            </div>

            {/* Basic Plan */}
            <div className="flex flex-col p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
              <div className="mb-5">
                <h3 className="text-lg font-bold">Basic</h3>
                <div className="mt-2 text-3xl font-bold">
                  {pricing.currencySymbol}
                  {billingCycle === "monthly"
                    ? pricing.basicMonthly
                    : Math.round(pricing.basicYearly / 12)}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {billingCycle === "monthly"
                    ? "Per month"
                    : `Per month, billed annually (${pricing.currencySymbol}${pricing.basicYearly})`}
                </p>
                {billingCycle === "yearly" && (
                  <p className="text-sm text-emerald-600 font-medium mt-1">
                    Save {pricing.currencySymbol}
                    {annualSavingsBasic} per year
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
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
                  <span>
                    Up to {SUBSCRIPTION_PLANS.basic?.limits?.userLimit} users
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>
                    Up to {SUBSCRIPTION_PLANS.basic?.limits?.transactionLimit}{" "}
                    transactions/month
                  </span>
                </li>
              </ul>

              <button className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600">
                Start 14-day Free Trial
              </button>
            </div>

            {/* Premium Plan */}
            <div className="flex flex-col p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-sm relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full">
                  Popular
                </span>
              </div>

              <div className="mb-5">
                <h3 className="text-lg font-bold">Premium</h3>
                <div className="mt-2 text-3xl font-bold">
                  {pricing.currencySymbol}
                  {billingCycle === "monthly"
                    ? pricing.premiumMonthly
                    : Math.round(pricing.premiumYearly / 12)}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {billingCycle === "monthly"
                    ? "Per month"
                    : `Per month, billed annually (${pricing.currencySymbol}${pricing.premiumYearly})`}
                </p>
                {billingCycle === "yearly" && (
                  <p className="text-sm text-emerald-600 font-medium mt-1">
                    Save {pricing.currencySymbol}
                    {annualSavingsPremium} per year
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
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
                  <span>Advanced invoicing features</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>Unlimited users</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>Unlimited transactions</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>Priority support</span>
                </li>
              </ul>

              <button className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600">
                Start 14-day Free Trial
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-gray-500">
            Need a custom solution for your business?{" "}
            <a href="/contact" className="text-emerald-600 hover:underline">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
