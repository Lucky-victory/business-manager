import Link from "next/link";
import { DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-client";

export const Header = () => {
  const data = useAuth();
  const user = data?.user;
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <DollarSign className="h-6 w-6 text-emerald-600" />
          <span>Biz Manager</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-emerald-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#benefits"
            className="text-sm font-medium hover:text-emerald-600 transition-colors"
          >
            Benefits
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:text-emerald-600 transition-colors"
          >
            Testimonials
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Button asChild variant="outline" className="hidden md:flex">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </>
          ) : (
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/app">Go to app</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
