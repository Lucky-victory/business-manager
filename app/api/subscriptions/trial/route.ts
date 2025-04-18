// app/api/subscriptions/trial/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userSubscriptions, pricing, plans } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";
import { generateUUID } from "@/lib/utils";
import { headers } from "next/headers";
import { PlanSelect } from "@/types";

interface TrialCheckResponse {
  trialActive: boolean;
  trialExpired?: boolean;
  trialUsed: boolean;
  trialEligible: boolean;
  daysLeft?: number;
  trialEndDate?: Date;
  trialStartDate?: Date;
  plan?: PlanSelect;
}
interface StartTrialRequest {
  pricingId: string;
}

// Check trial status
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user has an active trial
    const activeTrial = await db.query.userSubscriptions.findFirst({
      where: and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, "trial")
      ),
      with: {
        pricing: {
          with: {
            plan: true,
          },
        },
      },
    });

    if (!activeTrial) {
      // Check if user has ever had a trial before
      const pastTrial = await db.query.userSubscriptions.findFirst({
        where: and(
          eq(userSubscriptions.userId, userId),
          eq(userSubscriptions.trialUsed, true)
        ),
      });

      const response: TrialCheckResponse = {
        trialActive: false,
        trialUsed: !!pastTrial,
        trialEligible: !pastTrial,
      };

      return NextResponse.json(response, { status: 200 });
    }

    // Calculate days left in trial
    const now = new Date();
    const trialEndDate = new Date(activeTrial.trialEndDate as Date);
    const daysLeft = Math.ceil(
      (trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Check if trial has expired
    if (daysLeft <= 0) {
      // Update subscription in database to mark trial as expired
      await db
        .update(userSubscriptions)
        .set({
          status: "expired",
          updatedAt: new Date(),
        })
        .where(eq(userSubscriptions.id, activeTrial.id));

      const response: TrialCheckResponse = {
        trialActive: false,
        trialExpired: true,
        trialUsed: true,
        trialEligible: false,
      };

      return NextResponse.json(response, { status: 200 });
    }

    const response: TrialCheckResponse = {
      trialActive: true,
      daysLeft,
      trialEndDate: activeTrial.trialEndDate as Date,
      trialStartDate: activeTrial.trialStartDate as Date,
      plan: activeTrial.pricing?.plan,
      trialEligible: true,
      trialUsed: true,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error checking trial status:", error);
    return NextResponse.json(
      { error: "Failed to check trial status" },
      { status: 500 }
    );
  }
}

// Start a trial
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = (await request.json()) as StartTrialRequest;
    const { pricingId } = body;

    if (!pricingId) {
      return NextResponse.json(
        { error: "Pricing ID is required" },
        { status: 400 }
      );
    }

    // Check if user already has or had a trial
    const existingTrial = await db.query.userSubscriptions.findFirst({
      where: and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.trialUsed, true)
      ),
    });

    if (existingTrial) {
      return NextResponse.json(
        { error: "You have already used your free trial" },
        { status: 400 }
      );
    }

    // Check for any active subscription
    const activeSubscription = await db.query.userSubscriptions.findFirst({
      where: and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, "active")
      ),
    });

    if (activeSubscription) {
      return NextResponse.json(
        { error: "You already have an active subscription" },
        { status: 400 }
      );
    }

    // Verify pricing exists
    const pricingDetails = await db.query.pricing.findFirst({
      where: eq(pricing.id, pricingId),
      with: {
        plan: true,
      },
    });

    if (!pricingDetails) {
      return NextResponse.json(
        { error: "Invalid pricing plan" },
        { status: 404 }
      );
    }

    // Set trial dates
    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

    // Create new trial subscription
    const newTrial = await db.transaction(async (tx) => {
      const id = generateUUID();
      await tx.insert(userSubscriptions).values({
        id,
        userId,
        pricingId,
        startDate: trialStartDate,
        endDate: trialEndDate,
        trialStartDate,
        trialEndDate,
        trialUsed: true,
        status: "trial",
        billingCycle: "monthly", // Default to monthly for trial
        autoRenew: false, // No auto-renewal for trials
        nextBillingDate: trialEndDate,
      });

      return await tx.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.id, id),
        with: {
          pricing: {
            with: {
              plan: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        trial: newTrial,
        message: "Trial started successfully",
        trialEndDate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error starting trial:", error);
    return NextResponse.json(
      { error: "Failed to start trial" },
      { status: 500 }
    );
  }
}
