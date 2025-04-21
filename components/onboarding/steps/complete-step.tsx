import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface CompleteStepProps {
  onComplete: () => void;
}

export function CompleteStep({ onComplete }: CompleteStepProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
        <CardTitle className="text-center">Setup Complete!</CardTitle>
        <CardDescription className="text-center">
          Your account is now ready to use.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p>
            Your free trial has been activated successfully. You now have full
            access to all features for the next 14 days.
          </p>
          <p>
            We'll send you a reminder before your trial ends so you can decide
            if you want to continue with a paid subscription.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={onComplete}>Go to Dashboard</Button>
      </CardFooter>
    </Card>
  );
}
