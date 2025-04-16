import {
  plans as subscriptionPlans,
  userSubscriptions,
  pricing,
  countryCurrency,
} from "@/lib/db/schema";

export type SubscriptionPlanSelect = typeof subscriptionPlans.$inferSelect;
export type SubscriptionPlanInsert = typeof subscriptionPlans.$inferInsert;
export type UserSubscriptionSelect = typeof userSubscriptions.$inferSelect;
export type UserSubscriptionInsert = typeof userSubscriptions.$inferInsert;
export type PricingSelect = typeof pricing.$inferSelect;
export type PricingInsert = typeof pricing.$inferInsert;
export type CountryCurrencySelect = typeof countryCurrency.$inferSelect;
export type CountryCurrencyInsert = typeof countryCurrency.$inferInsert;

// Define a type for pricing with plan relation
export type PricingWithPlan = PricingSelect & {
  plan: SubscriptionPlanSelect;
};

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export interface PlanFeatures {
  expenses: boolean;
  expensesAnalytics: boolean;
  credit: boolean;
  creditReports: boolean;
  invoicing: boolean;
  inventory: boolean;
}

export interface CountryPricing {
  currencyCode: string;
  currencySymbol: string;
  basicMonthly: number;
  basicYearly: number;
  premiumMonthly: number;
  premiumYearly: number;
}

export type SubscriptionPlanWithFeatures = SubscriptionPlanSelect & {
  featuresObject: PlanFeatures;
};

export type SubscriptionTier = "free" | "basic" | "premium";

export const FEATURE_DESCRIPTIONS: Record<keyof PlanFeatures, string> = {
  expenses: "Track and manage business expenses",
  expensesAnalytics: "Advanced expense analytics and reporting",
  credit: "Manage customer credit and debt",
  creditReports: "Generate detailed credit reports",
  invoicing: "Create and send professional invoices",
  inventory: "Track inventory and stock levels",
};

// Default pricing in Nigerian Naira
export const DEFAULT_COUNTRY_PRICING: CountryPricing = {
  currencyCode: "NGN",
  currencySymbol: "₦",
  basicMonthly: 500,
  basicYearly: 5000,
  premiumMonthly: 1500,
  premiumYearly: 15000,
};

// Country-specific pricing
export const COUNTRY_PRICING: Record<string, CountryPricing> = {
  NG: {
    currencyCode: "NGN",
    currencySymbol: "₦",
    basicMonthly: 500,
    basicYearly: 5000,
    premiumMonthly: 1500,
    premiumYearly: 15000,
  },
  GH: {
    currencyCode: "GHS",
    currencySymbol: "₵",
    basicMonthly: 50,
    basicYearly: 500,
    premiumMonthly: 150,
    premiumYearly: 1500,
  },
  KE: {
    currencyCode: "KES",
    currencySymbol: "KSh",
    basicMonthly: 500,
    basicYearly: 5000,
    premiumMonthly: 1500,
    premiumYearly: 15000,
  },
  ZA: {
    currencyCode: "ZAR",
    currencySymbol: "R",
    basicMonthly: 75,
    basicYearly: 750,
    premiumMonthly: 225,
    premiumYearly: 2250,
  },
  US: {
    currencyCode: "USD",
    currencySymbol: "$",
    basicMonthly: 9.99,
    basicYearly: 99.99,
    premiumMonthly: 19.99,
    premiumYearly: 199.99,
  },
};

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionTier,
  {
    name: string;
    description: string;
    features: PlanFeatures;
  }
> = {
  free: {
    name: "Free",
    description: "Basic sales tracking for small businesses",
    features: {
      expenses: false,
      expensesAnalytics: false,
      credit: false,
      creditReports: false,
      invoicing: false,
      inventory: false,
    },
  },
  basic: {
    name: "Basic",
    description: "Essential tools for growing businesses",
    features: {
      expenses: true,
      expensesAnalytics: false,
      credit: true,
      creditReports: false,
      invoicing: false,
      inventory: false,
    },
  },
  premium: {
    name: "Premium",
    description: "Complete business management solution",
    features: {
      expenses: true,
      expensesAnalytics: true,
      credit: true,
      creditReports: true,
      invoicing: true,
      inventory: true,
    },
  },
};
