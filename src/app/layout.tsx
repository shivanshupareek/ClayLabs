import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../styles/globals.scss";

// =============================================================================
// FONTS
// Body:    Inter (Google Font)
// Heading: Poxe (custom OTF at src/app/fonts/poxe.otf)
//          Used for the logo and display headings at -2% letter spacing
// =============================================================================

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-body",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const poxe = localFont({
  src: "./fonts/poxe.otf",
  variable: "--font-heading",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// =============================================================================
// METADATA
// =============================================================================

export const metadata: Metadata = {
  metadataBase: new URL("https://clayora.com"),

  title: {
    default: "Clayora — Pottery Classes in Australia",
    template: "%s | Clayora",
  },

  description:
    "Join Clayora for intimate pottery classes in small groups. A peaceful, welcoming community-based studio in Australia for all skill levels.",

  keywords: [
    "pottery classes",
    "pottery studio",
    "clay classes",
    "wheel throwing",
    "handbuilding",
    "ceramics workshop",
    "pottery Australia",
    "community pottery",
  ],

  authors: [{ name: "Clayora", url: "https://clayora.com" }],
  creator: "Clayora",
  publisher: "Clayora",

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

  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://clayora.com",
    siteName: "Clayora",
    title: "Clayora — Pottery Classes in Australia",
    description:
      "Join Clayora for intimate pottery classes in small groups. A peaceful, welcoming community-based studio in Australia for all skill levels.",
    images: [
      {
        url: "/assets/og/OG_image.png",
        width: 1200,
        height: 630,
        alt: "Clayora — Pottery Classes in Australia",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Clayora — Pottery Classes in Australia",
    description:
      "Join Clayora for intimate pottery classes in small groups. A peaceful, welcoming community-based studio in Australia for all skill levels.",
    images: ["/assets/og/OG_image.png"],
  },

  alternates: {
    canonical: "https://clayora.com",
  },

  icons: {
    icon: [
      { url: "/assets/favicons/Favicon.ico", type: "image/x-icon" },
      { url: "/assets/favicons/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/favicons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/favicons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/assets/favicons/apple-touch-icon.png", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest",
};

// =============================================================================
// VIEWPORT
// =============================================================================

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF4ED" },
    { media: "(prefers-color-scheme: dark)",  color: "#2A1101" },
  ],
};

// =============================================================================
// JSON-LD — site-wide structured data
// XSS note: < replaced with \u003c per Next.js 16 JSON-LD guide.
// =============================================================================

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EducationalOrganization"],
  name: "Clayora",
  description:
    "Intimate pottery classes in small groups. A peaceful, community-based pottery studio in Australia for all skill levels.",
  url: "https://clayora.com",
  logo: "https://clayora.com/assets/og/OG_image.png",
  sameAs: [],
  address: {
    "@type": "PostalAddress",
    addressCountry: "AU",
  },
  areaServed: {
    "@type": "Country",
    name: "Australia",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Pottery Classes",
    itemListElement: [
      {
        "@type": "Offer",
        price: "300",
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
        url: "https://clayora.com/#book",
        itemOffered: {
          "@type": "Course",
          name: "6-Week Pottery Programme",
          description:
            "Small-group pottery classes covering wheel throwing and handbuilding for all skill levels. Two hours per week over six weeks.",
          numberOfCredits: 6,
          courseWorkload: "PT2H",
        },
      },
    ],
  },
};

// =============================================================================
// THEME INIT SCRIPT
// Injected into <head> as a blocking script — runs before any paint so there
// is no flash of the wrong theme. Reads localStorage first, falls back to
// prefers-color-scheme. Uses 'cl-theme' as the storage key.
// Safe: 'unsafe-inline' is present in script-src CSP (next.config.ts).
// =============================================================================

const themeInitScript = `(function(){try{var t=localStorage.getItem('cl-theme');var d=t||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',d);}catch(e){}})();`;

// =============================================================================
// ROOT LAYOUT
// =============================================================================

import Navbar from "./_components/(root)/Navbar/Navbar";
import SmoothScroll from "./_components/(root)/SmoothScroll/SmoothScroll";
import ScrollToTop from "./_components/(root)/ScrollToTop/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: data-theme is set by the inline script before
    // React hydrates, so the attribute value differs between server and client.
    // This suppresses the hydration mismatch warning for the <html> element only.
    <html
      lang="en-AU"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${poxe.variable}`}
    >
      <body>
        {/* Blocking theme script — runs before paint, prevents FOUC */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />

        {/* Skip-to-main-content — first focusable element, WCAG 2.4.1 */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <SmoothScroll>
          <Navbar />
          <ScrollToTop />

          {children}
        </SmoothScroll>

        {/* Site-wide JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
