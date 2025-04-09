// components/credit/purchases-tab.tsx
"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PurchaseCard } from "./purchase-card";

type PurchasesTabProps = {
  purchases: any[];
  activeTab: string;
};

export function PurchasesTab({ purchases, activeTab }: PurchasesTabProps) {
  const { updateCreditStatus, updateMultipleCreditStatus } = useStore();
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Apply status filter to purchases
  let filteredPurchases = purchases;
  if (statusFilter === "paid") {
    filteredPurchases = purchases.filter((purchase) => purchase.isPaid);
  } else if (statusFilter === "unpaid") {
    filteredPurchases = purchases.filter((purchase) => !purchase.isPaid);
  }

  // Handle marking items as paid
  const handleMarkAsPaid = async (creditId: string, isPaid: boolean) => {
    await updateCreditStatus(creditId, isPaid);
    toast({
      title: isPaid ? "Marked as paid" : "Marked as unpaid",
      description: `Item has been ${
        isPaid ? "marked as paid" : "marked as unpaid"
      }.`,
    });
  };

  // Handle marking multiple items as paid
  const handleMarkMultipleAsPaid = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to mark as paid.",
        variant: "destructive",
      });
      return;
    }

    await updateMultipleCreditStatus(selectedItems, true);
    setSelectedItems([]);
    setSelectAll(false);
    toast({
      title: "Items marked as paid",
      description: `${selectedItems.length} items have been marked as paid.`,
    });
  };

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      // Only update selectedItems if they're different from what they should be
      const unpaidItemIds = filteredPurchases
        .filter((p) => !p.isPaid)
        .map((p) => p.id);
      const allSelected = unpaidItemIds.every((id) =>
        selectedItems.includes(id)
      );
      const hasExtra = selectedItems.some((id) => !unpaidItemIds.includes(id));

      if (!allSelected || hasExtra) {
        setSelectedItems(unpaidItemIds);
      }
    } else {
      // Only update selectAll if all items are selected and selectAll is false
      const unpaidCount = filteredPurchases.filter((p) => !p.isPaid).length;
      if (
        unpaidCount > 0 &&
        selectedItems.length === unpaidCount &&
        !selectAll
      ) {
        setSelectAll(true);
      }
    }
  }, [selectAll, filteredPurchases, selectedItems]);

  // Handle individual checkbox change
  const handleCheckboxChange = (creditId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, creditId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== creditId));
      setSelectAll(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <Select
          value={statusFilter}
          onValueChange={(value: "all" | "paid" | "unpaid") =>
            setStatusFilter(value)
          }
        >
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

      {activeTab === "purchases" && statusFilter === "unpaid" && (
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="selectAll"
            checked={selectAll}
            onCheckedChange={(checked) => {
              setSelectAll(!!checked);
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

      {filteredPurchases.map((purchase) => (
        <PurchaseCard
          key={purchase.id}
          purchase={purchase}
          isSelected={selectedItems.includes(purchase.id)}
          showCheckbox={statusFilter !== "paid" && !purchase.isPaid}
          onCheckboxChange={handleCheckboxChange}
          onMarkAsPaid={handleMarkAsPaid}
        />
      ))}

      {filteredPurchases.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No purchases found with the selected filter.
        </div>
      )}
    </div>
  );
}
