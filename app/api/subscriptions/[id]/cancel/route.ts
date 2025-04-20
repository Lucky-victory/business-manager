import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { SubscriptionService } from "@/lib/subscription/subscription-service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const subscriptionId = params.id;

    // Verify the subscription belongs to the user
    const subscription = await db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.id, subscriptionId),
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    if (subscription.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to cancel this subscription" },
        { status: 403 }
      );
    }

    // Get cancellation reason from request body if provided
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || "User requested cancellation";

    // Cancel the subscription
    const canceledSubscription =
      await SubscriptionService.cancelUserSubscription(userId, reason);

    if (!canceledSubscription) {
      return NextResponse.json(
        { error: "Failed to cancel subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Subscription cancelled successfully",
      subscription: canceledSubscription,
    });
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
