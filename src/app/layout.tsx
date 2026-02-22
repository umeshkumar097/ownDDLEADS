import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import BroadcastBanner from "@/components/BroadcastBanner";
import RetargetingBanner from "@/components/RetargetingBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
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
  metadataBase: new URL("https://dhandaleads.com"),
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "DhandaLeads | B2B Leads Generation",
    description: "The smartest B2B data engine for Indian businesses. Find, verify, and close leads on autopilot.",
    url: "https://dhandaleads.com",
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
        {/* Google Analytics & Google Ads */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-BVKJKZL9XR" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Google Analytics
            gtag('config', 'G-BVKJKZL9XR');
            
            // Google Ads Conversion tracking (Replace AW-123456789 with actual ID)
            gtag('config', 'AW-CONVERSION_ID');
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'META_PIXEL_ID'); // Replace with actual Meta Pixel ID
            fbq('track', 'PageView');
          `}
        </Script>
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
          <ErrorBoundary>
            <BroadcastBanner />
            <RetargetingBanner />
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
