import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    // Required for static export (no image optimizer server on cPanel).
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
