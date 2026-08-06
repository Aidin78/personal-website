import type { MetadataRoute } from "next";
import { projects, projectsEnabled } from "@/content/projects";
import { routing } from "@/i18n/routing";
import { absoluteLanguageAlternates, localePath, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const staticPaths = projectsEnabled
  ? ["", "/about", "/projects", "/contact"]
  : ["", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      const localized = localePath(locale, path);
      entries.push({
        url: `${SITE_URL}${localized}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
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
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: {
            languages: { ...absoluteLanguageAlternates(path) },
          },
        });
      }
    }
  }

  return entries;
}
