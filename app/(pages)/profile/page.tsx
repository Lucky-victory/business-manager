"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileData, ProfileForm } from "@/components/profile/profile-form";
import { BackButton } from "@/components/ui/back-button";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useStore } from "@/lib/store";
import isEmpty from "just-is-empty";

export default function ProfilePage() {
  const router = useRouter();
  const { user: profileData, isLoading, fetchUser } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    isEmpty(profileData) && fetchUser();
  }, [fetchUser]);

  // Handle form submission
  const handleSubmit = async (data: ProfileData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setError(null);
    const { currency, ...rest } = data;
    const [currencySymbol, currencyCode, currencyName] =
      currency?.split("_") || [];
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
          currencyCode,
          currencySymbol,
          currencyName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const responseData = await response.json();
      fetchUser();
      setSuccessMessage("Profile updated successfully");

      // Refresh the page after a short delay
      // setTimeout(() => {
      //   router.refresh();
      // }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Profile Settings"
        backButton={<BackButton onClick={() => router.back()} />}
      />

      {isLoading?.user ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mt-6">
          {error}
        </div>
      ) : profileData ? (
        <>
          {successMessage && (
            <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
              {successMessage}
            </div>
          )}
          <div className="bg-card rounded-lg shadow-sm p-6">
            <ProfileForm
              initialData={profileData}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
        </>
      ) : (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mt-6">
          No profile data found. Please try refreshing the page.
        </div>
      )}
    </div>
  );
}
