"use server";

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
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    // Return the country code if available and supported, otherwise default to US
    const countryCode = data.country_code;

    // Check if the country code is one we support
    const supportedCountries = ["NG", "GH", "KE", "ZAR", "US"] as const;

    // Map ZA to ZAR if needed (some APIs return ZA for South Africa)
    const normalizedCode = countryCode === "ZA" ? "ZAR" : countryCode;

    return supportedCountries.includes(normalizedCode as any)
      ? (normalizedCode as "NG" | "GH" | "KE" | "ZAR" | "US")
      : "US";
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
    const countryPricing = await db.query.pricing.findMany({
      where: eq(
        pricing.countryCode,
        countryCode as "NG" | "GH" | "KE" | "ZAR" | "US"
      ),
      with: {
        plan: true,
      },
    });

    // Fetch country currency information
    const country = await db.query.countryCurrency.findFirst({
      where: eq(
        countryCurrency.countryCode,
        countryCode as "NG" | "GH" | "KE" | "ZAR" | "US"
      ),
    });

    // If no country found, use default (US)
    const fallbackCountry = await db.query.countryCurrency.findFirst({
      where: eq(countryCurrency.countryCode, "US"),
    });

    const currencyInfo = country || fallbackCountry;

    return NextResponse.json({
      success: true,
      data: {
        plans: activePlans,
        pricing: countryPricing,
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
