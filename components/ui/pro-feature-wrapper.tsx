"use client";

import React from "react";
import { useSubscription } from "@/lib/subscription-context";
import { PlanFeatures } from "@/types/subscription";
import { cn } from "@/lib/utils";
import { ProFeatureBadge } from "./pro-feature-badge";
import { Lock, Sparkles } from "lucide-react";
import { PlansModal } from "@/components/subscription/plans-modal";

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
  const { isFeatureEnabled, isLoading, setShowPlansModal, setFeatureClicked } =
    useSubscription();
  const isEnabled = isFeatureEnabled(feature);

  if (isLoading) {
    return <div className="animate-pulse h-8 bg-gray-200 rounded"></div>;
  }

  const handleProFeatureClick = () => {
    if (!isEnabled) {
      setFeatureClicked(feature);
      setShowPlansModal(true);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {showBadge && !isEnabled && (
        <div className="absolute top-0 right-0 z-10">
          <ProFeatureBadge tooltipText={tooltipText} />
        </div>
      )}

      <div
        className={cn(
          !isEnabled &&
            "opacity-80 cursor-pointer hover:opacity-100 transition-opacity"
        )}
        onClick={!isEnabled ? handleProFeatureClick : undefined}
      >
        {children}
      </div>

      {!isEnabled && (
        <div
          className="absolute inset-0 bg-background/50 flex items-center justify-center z-20 cursor-pointer hover:bg-background/40 transition-colors"
          onClick={handleProFeatureClick}
        >
          <div className="text-center p-4 rounded-lg bg-background/80 shadow-sm border max-w-xs">
            <Sparkles className="h-5 w-5 mx-auto mb-2 text-amber-500" />
            <p className="text-sm font-medium">{disabledMessage}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click to upgrade
            </p>
          </div>
        </div>
      )}

      <PlansModal />
    </div>
  );
}
