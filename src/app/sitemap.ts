import type { MetadataRoute } from "next";
import { projects, projectsEnabled } from "@/content/projects";
import { routing } from "@/i18n/routing";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aidinsahebi.vercel.app";

const staticPaths = projectsEnabled
  ? ["", "/about", "/projects", "/contact"]
  : ["", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((alt) => [alt, `${siteUrl}/${alt}${path}`]),
          ),
        },
      });
    }

    if (projectsEnabled) {
      for (const project of projects) {
        const path = `/projects/${project.slug}`;
        entries.push({
          url: `${siteUrl}/${locale}${path}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              routing.locales.map((alt) => [alt, `${siteUrl}/${alt}${path}`]),
            ),
          },
        });
      }
    }
  }

  return entries;
}
