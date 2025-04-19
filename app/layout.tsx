import type { Metadata } from "next";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { roboto } from "@/lib/font";

const metabaseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://www.bizmanager.africa";
export const metadata: Metadata = {
  metadataBase: new URL(metabaseUrl),
  title: "Biz Manager - Business Management Simplified for Africans",
  keywords: [
    "business management",
    "sales tracking",
    "credit management",
    "invoice generation",
    "expense tracking",
    "business analytics",
    "small business tools",
    "business software",
    "business solutions",
    "business management app",
    "business management software",
    "business management system",
    "business management platform",
    "business management tools",
    "business management solutions",
    "business management for small businesses",
    "business management for medium businesses",
    "business management for africans",
  ],
  description:
    "Manage your business sales and credits with ease - Biz Manager helps simplify business management for small and medium businesses around Africa.",
  openGraph: {
    title: "Biz Manager - Business Management Simplified for Africans",
    url: "https://www.bizmanager.africa",
    description:
      "Manage your business sales and credits with ease - Biz Manager helps simplify business management for small and medium businesses around Africa.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Business Manager",
      },
    ],
    type: "website",
    locale: "en_US",
    siteName: "Biz Manager Africa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Biz Manager - Business Management Simplified for Africans",
    description:
      "Manage your business sales and credits with ease - Biz Manager helps simplify business management for small and medium businesses around Africa.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    // apple: '/apple-touch-icon.png',
  },
  // manifest: '/site.webmanifest',

  applicationName: "Biz Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${roboto.className}`}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
