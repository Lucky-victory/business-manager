import { useState } from "react";
import type React from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetFooter } from "@/components/ui/sheet";
import { FormField } from "./form-field";
import { useAuth } from "@/lib/auth-client";
import { DebtorSelector } from "./debtor-selector";
import { PaymentTypeSelector } from "./payment-type-selector";
import { DatePickerField } from "../ui/date-picker";
import { getCurrentDateTime } from "@/lib/utils";

type PaymentFormProps = {
  defaultDebtorId?: string;
  defaultDebtorName?: string;
  onSuccess: () => void;
};

export function PaymentForm({
  defaultDebtorId = "",
  defaultDebtorName = "",
  onSuccess,
}: PaymentFormProps) {
  const { addCredit, debtors } = useStore();
  const auth = useAuth();

  const [paymentData, setPaymentData] = useState({
    debtorId: defaultDebtorId,
    debtorName: defaultDebtorName,
    amount: 0,
    paymentType: "cash",
    date: new Date().toISOString().split("T")[0],
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCredit({
      id: Date.now().toString(),
      debtorId: paymentData.debtorId || Date.now().toString(),
      type: "payment",
      amount: paymentData.amount + "",
      paymentType: paymentData.paymentType,
      date: new Date(paymentData.date).toISOString() as unknown as Date,
      userId: auth?.user?.id as string,
    });

    // Reset form and close sheet
    setPaymentData({
      debtorId: "",
      debtorName: "",
      amount: 0,
      paymentType: "cash",
      date: new Date().toISOString().split("T")[0],
    });
    onSuccess();
  };

  return (
    <form
      onSubmit={handlePaymentSubmit}
      className="space-y-4 py-4"
      id="payment-form"
    >
      <FormField id="paymentDebtorName" label="Debtor Name" required>
        {defaultDebtorId ? (
          <Input value={paymentData.debtorName} disabled />
        ) : (
          <DebtorSelector
            debtorId={paymentData.debtorId}
            onSelect={(value, debtorName) => {
              setPaymentData({
                ...paymentData,
                debtorId: value,
                debtorName: debtorName,
              });
            }}
          />
        )}
      </FormField>

      <FormField id="paymentAmount" label="Payment Amount" required>
        <Input
          type="number"
          min="0"
          step="5"
          value={paymentData.amount}
          onChange={(e) =>
            setPaymentData({
              ...paymentData,
              amount: Number.parseFloat(e.target.value) || 0,
            })
          }
          required
        />
      </FormField>

      <FormField id="paymentType" label="Payment Type" required>
        <PaymentTypeSelector
          value={paymentData.paymentType}
          onChange={(value) =>
            setPaymentData({ ...paymentData, paymentType: value })
          }
        />
      </FormField>

      {/* <FormField id="paymentDate" label="Date" required> */}
      <DatePickerField
        date={paymentData.date}
        onDateChange={(date) =>
          setPaymentData({
            ...paymentData,
            date: getCurrentDateTime(date as Date).toISOString(),
          })
        }
      />
      {/* </FormField> */}

      <SheetFooter className="pt-4">
        <Button type="submit">Record Payment</Button>
      </SheetFooter>
    </form>
  );
}
