import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import BroadcastBanner from "@/components/BroadcastBanner";
import Script from "next/script";

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
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-P9HTVMSN');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P9HTVMSN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers>
          <BroadcastBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
