"use client";

import React from "react";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ProFeatureBadge } from "./pro-feature-badge";
import { LockIcon } from "lucide-react";

interface ProFeatureWrapperProps {
  /**
   * The feature key to check against the user's subscription
   */
  feature: string;
  /**
   * The content to render if the user has access to the feature
   */
  children: React.ReactNode;
  /**
   * Optional fallback content to render if the user doesn't have access
   */
  fallback?: React.ReactNode;
  /**
   * Whether to show a badge indicating this is a premium feature
   */
  showBadge?: boolean;
  /**
   * Whether to show a lock icon for premium features
   */
  showLock?: boolean;
  /**
   * Whether to show an upgrade button for premium features
   */
  showUpgradeButton?: boolean;
  /**
   * Custom class name for the wrapper
   */
  className?: string;
}

/**
 * A wrapper component that conditionally renders content based on the user's subscription
 * and whether they have access to a specific feature.
 */
export function ProFeatureWrapper({
  feature,
  children,
  fallback,
  showBadge = false,
  showLock = true,
  showUpgradeButton = true,
  className = "",
}: ProFeatureWrapperProps) {
  const router = useRouter();
  const { hasFeatureAccess, isLoading } = useSubscriptionStore();

  // Default fallback content if none provided
  const defaultFallback = (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-900">
      {showLock && (
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <LockIcon className="w-6 h-6 text-gray-400" />
        </div>
      )}
      <div>
        <h3 className="text-lg font-medium mb-1">Premium Feature</h3>
        <p className="text-sm text-gray-500 mb-4">
          Upgrade your plan to access this feature
        </p>
        {showUpgradeButton && (
          <Button size="sm" onClick={() => router.push("/user/subscriptions")}>
            Upgrade Now
          </Button>
        )}
      </div>
    </div>
  );

  // If loading, show a placeholder
  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[100px]" />
    );
  }

  // If user has access to the feature, render the children
  if (hasFeatureAccess(feature)) {
    return (
      <div className={className}>
        {showBadge && <ProFeatureBadge className="mb-2" />}
        {children}
      </div>
    );
  }

  // Otherwise, render the fallback content
  return <div className={className}>{fallback || defaultFallback}</div>;
}
