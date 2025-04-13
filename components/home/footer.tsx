import { DollarSign } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2 font-bold">
          <DollarSign className="h-6 w-6 text-emerald-600" />
          <span>Biz Manager</span>
        </div>
        <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
          © 2024 - {new Date().getFullYear()} Biz Manager. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/terms"
            className="text-sm text-gray-500 hover:text-emerald-600"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-gray-500 hover:text-emerald-600"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-sm text-gray-500 hover:text-emerald-600"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};
