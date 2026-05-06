import type { NextConfig } from "next";

// =============================================================================
// SECURITY HEADERS
// Maintained here — never override or weaken in individual pages/components.
// To add a third-party integration, extend the relevant directive per AGENTS.md.
//
// CSP note: Using 'unsafe-inline' in script-src and style-src because Next.js
// App Router injects inline scripts/styles during hydration. A nonce-based
// approach (via proxy.ts) can be layered in later for stricter enforcement —
// at the cost of disabling static generation. See AGENTS.md for guidance.
// =============================================================================

const isDev = process.env.NODE_ENV === "development";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
  media-src 'self';
  object-src 'none';
  frame-src 'none';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`
  .replace(/\n/g, " ")
  .replace(/\s{2,}/g, " ")
  .trim();

const PermissionsPolicy = [
  // Hardware / sensor
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()",
  "usb=()",
  // Motion & orientation (fingerprinting / side-channel vectors)
  "accelerometer=()",
  "gyroscope=()",
  "magnetometer=()",
  "ambient-light-sensor=()",
  // Media / display
  "autoplay=()",
  "fullscreen=(self)",
  "picture-in-picture=()",
  "display-capture=()",
  // Hardware device APIs
  "serial=()",
  "hid=()",
  "bluetooth=()",
  "midi=()",
  // Privacy & identity
  "local-fonts=()",
  "identity-credentials-get=()",
  // XR / spatial
  "xr-spatial-tracking=()",
  // Misc browser APIs not used by this site
  "window-management=()",
  "screen-wake-lock=()",
  "gamepad=()",
  // Privacy Sandbox — explicit opt-out
  // interest-cohort (FLoC) and browsing-topics removed: Chrome dropped these
  // from the Permissions Policy spec; they generate unrecognized-feature warnings.
  // Remaining directives below still enforce opt-out of ad-targeting APIs.
  "join-ad-interest-group=()",
  "run-ad-auction=()",
  "attribution-reporting=()",
].join(", ");

const nextConfig: NextConfig = {
  reactCompiler: true,

  // ---------------------------------------------------------------------------
  // Image optimisation
  // Add remote domains here when external image sources are needed.
  // ---------------------------------------------------------------------------
  images: {
    formats: ["image/webp"],
    qualities: [75, 85, 90, 100],
    remotePatterns: [],
  },

  // ---------------------------------------------------------------------------
  // Security & performance headers — applied to every route
  // ---------------------------------------------------------------------------
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // CSP
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
          // Clickjacking — belt-and-suspenders alongside frame-ancestors
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // DNS prefetch for performance
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // Referrer — send origin only, no full URL to third parties
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // HSTS — force HTTPS for 2 years, include subdomains, preload-ready
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Cross-origin isolation — Spectre-class protection
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          // Blocks cross-origin window.opener access
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          // COEP deliberately omitted — would break future Google Maps iframes
          // Permissions-Policy — 27-directive set, Privacy Sandbox opt-out included
          { key: "Permissions-Policy", value: PermissionsPolicy },
        ],
      },
    ];
  },
};

export default nextConfig;
