"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Plus, Pencil, Trash } from "lucide-react";
import { SaleSelect, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SalesForm } from "@/components/sales/sales-form";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SalesDetailPage({
  params,
}: {
  params: { date: string };
}) {
  const router = useRouter();
  const _params = use<{ date: string }>(params as any);
  const { sales, fetchSales, deleteSale, formatCurrency } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [actionType, setActionType] = useState<"create" | "edit">("create");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<SaleSelect | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SaleSelect | null>(null);
  const isMobile = useIsMobile();

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

  const totalAmount = filteredSales.reduce(
    (sum, sale) => sum + +sale.amount,
    0
  );
  const totalProfit = filteredSales.reduce(
    (sum, sale) => sum + +sale.profit,
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

  function handleDeleteClick(item: SaleSelect) {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (itemToDelete) {
      setIsDeleting(true);
      await deleteSale(itemToDelete.id).then(async () => {
        setItemToDelete(null);
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setIsLoading(true);
        await fetchSales();
        setIsLoading(false);
      });

      // setIsDeleteDialogOpen(false);
      // setItemToDelete(null);
      // fetchSales();
    }
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
              <span className="text-2xl font-bold">
                {formatCurrency(totalAmount)}
              </span>
            </span>
          </p>
          <p className="text-muted-foreground">
            Total Profit:{" "}
            <span className="font-medium text-foreground ">
              <span className="text-2xl font-bold">
                {formatCurrency(totalProfit)}
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
        <Button
          onClick={() => openAddSaleForm(true)}
          size={isMobile ? "sm" : undefined}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sale
        </Button>
      </div>
      <div className="overflow-x-auto">
        {/* Desktop Table View */}
        {!isLoading && (
          <>
            <div className="hidden md:block">
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium capitalize">
                        {sale.paymentType}
                      </TableCell>
                      <TableCell>
                        {sale.quantity} {sale.measurementUnit || "--"}
                      </TableCell>
                      <TableCell>{sale.item}</TableCell>
                      <TableCell>{formatCurrency(sale.price)}</TableCell>
                      <TableCell>{formatCurrency(sale.amount)}</TableCell>
                      <TableCell>{formatCurrency(sale.profit)}</TableCell>
                      <TableCell>
                        {format(new Date(sale.date), "h:mm a")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => editItem(sale)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDeleteClick(sale)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredSales.map((sale) => (
                <Card key={sale.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{sale.item}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {sale.paymentType}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => editItem(sale)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDeleteClick(sale)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantity:</p>
                        <p>
                          {sale.quantity} {sale.measurementUnit || "--"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price:</p>
                        <p>{formatCurrency(sale.price)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total:</p>
                        <p>{formatCurrency(sale.amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit:</p>
                        <p>{formatCurrency(sale.profit)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time:</p>
                        <p>{format(new Date(sale.date), "h:mm a")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
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
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              sale record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild onClick={handleConfirmDelete}>
              <Button variant="destructive" className="bg-destructive">
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
