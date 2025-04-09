"use client";

import type React from "react";

import { useState } from "react";
import { SaleInsert, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export function SalesForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addSale } = useStore();
  const isMobile = useIsMobile();
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
    date: new Date().toISOString().split("T")[0] as string,
  });
  const auth = useAuth();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = formData.quantity * formData.price;

    addSale({
      id: Date.now().toString(),
      item: formData.item,
      quantity: formData.quantity,
      price: formData.price + "",
      amount: amount + "",
      paymentType: formData.paymentType,
      date: new Date(formData.date).toISOString() as unknown as Date,
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
      date: new Date().toISOString().split("T")[0],
    });
    onOpenChange(false);
  };
  const FormComp = (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
        <Label htmlFor="date">Date</Label>

        <Calendar
          mode="single"
          required
          id="date"
          selected={new Date(formData.date)}
          onSelect={(date) => setFormData({ ...formData, date: date as Date })}
          className="rounded-md border"
        />
      </div>
      {isMobile ? (
        <DrawerFooter className="pt-4">
          <Button type="submit">Add Sale</Button>
        </DrawerFooter>
      ) : (
        <DialogFooter className="pt-4">
          <Button type="submit">Add Sale</Button>
        </DialogFooter>
      )}
    </form>
  );
  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
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
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
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
