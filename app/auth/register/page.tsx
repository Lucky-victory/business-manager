"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { Loader2, Check, X } from "lucide-react";

// Enhanced password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

// Enhanced registration schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  name: z.string().min(2, "Name must be at least 2 characters"),
});

// Form input validation types
type ValidationErrors = {
  name?: string;
  email?: string;
  password?: string;
};

// Password strength validation types
type PasswordCriteria = {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
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
    setSubmitError("");
    setIsSubmitting(true);

    try {
      // Validate all form data at once
      const validatedData = registerSchema.parse(formData);

      // Attempt registration
      const result = await authClient.signUp.email(validatedData);

      if (result?.error) {
        setSubmitError(result.error?.message || "Registration failed");
      } else {
        // If successful, redirect to dashboard
        router.push("/");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Update all field errors from validation
        const newErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ValidationErrors;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        setSubmitError("Please fix the errors in the form");
      } else {
        setSubmitError("An unexpected error occurred during registration");
        console.error("Registration error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle social sign-in
  async function signUpWithGoogle() {
    try {
      setIsSubmitting(true);
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      setSubmitError("Google sign-in failed. Please try again.");
      console.error("Google sign-in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-6 p-8 bg-card rounded-lg shadow-lg">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
        </div>
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-bold text-foreground">
            Create your account
          </h2>
        </div>

        {submitError && (
          <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded relative">
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={`flex h-10 w-full rounded-md border ${
                  errors.name ? "border-destructive" : "border-input"
                } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`flex h-10 w-full rounded-md border ${
                  errors.email ? "border-destructive" : "border-input"
                } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`flex h-10 w-full rounded-md border ${
                  errors.password ? "border-destructive" : "border-input"
                } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password}
                </p>
              )}

              {/* Password Strength Indicator */}
              {formData.password.length > 0 && (
                <div className="mt-2 p-3 bg-background border border-input rounded-md transition-all duration-300">
                  <p className="text-sm font-medium mb-2">
                    Password must contain:
                  </p>
                  <ul className="space-y-1">
                    <li className="flex items-center text-sm">
                      {passwordCriteria.minLength ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 mr-2 text-destructive" />
                      )}
                      <span
                        className={
                          passwordCriteria.minLength
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }
                      >
                        At least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center text-sm">
                      {passwordCriteria.hasUppercase ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 mr-2 text-destructive" />
                      )}
                      <span
                        className={
                          passwordCriteria.hasUppercase
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }
                      >
                        At least one uppercase letter
                      </span>
                    </li>
                    <li className="flex items-center text-sm">
                      {passwordCriteria.hasNumber ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 mr-2 text-destructive" />
                      )}
                      <span
                        className={
                          passwordCriteria.hasNumber
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }
                      >
                        At least one number
                      </span>
                    </li>
                    <li className="flex items-center text-sm">
                      {passwordCriteria.hasSpecial ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 mr-2 text-destructive" />
                      )}
                      <span
                        className={
                          passwordCriteria.hasSpecial
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }
                      >
                        At least one special character
                      </span>
                    </li>
                  </ul>
                </div>
              )}
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
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login Button */}
        <div className="mt-4">
          <button
            onClick={signUpWithGoogle}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Image
                  className="h-5 w-5 mr-2"
                  src="/google.svg"
                  alt="Google logo"
                  width={20}
                  height={20}
                />
                Register with Google
              </>
            )}
          </button>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
