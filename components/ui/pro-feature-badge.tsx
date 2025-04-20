"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProFeatureBadgeProps {
  className?: string;
  tooltipText?: string;
}

export function ProFeatureBadge({
  className,
  tooltipText = "This is a Pro feature. Upgrade to access.",
}: ProFeatureBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "bg-gradient-to-r from-amber-500 to-pink-500 text-white border-none ml-2",
              className
            )}
          >
            {/* <Sparkles className="h-3 w-3 mr-1" /> */}
            PRO
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
