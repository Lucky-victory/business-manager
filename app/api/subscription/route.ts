import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { plans, pricing, countryCurrency } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Helper function to get client IP address
function getClientIp(req: NextRequest): string | null {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return null;
}

// Helper function to get country code from IP
async function getCountryFromIp(ip: string): Promise<string> {
  try {
    // Use a geolocation API to get country from IP
    // For production, you might want to use a paid service with better reliability
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    // Return the country code if available and supported, otherwise default to US
    const countryCode = data.countryCode;

    // Check if the country code is one we support
    const supportedCountries = ["NG", "GH", "KE", "ZAR", "US"] as const;

    // Check if the normalized code is in our supported countries
    const isSupported = supportedCountries.includes(countryCode);

    // Return the supported country code or default to US
    return isSupported ? countryCode : "US";
  } catch (error) {
    console.error("Error fetching country from IP:", error);
    return "US"; // Default to US on error
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get client IP and determine country
    const clientIp = getClientIp(req) || "0.0.0.0";
    const countryCode = await getCountryFromIp(clientIp);

    // Fetch all active plans
    const activePlans = await db.query.plans.findMany({
      where: eq(plans.isActive, true),
    });

    // Fetch pricing for the determined country
    const countryPricing = await db
      .select()
      .from(pricing)
      .where(eq(pricing.countryCode, countryCode))
      .leftJoin(plans, eq(pricing.planId, plans.id));

    // Fetch country currency information
    const country = await db
      .select()
      .from(countryCurrency)
      .where(
        eq(
          countryCurrency.countryCode,
          countryCode as "NG" | "GH" | "KE" | "ZAR" | "US"
        )
      )
      .limit(1);

    const currencyInfo = country[0];

    console.log({
      activePlans,
      countryPricing,
      currencyInfo,
    });

    // Format the pricing data to include plan information
    const formattedPricing = countryPricing.map((row) => ({
      ...row.pricing,
      plan: row.plans,
    }));
    console.log({
      formattedPricing,
      activePlans,
    });

    return NextResponse.json({
      success: true,
      data: {
        plans: activePlans,
        pricing: formattedPricing,
        country: currencyInfo,
        detectedCountryCode: countryCode,
      },
    });
  } catch (error) {
    console.error("Error fetching subscription data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription data" },
      { status: 500 }
    );
  }
}
