import type { NextConfig } from "next";

/** Essays that used to live under /writing. Kept so old inbound links land. */
const RETIRED_WRITING_PATHS = [
  "/writing",
  "/writing/slop-might-save-your-startup",
  "/writing/what-ai-wont-fix",
  "/writing/when-ai-gets-your-types-wrong",
  "/writing/the-rise-of-generalist-leaders",
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.licdn.com",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    return RETIRED_WRITING_PATHS.map((source) => ({
      source,
      destination: "/",
      permanent: true,
    }));
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
