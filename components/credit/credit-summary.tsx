"use client";

import { CreditSelect, useStore } from "@/lib/store";
import isEmpty from "just-is-empty";

type CreditSummaryProps = {
  debtorCredits: CreditSelect[];
};

export function CreditSummary({ debtorCredits }: CreditSummaryProps) {
  // Separate purchases and payments
  const allPurchases = debtorCredits.filter(
    (credit) => credit.type === "purchase"
  );
  const payments = debtorCredits.filter((credit) => credit.type === "payment");
  const { formatCurrency } = useStore();
  // Calculate total amount owed
  const totalPurchases = allPurchases.reduce(
    (sum, purchase) => sum + +purchase.amount,
    0
  );
  const totalPayments = payments.reduce(
    (sum, payment) => sum + +payment.amount,
    0
  );

  const totalOwed = totalPurchases - totalPayments;
  const unpaidItems = allPurchases.filter((purchase) => !purchase.isPaid);
  // Calculate paid and unpaid amounts
  const paidAmount = allPurchases
    .filter((purchase) => purchase.isPaid)
    .reduce((sum, purchase) => sum + +purchase.amount, 0);
  const unpaidAmount =
    unpaidItems?.length > 0
      ? allPurchases
          .filter((purchase) => !purchase.isPaid)
          .reduce((sum, purchase) => sum + +purchase.amount, 0) - totalPayments
      : allPurchases
          .filter((purchase) => !purchase.isPaid)
          .reduce((sum, purchase) => sum + +purchase.amount, 0);
  const debtorCredit = {
    totalAmount: totalPurchases,
    paidAmount,
    unpaidAmount,
  };

  return (
    <div>
      <p className="text-muted-foreground">
        Total Owed:
        <span
          className={`font-medium ${
            debtorCredit.totalAmount > 0 ? "text-red-500" : "text-green-500"
          } ml-1`}
        >
          {formatCurrency(Number(debtorCredit.totalAmount))}
        </span>
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground">
          Paid:
          <span className="font-medium text-green-500 ml-1">
            {formatCurrency(Number(debtorCredit.paidAmount))}
          </span>
        </p>
        <p className="text-muted-foreground">
          Unpaid:
          <span className="font-medium text-red-500 ml-1">
            {formatCurrency(Number(debtorCredit.unpaidAmount))}
          </span>
        </p>
        <p className="text-muted-foreground">
          Payments made:
          <span className="font-medium text-green-500 ml-1">
            {formatCurrency(Number(totalPayments))}
          </span>
        </p>
      </div>
    </div>
  );
}
