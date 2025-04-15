"use client";

import React from "react";
import { useSubscription } from "@/lib/subscription-context";
import { PlanFeatures } from "@/types/subscription";
import { cn } from "@/lib/utils";
import { ProFeatureBadge } from "./pro-feature-badge";
import { Lock } from "lucide-react";

interface ProFeatureWrapperProps {
  feature: keyof PlanFeatures;
  children: React.ReactNode;
  className?: string;
  showBadge?: boolean;
  tooltipText?: string;
  disabledMessage?: string;
}

export function ProFeatureWrapper({
  feature,
  children,
  className,
  showBadge = true,
  tooltipText,
  disabledMessage = "This feature requires a Pro subscription",
}: ProFeatureWrapperProps) {
  const { isFeatureEnabled, isLoading } = useSubscription();
  const isEnabled = isFeatureEnabled(feature);

  if (isLoading) {
    return <div className="animate-pulse h-8 bg-gray-200 rounded"></div>;
  }

  return (
    <div className={cn("relative", className)}>
      {showBadge && !isEnabled && (
        <div className="absolute top-0 right-0 z-10">
          <ProFeatureBadge tooltipText={tooltipText} />
        </div>
      )}

      <div
        className={cn(
          !isEnabled && "opacity-60 pointer-events-none select-none"
        )}
      >
        {children}
      </div>

      {!isEnabled && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20">
          <div className="text-center p-4 rounded-lg bg-background/80 shadow-sm border max-w-xs">
            <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">{disabledMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
