"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SalesForm } from "@/components/sales/sales-form";
import { useState } from "react";

export default function SalesDetailPage({
  params,
}: {
  params: { date: string };
}) {
  const router = useRouter();
  const _params = use<{ date: string }>(params as any);
  const { sales, fetchSales } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Filter sales for the selected date
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
            <span className="font-medium text-foreground">
              ₦{totalAmount.toFixed(2)}
            </span>
          </p>
          <p className="text-muted-foreground">
            Items Sold:{" "}
            <span className="font-medium text-foreground">
              {filteredSales.length}
            </span>
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Sale
        </Button>
      </div>

      <div className="space-y-4">
        {filteredSales.map((sale) => (
          <Card key={sale.id}>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Item</p>
                  <p className="font-medium">{sale.item}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{sale.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    ₦{parseInt(sale.price, 10).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-medium">
                    ₦{parseInt(sale.amount, 10).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-medium capitalize">{sale.paymentType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {format(new Date(sale.date), "h:mm a")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSales.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No sales recorded for this date.
          </div>
        )}
      </div>

      <SalesForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        defaultDate={dateString}
      />
    </div>
  );
}
