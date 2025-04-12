"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { RegisterForm } from "@/components/auth/register-form";
import { BackButton } from "@/components/ui/back-button";
import { SocialSignInButton } from "@/components/auth/social-sign-in-button";
import { AlertError } from "@/components/ui/alert-error";

// Validation schemas
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export default function Register() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Handle form submission
  const handleSubmit = async (formData: z.infer<typeof registerSchema>) => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const result = await authClient.signUp.email(formData);

      if (result?.error) {
        setSubmitError(result.error?.message || "Registration failed");
      } else {
        // If successful, redirect to dashboard
        router.push("/app");
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred during registration");
      console.error("Registration error:", error);
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
        callbackURL: "/app",
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
          <BackButton onClick={() => router.back()} />
        </div>

        <div className="text-center">
          <h2 className="mt-4 text-3xl font-bold text-foreground">
            Create your account
          </h2>
        </div>

        {submitError && <AlertError message={submitError} />}

        <RegisterForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />

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
          <SocialSignInButton
            provider="google"
            onClick={signUpWithGoogle}
            isLoading={isSubmitting}
          />
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/auth/login"
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
