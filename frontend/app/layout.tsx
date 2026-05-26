import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FounderConnect — Find Your Perfect Co-Founder",
  description:
    "FounderConnect uses a proprietary compatibility algorithm to match entrepreneurs with complementary skills, shared vision, and aligned industry focus. Join 50,000+ founders building the next generation of startups.",
  keywords: [
    "co-founder matching",
    "startup co-founder",
    "find co-founder",
    "entrepreneur network",
    "startup matching",
    "founder platform",
  ],
  openGraph: {
    title: "FounderConnect — Find Your Perfect Co-Founder",
    description:
      "AI-powered co-founder matching for the next generation of startups.",
    type: "website",
    siteName: "FounderConnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "FounderConnect — Find Your Perfect Co-Founder",
    description:
      "AI-powered co-founder matching for the next generation of startups.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="min-h-screen bg-background font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
