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

// export const FEATURE_DESCRIPTIONS: Record<keyof PlanFeatures, string> = {
//   expenses: "Track and manage business expenses",
//   expensesAnalytics: "Advanced expense analytics and reporting",
//   credit: "Manage customer credit and debt",
//   creditReports: "Generate detailed credit reports",
//   invoicing: "Create and send professional invoices",
//   inventory: "Track inventory and stock levels",
// };

// Default pricing in Nigerian Naira
// Updated pricing in Nigerian Naira with higher values
export const DEFAULT_COUNTRY_PRICING: CountryPricing = {
  currencyCode: "NGN",
  currencySymbol: "₦",
  basicMonthly: 2500,
  basicYearly: 25000, // 2 months free
  premiumMonthly: 7500,
  premiumYearly: 75000, // 2 months free
};

// Country-specific pricing with adjusted values
export const COUNTRY_PRICING: Record<string, CountryPricing> = {
  NG: {
    currencyCode: "NGN",
    currencySymbol: "₦",
    basicMonthly: 2500,
    basicYearly: 25000,
    premiumMonthly: 7500,
    premiumYearly: 75000,
  },
  GH: {
    currencyCode: "GHS",
    currencySymbol: "₵",
    basicMonthly: 100,
    basicYearly: 1000,
    premiumMonthly: 300,
    premiumYearly: 3000,
  },
  KE: {
    currencyCode: "KES",
    currencySymbol: "KSh",
    basicMonthly: 1000,
    basicYearly: 10000,
    premiumMonthly: 3000,
    premiumYearly: 30000,
  },
  ZAR: {
    currencyCode: "ZAR",
    currencySymbol: "R",
    basicMonthly: 150,
    basicYearly: 1500,
    premiumMonthly: 450,
    premiumYearly: 4500,
  },
  US: {
    currencyCode: "USD",
    currencySymbol: "$",
    basicMonthly: 10,
    basicYearly: 100,
    premiumMonthly: 30,
    premiumYearly: 300,
  },
};
// Country-specific pricing
// export const COUNTRY_PRICING: Record<string, CountryPricing> = {
//   NG: {
//     currencyCode: "NGN",
//     currencySymbol: "₦",
//     basicMonthly: 500,
//     basicYearly: 5000,
//     premiumMonthly: 1500,
//     premiumYearly: 15000,
//   },
//   GH: {
//     currencyCode: "GHS",
//     currencySymbol: "₵",
//     basicMonthly: 50,
//     basicYearly: 500,
//     premiumMonthly: 150,
//     premiumYearly: 1500,
//   },
//   KE: {
//     currencyCode: "KES",
//     currencySymbol: "KSh",
//     basicMonthly: 500,
//     basicYearly: 5000,
//     premiumMonthly: 1500,
//     premiumYearly: 15000,
//   },
//   ZAR: {
//     currencyCode: "ZAR",
//     currencySymbol: "R",
//     basicMonthly: 75,
//     basicYearly: 750,
//     premiumMonthly: 225,
//     premiumYearly: 2250,
//   },
//   US: {
//     currencyCode: "USD",
//     currencySymbol: "$",
//     basicMonthly: 9.99,
//     basicYearly: 99.99,
//     premiumMonthly: 19.99,
//     premiumYearly: 199.99,
//   },
// };

// export const SUBSCRIPTION_PLANS: Record<SubscriptionTier,
//   {
//     name: string;
//     description: string;
//     features: PlanFeatures;
//   }
// > = {
//   free: {
//     name: "Free",
//     description: "Basic sales tracking for small businesses",
//     features: {
//       expenses: false,
//       expensesAnalytics: false,
//       credit: false,
//       creditReports: false,
//       invoicing: false,
//       inventory: false,
//     },
//   },
//   basic: {
//     name: "Basic",
//     description: "Essential tools for growing businesses",
//     features: {
//       expenses: true,
//       expensesAnalytics: false,
//       credit: true,
//       creditReports: false,
//       invoicing: false,
//       inventory: false,
//     },
//   },
//   premium: {
//     name: "Premium",
//     description: "Complete business management solution",
//     features: {
//       expenses: true,
//       expensesAnalytics: true,
//       credit: true,
//       creditReports: true,
//       invoicing: true,
//       inventory: true,
//     },
//   },
// };
// Add usage limits to plan types
export interface PlanLimits {
  transactionLimit: number; // Monthly transaction limit
  userLimit: number; // Number of user accounts allowed
  storageLimit: number; // Storage in MB
}

// Updated subscription plans with more detailed features and limits
export const SUBSCRIPTION_PLANS: Record<
  SubscriptionTier,
  {
    name: string;
    description: string;
    features: PlanFeatures;
    limits: PlanLimits;
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
    limits: {
      transactionLimit: 50,
      userLimit: 1,
      storageLimit: 100,
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
      invoicing: true, // Added basic invoicing
      inventory: false,
    },
    limits: {
      transactionLimit: 500,
      userLimit: 3,
      storageLimit: 1000,
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
    limits: {
      transactionLimit: -1, // Unlimited
      userLimit: -1, // Unlimited
      storageLimit: 5000,
    },
  },
};

// Add more detailed feature descriptions
export const FEATURE_DESCRIPTIONS: Record<keyof PlanFeatures, string> = {
  expenses: "Track and categorize all business expenses",
  expensesAnalytics: "Advanced expense analytics with trends and forecasting",
  credit: "Manage customer credit with payment tracking",
  creditReports: "Generate detailed credit reports and statements",
  invoicing: "Create and send professional invoices to customers",
  inventory: "Track inventory with low stock alerts and valuations",
};
