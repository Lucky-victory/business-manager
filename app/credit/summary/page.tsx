"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, BarChart3, PieChart } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreditSummaryPage() {
  const router = useRouter();
  const { credits, debtors, formatCurrency } = useStore();
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month"
  );

  // Calculate summary statistics
  const totalOutstanding = credits
    .filter((credit) => credit.type === "purchase" && !credit.isPaid)
    .reduce((sum, credit) => sum + +credit.amount, 0);

  const totalPaid = credits
    .filter((credit) => credit.type === "purchase" && credit.isPaid)
    .reduce((sum, credit) => sum + +credit.amount, 0);

  const totalPayments = credits
    .filter((credit) => credit.type === "payment")
    .reduce((sum, credit) => sum + +credit.amount, 0);

  // Calculate per-debtor statistics
  const debtorStats = debtors
    .map((debtor) => {
      const debtorCredits = credits.filter(
        (credit) => credit.debtorId === debtor.id
      );

      const outstanding = debtorCredits
        .filter((credit) => credit.type === "purchase" && !credit.isPaid)
        .reduce((sum, credit) => sum + +credit.amount, 0);

      const paid = debtorCredits
        .filter((credit) => credit.type === "purchase" && credit.isPaid)
        .reduce((sum, credit) => sum + +credit.amount, 0);

      const payments = debtorCredits
        .filter((credit) => credit.type === "payment")
        .reduce((sum, credit) => sum + +credit.amount, 0);

      return {
        id: debtor.id,
        name: debtor.name,
        outstanding,
        paid,
        payments,
        total: outstanding + paid,
      };
    })
    .sort((a, b) => b.outstanding - a.outstanding);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Credit Summary</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Overview of all credit transactions and outstanding balances
        </p>
        <div className="flex items-center gap-2">
          <Select
            value={timeframe}
            onValueChange={(value: "week" | "month" | "year") =>
              setTimeframe(value)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Outstanding
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Number(totalOutstanding))}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {debtors.length} debtors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Number(totalPaid))}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalPaid / (totalPaid + totalOutstanding)) * 100).toFixed(1)}%
              of total credit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Number(totalPayments))}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalPayments / totalPaid) * 100).toFixed(1)}% of paid amount
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Outstanding Credit by Debtor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {debtorStats.map((debtor) => (
              <div key={debtor.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{debtor.name}</div>
                  <div className="font-medium">
                    {formatCurrency(Number(debtor.outstanding))}
                  </div>
                </div>
                <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${
                        (debtor.outstanding / (debtor.total || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    Outstanding: {formatCurrency(Number(debtor.outstanding))}
                  </span>
                  <span>Paid: {formatCurrency(Number(debtor.paid))}</span>
                </div>
              </div>
            ))}

            {debtorStats.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No credit data available.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
