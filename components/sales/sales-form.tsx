"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SalesForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { addSale } = useStore()
  const [formData, setFormData] = useState({
    item: "",
    quantity: 1,
    price: 0,
    paymentType: "cash",
    date: new Date().toISOString().split("T")[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amount = formData.quantity * formData.price

    addSale({
      id: Date.now().toString(),
      item: formData.item,
      quantity: formData.quantity,
      price: formData.price,
      amount,
      paymentType: formData.paymentType,
      date: new Date(formData.date).toISOString(),
    })

    // Reset form and close sheet
    setFormData({
      item: "",
      quantity: 1,
      price: 0,
      paymentType: "cash",
      date: new Date().toISOString().split("T")[0],
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add New Sale</SheetTitle>
          <SheetDescription>Enter the details of the item sold.</SheetDescription>
        </SheetHeader>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Unit</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentType">Payment Type</Label>
            <Select
              value={formData.paymentType}
              onValueChange={(value) => setFormData({ ...formData, paymentType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="transfer">Bank Transfer</SelectItem>
                <SelectItem value="pos">POS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <SheetFooter className="pt-4">
            <Button type="submit">Add Sale</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

