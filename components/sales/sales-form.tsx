"use client";

import type React from "react";

import { useRef, useState } from "react";
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

export function SalesForm({
  open,
  onOpenChange,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date | string;
}) {
  const { addSale } = useStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    item: string;
    quantity: number;
    price: number;
    paymentType: SaleInsert["paymentType"];
    measurementUnit: SaleInsert["measurementUnit"];
    date: Date | string;
  }>({
    item: "",
    quantity: 1,
    price: 0,
    paymentType: "cash",
    measurementUnit: "pcs",
    date: defaultDate ? new Date(defaultDate) : new Date(),
  });
  console.log({
    defaultDate,
    date: formData.date,
  });

  const auth = useAuth();
  const popoverTriggerBtnRef = useRef<HTMLButtonElement | null>(null);
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
  const AddButton = (
    <Button
      type="submit"
      className={cn("flex items-center")}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
        </>
      ) : (
        "Add Sale"
      )}
    </Button>
  );
  const FormComp = (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="item">Item Name</Label>
        <Input
          id="item"
          placeholder="Enter item name"
          value={formData.item}
          onChange={(e) => setFormData({ ...formData, item: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center gap-4 max-sm:flex-wrap">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: Number.parseInt(e.target.value) || 1,
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurementUnit">Unit</Label>
            <Select
              value={formData.measurementUnit as string}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  measurementUnit: value as typeof formData.measurementUnit,
                })
              }
            >
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

        <div className="space-y-2 col-span-1">
          <Label htmlFor="price">Price per Unit</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="50"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: Number.parseFloat(e.target.value) || 0,
              })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentType">Payment Type</Label>
        <Select
          value={formData.paymentType}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              paymentType: value as SaleInsert["paymentType"],
            })
          }
        >
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

      <div className="space-y-2">
        <Popover modal={false}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              ref={popoverTriggerBtnRef}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !formData.date && "text-muted-foreground"
              )}
            >
              {formData.date ? (
                format(formData.date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              required
              id="date"
              selected={new Date(formData.date)}
              onSelect={(date) => {
                if (date) setFormData({ ...formData, date });

                popoverTriggerBtnRef.current?.click();
              }}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
      {isMobile ? (
        <DrawerFooter className="pt-4">{AddButton}</DrawerFooter>
      ) : (
        <DialogFooter className="pt-4">{AddButton}</DialogFooter>
      )}
    </form>
  );
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
            <div className="px-4">{FormComp}</div>
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
            <div className="px-4">{FormComp}</div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
