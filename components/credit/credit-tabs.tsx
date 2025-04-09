// components/credit/credit-tabs.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchasesTab } from "./purchases-tab";
import { PaymentsTab } from "./payments-tab";

type CreditTabsProps = {
  debtorCredits: any[];
};

export function CreditTabs({ debtorCredits }: CreditTabsProps) {
  const [activeTab, setActiveTab] = useState<"purchases" | "payments">(
    "purchases"
  );

  // Separate purchases and payments
  const purchases = debtorCredits.filter(
    (credit) => credit.type === "purchase"
  );
  const payments = debtorCredits.filter((credit) => credit.type === "payment");

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as "purchases" | "payments")}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <TabsList className="grid w-full sm:w-auto grid-cols-2">
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="purchases">
        <PurchasesTab purchases={purchases} activeTab={activeTab} />
      </TabsContent>

      <TabsContent value="payments">
        <PaymentsTab payments={payments} />
      </TabsContent>
    </Tabs>
  );
}
