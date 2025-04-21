import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { db } from "./lib/db";
import { users, userSubscriptions } from "./lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isAuthPath = path.startsWith("/auth");
  const isPublicPath =
    isAuthPath || ["/", "/terms", "/privacy", "/landing"].includes(path);
  const isOnboardingPath = path.startsWith("/onboarding");
  const isCheckoutPath = path.startsWith("/checkout");
  const isApiPath = path.startsWith("/api");

  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const isAuthenticated = !!session?.user;

  // If the user is not authenticated and the path is not public, redirect to login
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If the user is authenticated
  if (isAuthenticated) {
    // Redirect from home page to app
    if (path === "/") {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // If the user is authenticated and trying to access auth pages, redirect to home
    if (isAuthPath) {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // Skip onboarding, checkout, and API paths for further checks
    if (isOnboardingPath || isCheckoutPath || isApiPath) {
      return NextResponse.next();
    }

    try {
      // Check if user has completed onboarding
      const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
      });

      // If user hasn't set company name, redirect to onboarding
      if (!user?.isOnboardingComplete && !isOnboardingPath) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }

      // Check subscription status for protected paths
      if (path.startsWith("/app")) {
        // Get user's subscription
        const subscription = await db.query.userSubscriptions.findFirst({
          where: eq(userSubscriptions.userId, session.user.id),
          orderBy: [desc(userSubscriptions.createdAt)],
        });

        // Check if subscription is active or in trial
        const hasActiveSubscription =
          subscription &&
          (subscription.status === "active" || subscription.status === "trial");

        // If subscription is expired or canceled and trying to access a protected path
        if (
          subscription &&
          (subscription.status === "expired" ||
            subscription.status === "canceled") &&
          !path.includes("/app/subscriptions")
        ) {
          // Redirect to subscription page
          return NextResponse.redirect(
            new URL("/app/subscriptions", request.url)
          );
        }
      }
    } catch (error) {
      console.error("Error in middleware:", error);
      // Continue to the requested page on error
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - asset files (.svg, .png, .jpg, .jpeg, .gif, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.ico).*)",
  ],
};
