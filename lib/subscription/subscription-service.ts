import { db } from "@/lib/db";
import {
  SubscriptionTier,
  PlanFeatures,
  SUBSCRIPTION_PLANS,
  UserSubscriptionSelect,
  PricingWithPlan,
} from "@/types/subscription";
import {
  userSubscriptions,
  pricing,
  plans,
  userUsage,
  subscriptionPayments,
} from "@/lib/db/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { PaymentService } from "@/lib/payment/payment-service";
import { generateUUID } from "@/lib/utils";

export class SubscriptionService {
  /**
   * Check if a feature is available for a user's subscription tier
   */
  static hasFeature(
    tier: SubscriptionTier,
    featureKey: keyof PlanFeatures
  ): boolean {
    return SUBSCRIPTION_PLANS[tier].features[featureKey];
  }

  /**
   * Check if a user has reached their transaction limit
   */
  static hasReachedTransactionLimit(
    tier: SubscriptionTier,
    currentCount: number
  ): boolean {
    const limit = SUBSCRIPTION_PLANS[tier].limits.transactionLimit;
    if (limit === -1) return false; // Unlimited
    return currentCount >= limit;
  }

  /**
   * Check if a user can add more team members
   */
  static canAddTeamMember(
    tier: SubscriptionTier,
    currentTeamSize: number
  ): boolean {
    const limit = SUBSCRIPTION_PLANS[tier].limits.userLimit;
    if (limit === -1) return true; // Unlimited
    return currentTeamSize < limit;
  }

  /**
   * Get plan upgrade suggestions when limits are reached
   */
  static getUpgradeSuggestion(
    currentTier: SubscriptionTier,
    limitType: "transaction" | "user" | "storage"
  ): {
    title: string;
    description: string;
    targetTier: SubscriptionTier;
  } | null {
    if (currentTier === "premium") return null; // Already on highest tier

    if (currentTier === "free") {
      return {
        title: "Upgrade to Basic",
        description: `Get higher ${limitType} limits and unlock expenses & credit tracking`,
        targetTier: "basic",
      };
    } else {
      return {
        title: "Upgrade to Premium",
        description: `Get unlimited ${limitType}s and unlock all advanced features`,
        targetTier: "premium",
      };
    }
  }

  /**
   * Calculate savings from yearly subscription
   */
  static calculateYearlySavings(
    tier: SubscriptionTier,
    countryCode: string
  ): number {
    // This would need access to your pricing data
    // Implementation depends on how you access pricing in your application
    return 0; // Placeholder
  }

  /**
   * Get a user's current subscription
   */
  static async getUserSubscription(userId: string): Promise<{
    subscription: UserSubscriptionSelect | null;
    tier: SubscriptionTier;
    isActive: boolean;
    isTrial: boolean;
    isExpired: boolean;
    daysLeft: number | null;
    features: PlanFeatures;
  }> {
    try {
      // Get the user's subscription
      const subscription = await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.userId, userId),
        with: {
          pricing: {
            with: {
              plan: true,
            },
          },
        },
        orderBy: [desc(userSubscriptions.createdAt)],
      });

      // Default to free tier if no subscription
      let tier: SubscriptionTier = "free";
      let isActive = false;
      let isTrial = false;
      let isExpired = false;
      let daysLeft: number | null = null;
      let features: PlanFeatures = SUBSCRIPTION_PLANS.free.features;

      if (subscription) {
        // Determine tier based on plan name
        const planName = subscription.pricing?.plan?.name?.toLowerCase();
        if (planName === "premium") {
          tier = "premium";
        } else if (planName === "basic") {
          tier = "basic";
        }

        // Check if subscription is active
        isActive = subscription.status === "active";
        isTrial = subscription.status === "trial";
        isExpired = ["expired", "canceled"].includes(subscription.status);

        // Calculate days left
        if (subscription.endDate) {
          const now = new Date();
          const endDate = new Date(subscription.endDate);
          daysLeft = Math.max(
            0,
            Math.ceil(
              (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )
          );
        }

        // Get features from the plan
        if (tier !== "free") {
          features = SUBSCRIPTION_PLANS[tier].features;
        }
      }

      return {
        subscription: subscription || null,
        tier,
        isActive,
        isTrial,
        isExpired,
        daysLeft,
        features,
      };
    } catch (error) {
      console.error("Error getting user subscription:", error);
      // Default to free tier on error
      return {
        subscription: null,
        tier: "free",
        isActive: false,
        isTrial: false,
        isExpired: false,
        daysLeft: null,
        features: SUBSCRIPTION_PLANS.free.features,
      };
    }
  }

  /**
   * Check if a user has access to a specific feature
   */
  static async hasFeatureAccess(
    userId: string,
    featureKey: keyof PlanFeatures
  ): Promise<boolean> {
    try {
      const { tier, isActive, isTrial } = await this.getUserSubscription(
        userId
      );

      // If subscription is not active or trial, only allow free features
      if (!isActive && !isTrial && tier !== "free") {
        return SUBSCRIPTION_PLANS.free.features[featureKey];
      }

      return SUBSCRIPTION_PLANS[tier].features[featureKey];
    } catch (error) {
      console.error("Error checking feature access:", error);
      // Default to free tier features on error
      return SUBSCRIPTION_PLANS.free.features[featureKey];
    }
  }

  /**
   * Start a free trial for a user
   */
  static async startFreeTrial(userId: string, pricingId: string) {
    try {
      // Check if user already has a subscription
      const existingSubscription = await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.userId, userId),
      });

      if (existingSubscription?.trialUsed) {
        throw new Error("User has already used their free trial");
      }

      if (existingSubscription?.status === "active") {
        throw new Error("User already has an active subscription");
      }

      // Verify pricing exists
      const pricingDetail = await db.query.pricing.findFirst({
        where: eq(pricing.id, pricingId),
      });
      if (!pricingDetail) {
        throw new Error("Invalid pricing plan");
      }
      const plan = await db.query.plans.findFirst({
        where: eq(plans.id, pricingDetail?.planId as string),
      });
      const pricingDetails = {
        ...pricingDetail,
        plan,
      };
      if (!pricingDetails) {
        throw new Error("Invalid pricing plan");
      }

      // Set trial dates
      const trialStartDate = new Date();
      const trialEndDate = new Date(trialStartDate);
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

      // Create new trial subscription
      const id = generateUUID();
      await db.insert(userSubscriptions).values({
        id,
        userId,
        pricingId,
        startDate: trialStartDate,
        endDate: trialEndDate,
        trialStartDate,
        trialEndDate,
        trialUsed: true,
        status: "trial",
        billingCycle: "monthly", // Default to monthly for trial
        autoRenew: false, // No auto-renewal for trials
        nextBillingDate: trialEndDate,
      });

      const newSubscription = await db
        .select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions.id, id))
        .leftJoin(pricing, eq(pricing.id, userSubscriptions.pricingId))
        .leftJoin(plans, eq(plans.id, pricing.planId));
      console.log({
        newSubscription: newSubscription[0],
      });
      const sub = newSubscription.map((sub) => ({
        ...sub.user_subscriptions,
        pricing: {
          ...sub.pricing,
          plan: {
            ...sub.plans,
          },
        },
      }));

      return sub || null;
    } catch (error) {
      console.error("Error starting free trial:", error);
      throw error;
    }
  }

  /**
   * Check if a user has reached their usage limits
   */
  static async checkUsageLimits(
    userId: string,
    usageType: "sales" | "credits" | "expenses" | "invoices" | "storage"
  ): Promise<{
    hasReachedLimit: boolean;
    currentUsage: number;
    limit: number;
    percentUsed: number;
  }> {
    try {
      const { tier } = await this.getUserSubscription(userId);

      // Get the current month's usage
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const usage = await db.query.userUsage.findFirst({
        where: and(
          eq(userUsage.userId, userId),
          eq(userUsage.year, year),
          eq(userUsage.month, month)
        ),
      });

      let currentUsage = 0;
      let limit = 0;

      // Set the appropriate usage and limit based on type
      switch (usageType) {
        case "sales":
          currentUsage = usage?.salesCount || 0;
          limit = SUBSCRIPTION_PLANS[tier].limits.transactionLimit;
          break;
        case "credits":
          currentUsage = usage?.creditsCount || 0;
          limit = SUBSCRIPTION_PLANS[tier].limits.transactionLimit;
          break;
        case "expenses":
          currentUsage = usage?.expensesCount || 0;
          limit = SUBSCRIPTION_PLANS[tier].limits.transactionLimit;
          break;
        case "invoices":
          currentUsage = usage?.invoicesCount || 0;
          limit = SUBSCRIPTION_PLANS[tier].limits.transactionLimit;
          break;
        case "storage":
          currentUsage = usage?.storageUsed || 0;
          limit = SUBSCRIPTION_PLANS[tier].limits.storageLimit * 1024; // Convert MB to KB
          break;
      }

      // If limit is -1, it means unlimited
      const hasReachedLimit = limit !== -1 && currentUsage >= limit;
      const percentUsed =
        limit === -1
          ? 0
          : Math.min(100, Math.round((currentUsage / limit) * 100));

      return {
        hasReachedLimit,
        currentUsage,
        limit,
        percentUsed,
      };
    } catch (error) {
      console.error(`Error checking ${usageType} limits:`, error);
      // Default to reached limit on error to be safe
      return {
        hasReachedLimit: true,
        currentUsage: 0,
        limit: 0,
        percentUsed: 100,
      };
    }
  }

  /**
   * Increment usage counter for a specific type
   */
  static async incrementUsage(
    userId: string,
    usageType: "sales" | "credits" | "expenses" | "invoices",
    count: number = 1
  ): Promise<void> {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Check if there's an existing usage record for this month
      const existingUsage = await db.query.userUsage.findFirst({
        where: and(
          eq(userUsage.userId, userId),
          eq(userUsage.year, year),
          eq(userUsage.month, month)
        ),
      });

      if (existingUsage) {
        // Update the existing record
        const updateData: Record<string, any> = {
          updatedAt: now,
        };

        switch (usageType) {
          case "sales":
            updateData.salesCount = existingUsage.salesCount + count;
            break;
          case "credits":
            updateData.creditsCount = existingUsage.creditsCount + count;
            break;
          case "expenses":
            updateData.expensesCount = existingUsage.expensesCount + count;
            break;
          case "invoices":
            updateData.invoicesCount = existingUsage.invoicesCount + count;
            break;
        }

        await db
          .update(userUsage)
          .set(updateData)
          .where(eq(userUsage.id, existingUsage.id));
      } else {
        // Create a new usage record
        const id = generateUUID();

        // Initialize with default values
        let salesCount = 0;
        let creditsCount = 0;
        let expensesCount = 0;
        let invoicesCount = 0;

        // Set the appropriate count based on usage type
        switch (usageType) {
          case "sales":
            salesCount = count;
            break;
          case "credits":
            creditsCount = count;
            break;
          case "expenses":
            expensesCount = count;
            break;
          case "invoices":
            invoicesCount = count;
            break;
        }

        await db.insert(userUsage).values({
          id,
          userId,
          year,
          month,
          salesCount,
          creditsCount,
          expensesCount,
          invoicesCount,
          storageUsed: 0,
        });
      }
    } catch (error) {
      console.error(`Error incrementing ${usageType} usage:`, error);
      // Log but don't throw to prevent disrupting the user experience
    }
  }

  /**
   * Update storage usage
   */
  static async updateStorageUsage(
    userId: string,
    sizeInKB: number
  ): Promise<void> {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Check if there's an existing usage record for this month
      const existingUsage = await db.query.userUsage.findFirst({
        where: and(
          eq(userUsage.userId, userId),
          eq(userUsage.year, year),
          eq(userUsage.month, month)
        ),
      });

      if (existingUsage) {
        // Update the existing record
        await db
          .update(userUsage)
          .set({
            storageUsed: existingUsage.storageUsed + sizeInKB,
            updatedAt: now,
          })
          .where(eq(userUsage.id, existingUsage.id));
      } else {
        // Create a new usage record
        const id = generateUUID();
        await db.insert(userUsage).values({
          id,
          userId,
          year,
          month,
          salesCount: 0,
          creditsCount: 0,
          expensesCount: 0,
          invoicesCount: 0,
          storageUsed: sizeInKB,
        });
      }
    } catch (error) {
      console.error("Error updating storage usage:", error);
      // Log but don't throw to prevent disrupting the user experience
    }
  }

  /**
   * Get all available plans with pricing for a country
   */
  static async getPlansWithPricing(
    countryCode: string = "NG"
  ): Promise<PricingWithPlan[]> {
    try {
      const pricingData = await db
        .select()
        .from(pricing)
        .where(eq(pricing.countryCode, countryCode))
        .leftJoin(plans, eq(pricing.planId, plans.id));

      return pricingData
        .filter((row) => row.plans !== null)
        .map((row) => ({
          ...row.pricing,
          plan: row.plans!,
        }));
    } catch (error) {
      console.error("Error getting plans with pricing:", error);
      return [];
    }
  }

  /**
   * Get a user's payment history
   */
  static async getPaymentHistory(
    userId: string
  ): Promise<(typeof subscriptionPayments.$inferSelect)[]> {
    try {
      // First get the user's subscription
      const subscription = await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.userId, userId),
      });

      if (!subscription) {
        return [];
      }

      // Get all payments for this subscription
      return await db.query.subscriptionPayments.findMany({
        where: eq(subscriptionPayments.subscriptionId, subscription.id),
        orderBy: [desc(subscriptionPayments.paymentDate)],
      });
    } catch (error) {
      console.error("Error getting payment history:", error);
      return [];
    }
  }

  /**
   * Cancel a user's subscription
   */
  static async cancelUserSubscription(
    userId: string,
    reason?: string
  ): Promise<UserSubscriptionSelect | null> {
    try {
      // Get the user's subscription
      const subscription = await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.userId, userId),
      });

      if (!subscription) {
        throw new Error("No active subscription found");
      }

      // Use the payment service to cancel
      const result = await PaymentService.cancelSubscription(
        subscription.id,
        reason
      );
      return result || null;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }

  /**
   * Check for subscriptions that need renewal and process them
   * This would typically be run by a cron job
   */
  static async processSubscriptionRenewals(): Promise<void> {
    try {
      const now = new Date();

      // Find subscriptions due for renewal (next billing date is today or earlier)
      const dueSubscriptions = await db.query.userSubscriptions.findMany({
        where: and(
          eq(userSubscriptions.status, "active"),
          eq(userSubscriptions.autoRenew, true),
          lte(userSubscriptions.nextBillingDate, now)
        ),
        with: {
          pricing: true,
        },
      });

      for (const subscription of dueSubscriptions) {
        try {
          // In a real implementation, this would charge the customer's payment method
          // For now, we'll just update the subscription dates

          const startDate = new Date();
          const endDate = new Date(startDate);

          if (subscription.billingCycle === "monthly") {
            endDate.setMonth(endDate.getMonth() + 1);
          } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
          }

          // Update the subscription
          await db
            .update(userSubscriptions)
            .set({
              startDate,
              endDate,
              lastPaymentDate: startDate,
              nextBillingDate: endDate,
              updatedAt: now,
            })
            .where(eq(userSubscriptions.id, subscription.id));

          // Record a successful payment
          const paymentId = generateUUID();
          await db.insert(subscriptionPayments).values({
            id: paymentId,
            subscriptionId: subscription.id,
            amount:
              subscription.billingCycle === "monthly"
                ? subscription.pricing?.monthlyPrice?.toString() || "0"
                : subscription.pricing?.yearlyPrice?.toString() || "0",
            currency: "NGN", // Default, would come from pricing
            status: "succeeded",
            paymentMethod: "automatic",
            paymentProvider: "system",
            paymentProviderSubscriptionId: `renewal_${subscription.id}`,
            paymentDate: startDate,
            metadata: {
              type: "automatic_renewal",
              billingCycle: subscription.billingCycle,
            },
          });

          console.log(`Successfully renewed subscription ${subscription.id}`);
        } catch (error) {
          console.error(
            `Error renewing subscription ${subscription.id}:`,
            error
          );

          // Mark subscription as past_due
          await db
            .update(userSubscriptions)
            .set({
              status: "past_due",
              updatedAt: now,
            })
            .where(eq(userSubscriptions.id, subscription.id));

          // Record a failed payment
          const paymentId = generateUUID();
          await db.insert(subscriptionPayments).values({
            id: paymentId,
            subscriptionId: subscription.id,
            amount:
              subscription.billingCycle === "monthly"
                ? subscription.pricing?.monthlyPrice?.toString() || "0"
                : subscription.pricing?.yearlyPrice?.toString() || "0",
            currency: "NGN", // Default, would come from pricing
            status: "failed",
            paymentMethod: "automatic",
            paymentProvider: "system",
            paymentProviderSubscriptionId: `renewal_${subscription.id}`,
            paymentDate: now,
            metadata: {
              type: "automatic_renewal",
              billingCycle: subscription.billingCycle,
              failureReason: "Automatic renewal processing failed",
            },
          });
        }
      }
    } catch (error) {
      console.error("Error processing subscription renewals:", error);
    }
  }
}
