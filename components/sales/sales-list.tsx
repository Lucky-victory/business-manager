"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesForm } from "@/components/sales/sales-form";
import Link from "next/link";

export function SalesList() {
  const router = useRouter();
  const { sales, fetchSales } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Group sales by date
  const salesByDate = sales.reduce((acc, sale) => {
    const date = format(new Date(sale.date), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        date,
        totalAmount: 0,
        count: 0,
      };
    }
    acc[date].totalAmount += +sale.amount;
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { date: string; totalAmount: number; count: number }>);
  console.log({
    salesByDate,
    sales,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Sales</h2>
        <Button asChild>
          <Link href={"/sales/new"}>
            <Plus className="h-4 w-4 mr-2" />
            Add Sale
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(salesByDate).map((saleDay) => (
          <Card
            key={saleDay.date}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push(`/sales/${saleDay.date}`)}
          >
            <CardHeader className="pb-2">
              <CardTitle>
                {format(new Date(saleDay.date), "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Sales:</span>
                <span className="font-medium flex items-center">
                  ₦
                  <span className="font-bold text-2xl">
                    {saleDay.totalAmount.toLocaleString("en-US") as string}
                  </span>
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Items Sold:</span>
                <span className="font-medium">{saleDay.count}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {sales.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No sales recorded yet. Add your first sale!
          </div>
        )}
      </div>

      <SalesForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
