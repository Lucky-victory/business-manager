"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

// Define the profile schema
const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().optional().or(z.literal("")),
  displayUsername: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  companyName: z.string().optional().or(z.literal("")),
  companyAddress: z.string().optional().or(z.literal("")),
  companyPhone: z.string().optional().or(z.literal("")),
  companyEmail: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
});

type ProfileData = z.infer<typeof profileSchema>;

type ProfileFormProps = {
  initialData: ProfileData;
  isSubmitting: boolean;
  onSubmit: (data: ProfileData) => Promise<void>;
};

export function ProfileForm({
  initialData,
  isSubmitting,
  onSubmit,
}: ProfileFormProps) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name || "",
      username: initialData.username || "",
      displayUsername: initialData.displayUsername || "",
      image: initialData.image || "",
      companyName: initialData.companyName || "",
      companyAddress: initialData.companyAddress || "",
      companyPhone: initialData.companyPhone || "",
      companyEmail: initialData.companyEmail || "",
    },
  });

  async function handleSubmit(values: z.infer<typeof profileSchema>) {
    await onSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-6 space-y-4 max-w-xl"
      >
        <div className="space-y-4">
          {/* Personal Information Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        disabled={isSubmitting}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Display Username Field */}
              <FormField
                control={form.control}
                name="displayUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your display name"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profile Image URL Field */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your profile image URL"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Company Information Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Company Information</h2>
            <div className="space-y-4">
              {/* Company Name Field */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company name"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Address Field */}
              <FormField
                control={form.control}
                name="companyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your company address"
                        {...field}
                        disabled={isSubmitting}
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Phone Field */}
              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company phone"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Email Field */}
              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your company email"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button
            type="submit"
            className="max-sm:w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
