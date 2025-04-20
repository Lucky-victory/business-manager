"use client";

import React from "react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProFeatureBadgeProps extends BadgeProps {}

export function ProFeatureBadge({ className, ...props }: ProFeatureBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-gradient-to-r from-amber-500 to-pink-500 text-white border-0 gap-1",
        className
      )}
      {...props}
    >
      <SparklesIcon className="h-3 w-3" />
      <span>PRO</span>
    </Badge>
  );
}
