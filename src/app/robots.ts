import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Allow full crawl. Disabled project stubs are handled by Apache 301s in
 * generated .htaccess (not robots Disallow) so Google can see the redirect
 * and consolidate signals to the homepage.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
