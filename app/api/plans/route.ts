import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { plans, pricing } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const countryCode = searchParams.get("countryCode") || "NG"; // Default to Nigeria

    // Get all plans
    const allPlans = await db.query.plans.findMany({
      where: eq(plans.isActive, true),
    });

    // Get pricing for the specified country
    const pricingData = await db.query.pricing.findMany({
      where: eq(pricing.countryCode, countryCode),
      with: {
        plan: true,
      },
    });

    return NextResponse.json({
      plans: allPlans,
      pricing: pricingData,
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
