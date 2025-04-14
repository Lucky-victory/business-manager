"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { CreditForm } from "@/components/credit/credit-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditReportDialog } from "@/components/credit/credit-report-dialog";
import { LoadingStateWrapper } from "../ui/loading-state-wrapper";
import { cn } from "@/lib/utils";

export function CreditList() {
  const router = useRouter();
  const {
    credits,
    fetchCredits,
    fetchDebtors,
    debtors,
    getTotalOutstandingCredit,
    formatCurrency,
    isLoading,
  } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [filteredCredits, setFilteredCredits] = useState(credits);
  const totalOutstandingCredit = getTotalOutstandingCredit();

  useEffect(() => {
    fetchCredits();
    fetchDebtors();
  }, [fetchCredits, fetchDebtors]);

  useEffect(() => {
    // Apply status filter
    if (statusFilter === "all") {
      setFilteredCredits(credits);
    } else if (statusFilter === "paid") {
      setFilteredCredits(credits.filter((credit) => credit.isPaid));
    } else {
      setFilteredCredits(credits.filter((credit) => !credit.isPaid));
    }
  }, [credits, statusFilter]);

  // Group credits by debtor
  const creditsByDebtor = filteredCredits.reduce(
    (acc, credit) => {
      const debtor = debtors.find((debtor) => debtor.id === credit.debtorId);
      if (!acc[credit.debtorId]) {
        acc[credit.debtorId] = {
          debtorId: credit.debtorId,
          debtorName: debtor?.name || "Unknown Debtor",
          totalAmount: 0,
          paidAmount: 0,
          unpaidAmount: 0,
          lastUpdate: new Date(0).toISOString(),
        };
      }

      // Add to total amount if it's a purchase
      if (credit.type === "purchase") {
        acc[credit.debtorId].totalAmount += Number(credit.amount);

        // Track paid vs unpaid amounts
        if (credit.isPaid) {
          acc[credit.debtorId].paidAmount += Number(credit.amount);
        } else {
          acc[credit.debtorId].unpaidAmount += Number(credit.amount);
        }
      } else if (credit.type === "payment") {
        // For payments, we don't add to paidAmount directly to avoid double counting
        // Instead, we just reduce the unpaidAmount
        acc[credit.debtorId].unpaidAmount = Math.max(
          0,
          acc[credit.debtorId].unpaidAmount - Number(credit.amount)
        );
      }

      // Update last update date if this entry is newer
      const creditDate = new Date(credit.date);
      const lastUpdateDate = new Date(acc[credit.debtorId].lastUpdate);
      if (creditDate > lastUpdateDate) {
        acc[credit.debtorId].lastUpdate = credit.date;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        debtorId: string;
        debtorName: string;
        totalAmount: number;
        paidAmount: number;
        unpaidAmount: number;
        lastUpdate: Date | string;
      }
    >
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Credit</h2>
          <p className="text-muted-foreground">
            Total Outstanding:{" "}
            <span className="font-medium text-red-500">
              {formatCurrency(Number(totalOutstandingCredit))}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "paid" | "unpaid") =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="paid">Paid Only</SelectItem>
              <SelectItem value="unpaid">Unpaid Only</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Credit Reports</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsReportOpen(true)}>
                Generate Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/credit/summary")}>
                View Summary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Credit
          </Button>
        </div>
      </div>

      <div
        className={cn(
          isLoading.credits && "",
          !isLoading?.credits && "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        )}
      >
        <LoadingStateWrapper isLoading={isLoading.credits}>
          {Object.values(creditsByDebtor).map((debtorCredit) => (
            <Card
              key={debtorCredit.debtorId}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => router.push(`/credit/${debtorCredit.debtorId}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle>{debtorCredit.debtorName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Owed:</span>
                  <span
                    className={`font-medium ${
                      debtorCredit.totalAmount > 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {formatCurrency(Number(debtorCredit.totalAmount))}
                  </span>
                </div>
                {statusFilter === "all" && (
                  <>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-muted-foreground">
                        Paid Amount:
                      </span>
                      <span className="font-medium text-green-500">
                        {formatCurrency(Number(debtorCredit.paidAmount))}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-muted-foreground">
                        Unpaid Amount:
                      </span>
                      <span className="font-medium text-red-500">
                        {formatCurrency(Number(debtorCredit.unpaidAmount))}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between mt-1.5">
                  <span className="text-muted-foreground">Last Update:</span>
                  <span className="font-medium">
                    {format(new Date(debtorCredit.lastUpdate), "MMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
              {/* <CardFooter className="pt-0">
              <div className="flex gap-2 w-full justify-end">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/credit/${debtorCredit.debtorId}/invoice`);
                  }}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Invoice
                  </Button>
              </div>
            </CardFooter> */}
            </Card>
          ))}
        </LoadingStateWrapper>

        {filteredCredits.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No credit records found with the selected filter.
          </div>
        )}
      </div>

      <CreditForm open={isFormOpen} onOpenChange={setIsFormOpen} />
      <CreditReportDialog open={isReportOpen} onOpenChange={setIsReportOpen} />
    </div>
  );
}
