import { useState } from "react";
import type React from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetFooter } from "@/components/ui/sheet";
import { FormField } from "./form-field";
import { authClient, useAuth } from "@/lib/auth-client";
import { DebtorSelector } from "./debtor-selector";
import { DatePickerField } from "../ui/date-picker";
import { getCurrentDateTime } from "@/lib/utils";

type PurchaseFormProps = {
  defaultDebtorId?: string;
  defaultDebtorName?: string;
  onSuccess: () => void;
};

export function PurchaseForm({
  defaultDebtorId = "",
  defaultDebtorName = "",
  onSuccess,
}: PurchaseFormProps) {
  const { addCredit } = useStore();
  const auth = useAuth();

  const [purchaseData, setPurchaseData] = useState({
    debtorId: defaultDebtorId,
    debtorName: defaultDebtorName,
    item: "",
    quantity: 1,
    price: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = purchaseData.quantity * purchaseData.price;

    addCredit({
      id: Date.now().toString(),
      debtorId: purchaseData.debtorId || Date.now().toString(),
      type: "purchase",
      item: purchaseData.item,
      quantity: purchaseData.quantity,
      price: purchaseData.price + "",
      amount: amount + "",
      date: new Date(purchaseData.date).toISOString() as unknown as Date,
      userId: auth?.user?.id as string,
    });

    // Reset form and close sheet
    setPurchaseData({
      debtorId: "",
      debtorName: "",
      item: "",
      quantity: 1,
      price: 0,
      date: new Date().toISOString().split("T")[0],
    });
    onSuccess();
  };

  return (
    <form onSubmit={handlePurchaseSubmit} className="space-y-4 py-4">
      <FormField id="debtorName" label="Debtor Name" required>
        <DebtorSelector
          debtorId={purchaseData.debtorId}
          onSelect={(value, debtorName) => {
            setPurchaseData({
              ...purchaseData,
              debtorId: value,
              debtorName: debtorName,
            });
          }}
        />
      </FormField>

      <FormField id="item" label="Item Name" required>
        <Input
          placeholder="Enter item name"
          value={purchaseData.item}
          onChange={(e) =>
            setPurchaseData({ ...purchaseData, item: e.target.value })
          }
          required
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="quantity" label="Quantity" required>
          <Input
            type="number"
            min="1"
            value={purchaseData.quantity}
            onChange={(e) =>
              setPurchaseData({
                ...purchaseData,
                quantity: Number.parseInt(e.target.value) || 1,
              })
            }
            required
          />
        </FormField>

        <FormField id="price" label="Price per Unit" required>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={purchaseData.price}
            onChange={(e) =>
              setPurchaseData({
                ...purchaseData,
                price: Number.parseFloat(e.target.value) || 0,
              })
            }
            required
          />
        </FormField>
      </div>

      <FormField id="date" label="Date" required>
        <DatePickerField
          date={purchaseData.date}
          onDateChange={(date) =>
            setPurchaseData({
              ...purchaseData,
              date: getCurrentDateTime(date as Date).toISOString(),
            })
          }
        />
      </FormField>

      <SheetFooter className="pt-4">
        <Button type="submit">Add Purchase</Button>
      </SheetFooter>
    </form>
  );
}
