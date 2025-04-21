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
import { Loader2, WifiOff } from "lucide-react";
import CustomNumberInput from "../ui/custom-number-input";
import { Textarea } from "../ui/textarea";
import { DatePickerField } from "../ui/date-picker";
import { SheetFooter } from "../ui/sheet";
import { useSyncFetch } from "@/lib/sync/use-offline-sync";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the sync fetch hook for offline-first data synchronization
  const addExpenseFetch = useSyncFetch({
    endpoint: "/api/expenses",
    method: "POST",
  });

  const updateExpenseFetch = expense
    ? useSyncFetch({
        endpoint: `/api/expenses/${expense.id}`,
        method: "PATCH",
      })
    : null;

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
        // Update existing expense
        const updateData = {
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
        };

        // Use the sync fetch hook for offline-first data synchronization
        const result = await updateExpenseFetch?.execute(updateData);

        if (updateExpenseFetch?.isOffline) {
          // If offline, update the local store and show offline message
          await updateExpense({
            id: expense.id,
            ...updateData,
          });

          toast({
            title: "Expense updated offline",
            description: "Changes will sync when you're back online",
            variant: "default",
          });
        } else if (result) {
          // If online and successful, update the local store
          await updateExpense({
            id: expense.id,
            ...updateData,
          });

          toast({
            title: "Expense updated",
            description: "Your expense has been updated successfully",
            variant: "default",
          });
        }
      } else {
        // Add new expense
        const newExpense: ExpenseInsert = {
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
        };

        // Use the sync fetch hook for offline-first data synchronization
        const result = await addExpenseFetch.execute(newExpense);

        if (addExpenseFetch.isOffline) {
          // If offline, add to local store and show offline message
          await addExpense(newExpense);

          toast({
            title: "Expense saved offline",
            description: "It will be synced when you're back online",
            variant: "default",
          });
        } else if (result) {
          // If online and successful, add to local store
          await addExpense(newExpense);

          toast({
            title: "Expense added",
            description: "Your expense has been added successfully",
            variant: "default",
          });
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Failed to save expense:", error);

      toast({
        title: "Error",
        description: "Failed to save expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-10">
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <CustomNumberInput
                    value={field.value + ""}
                    placeholder="0.00"
                    onValueChange={(value) => field.onChange(value)}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
        </div>

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
                <Textarea
                  rows={3}
                  className="max-h-[100px]"
                  placeholder="Additional details"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePickerField
                  date={new Date(field.value)}
                  onDateChange={(date) => field.onChange(date)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SheetFooter>
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
        </SheetFooter>
      </form>
    </Form>
  );
}
