import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { SubscriptionService } from "@/lib/subscription/subscription-service";
import { IS_DEV } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    if (!body.pricingId) {
      return NextResponse.json(
        { error: "Pricing ID is required" },
        { status: 400 }
      );
    }

    // Start the free trial
    const subscription = await SubscriptionService.startFreeTrial(
      userId,
      body.pricingId
    );

    if (!subscription) {
      return NextResponse.json(
        { error: "Failed to start free trial" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Free trial started successfully",
      subscription,
    });
  } catch (error: any) {
    console.error("Error starting free trial:", error);
    return NextResponse.json(
      { error: IS_DEV ? error.message : "Failed to start free trial" },
      { status: 500 }
    );
  }
}
