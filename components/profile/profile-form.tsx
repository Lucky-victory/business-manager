"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/ui/form-field";

// Define the profile schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().optional(),
  displayUsername: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email("Invalid email address").optional(),
  image: z.string().optional(),
});

type ProfileData = z.infer<typeof profileSchema>;

type ValidationErrors = {
  name?: string;
  username?: string;
  displayUsername?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  image?: string;
};

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
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Handle form input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate each field on change
    try {
      if (name === "name") {
        z.string().min(2, "Name must be at least 2 characters").parse(value);
        setErrors((prev) => ({ ...prev, name: undefined }));
      } else if (name === "companyEmail" && value) {
        z.string().email("Invalid email address").parse(value);
        setErrors((prev) => ({ ...prev, companyEmail: undefined }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
      }
    }
  };

  // Handle form blur for validation feedback
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    try {
      if (name === "name") {
        z.string().min(2, "Name must be at least 2 characters").parse(value);
      } else if (name === "companyEmail" && value) {
        z.string().email("Invalid email address").parse(value);
      }
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate all form data at once
      const validatedData = profileSchema.parse(formData);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Update all field errors from validation
        const newErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ValidationErrors;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form className="mt-6 space-y-4 max-w-xl" onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Personal Information Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            {/* Name Field */}
            <FormField
              id="name"
              name="name"
              label="Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              error={errors.name}
              required
            />

            {/* Username Field */}
            <FormField
              id="username"
              name="username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={formData.username || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              error={errors.username}
            />

            {/* Display Username Field */}
            <FormField
              id="displayUsername"
              name="displayUsername"
              label="Display Name"
              type="text"
              placeholder="Enter your display name"
              value={formData.displayUsername || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              error={errors.displayUsername}
            />

            {/* Profile Image URL Field */}
            <FormField
              id="image"
              name="image"
              label="Profile Image URL"
              type="text"
              placeholder="Enter your profile image URL"
              value={formData.image || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              error={errors.image}
            />
          </div>
        </div>

        {/* Company Information Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Company Information</h2>
          <div className="space-y-4">
            {/* Company Name Field */}
            <FormField
              id="companyName"
              name="companyName"
              label="Company Name"
              type="text"
              placeholder="Enter your company name"
              value={formData.companyName || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              error={errors.companyName}
            />

            {/* Company Address Field */}
            <FormField
              id="companyAddress"
              name="companyAddress"
              label="Company Address"
              type="text"
              placeholder="Enter your company address"
              value={formData.companyAddress || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              error={errors.companyAddress}
            />

            {/* Company Phone Field */}
            <FormField
              id="companyPhone"
              name="companyPhone"
              label="Company Phone"
              type="text"
              placeholder="Enter your company phone"
              value={formData.companyPhone || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              error={errors.companyPhone}
            />

            {/* Company Email Field */}
            <FormField
              id="companyEmail"
              name="companyEmail"
              label="Company Email"
              type="email"
              placeholder="Enter your company email"
              value={formData.companyEmail || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              error={errors.companyEmail}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
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
        </button>
      </div>
    </form>
  );
}
