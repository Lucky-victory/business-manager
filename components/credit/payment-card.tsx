// components/credit/payment-card.tsx
"use client";

import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";

type PaymentCardProps = {
  payment: any;
};

export function PaymentCard({ payment }: PaymentCardProps) {
  const { formatCurrency } = useStore();
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium">
              {formatCurrency(Number(payment.amount))}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Type</p>
            <p className="font-medium capitalize">{payment.paymentType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">
              {format(new Date(payment.date), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
