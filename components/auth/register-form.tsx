// components/auth/register-form.tsx
"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { PasswordCriteria } from "@/components/auth/password-criteria";
import {
  registerSchema,
  passwordSchema,
} from "@/app/(pages)/auth/register/page"; // Adjust import path as needed
import { Button } from "../ui/button";

type ValidationErrors = {
  name?: string;
  email?: string;
  password?: string;
};

type PasswordCriteriaState = {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

type RegisterFormProps = {
  isSubmitting: boolean;
  onSubmit: (data: z.infer<typeof registerSchema>) => Promise<void>;
};

export function RegisterForm({ isSubmitting, onSubmit }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [passwordCriteria, setPasswordCriteria] =
    useState<PasswordCriteriaState>({
      minLength: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecial: false,
    });

  // Validate password criteria on each change
  useEffect(() => {
    const { password } = formData;
    setPasswordCriteria({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    });
  }, [formData.password]);

  // Handle form input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate each field on change
    try {
      if (name === "name") {
        z.string().min(2, "Name must be at least 2 characters").parse(value);
        setErrors((prev) => ({ ...prev, name: undefined }));
      } else if (name === "email") {
        z.string().email("Invalid email address").parse(value);
        setErrors((prev) => ({ ...prev, email: undefined }));
      } else if (name === "password") {
        // For password, we don't show error message immediately, as the criteria list shows status
        if (value.length > 0) {
          try {
            passwordSchema.parse(value);
            setErrors((prev) => ({ ...prev, password: undefined }));
          } catch (error) {
            // Don't set error message yet, just validate criteria
          }
        }
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
      } else if (name === "email") {
        z.string().email("Invalid email address").parse(value);
      } else if (name === "password") {
        passwordSchema.parse(value);
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
      const validatedData = registerSchema.parse(formData);
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
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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

        {/* Email Field */}
        <FormField
          id="email"
          name="email"
          label="Email address"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          error={errors.email}
          required
        />

        {/* Password Field */}
        <div>
          <FormField
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            error={errors.password}
            required
          />

          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <PasswordCriteria criteria={passwordCriteria} />
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <Button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </div>
    </form>
  );
}
