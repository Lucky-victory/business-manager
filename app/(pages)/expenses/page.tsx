"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { ExpensesList } from "@/components/expenses/expenses-list";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function ExpensesPage() {
  const { fetchExpenses, expenses, getTotalExpenses, formatCurrency } =
    useStore();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const totalExpenses = getTotalExpenses();
  const monthlyExpenses = getTotalExpenses("month");
  const weeklyExpenses = getTotalExpenses("week");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Expenses"
        description="Track and manage your business expenses"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </div>
            <div className="text-2xl font-bold mt-2">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">
              This Month
            </div>
            <div className="text-2xl font-bold mt-2">
              {formatCurrency(monthlyExpenses)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">
              This Week
            </div>
            <div className="text-2xl font-bold mt-2">
              {formatCurrency(weeklyExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      <ExpensesList />
    </div>
  );
}
