"use client";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useSubscriptionStore } from "@/lib/subscription-store";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, fetchUser } = useStore();
  const { fetchSubscriptionData } = useSubscriptionStore();

  // Fetch user data and subscription data on component mount
  useEffect(() => {
    fetchUser();
    fetchSubscriptionData();
  }, [fetchUser, fetchSubscriptionData]);

  // If user has already completed onboarding, redirect to app
  useEffect(() => {
    // Check if user has company name set (indicating onboarding completion)
    if (user?.companyName) {
      router.push("/app");
    }
  }, [user, router]);

  return <OnboardingFlow />;
}
