// components/credit/payments-tab.tsx
"use client";

import { PaymentCard } from "./payment-card";

type PaymentsTabProps = {
  payments: any[];
};

export function PaymentsTab({ payments }: PaymentsTabProps) {
  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <PaymentCard key={payment.id} payment={payment} />
      ))}

      {payments.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No payments recorded for this debtor.
        </div>
      )}
    </div>
  );
}
