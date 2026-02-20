import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import BroadcastBanner from "@/components/BroadcastBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DhandaLeads | B2B Leads Generation & High Quality Leads",
  description: "The smartest B2B data engine for Indian businesses. Find, verify, and close leads on autopilot. Buy HNI leads and organic leads generation.",
  keywords: [
    "B2B leads generation",
    "B2B leads genenrations",
    "organic leads generation",
    "orginc leads genration",
    "high quality leads generation",
    "high qauilty leads generations",
    "buy HNI leads",
    "leads buy HNI",
    "leads generations",
    "leads genrations",
    "Indian B2B database",
    "business leads India"
  ],
  authors: [{ name: "Aiclex Technologies" }],
  openGraph: {
    title: "DhandaLeads | B2B Leads Generation",
    description: "The smartest B2B data engine for Indian businesses. Find, verify, and close leads on autopilot.",
    url: "https://dhandaleads.com", // Replace with actual domain
    siteName: "DhandaLeads",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <BroadcastBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
