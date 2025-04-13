import type { Metadata } from "next";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { roboto } from "@/lib/font";
export const metadata: Metadata = {
  title: "Business Manager",
  description:
    "Manage your business sales and credits with ease - Biz Manager helps simplify business management for small and medium businesses around in Africa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
