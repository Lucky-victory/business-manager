"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { ProFeatureWrapper } from "@/components/ui/pro-feature-wrapper";
import { ProFeatureBadge } from "@/components/ui/pro-feature-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExpenseForm } from "./expense-form";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseSelect } from "@/lib/store";
import { EmptyState } from "../empty-state";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { LoadingStateWrapper } from "../ui/loading-state-wrapper";

export function ExpensesList() {
  const { expenses, isLoading, deleteExpense, formatCurrency } = useStore();
  const { isFeatureEnabled } = useSubscriptionStore();
  const [editingExpense, setEditingExpense] = useState<ExpenseSelect | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (expense: ExpenseSelect) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      await deleteExpense(id);
    }
  };

  const emptyState = (
    <EmptyState
      title="No expenses yet"
      description="Start tracking your expenses by adding your first expense record."
      action={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      }
    />
  );

  return (
    <ProFeatureWrapper
      feature="expenses"
      disabledMessage="Expense tracking requires a Basic or Premium subscription"
    >
      <LoadingStateWrapper
        isLoading={isLoading.expenses}
        loadingText="Loading expenses..."
      >
        <>
          {!expenses || expenses.length === 0 ? (
            emptyState
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Expenses</h2>
                <div className="flex gap-4 items-center">
                  <Button
                    variant="outline"
                    asChild
                    className="text-sm"
                    disabled={!isFeatureEnabled("expensesAnalytics")}
                  >
                    <Link href="/expenses">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Expense Analytics
                      {!isFeatureEnabled("expensesAnalytics") && (
                        <ProFeatureBadge
                          className="ml-2"
                          tooltipText="Advanced analytics requires a Premium subscription"
                        />
                      )}
                    </Link>
                  </Button>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                      </DialogHeader>
                      <ExpenseForm
                        onSuccess={() => setIsAddDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(expense.date.toString())}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{expense.item}</div>
                          {expense.notes && (
                            <div className="text-xs text-muted-foreground">
                              {expense.notes}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {expense.category ? (
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                              {expense.category}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>{expense.paymentType}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(expense)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(expense.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Expense</DialogTitle>
                  </DialogHeader>
                  {editingExpense && (
                    <ExpenseForm
                      expense={editingExpense}
                      onSuccess={() => setIsEditDialogOpen(false)}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}
        </>
      </LoadingStateWrapper>
    </ProFeatureWrapper>
  );
}
