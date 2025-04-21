import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubscriptionStore } from "@/lib/subscription-store";

// Define the form schema for the currency step
const currencyFormSchema = z.object({
  countryCode: z.string().min(2, "Please select a country"),
});

export type CurrencyFormData = z.infer<typeof currencyFormSchema>;

interface CurrencyStepProps {
  onBack: () => void;
  onSubmit: (data: CurrencyFormData) => Promise<void>;
  isLoading: boolean;
}

export function CurrencyStep({
  onBack,
  onSubmit,
  isLoading,
}: CurrencyStepProps) {
  const { detectedCountryCode } = useSubscriptionStore();

  // Initialize the form with detected country code if available
  const form = useForm<CurrencyFormData>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      countryCode: detectedCountryCode || "NG",
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Currency Preference</CardTitle>
        <CardDescription>
          Choose your preferred currency for transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NG">Nigeria (₦)</SelectItem>
                      <SelectItem value="GH">Ghana (₵)</SelectItem>
                      <SelectItem value="KE">Kenya (KSh)</SelectItem>
                      <SelectItem value="ZAR">South Africa (R)</SelectItem>
                      <SelectItem value="US">United States ($)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This will determine the currency used for all transactions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
