import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { countryCurrency, plans, pricing } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const countryCode = searchParams.get("countryCode") || "NG"; // Default to Nigeria

    // Get all active plans
    const allPlans = await db.query.plans.findMany({
      where: eq(plans.isActive, true),
    });
    console.log({ allPlans });

    // Get pricing for the specified country
    const pricingData = await db
      .select()
      .from(pricing)
      .where(
        eq(
          pricing.countryCode,
          countryCode as "NG" | "US" | "KE" | "ZAR" | "GH"
        )
      )
      .leftJoin(
        countryCurrency,
        eq(pricing.countryCode, countryCurrency.countryCode)
      )
      .leftJoin(plans, eq(pricing.planId, plans.id));

    // Transform the result to match the expected format
    const formattedPricing = pricingData.map((row) => ({
      ...row.pricing,
      country: row.country_currency,
      plan: row.plans,
    }));

    return NextResponse.json({
      plans: allPlans,
      pricing: formattedPricing,
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
