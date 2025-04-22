"use client";

import { useSubscriptionStore } from "@/lib/subscription-store";
import { cn } from "@/lib/utils";
import { PlanFeatures } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { ProFeatureBadge } from "@/components/ui/pro-feature-badge";
import { BarChart3, CreditCard, DollarSign, Search } from "lucide-react";
import { TabType } from "./types";

interface MobileTabBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function MobileTabBar({ activeTab, setActiveTab }: MobileTabBarProps) {
  const { hasFeatureAccess, setShowPlansModal, setFeatureClicked } =
    useSubscriptionStore();

  const navItems = [
    {
      id: "sales",
      label: "Sales",
      icon: <BarChart3 className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: "credit",
      label: "Credit",
      icon: <CreditCard className="h-5 w-5" />,
      enabled: hasFeatureAccess("credit"),
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: <DollarSign className="h-5 w-5" />,
      enabled: hasFeatureAccess("expenses"),
    },
  ];

  const isSearchPage = activeTab === "search";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 h-16 flex items-center justify-around z-20">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={cn(
            "flex-col h-full rounded-none relative",
            activeTab === item.id ? "bg-gray-100 dark:bg-gray-900" : ""
          )}
          onClick={() => {
            if (!item.enabled) {
              setFeatureClicked(item.id as keyof PlanFeatures);
              setShowPlansModal(true);
              return;
            }
            setActiveTab(item.id as TabType);
          }}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
          {!item.enabled && (
            <span className="absolute top-1 right-[5%] translate-x-[-50%] ">
              <ProFeatureBadge />
            </span>
          )}
        </Button>
      ))}
      <Button
        variant="ghost"
        className={cn(
          "flex-col h-full rounded-none",
          isSearchPage ? "bg-gray-100 dark:bg-gray-900" : ""
        )}
        onClick={() => setActiveTab("search")}
      >
        <Search className="h-5 w-5" />
        <span className="text-xs mt-1">Search</span>
      </Button>
    </div>
  );
}
