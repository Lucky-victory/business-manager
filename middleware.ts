import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isAuthPath = path.startsWith("/auth");
  const isPublicPath =
    isAuthPath || ["/", "/terms", "/privacy", "/landing"].includes(path);

  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const isAuthenticated = !!session?.user;

  // If the user is not authenticated and the path is not public, redirect to login
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (isAuthenticated && path === "/") {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // If the user is authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL("/app", request.url));
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
