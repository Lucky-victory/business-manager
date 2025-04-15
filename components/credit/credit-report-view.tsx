"use client";

import { forwardRef } from "react";
import { format } from "date-fns";
import { CreditSelect, DebtorSelect, UserSelect } from "@/lib/store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DateRange } from "@/lib/report-utils";

interface CreditReportViewProps {
  credits: CreditSelect[];
  debtors: DebtorSelect[];
  dateRange: DateRange;
  selectedDebtorId?: string;
  user: UserSelect;
  formatCurrency: (amount: number | string) => string;
}

export const CreditReportView = forwardRef<
  HTMLDivElement,
  CreditReportViewProps
>(function CreditReportView(
  { credits, debtors, dateRange, selectedDebtorId, user, formatCurrency },
  ref
) {
  // Filter credits by date range and debtor if selected
  let filteredCredits = credits.filter((credit) => {
    const creditDate = new Date(credit.date);
    return creditDate >= dateRange.from && creditDate <= dateRange.to;
  });

  // Filter by debtor if not "all"
  if (selectedDebtorId && selectedDebtorId !== "all") {
    filteredCredits = filteredCredits.filter(
      (credit) => credit.debtorId === selectedDebtorId
    );
  }

  // Get selected debtor name if applicable
  const selectedDebtor =
    selectedDebtorId && selectedDebtorId !== "all"
      ? debtors.find((d) => d.id === selectedDebtorId)
      : null;

  // Calculate totals
  const totalPurchases = filteredCredits
    .filter((credit) => credit.type === "purchase")
    .reduce((sum, credit) => sum + Number(credit.amount), 0);

  const totalPayments = filteredCredits
    .filter((credit) => credit.type === "payment")
    .reduce((sum, credit) => sum + Number(credit.amount), 0);

  const paidPurchases = filteredCredits
    .filter((credit) => credit.type === "purchase" && credit.isPaid)
    .reduce((sum, credit) => sum + Number(credit.amount), 0);

  const unpaidPurchases = filteredCredits
    .filter((credit) => credit.type === "purchase" && !credit.isPaid)
    .reduce((sum, credit) => sum + Number(credit.amount), 0);

  const outstandingBalance = Math.max(0, unpaidPurchases - totalPayments);

  return (
    <Card className="w-full max-w-4xl mx-auto" ref={ref}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">CREDIT REPORT</CardTitle>
          <p className="text-muted-foreground">
            {format(dateRange.from, "MMMM d, yyyy")} -{" "}
            {format(dateRange.to, "MMMM d, yyyy")}
          </p>
          {selectedDebtor && (
            <p className="text-muted-foreground mt-1">
              Debtor: {selectedDebtor.name}
            </p>
          )}
        </div>
        <div className="text-right">
          {user?.companyName && (
            <p className="font-bold">{user?.companyName}</p>
          )}
          {user?.companyAddress && (
            <p className="text-sm text-muted-foreground">
              {user?.companyAddress}
            </p>
          )}
          {user?.companyPhone && (
            <p className="text-sm text-muted-foreground">
              {user?.companyPhone}
            </p>
          )}
          {user?.companyEmail && (
            <p className="text-sm text-muted-foreground">
              {user?.companyEmail}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Purchases:</span>
                <span className="font-medium">
                  {formatCurrency(totalPurchases)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Payments:</span>
                <span className="font-medium">
                  {formatCurrency(totalPayments)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid Purchases:</span>
                <span className="font-medium text-green-500">
                  {formatCurrency(paidPurchases)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unpaid Purchases:</span>
                <span className="font-medium text-red-500">
                  {formatCurrency(unpaidPurchases)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Outstanding Balance:
                </span>
                <span className="font-medium text-red-500">
                  {formatCurrency(outstandingBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <h3 className="font-semibold mb-3">Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Debtor</th>
                <th className="py-2 text-left">Type</th>
                <th className="py-2 text-left">Item</th>
                <th className="py-2 text-right">Quantity</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCredits.map((credit) => {
                const debtor = debtors.find((d) => d.id === credit.debtorId);
                const debtorName = debtor?.name || "Unknown";
                const status = credit.isPaid ? "Paid" : "Unpaid";
                const formattedDate = format(
                  new Date(credit.date),
                  "MMM d, yyyy"
                );

                return (
                  <tr key={credit.id} className="border-b">
                    <td className="py-2">{formattedDate}</td>
                    <td className="py-2">{debtorName}</td>
                    <td className="py-2 capitalize">{credit.type}</td>
                    <td className="py-2">{credit.item || "-"}</td>
                    <td className="py-2 text-right">
                      {credit.quantity || "-"}
                    </td>
                    <td className="py-2 text-right">
                      {credit.price
                        ? formatCurrency(Number(credit.price))
                        : "-"}
                    </td>
                    <td className="py-2 text-right">
                      {formatCurrency(Number(credit.amount))}
                    </td>
                    <td className="py-2 text-right">
                      <span
                        className={
                          credit.isPaid ? "text-green-500" : "text-red-500"
                        }
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredCredits.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-4 text-center text-muted-foreground"
                  >
                    No transactions found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center border-t pt-3">
        <p className="text-sm text-muted-foreground mb-2">
          Report generated on {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
        </p>
        <div className="text-xs text-muted-foreground">
          Powered by BizManager.Africa
        </div>
      </CardFooter>
    </Card>
  );
});
