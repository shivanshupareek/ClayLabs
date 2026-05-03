import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../styles/globals.scss";

// =============================================================================
// FONTS
//
// Body:    Inter (Google Font)
// Heading: Poke (custom OTF) — PENDING font file
//
// To activate Poke:
//   1. Place Poke.otf at src/app/fonts/Poke.otf
//   2. Replace the Playfair_Display import with:
//        import localFont from "next/font/local"
//        const poke = localFont({
//          src: "./fonts/Poke.otf",
//          variable: "--font-heading",
//          display: "swap",
//          preload: false,
//          fallback: ["Georgia", "Times New Roman", "serif"],
//        })
//   3. Swap `playfairDisplay.variable` → `poke.variable` in the <html> className
// =============================================================================

// Primary body font — preloaded (drives LCP)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-body",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

// TEMPORARY heading placeholder — replace with Poke once OTF is provided
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-heading",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// =============================================================================
// METADATA
// =============================================================================

export const metadata: Metadata = {
  metadataBase: new URL("https://claylabs.com.au"),

  title: {
    default: "ClayLabs — Pottery Classes in Australia",
    template: "%s | ClayLabs",
  },

  description:
    "Join ClayLabs for intimate pottery classes in small groups. A peaceful, welcoming community-based studio in Australia for all skill levels.",

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

  authors: [{ name: "ClayLabs", url: "https://claylabs.com.au" }],
  creator: "ClayLabs",
  publisher: "ClayLabs",

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
    url: "https://claylabs.com.au",
    siteName: "ClayLabs",
    title: "ClayLabs — Pottery Classes in Australia",
    description:
      "Join ClayLabs for intimate pottery classes in small groups. A peaceful, welcoming community-based studio in Australia for all skill levels.",
    images: [
      {
        url: "/assets/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "ClayLabs — Pottery Classes in Australia",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ClayLabs — Pottery Classes in Australia",
    description:
      "Join ClayLabs for intimate pottery classes in small groups. A peaceful, welcoming community-based studio in Australia for all skill levels.",
    images: ["/assets/og/og-default.jpg"],
  },

  alternates: {
    canonical: "https://claylabs.com.au",
  },

  icons: {
    icon: [
      { url: "/assets/favicons/favicon.ico" },
      {
        url: "/assets/favicons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/assets/favicons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [{ url: "/assets/favicons/apple-touch-icon.png" }],
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
  name: "ClayLabs",
  description:
    "Intimate pottery classes in small groups. A peaceful, community-based pottery studio in Australia for all skill levels.",
  url: "https://claylabs.com.au",
  logo: "https://claylabs.com.au/assets/og/og-default.jpg",
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
        itemOffered: {
          "@type": "Course",
          name: "Pottery Classes",
          description:
            "Small-group pottery classes covering wheel throwing and handbuilding for all skill levels.",
        },
      },
    ],
  },
};

// =============================================================================
// ROOT LAYOUT
// =============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${inter.variable} ${playfairDisplay.variable}`}
    >
      <body>
        {/* Skip-to-main-content — first focusable element, WCAG 2.4.1 */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {children}

        {/* Site-wide JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
