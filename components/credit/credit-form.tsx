"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CreditForm({
  open,
  onOpenChange,
  defaultDebtorId = "",
  defaultDebtorName = "",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDebtorId?: string
  defaultDebtorName?: string
}) {
  const { addCredit, debtors } = useStore()
  const [activeTab, setActiveTab] = useState<"purchase" | "payment">("purchase")

  const [purchaseData, setPurchaseData] = useState({
    debtorId: defaultDebtorId,
    debtorName: defaultDebtorName,
    item: "",
    quantity: 1,
    price: 0,
    date: new Date().toISOString().split("T")[0],
  })

  const [paymentData, setPaymentData] = useState({
    debtorId: defaultDebtorId,
    debtorName: defaultDebtorName,
    amount: 0,
    paymentType: "cash",
    date: new Date().toISOString().split("T")[0],
  })

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amount = purchaseData.quantity * purchaseData.price

    addCredit({
      id: Date.now().toString(),
      debtorId: purchaseData.debtorId || Date.now().toString(),
      debtorName: purchaseData.debtorName,
      type: "purchase",
      item: purchaseData.item,
      quantity: purchaseData.quantity,
      price: purchaseData.price,
      amount,
      date: new Date(purchaseData.date).toISOString(),
    })

    // Reset form and close sheet
    setPurchaseData({
      debtorId: "",
      debtorName: "",
      item: "",
      quantity: 1,
      price: 0,
      date: new Date().toISOString().split("T")[0],
    })
    onOpenChange(false)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    addCredit({
      id: Date.now().toString(),
      debtorId: paymentData.debtorId || Date.now().toString(),
      debtorName: paymentData.debtorName,
      type: "payment",
      amount: paymentData.amount,
      paymentType: paymentData.paymentType,
      date: new Date(paymentData.date).toISOString(),
    })

    // Reset form and close sheet
    setPaymentData({
      debtorId: "",
      debtorName: "",
      amount: 0,
      paymentType: "cash",
      date: new Date().toISOString().split("T")[0],
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Manage Credit</SheetTitle>
          <SheetDescription>Add a new purchase on credit or record a payment.</SheetDescription>
        </SheetHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "purchase" | "payment")}
          className="mt-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="purchase">
            <form onSubmit={handlePurchaseSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="debtorName">Debtor Name</Label>
                <Input
                  id="debtorName"
                  placeholder="Enter debtor name"
                  value={purchaseData.debtorName}
                  onChange={(e) => setPurchaseData({ ...purchaseData, debtorName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item">Item Name</Label>
                <Input
                  id="item"
                  placeholder="Enter item name"
                  value={purchaseData.item}
                  onChange={(e) => setPurchaseData({ ...purchaseData, item: e.target.value })}
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
                    value={purchaseData.quantity}
                    onChange={(e) =>
                      setPurchaseData({ ...purchaseData, quantity: Number.parseInt(e.target.value) || 1 })
                    }
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
                    value={purchaseData.price}
                    onChange={(e) =>
                      setPurchaseData({ ...purchaseData, price: Number.parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={purchaseData.date}
                  onChange={(e) => setPurchaseData({ ...purchaseData, date: e.target.value })}
                  required
                />
              </div>

              <SheetFooter className="pt-4">
                <Button type="submit">Add Purchase</Button>
              </SheetFooter>
            </form>
          </TabsContent>

          <TabsContent value="payment">
            <form onSubmit={handlePaymentSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="paymentDebtorName">Debtor Name</Label>
                {defaultDebtorId ? (
                  <Input id="paymentDebtorName" value={paymentData.debtorName} disabled />
                ) : (
                  <Select
                    value={paymentData.debtorId}
                    onValueChange={(value) => {
                      const debtor = debtors.find((d) => d.id === value)
                      setPaymentData({
                        ...paymentData,
                        debtorId: value,
                        debtorName: debtor?.name || "",
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select debtor" />
                    </SelectTrigger>
                    <SelectContent>
                      {debtors.map((debtor) => (
                        <SelectItem key={debtor.id} value={debtor.id}>
                          {debtor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select
                  value={paymentData.paymentType}
                  onValueChange={(value) => setPaymentData({ ...paymentData, paymentType: value })}
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
                <Label htmlFor="paymentDate">Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentData.date}
                  onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                  required
                />
              </div>

              <SheetFooter className="pt-4">
                <Button type="submit">Record Payment</Button>
              </SheetFooter>
            </form>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

