import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

interface WelcomeStepProps {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to Business Manager</CardTitle>
        <CardDescription>
          Let's set up your account to get you started quickly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">This quick onboarding process will help you:</p>
        <ul className="space-y-2 mb-4">
          <li className="flex items-center">
            <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
            <span>Set up your profile</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
            <span>Configure your business details</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
            <span>Choose your currency preference</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
            <span>Start your free trial</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={onContinue} className="w-full">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
