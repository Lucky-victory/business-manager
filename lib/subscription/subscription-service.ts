import {
  SubscriptionTier,
  PlanFeatures,
  SUBSCRIPTION_PLANS,
} from "@/types/subscription";

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
}
