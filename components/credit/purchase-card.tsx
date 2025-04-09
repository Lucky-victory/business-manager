// components/credit/purchase-card.tsx
"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

type PurchaseCardProps = {
  purchase: any;
  isSelected: boolean;
  showCheckbox: boolean;
  onCheckboxChange: (id: string, checked: boolean) => void;
  onMarkAsPaid: (id: string, isPaid: boolean) => void;
};

export function PurchaseCard({
  purchase,
  isSelected,
  showCheckbox,
  onCheckboxChange,
  onMarkAsPaid,
}: PurchaseCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {showCheckbox && (
              <Checkbox
                id={`select-${purchase.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  onCheckboxChange(purchase.id, !!checked);
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
                e.stopPropagation();
                onMarkAsPaid(purchase.id, true);
              }}
            >
              Mark as Paid
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsPaid(purchase.id, false);
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
            <p className="font-medium">
              ₦
              {parseInt(
                purchase.price ? purchase?.price + "" : "0",
                10
              ).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-medium">
              ₦
              {parseInt(
                purchase.amount ? purchase?.amount + "" : "0",
                10
              ).toFixed(2)}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">
              {format(new Date(purchase.date), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
