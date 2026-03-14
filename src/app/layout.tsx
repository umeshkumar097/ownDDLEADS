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
  title: {
    default: "DhandaLeads | B2B Lead Generation India",
    template: "%s | DhandaLeads"
  },
  description: "India's smartest B2B data engine. Discover, verify, and close leads on autopilot. Trusted by 500+ Indian businesses for high-quality lead generation.",
  keywords: [
    "B2B lead generation India",
    "B2B leads India",
    "buy business leads India",
    "lead generation company India",
    "B2B database India",
    "verified business leads",
    "HNI leads India",
    "business contact database",
    "sales leads India",
    "lead generation tool India",
    "WhatsApp leads India",
    "organic lead generation",
    "high quality leads",
    "Aiclex Technologies",
    "DhandaLeads"
  ],
  authors: [{ name: "Aiclex Technologies", url: "https://aiclex.in" }],
  creator: "Aiclex Technologies",
  publisher: "DhandaLeads",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' }
  },
  alternates: {
    canonical: 'https://dhandaleads.com',
  },
  openGraph: {
    title: "DhandaLeads | B2B Lead Generation India",
    description: "India's smartest B2B data engine. Discover, verify, and close leads on autopilot.",
    url: "https://dhandaleads.com",
    siteName: "DhandaLeads",
    locale: "en_IN",
    type: "website",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DhandaLeads - B2B Lead Generation India' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DhandaLeads | B2B Lead Generation India',
    description: "India's smartest B2B data engine. Find, verify, and close leads on autopilot.",
    images: ['/og-image.png'],
  }
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
        {/* Organization + WebSite JSON-LD Structured Data */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Aiclex Technologies",
                "url": "https://dhandaleads.com",
                "logo": "https://dhandaleads.com/logo.png",
                "description": "India's leading B2B lead generation platform. Discover and verify business contacts across India.",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "A-116/117, Okhla Phase II",
                  "addressLocality": "New Delhi",
                  "postalCode": "110020",
                  "addressCountry": "IN"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+91-8449488090",
                  "contactType": "customer support",
                  "availableLanguage": ["English", "Hindi"]
                },
                "sameAs": [
                  "https://aiclex.in",
                  "https://linkedin.com/in/iukbsr"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "DhandaLeads",
                "url": "https://dhandaleads.com",
                "description": "India's smartest B2B lead generation engine",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://dhandaleads.com/solutions/lead-generation-company/{search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ])
          }}
        />
        {/* Google Tag Manager */}
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
