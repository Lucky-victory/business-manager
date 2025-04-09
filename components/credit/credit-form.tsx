// components/credit/CreditForm.tsx
"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchaseForm } from "./purchase-form";
import { PaymentForm } from "./payment-form";

export function CreditForm({
  open,
  onOpenChange,
  defaultDebtorId = "",
  defaultDebtorName = "",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDebtorId?: string;
  defaultDebtorName?: string;
}) {
  const [activeTab, setActiveTab] = useState<"purchase" | "payment">(
    "purchase"
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Manage Credit</SheetTitle>
          <SheetDescription>
            Add a new purchase on credit or record a payment.
          </SheetDescription>
        </SheetHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "purchase" | "payment")
          }
          className="mt-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="purchase">
            <PurchaseForm
              defaultDebtorId={defaultDebtorId}
              defaultDebtorName={defaultDebtorName}
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentForm
              defaultDebtorId={defaultDebtorId}
              defaultDebtorName={defaultDebtorName}
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
