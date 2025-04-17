"use client";

import { useRef, useState, useCallback, memo, useEffect } from "react";
import { SaleInsert, SaleSelect, useStore } from "@/lib/store";
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
import { cn, formatPrice, generateUUID, getCurrentDateTime } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DrawerOrModal } from "../ui/drawer-or-modal";
import { DatePickerField } from "../ui/date-picker";
import CustomNumberInput from "../ui/custom-number-input";

// Types for form data
interface SalesFormData {
  id?: string;
  item?: string;
  quantity: number;
  price: string;
  paymentType: SaleInsert["paymentType"];
  measurementUnit: SaleInsert["measurementUnit"];
  date: Date | string;
  profit: string;
  amount: string;
}

// Types for form props
interface SalesFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date | string;
  initialData?: Partial<SaleInsert>;
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
        placeholder="What did you sell"
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
  }) => {
    const units = [
      {
        name: "Kilogram",
        value: "kg",
      },
      {
        name: "Gram",
        value: "g",
      },
      {
        name: "Liter",
        value: "ltr",
      },
      { name: "Pieces", value: "pcs" },
      {
        name: "Packs",
        value: "pks",
      },
      {
        name: "Bags",
        value: "bg",
      },
      {
        name: "Dozens",
        value: "dz",
      },
    ];
    return (
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <CustomNumberInput
            inputId="quantity"
            placeholder="Quantity"
            enableFormatting={false}
            allowDecimal={false}
            value={quantity + ""}
            minValue={1}
            onValueChange={(val) => onQuantityChange(parseInt(val, 10))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="measurementUnit">Unit</Label>
          <Select
            value={measurementUnit as string}
            onValueChange={onUnitChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => {
                return (
                  <SelectItem value={unit.value} key={unit.value}>
                    {unit.name}
                    {`(${unit.value})`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
);
QuantityUnitField.displayName = "QuantityUnitField";

const NumberField = memo(
  ({
    value,
    onChange,
    label,
    id,
  }: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    id: string;
  }) => (
    <div className="space-y-2 col-span-1">
      <Label htmlFor={id}>{label}</Label>
      {/* <Input
        id={id}
        type="number"
        min="0"
        step="5"
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
        required
      />{" "} */}
      <CustomNumberInput
        inputId={id}
        enableFormatting
        placeholder="0.00"
        allowDecimal
        value={value}
        minValue={0}
        onValueChange={(val) =>
          onChange(
            formatPrice(val, undefined, {
              formatted: false,
            })
          )
        }
      />
    </div>
  )
);
NumberField.displayName = "NumberField";

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
          <SelectItem value="pos">POS (card)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
);
PaymentTypeField.displayName = "PaymentTypeField";

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
export function SalesForm({
  open,
  onOpenChange,
  defaultDate,
  initialData,
}: SalesFormProps) {
  const { addSale, editSale } = useStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const auth = useAuth();

  // State management
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SalesFormData | SaleSelect>({
    item: "",

    ...({
      ...initialData,
      measurementUnit: initialData?.measurementUnit || "pcs",
      paymentType: initialData?.paymentType || "transfer",
      // Set default date to today if no initial data is provided
      date: defaultDate ? new Date(defaultDate) : new Date(),
      quantity: initialData?.quantity || 1,
      price: initialData?.price || "",
      profit: initialData?.profit || "",
      amount: initialData?.amount || "",
    } as SalesFormData),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        quantity: initialData?.quantity || 1,
        price: initialData?.price || 0,
        profit: initialData?.profit || "",
        amount: initialData?.amount || "",
      } as SalesFormData);
    }
  }, [initialData]);
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

      const amount =
        formData?.quantity &&
        formData.quantity * parseInt(formData.price as string);
      const currentDate = getCurrentDateTime(formData.date as Date);

      if (initialData) {
        await editSale(formData.id as string, {
          ...formData,
          date: currentDate,
          price: formData.price + "",
          profit: formData.profit + "",
          amount: amount + "",
          userId: auth?.user?.id as string,
        });
      } else {
        await addSale({
          id: generateUUID(),
          item: formData.item as string,
          quantity: formData.quantity as number,
          price: formData.price + "",
          profit: formData.profit + "",
          amount: amount + "",
          paymentType: formData.paymentType as SaleInsert["paymentType"],
          date: currentDate,
          measurementUnit: formData.measurementUnit,
          userId: auth?.user?.id as string,
        });
      }

      // Reset form and close sheet
      setFormData({
        item: "",
        quantity: 1,
        price: "",
        paymentType: "transfer",
        measurementUnit: "pcs",
        profit: "",
        amount: "",
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
  const AddButton = ({ isAdding }: { isAdding: boolean }) => (
    <Button
      type="submit"
      form="sales-add-form"
      className="flex items-center"
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
          {initialData ? "Saving..." : "Adding..."}
        </>
      ) : initialData ? (
        "Save Sale"
      ) : (
        "Add Sale"
      )}
    </Button>
  );

  // Form content
  const FormContent = (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 py-4"
      id="sales-add-form"
    >
      <ErrorAlert message={error} />

      <ItemNameField
        value={formData.item || ""}
        onChange={(value) => updateField("item", value)}
      />

      <div className="flex items-center gap-4 max-sm:flex-wrap">
        <QuantityUnitField
          quantity={formData.quantity as number}
          measurementUnit={formData.measurementUnit}
          onQuantityChange={(value) => {
            updateField("quantity", value);
            updateField(
              "amount",
              formatPrice(value * parseFloat(formData.price), undefined, {
                formatted: false,
              })
            );
          }}
          onUnitChange={(value) => updateField("measurementUnit", value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <NumberField
          value={formData.price}
          id="price"
          label="Price per Unit"
          onChange={(value) => {
            updateField("price", value);
            updateField(
              "amount",
              formatPrice(
                parseFloat(value) * parseFloat(formData.price),
                undefined,
                {
                  formatted: false,
                  addDecimals: false,
                }
              )
            );
          }}
        />
        <NumberField
          value={formData.profit}
          id="profit"
          label="Profit Made"
          onChange={(value) => updateField("profit", value)}
        />
        <NumberField
          value={formData.profit}
          id="amount"
          label="Total Amount"
          onChange={(value) => {
            updateField("amount", value);
            updateField(
              "price",
              formatPrice(
                Math.abs(parseFloat(value) / formData.quantity),
                undefined,
                {
                  formatted: false,
                }
              )
            );
          }}
        />
      </div>

      <PaymentTypeField
        value={formData.paymentType!}
        onChange={(value) => updateField("paymentType", value)}
      />

      <DatePickerField
        date={formData.date!}
        onDateChange={(date) => updateField("date", date)}
      />
    </form>
  );
  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    setFormData({
      item: "",
      quantity: 1,
      price: "",
      paymentType: "transfer",
      measurementUnit: "pcs",
      profit: "",
      amount: "",
      date: defaultDate ? new Date(defaultDate) : new Date(),
    });
  }
  // Render responsive layout based on device type
  return (
    <>
      <DrawerOrModal
        description=" Enter the details of the item sold."
        title="Add New Sale"
        open={open}
        onOpenChange={handleOpenChange}
        footer={<AddButton isAdding={isAdding} />}
      >
        {FormContent}
      </DrawerOrModal>
    </>
  );
}
