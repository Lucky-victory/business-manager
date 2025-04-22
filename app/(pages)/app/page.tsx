// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { useStore } from "@/lib/store";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { ContentWrapper } from "@/components/layouts/content-wrapper";
import { tabs } from "@/components/layouts/types";

export default function Home() {
  const [tabQueryState, setTabQueryState] = useQueryState(
    "tab",
    parseAsStringLiteral(tabs).withDefault("sales")
  );

  const { fetchUser, fetchExpenses } = useStore();
  const { fetchSubscriptionData } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  useEffect(() => {
    fetchUser();
    fetchExpenses();
  }, [fetchUser, fetchExpenses]);

  return (
    <DashboardLayout activeTab={tabQueryState} setActiveTab={setTabQueryState}>
      <ContentWrapper
        activeTab={tabQueryState}
        setActiveTab={setTabQueryState}
      />
    </DashboardLayout>
  );
}
