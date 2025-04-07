"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Plus, Check, FileText } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditForm } from "@/components/credit/credit-form"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function CreditDetailPage({ params }: { params: { debtorId: string } }) {
  const router = useRouter()
  const { credits, fetchCredits, updateCreditStatus, updateMultipleCreditStatus } = useStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"purchases" | "payments">("purchases")
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  // Filter credits for the selected debtor
  const debtorId = params.debtorId
  const debtorCredits = credits.filter((credit) => credit.debtorId === debtorId)

  // Get debtor name
  const debtorName = debtorCredits.length > 0 ? debtorCredits[0].debtorName : "Unknown Debtor"

  // Separate purchases and payments
  const allPurchases = debtorCredits.filter((credit) => credit.type === "purchase")
  const payments = debtorCredits.filter((credit) => credit.type === "payment")

  // Apply status filter to purchases
  let purchases = allPurchases
  if (statusFilter === "paid") {
    purchases = allPurchases.filter((purchase) => purchase.isPaid)
  } else if (statusFilter === "unpaid") {
    purchases = allPurchases.filter((purchase) => !purchase.isPaid)
  }

  // Calculate total amount owed
  const totalPurchases = allPurchases.reduce((sum, purchase) => sum + purchase.amount, 0)
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalOwed = totalPurchases - totalPayments

  // Calculate paid and unpaid amounts
  const paidAmount = allPurchases
    .filter((purchase) => purchase.isPaid)
    .reduce((sum, purchase) => sum + purchase.amount, 0)
  const unpaidAmount = allPurchases
    .filter((purchase) => !purchase.isPaid)
    .reduce((sum, purchase) => sum + purchase.amount, 0)

  // Handle marking items as paid
  const handleMarkAsPaid = async (creditId: string, isPaid: boolean) => {
    await updateCreditStatus(creditId, isPaid)
    toast({
      title: isPaid ? "Marked as paid" : "Marked as unpaid",
      description: `Item has been ${isPaid ? "marked as paid" : "marked as unpaid"}.`,
    })
  }

  // Handle marking multiple items as paid
  const handleMarkMultipleAsPaid = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to mark as paid.",
        variant: "destructive",
      })
      return
    }

    await updateMultipleCreditStatus(selectedItems, true)
    setSelectedItems([])
    setSelectAll(false)
    toast({
      title: "Items marked as paid",
      description: `${selectedItems.length} items have been marked as paid.`,
    })
  }

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedItems(purchases.filter((p) => !p.isPaid).map((p) => p.id))
    } else if (selectedItems.length === purchases.filter((p) => !p.isPaid).length) {
      // If all items are selected but selectAll is false, update it
      setSelectAll(true)
    }
  }, [selectAll, purchases])

  // Handle individual checkbox change
  const handleCheckboxChange = (creditId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, creditId])
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== creditId))
      setSelectAll(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{debtorName}</h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <p className="text-muted-foreground">
            Total Owed:
            <span className={`font-medium ${totalOwed > 0 ? "text-red-500" : "text-green-500"} ml-1`}>
              ${Math.abs(totalOwed).toFixed(2)}
            </span>
          </p>
          <div className="flex gap-4">
            <p className="text-muted-foreground">
              Paid:
              <span className="font-medium text-green-500 ml-1">${paidAmount.toFixed(2)}</span>
            </p>
            <p className="text-muted-foreground">
              Unpaid:
              <span className="font-medium text-red-500 ml-1">${unpaidAmount.toFixed(2)}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => router.push(`/credit/${debtorId}/invoice`)}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "purchases" | "payments")}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {activeTab === "purchases" && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={(value: "all" | "paid" | "unpaid") => setStatusFilter(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="paid">Paid Only</SelectItem>
                  <SelectItem value="unpaid">Unpaid Only</SelectItem>
                </SelectContent>
              </Select>

              {selectedItems.length > 0 && (
                <Button onClick={handleMarkMultipleAsPaid}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark Selected as Paid ({selectedItems.length})
                </Button>
              )}
            </div>
          )}
        </div>

        <TabsContent value="purchases" className="space-y-4">
          {activeTab === "purchases" && statusFilter === "unpaid" && (
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="selectAll"
                checked={selectAll}
                onCheckedChange={(checked) => {
                  setSelectAll(!!checked)
                }}
              />
              <label
                htmlFor="selectAll"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Select All Unpaid Items
              </label>
            </div>
          )}

          {purchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {statusFilter !== "paid" && !purchase.isPaid && (
                      <Checkbox
                        id={`select-${purchase.id}`}
                        checked={selectedItems.includes(purchase.id)}
                        onCheckedChange={(checked) => {
                          handleCheckboxChange(purchase.id, !!checked)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <Badge variant={purchase.isPaid ? "success" : "destructive"}>
                      {purchase.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                    {purchase.isPaid && purchase.paidDate && (
                      <span className="text-xs text-muted-foreground">
                        Paid on {format(new Date(purchase.paidDate), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>

                  {!purchase.isPaid ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsPaid(purchase.id, true)
                      }}
                    >
                      Mark as Paid
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsPaid(purchase.id, false)
                      }}
                    >
                      Mark as Unpaid
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Item</p>
                    <p className="font-medium">{purchase.item}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{purchase.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">${purchase.price?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">${purchase.amount.toFixed(2)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(new Date(purchase.date), "MMMM d, yyyy")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {purchases.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">No purchases found with the selected filter.</div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">${payment.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Type</p>
                    <p className="font-medium capitalize">{payment.paymentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(new Date(payment.date), "MMMM d, yyyy")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {payments.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">No payments recorded for this debtor.</div>
          )}
        </TabsContent>
      </Tabs>

      <CreditForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        defaultDebtorId={debtorId}
        defaultDebtorName={debtorName}
      />

      <Toaster />
    </div>
  )
}

