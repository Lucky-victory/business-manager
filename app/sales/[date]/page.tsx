"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, set } from "date-fns";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { SaleSelect, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SalesForm } from "@/components/sales/sales-form";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SalesDetailPage({
  params,
}: {
  params: { date: string };
}) {
  const router = useRouter();
  const _params = use<{ date: string }>(params as any);
  const { sales, fetchSales } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [actionType, setActionType] = useState<"create" | "edit">("create");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<SaleSelect | null>(null);
  useEffect(() => {
    setIsLoading(true);
    fetchSales();
    setIsLoading(false);
  }, [fetchSales]);

  const dateString = _params.date;

  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    return format(saleDate, "yyyy-MM-dd") === dateString;
  });

  // Calculate total amount
  const totalAmount = filteredSales.reduce(
    (sum, sale) => sum + +sale.amount,
    0
  );

  const formattedDate = dateString
    ? format(new Date(dateString), "MMMM d, yyyy")
    : "Loading...";
  function editItem(item: any) {
    setActionType("edit");
    setSelectedItem(item);
    setIsFormOpen(true);
  }

  function openAddSaleForm(open: boolean) {
    setActionType("create");
    setSelectedItem(null);
    setIsFormOpen(open);
  }
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
        <h1 className="text-2xl font-bold">Sales for {formattedDate}</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            Total Sales:{" "}
            <span className="font-medium text-foreground ">
              ₦
              <span className="text-2xl font-bold">
                {formatCurrency(totalAmount)}
              </span>
            </span>
          </p>
          <p className="text-muted-foreground">
            Items Sold:{" "}
            <span className="font-medium text-foreground">
              {filteredSales.length}
            </span>
          </p>
        </div>
        <Button onClick={() => openAddSaleForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Sale
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow
                key={sale.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setActionType("edit");
                  editItem(sale);
                }}
              >
                <TableCell className="font-medium capitalize">
                  {sale.paymentType}
                </TableCell>
                <TableCell>
                  {sale.quantity} {sale.measurementUnit || "--"}
                </TableCell>
                <TableCell>{sale.item}</TableCell>
                <TableCell>
                  ₦{formatCurrency(parseInt(sale.price, 10))}
                </TableCell>
                <TableCell>
                  ₦{formatCurrency(parseInt(sale.amount, 10))}
                </TableCell>
                <TableCell>
                  ₦{formatCurrency(parseInt(sale.profit, 10))}
                </TableCell>
                <TableCell>{format(new Date(sale.date), "h:mm a")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {isLoading && (
          <div className="flex flex-col gap-4 max-w-40 mx-auto items-center py-8">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Fetching data...</span>
          </div>
        )}
        {!isLoading && filteredSales.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No sales recorded for this date.
          </div>
        )}
      </div>
      {selectedItem && actionType === "edit" ? (
        <SalesForm
          open={isFormOpen}
          onOpenChange={openAddSaleForm}
          defaultDate={dateString}
          initialData={selectedItem}
        />
      ) : (
        <SalesForm
          open={isFormOpen}
          onOpenChange={openAddSaleForm}
          defaultDate={dateString}
        />
      )}
    </div>
  );
}
