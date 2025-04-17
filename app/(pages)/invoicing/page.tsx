// InvoiceGenerator.tsx
"use client";

import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { Download, ImageDown, Plus, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
import { DatePickerField } from "@/components/ui/date-picker";
import { generateUUID } from "@/lib/utils";

// A flexible item type that can accommodate any structure
export type DynamicInvoiceItem = {
  id: string;
  [key: string]: any; // This allows any properties to be added
};

export type InvoiceColumnConfig = {
  key: string; // The object key to display in this column
  header: string; // The column header text
  formatter?: (value: any) => string; // Optional formatter function
  alignment?: "left" | "center" | "right"; // Text alignment
  width?: string; // CSS width value
};

export type InvoiceProps = {
  invoiceNumber?: string;
  issueDate?: Date;
  dueDate?: Date;
  notes?: string;

  // Dynamic items configuration
  items: DynamicInvoiceItem[];
  columns: InvoiceColumnConfig[];
  amountKey?: string; // The key in items that contains the amount for calculations

  // Calculation options
  totalPaid?: number;
  tax?: { percentage: number; label: string };
  discount?: { value: number; isPercentage: boolean; label: string };
  additionalFees?: Array<{ label: string; amount: number }>;

  // Display options
  currency?: string;
  currencyPosition?: "prefix" | "suffix";

  // Company (Biller) information
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyLogo?: string;

  // Client information
  clientName: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;

  // Customization options
  showBranding?: boolean;
  brandName?: string;
  primaryColor?: string;
  additionalInfo?: React.ReactNode; // Any additional content to display

  // Allow item editing
  editable?: boolean;

  // Callback functions
  onInvoiceNumberChange?: (value: string) => void;
  onDueDateChange?: (date: Date) => void;
  onNotesChange?: (value: string) => void;
  onItemsChange?: (items: DynamicInvoiceItem[]) => void;
  getSubtotal?: (items: DynamicInvoiceItem[]) => number; // Custom subtotal calculation
};

export const InvoiceGenerator: React.FC<InvoiceProps> = ({
  invoiceNumber = `INV-${generateUUID().slice(-8).toUpperCase()}`,
  issueDate = new Date(),
  dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  notes = "Thank you for your business!",

  items = [],
  columns = [],
  amountKey = "amount",

  totalPaid = 0,
  tax,
  discount,
  additionalFees = [],

  currency = "$",
  currencyPosition = "prefix",

  companyName,
  companyAddress,
  companyPhone,
  companyEmail,
  companyLogo,

  clientName,
  clientAddress,
  clientPhone,
  clientEmail,

  showBranding = true,
  brandName = "Invoice Generator",
  primaryColor = "#0f172a",
  additionalInfo,

  editable = true,

  onInvoiceNumberChange,
  onDueDateChange,
  onNotesChange,
  onItemsChange,
  getSubtotal,
}) => {
  const [localInvoiceNumber, setLocalInvoiceNumber] = useState(invoiceNumber);
  const [localDueDate, setLocalDueDate] = useState(dueDate);
  const [localNotes, setLocalNotes] = useState(notes);
  const [localItems, setLocalItems] = useState<DynamicInvoiceItem[]>(items);

  const invoiceRef = useRef<HTMLDivElement>(null);

  // Calculate subtotal based on amountKey or custom function
  const calculateSubtotal = (): number => {
    if (getSubtotal) {
      return getSubtotal(localItems);
    }

    return localItems.reduce((sum, item) => {
      const amount = parseFloat(item[amountKey] || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  // Calculate tax amount if provided
  const taxAmount = tax ? subtotal * (tax.percentage / 100) : 0;

  // Calculate discount
  const discountAmount = discount
    ? discount.isPercentage
      ? subtotal * (discount.value / 100)
      : discount.value
    : 0;

  // Calculate additional fees total
  const feesTotal = additionalFees.reduce((sum, fee) => sum + fee.amount, 0);

  // Calculate grand total
  const grandTotal = subtotal + taxAmount - discountAmount + feesTotal;

  // Calculate total due
  const totalDue = Math.max(0, grandTotal - totalPaid);

  // Format currency function
  const formatCurrency = (value: number): string => {
    const formattedValue = value.toFixed(2);
    return currencyPosition === "prefix"
      ? `${currency}${formattedValue}`
      : `${formattedValue} ${currency}`;
  };

  const handleInvoiceNumberChange = (value: string) => {
    setLocalInvoiceNumber(value);
    if (onInvoiceNumberChange) {
      onInvoiceNumberChange(value);
    }
  };

  const handleDueDateChange = (date: Date) => {
    setLocalDueDate(date);
    if (onDueDateChange) {
      onDueDateChange(date);
    }
  };

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
    if (onNotesChange) {
      onNotesChange(value);
    }
  };

  const handleItemsChange = (updatedItems: DynamicInvoiceItem[]) => {
    setLocalItems(updatedItems);
    if (onItemsChange) {
      onItemsChange(updatedItems);
    }
  };

  const addNewItem = () => {
    // Create empty item with default values for all columns
    const newItem: DynamicInvoiceItem = { id: generateUUID() };

    // Set default values for all columns
    columns.forEach((col) => {
      // For numeric fields, start with 0 or 1 (quantity)
      if (col.key === "quantity") {
        newItem[col.key] = 1;
      } else if (col.key === "price" || col.key === amountKey) {
        newItem[col.key] = 0;
      } else {
        newItem[col.key] = "";
      }
    });

    const updatedItems = [...localItems, newItem];
    handleItemsChange(updatedItems);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = localItems.filter((item) => item.id !== itemId);
    handleItemsChange(updatedItems);
  };

  const updateItemField = (itemId: string, field: string, value: any) => {
    const updatedItems = localItems.map((item) => {
      if (item.id === itemId) {
        // Special handling for automatic amount calculation if price and quantity are present
        const updatedItem = { ...item, [field]: value };

        if (
          (field === "price" || field === "quantity") &&
          updatedItem.price !== undefined &&
          updatedItem.quantity !== undefined
        ) {
          // Auto-calculate amount if both price and quantity exist
          const price = parseFloat(updatedItem.price);
          const quantity = parseFloat(updatedItem.quantity);

          if (!isNaN(price) && !isNaN(quantity)) {
            updatedItem[amountKey] = price * quantity;
          }
        }

        return updatedItem;
      }
      return item;
    });

    handleItemsChange(updatedItems);
  };

  const captureInvoice = async () => {
    if (!invoiceRef.current) return null;

    try {
      // Hide buttons during capture
      const printButtons = document.querySelector(".invoice-actions");
      if (printButtons) {
        printButtons.classList.add("hidden");
      }

      // Capture the invoice element as an image with high quality
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 0, // No timeout for image loading
        allowTaint: false,
        removeContainer: true,
      });

      // Show buttons again
      if (printButtons) {
        printButtons.classList.remove("hidden");
      }

      return canvas;
    } catch (error) {
      console.error("Error capturing invoice:", error);

      // Show buttons again in case of error
      const printButtons = document.querySelector(".invoice-actions");
      if (printButtons) {
        printButtons.classList.remove("hidden");
      }

      return null;
    }
  };

  const handleDownloadAsImage = async () => {
    try {
      toast({
        title: "Generating Image",
        description: "Please wait while we generate your invoice image...",
      });

      const canvas = await captureInvoice();
      if (!canvas) {
        throw new Error("Failed to capture invoice");
      }

      // Create a lossless PNG with maximum quality
      const imgData = canvas.toDataURL("image/png", 1.0);

      // Create a download link
      const link = document.createElement("a");
      link.download = `Invoice-${localInvoiceNumber}.png`;
      link.href = imgData;
      link.click();

      toast({
        title: "Invoice downloaded",
        description: "Invoice has been downloaded as an image.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your invoice...",
      });

      const canvas = await captureInvoice();
      if (!canvas) {
        throw new Error("Failed to capture invoice");
      }

      // Calculate PDF dimensions (A4 format)
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF with compression options
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Handle multi-page if content is longer than a single page
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      // Add first page
      pdf.addImage(
        canvas,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        `invoice-${pageNumber}`,
        "FAST" // Use fast compression
      );
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = -pageHeight * pageNumber;
        pageNumber++;
        pdf.addPage();
        pdf.addImage(
          canvas,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          `invoice-${pageNumber}`,
          "FAST"
        );
        heightLeft -= pageHeight;
      }

      // Save PDF with lossless compression
      pdf.save(`Invoice-${localInvoiceNumber}.pdf`);

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
    }
  };

  return (
    <div className="invoice-container">
      <div className="invoice-editor print:hidden mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={localInvoiceNumber}
              onChange={(e) => handleInvoiceNumberChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <DatePickerField
              date={localDueDate.toISOString()}
              minDate={new Date()}
              onDateChange={(date) => handleDueDateChange(new Date(date))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={localNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={3}
          />
        </div>

        {editable && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Invoice Items</Label>
              <Button size="sm" variant="outline" onClick={addNewItem}>
                <Plus className="mr-1 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="border rounded-md p-4 space-y-4">
              {localItems.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No items added yet. Click "Add Item" to create a new invoice
                  item.
                </div>
              ) : (
                localItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    {columns.map((col) => (
                      <div key={col.key} className="space-y-1">
                        <Label htmlFor={`${item.id}-${col.key}`}>
                          {col.header}
                        </Label>
                        <Input
                          id={`${item.id}-${col.key}`}
                          value={item[col.key] || ""}
                          type={
                            col.key === "price" ||
                            col.key === "quantity" ||
                            col.key === amountKey
                              ? "number"
                              : "text"
                          }
                          min={col.key === "quantity" ? "1" : "0"}
                          step={
                            col.key === "price" || col.key === amountKey
                              ? "0.01"
                              : "1"
                          }
                          onChange={(e) =>
                            updateItemField(
                              item.id,
                              col.key,
                              col.key === "price" ||
                                col.key === "quantity" ||
                                col.key === amountKey
                                ? parseFloat(e.target.value)
                                : e.target.value
                            )
                          }
                          disabled={
                            col.key === amountKey &&
                            item.price !== undefined &&
                            item.quantity !== undefined
                          }
                        />
                      </div>
                    ))}
                    <div className="flex justify-end items-end">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Card
        className="mb-6 print:shadow-none print:border-none"
        ref={invoiceRef}
        style={
          {
            "--primary-color": primaryColor,
          } as React.CSSProperties
        }
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">INVOICE</CardTitle>
            <p className="text-muted-foreground">{localInvoiceNumber}</p>
          </div>
          <div className="text-right">
            {companyLogo && (
              <img
                src={companyLogo}
                alt="Company Logo"
                className="h-12 mb-2 ml-auto"
              />
            )}
            {companyName && <p className="font-bold">{companyName}</p>}
            {companyAddress && (
              <p className="text-sm text-muted-foreground">{companyAddress}</p>
            )}
            {companyPhone && (
              <p className="text-sm text-muted-foreground">{companyPhone}</p>
            )}
            {companyEmail && (
              <p className="text-sm text-muted-foreground">{companyEmail}</p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 print:gap-2 mb-6">
            <div>
              <h3 className="font-semibold mb-1">Bill To:</h3>
              <p>{clientName}</p>
              {clientAddress && (
                <p className="text-sm text-muted-foreground">{clientAddress}</p>
              )}
              {clientPhone && (
                <p className="text-sm text-muted-foreground">{clientPhone}</p>
              )}
              {clientEmail && (
                <p className="text-sm text-muted-foreground">{clientEmail}</p>
              )}
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Date:</span>
                  <span>{format(issueDate, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{format(localDueDate, "MMMM d, yyyy")}</span>
                </div>
              </div>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-2 text-${col.alignment || "left"}`}
                    style={{ width: col.width }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {localItems.map((item) => (
                <tr key={item.id} className="border-b">
                  {columns.map((col) => {
                    const value = item[col.key];
                    const displayValue = col.formatter
                      ? col.formatter(value)
                      : col.key === "price" || col.key === amountKey
                      ? formatCurrency(parseFloat(value) || 0)
                      : value;

                    return (
                      <td
                        key={`${item.id}-${col.key}`}
                        className={`py-2 text-${col.alignment || "left"}`}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <div className="w-1/2 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {tax && (
                <div className="flex justify-between">
                  <span className="font-medium">
                    {tax.label || `Tax (${tax.percentage}%)`}:
                  </span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
              )}

              {discount && discount.value > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">
                    {discount.label ||
                      `Discount ${
                        discount.isPercentage ? `(${discount.value}%)` : ""
                      }`}
                    :
                  </span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}

              {additionalFees.map((fee, index) => (
                <div key={index} className="flex justify-between">
                  <span className="font-medium">{fee.label}:</span>
                  <span>{formatCurrency(fee.amount)}</span>
                </div>
              ))}

              {totalPaid > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Paid:</span>
                  <span>- {formatCurrency(totalPaid)}</span>
                </div>
              )}

              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Due:</span>
                <span>{formatCurrency(totalDue)}</span>
              </div>
            </div>
          </div>

          {additionalInfo && <div className="mt-6">{additionalInfo}</div>}

          <div className="mt-8 print:mt-6">
            <h3 className="font-semibold mb-1">Notes:</h3>
            <p className="text-muted-foreground">{localNotes}</p>
          </div>
        </CardContent>
        {showBranding && (
          <CardFooter className="flex flex-col items-center border-t pt-3">
            <p className="text-sm text-muted-foreground mb-2">
              Thank you for your patronage!
            </p>
            <div className="print-watermark text-xs text-muted-foreground">
              Powered by {brandName}
            </div>
          </CardFooter>
        )}
      </Card>

      <div className="flex justify-end gap-2 print:hidden invoice-actions">
        <Button variant="outline" onClick={handleDownloadAsImage}>
          Download Image
          <ImageDown className="ml-2 h-4 w-4" />
        </Button>

        <Button onClick={handleDownloadPDF}>
          Download PDF
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Toaster />
    </div>
  );
};
export default InvoiceGenerator;
