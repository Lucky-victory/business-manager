"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Home } from "lucide-react";
import { useSubscriptionStore } from "@/lib/subscription-store";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { currentPlanId } = useSubscriptionStore();

  // In a real app, this would verify the payment status with the server
  useEffect(() => {
    // Simulate updating the user's subscription status
    console.log("Payment successful, subscription updated");
  }, []);

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-emerald-500 mb-2" />
          <CardTitle>Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Thank you for your purchase. Your subscription has been activated.
          </p>
          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email shortly with your receipt and
            subscription details.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/app")}>
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
