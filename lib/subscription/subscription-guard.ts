import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { SubscriptionService } from "./subscription-service";
import { PlanFeatures } from "@/types/subscription";

/**
 * Middleware to check if a user has access to a specific feature
 * This should be used in API routes to protect features based on subscription
 */
export async function checkFeatureAccess(
  req: NextRequest,
  feature: keyof PlanFeatures
) {
  try {
    // Get the user session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    // If no session, user is not authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if the user has access to the feature
    const hasAccess = await SubscriptionService.hasFeatureAccess(
      session.user.id,
      feature
    );

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: "Subscription required",
          feature,
          message: "Your current plan does not include this feature",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // User has access, continue
    return null;
  } catch (error) {
    console.error("Error checking feature access:", error);
    return NextResponse.json(
      { error: "Failed to check feature access" },
      { status: 500 }
    );
  }
}

/**
 * Middleware to check if a user has reached their usage limits
 * This should be used in API routes to protect against exceeding limits
 */
export async function checkUsageLimits(
  req: NextRequest,
  usageType: "sales" | "credits" | "expenses" | "invoices" | "storage"
) {
  try {
    // Get the user session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    // If no session, user is not authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if the user has reached their usage limits
    const { hasReachedLimit, currentUsage, limit, percentUsed } =
      await SubscriptionService.checkUsageLimits(session.user.id, usageType);

    if (hasReachedLimit) {
      return NextResponse.json(
        {
          error: "Usage limit reached",
          usageType,
          currentUsage,
          limit,
          percentUsed,
          message: `You have reached your ${usageType} limit for this month`,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // User has not reached limits, continue
    return null;
  } catch (error) {
    console.error("Error checking usage limits:", error);
    return NextResponse.json(
      { error: "Failed to check usage limits" },
      { status: 500 }
    );
  }
}

/**
 * Increment usage counter for a specific type
 * This should be called after successful operations to track usage
 */
export async function incrementUsageCounter(
  req: NextRequest,
  usageType: "sales" | "credits" | "expenses" | "invoices",
  count: number = 1
) {
  try {
    // Get the user session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    // If no session, user is not authenticated
    if (!session?.user) {
      return;
    }

    // Increment the usage counter
    await SubscriptionService.incrementUsage(session.user.id, usageType, count);
  } catch (error) {
    console.error(`Error incrementing ${usageType} usage:`, error);
    // Don't throw, just log the error to avoid disrupting the user experience
  }
}

/**
 * Update storage usage
 * This should be called after file uploads to track storage usage
 */
export async function updateStorageUsage(req: NextRequest, sizeInKB: number) {
  try {
    // Get the user session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    // If no session, user is not authenticated
    if (!session?.user) {
      return;
    }

    // Update the storage usage
    await SubscriptionService.updateStorageUsage(session.user.id, sizeInKB);
  } catch (error) {
    console.error("Error updating storage usage:", error);
    // Don't throw, just log the error to avoid disrupting the user experience
  }
}
