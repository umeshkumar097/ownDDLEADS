import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import BroadcastBanner from "@/components/BroadcastBanner";
import RetargetingBanner from "@/components/RetargetingBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import Script from "next/script";
import { headers } from "next/headers";
import { getBrandingByHost } from "@/lib/branding";
import { BrandingProvider } from "@/components/BrandingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host');
  const branding = await getBrandingByHost(host);

  return {
    metadataBase: new URL("https://dhandaleads.com"),
    title: {
      default: branding.name,
      template: `%s | ${branding.name}`
    },
    description: branding.isWhitelabel 
      ? `Premium B2B lead generation platform by ${branding.name}.` 
      : "India's smartest B2B data engine. Discover, verify, and close leads on autopilot. Trusted by 500+ Indian businesses for high-quality lead generation.",
    icons: {
      icon: branding.faviconUrl || '/favicon.ico',
    },
    robots: {
      index: !branding.isWhitelabel,
      follow: true,
    },
    openGraph: {
      title: branding.name,
      description: branding.isWhitelabel ? `Lead generation powered by ${branding.name}` : "India's smartest B2B data engine.",
      images: [{ url: branding.logoUrl || '/og-image.png', width: 1200, height: 630 }]
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get('host');
  const branding = await getBrandingByHost(host);

  return (
    <html lang="en">
      <head>
        {!branding.isWhitelabel && (
          <>
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
            {/* Google Tag Manager */}
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-BVKJKZL9XR" strategy="afterInteractive" />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!branding.isWhitelabel && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-P9HTVMSN"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Providers>
          <BrandingProvider branding={branding}>
            <ErrorBoundary>
              {!branding.isWhitelabel && <BroadcastBanner />}
              {!branding.isWhitelabel && <RetargetingBanner />}
              {children}
            </ErrorBoundary>
          </BrandingProvider>
        </Providers>
      </body>
    </html>
  );
}
