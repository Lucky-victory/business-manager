"use client";

import { use, useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Download, Printer, Send } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./print-styles.css";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { generateUUID, getCurrentDateTime } from "@/lib/utils";
import { DatePickerField } from "@/components/ui/date-picker";

export default function InvoicePage({
  params,
}: {
  params: { debtorId: string };
}) {
  const router = useRouter();
  const _params = use<{ debtorId: string }>(params as any);
  const { credits, fetchCredits, debtors, formatCurrency, user, fetchUser } =
    useStore();
  const defaultInvNumber = useMemo(
    () => `INV-${generateUUID().slice(-16).toUpperCase()}`,
    []
  );
  const [invoiceNumber, setInvoiceNumber] = useState(defaultInvNumber);
  const [dueDate, setDueDate] = useState(
    format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
  );
  const [notes, setNotes] = useState("Thank you for your business!");

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      fetchUser();
    }
    fetchCredits();
  }, [fetchCredits]);

  // Filter credits for the selected debtor
  const debtorId = _params.debtorId;
  const debtorCredits = credits.filter(
    (credit) => credit.debtorId === debtorId
  );
  const debtor = debtors.find(
    (debtor) => debtor.id === debtorCredits?.[0]?.debtorId
  );
  const debtorName = debtor?.name || "Unknown Debtor";
  const payments = debtorCredits.filter((credit) => credit.type === "payment");
  const totalPayments = payments.reduce(
    (sum, payment) => sum + +payment.amount,
    0
  );

  // Get unpaid purchases
  const unpaidPurchases = debtorCredits.filter(
    (credit) => credit.type === "purchase" && !credit.isPaid
  );

  const unpaidItems = debtorCredits.filter(
    (credit) => credit.type === "purchase" && !credit.isPaid
  );
  // const unpaidAmount =
  //   unpaidItems?.length > 0
  //     ? unpaidPurchases
  //         .filter((purchase) => !purchase.isPaid)
  //         .reduce((sum, purchase) => sum + +purchase.amount, 0) - totalPayments
  //     : unpaidPurchases
  //         .filter((purchase) => !purchase.isPaid)
  //         .reduce((sum, purchase) => sum + +purchase.amount, 0);
  // Calculate total amount due
  const totalDue =
    unpaidPurchases.reduce((sum, purchase) => sum + +purchase.amount, 0) -
    totalPayments;

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;

    try {
      // Show loading toast
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your invoice...",
      });

      // Hide buttons during capture
      const printButtons = document.querySelector(".print-buttons");
      if (printButtons) {
        printButtons.classList.add("hidden");
      }

      // Capture the invoice element as an image
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Show buttons again
      if (printButtons) {
        printButtons.classList.remove("hidden");
      }

      // Calculate PDF dimensions (A4 format)
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Save PDF
      pdf.save(`Invoice-${invoiceNumber}.pdf`);

      // Show success toast
      toast({
        title: "Invoice downloaded",
        description: "Invoice has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });

      // Show buttons again in case of error
      const printButtons = document.querySelector(".print-buttons");
      if (printButtons) {
        printButtons.classList.remove("hidden");
      }
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleSendInvoice = () => {
    // In a real app, this would send the invoice via email
    toast({
      title: "Invoice sent",
      description: `Invoice has been sent to ${debtorName}.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Invoice for {debtorName}</h1>
      </div>

      <div className="print:hidden mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>

            <DatePickerField
              date={dueDate}
              minDate={new Date()}
              onDateChange={(date) =>
                setDueDate(getCurrentDateTime(date).toISOString())
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <Card
        className="mb-6 print:shadow-none print:border-none"
        ref={invoiceRef}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">INVOICE</CardTitle>
            <p className="text-muted-foreground">{invoiceNumber}</p>
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
          <div className="grid grid-cols-2 gap-4 print:gap-2 mb-6">
            <div>
              <h3 className="font-semibold mb-1">Bill To:</h3>
              <p>{debtorName}</p>
              {debtor?.address && (
                <p className="text-sm text-muted-foreground">
                  {debtor?.address}
                </p>
              )}
              {debtor?.phone && (
                <p className="text-sm text-muted-foreground">{debtor?.phone}</p>
              )}
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Date:</span>
                  <span>{format(new Date(), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{format(new Date(dueDate), "MMMM d, yyyy")}</span>
                </div>
              </div>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Item</th>
                <th className="py-2 text-right">Quantity</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {unpaidPurchases.map((purchase) => (
                <tr key={purchase.id} className="border-b">
                  <td className="py-2">{purchase.item}</td>
                  <td className="py-2 text-right">{purchase.quantity}</td>
                  <td className="py-2 text-right">
                    {formatCurrency(Number(purchase.price))}
                  </td>
                  <td className="py-2 text-right">
                    {formatCurrency(Number(purchase.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <div className="w-1/2 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>{formatCurrency(Number(totalDue))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Paid:</span>
                <span>- {formatCurrency(Number(totalPayments))}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Due:</span>
                <span>{formatCurrency(totalDue)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 print:mt-6">
            <h3 className="font-semibold mb-1">Notes:</h3>
            <p className="text-muted-foreground">{notes}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center border-t pt-3">
          <p className="text-sm text-muted-foreground mb-2">
            Thank you for your patronage!
          </p>
          <div className="print-watermark text-xs text-muted-foreground">
            Powered by BizManager.Africa
          </div>
        </CardFooter>
      </Card>

      <div className="flex justify-end gap-2 print:hidden print-buttons">
        {/* <Button variant="outline" onClick={handlePrintInvoice}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button> */}
        <Button onClick={handleDownloadInvoice}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        {/* <Button onClick={handleSendInvoice}>
          <Send className="mr-2 h-4 w-4" />
          Send Invoice
        </Button> */}
      </div>

      <Toaster />
    </div>
  );
}
