import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userSubscriptions, pricing } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
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

    // Get the user's subscription
    const subscription = await db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.userId, userId),
      orderBy: [desc(userSubscriptions.createdAt)],
    });

    // If subscription exists, fetch pricing and plan details separately
    if (subscription) {
      const pricingDetails = await db.query.pricing.findFirst({
        where: eq(pricing.id, subscription.pricingId),
        with: {
          plan: true,
        },
      });

      // Return the subscription and pricing details separately
      return NextResponse.json({
        subscription: subscription,
        pricing: pricingDetails || null,
      });
    }

    return NextResponse.json({
      subscription: null,
      pricing: null,
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
