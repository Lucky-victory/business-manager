import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { roboto } from "@/lib/font";
import PWAProvider from "@/components/pwa/pwa-provider";

const metabaseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://www.bizmanager.africa";

// PWA theme color
const themeColor = "#4f46e5";

export const viewport: Viewport = {
  themeColor: themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

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
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Biz Manager",
  },
  applicationName: "Biz Manager",
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Biz Manager" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-startup-image" href="/icons/splash-screen.png" />
      </head>
      <body className={`${roboto.variable} ${roboto.className}`}>
        <PWAProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </PWAProvider>
      </body>
    </html>
  );
}
