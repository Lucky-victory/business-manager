"use client";
import { parseAsStringLiteral, useQueryState } from "nuqs";
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
  const tabs = ["purchase", "payment"] as const;
  const [tabQueryState, setTabQueryState] = useQueryState(
    "c_tab",
    parseAsStringLiteral(tabs).withDefault("purchase")
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
          value={tabQueryState}
          onValueChange={(value) =>
            setTabQueryState(value as "purchase" | "payment")
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
