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
import { DrawerOrModal } from "../ui/drawer-or-modal";
import { AddDebtorForm } from "./add-debtor-form";

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
  const tabs = ["purchase", "payment", "add_debtor"] as const;
  const [tabQueryState, setTabQueryState] = useQueryState(
    "c_tab",
    parseAsStringLiteral(tabs).withDefault("purchase")
  );

  function handleOpenChange(open: boolean) {
    // setTabQueryState('purchase')
    onOpenChange(open);
  }
  return (
    <DrawerOrModal
      open={open}
      onOpenChange={handleOpenChange}
      title={"Manage Credit"}
      description={" Add a new purchase on credit or record a payment."}
    >
      <div className="pb-10">
        <Tabs
          value={tabQueryState}
          onValueChange={(value) =>
            setTabQueryState(value as "purchase" | "payment")
          }
          className="mt-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="add_debtor">Add Debtor</TabsTrigger>
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
          <TabsContent value="add_debtor">
            <AddDebtorForm
              onSuccess={() => {
                setTabQueryState("purchase");
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DrawerOrModal>
  );
}
