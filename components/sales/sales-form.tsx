"use client";

import { useRef, useState, useCallback, memo } from "react";
import { SaleInsert, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn, generateUUID } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Types for form data
interface SalesFormData {
  item: string;
  quantity: number;
  price: number;
  paymentType: SaleInsert["paymentType"];
  measurementUnit: SaleInsert["measurementUnit"];
  date: Date | string;
}

// Types for form props
interface SalesFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date | string;
}

// Memoized Form Field Components to prevent unnecessary re-renders
const ItemNameField = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-2">
      <Label htmlFor="item">Item Name</Label>
      <Input
        id="item"
        placeholder="Enter item name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  )
);
ItemNameField.displayName = "ItemNameField";

const QuantityUnitField = memo(
  ({
    quantity,
    measurementUnit,
    onQuantityChange,
    onUnitChange,
  }: {
    quantity: number;
    measurementUnit: SaleInsert["measurementUnit"];
    onQuantityChange: (value: number) => void;
    onUnitChange: (value: string) => void;
  }) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) =>
            onQuantityChange(Number.parseInt(e.target.value) || 1)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="measurementUnit">Unit</Label>
        <Select value={measurementUnit as string} onValueChange={onUnitChange}>
          <SelectTrigger>
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pcs">pcs</SelectItem>
            <SelectItem value="set">set</SelectItem>
            <SelectItem value="kg">kg</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
);
QuantityUnitField.displayName = "QuantityUnitField";

const PriceField = memo(
  ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => (
    <div className="space-y-2 col-span-1">
      <Label htmlFor="price">Price per Unit</Label>
      <Input
        id="price"
        type="number"
        min="0"
        step="5"
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
        required
      />
    </div>
  )
);
PriceField.displayName = "PriceField";

const PaymentTypeField = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-2">
      <Label htmlFor="paymentType">Payment Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select payment type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cash">Cash</SelectItem>
          <SelectItem value="transfer">Bank Transfer</SelectItem>
          <SelectItem value="pos">POS</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
);
PaymentTypeField.displayName = "PaymentTypeField";

const DatePickerField = memo(
  ({
    date,
    onDateChange,
  }: {
    date: Date | string;
    onDateChange: (date: Date) => void;
  }) => {
    const popoverTriggerBtnRef = useRef<HTMLButtonElement | null>(null);

    return (
      <div className="space-y-2">
        <Popover modal={false}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              ref={popoverTriggerBtnRef}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              required
              id="date"
              selected={new Date(date)}
              onSelect={(selectedDate) => {
                if (selectedDate) onDateChange(selectedDate);
                popoverTriggerBtnRef.current?.click();
              }}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
DatePickerField.displayName = "DatePickerField";

const ErrorAlert = memo(({ message }: { message: string | null }) => {
  if (!message) return null;

  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
});
ErrorAlert.displayName = "ErrorAlert";

// Main SalesForm component
export function SalesForm({ open, onOpenChange, defaultDate }: SalesFormProps) {
  const { addSale } = useStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const auth = useAuth();

  // State management
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SalesFormData>({
    item: "",
    quantity: 1,
    price: 0,
    paymentType: "transfer",
    measurementUnit: "pcs",
    date: defaultDate ? new Date(defaultDate) : new Date(),
    profit: 0,
  });

  // Memoized field update handlers
  const updateField = useCallback((field: keyof SalesFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsAdding(true);

      const amount = formData.quantity * formData.price;
      const currentDate = new Date(formData.date);
      const now = new Date();
      currentDate.setHours(now.getHours());
      currentDate.setMinutes(now.getMinutes());
      currentDate.setSeconds(now.getSeconds());
      currentDate.setMilliseconds(now.getMilliseconds());

      await addSale({
        id: generateUUID(),
        item: formData.item,
        quantity: formData.quantity,
        price: formData.price + "",
        amount: amount + "",
        paymentType: formData.paymentType,
        date: currentDate,
        measurementUnit: formData.measurementUnit,
        userId: auth?.user?.id as string,
      });

      // Reset form and close sheet
      setFormData({
        item: "",
        quantity: 1,
        price: 0,
        paymentType: "transfer",
        measurementUnit: "pcs",
        date: defaultDate ? new Date(defaultDate) : new Date(),
      });

      toast({
        title: "Success",
        description: "Sale has been added successfully.",
      });

      setIsAdding(false);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add sale. Please try again.";

      setError(errorMessage);

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });

      setIsAdding(false);
    }
  };

  // Memoized add button component
  const AddButton = (
    <Button type="submit" className="flex items-center" disabled={isAdding}>
      {isAdding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
        </>
      ) : (
        "Add Sale"
      )}
    </Button>
  );

  // Form content
  const FormContent = (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <ErrorAlert message={error} />

      <ItemNameField
        value={formData.item}
        onChange={(value) => updateField("item", value)}
      />

      <div className="flex items-center gap-4 max-sm:flex-wrap">
        <QuantityUnitField
          quantity={formData.quantity}
          measurementUnit={formData.measurementUnit}
          onQuantityChange={(value) => updateField("quantity", value)}
          onUnitChange={(value) => updateField("measurementUnit", value)}
        />

        <PriceField
          value={formData.price}
          onChange={(value) => updateField("price", value)}
        />
        <PriceField
          value={formData.profit}
          onChange={(value) => updateField("profit", value)}
        />
      </div>

      <PaymentTypeField
        value={formData.paymentType}
        onChange={(value) => updateField("paymentType", value)}
      />

      <DatePickerField
        date={formData.date}
        onDateChange={(date) => updateField("date", date)}
      />

      {isMobile ? (
        <DrawerFooter className="pt-4">{AddButton}</DrawerFooter>
      ) : (
        <DialogFooter className="pt-4">{AddButton}</DialogFooter>
      )}
    </form>
  );

  // Render responsive layout based on device type
  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange} modal={true}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add New Sale</DrawerTitle>
              <DrawerDescription>
                Enter the details of the item sold.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">{FormContent}</div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
          <DialogContent className="pointer-events-auto">
            <DialogHeader>
              <DialogTitle>Add New Sale</DialogTitle>
              <DialogDescription>
                Enter the details of the item sold.
              </DialogDescription>
            </DialogHeader>
            <div className="px-4">{FormContent}</div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
