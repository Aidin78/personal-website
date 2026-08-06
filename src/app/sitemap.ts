import type { MetadataRoute } from "next";
import { projects, projectsEnabled } from "@/content/projects";
import { routing } from "@/i18n/routing";
import {
  absoluteLanguageAlternates,
  localePath,
  SITE_CONTENT_LASTMOD,
  SITE_URL,
} from "@/lib/seo";

export const dynamic = "force-static";

const staticPaths = projectsEnabled
  ? ["", "/about", "/projects", "/contact"]
  : ["", "/about", "/contact"];

/**
 * Sitemap lists only indexable, canonical, trailing-slash URLs.
 * Omits changefreq/priority (Google ignores them).
 * lastmod is a maintained content-revision date — update SITE_CONTENT_LASTMOD
 * in src/lib/seo.ts when primary page content meaningfully changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date(SITE_CONTENT_LASTMOD);

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      const localized = localePath(locale, path);
      entries.push({
        url: `${SITE_URL}${localized}`,
        lastModified,
        alternates: {
          languages: { ...absoluteLanguageAlternates(path) },
        },
      });
    }

    if (projectsEnabled) {
      for (const project of projects) {
        const path = `/projects/${project.slug}`;
        const localized = localePath(locale, path);
        entries.push({
          url: `${SITE_URL}${localized}`,
          lastModified,
          alternates: {
            languages: { ...absoluteLanguageAlternates(path) },
          },
        });
      }
    }
  }

  return entries;
}
