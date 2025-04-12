import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isAuthPath = path.startsWith("/auth");
  const isPublicPath = isAuthPath || path.startsWith("/landing");

  // Get the user's session
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const isAuthenticated = !!session?.user;

  // If the user is not authenticated and the path is not public, redirect to login
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If the user is authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
