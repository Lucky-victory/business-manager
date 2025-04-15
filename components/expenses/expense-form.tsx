"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStore, ExpenseSelect, ExpenseInsert } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const expenseFormSchema = z.object({
  item: z.string().min(1, "Item is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentType: z.string().min(1, "Payment type is required"),
  category: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  expense?: ExpenseSelect;
  onSuccess: () => void;
}

export function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: expense
      ? {
          item: expense.item,
          amount: Number(expense.amount),
          paymentType: expense.paymentType,
          category: expense.category || "",
          notes: expense.notes || "",
          date: new Date(expense.date).toISOString().split("T")[0],
        }
      : {
          item: "",
          amount: 0,
          paymentType: "",
          category: "",
          notes: "",
          date: new Date().toISOString().split("T")[0],
        },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsSubmitting(true);
    try {
      if (expense) {
        await updateExpense({
          id: expense.id,
          item: data.item,
          amount: String(data.amount),
          paymentType: data.paymentType as
            | "cash"
            | "card"
            | "transfer"
            | "other",
          category: data.category || null,
          notes: data.notes || null,
          date: new Date(data.date),
        });
      } else {
        await addExpense({
          item: data.item,
          amount: String(data.amount),
          paymentType: data.paymentType as
            | "cash"
            | "card"
            | "transfer"
            | "other",
          category: data.category || null,
          notes: data.notes || null,
          date: new Date(data.date),
          userId: "", // This will be set by the server
          id: "", // This will be set by the server
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="item"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item</FormLabel>
              <FormControl>
                <Input placeholder="What was purchased" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Additional details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2" />
                Saving...
              </>
            ) : expense ? (
              "Update Expense"
            ) : (
              "Add Expense"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
