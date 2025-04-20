import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
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

    // Get the user's subscription with pricing and plan details
    const subscription = await db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.userId, userId),
      with: {
        pricing: {
          with: {
            plan: true,
          },
        },
      },
      orderBy: [desc(userSubscriptions.createdAt)],
    });

    return NextResponse.json({
      subscription: subscription || null,
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
