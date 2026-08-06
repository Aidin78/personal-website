import type { Metadata } from "next";
import { getProfileName, profile } from "@/content/profile";
import { routing } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aidinsahebi.ir";

export const SITE_NAME = "Aidin Sahebi";

/**
 * Significant content revision date for sitemap lastmod (YYYY-MM-DD).
 * Update this when primary copy, structure, or indexable pages change —
 * not on every rebuild.
 */
export const SITE_CONTENT_LASTMOD = "2026-08-06";

/** Locale path with trailing slash to match `trailingSlash: true`. */
export function localePath(locale: string, path = ""): string {
  const clean = path.replace(/^\/|\/$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

export function absoluteUrl(locale: string, path = ""): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

export function languageAlternates(path = "") {
  return {
    en: localePath("en", path),
    fa: localePath("fa", path),
    "x-default": localePath("en", path),
  } as const;
}

export function absoluteLanguageAlternates(path = "") {
  return {
    en: absoluteUrl("en", path),
    fa: absoluteUrl("fa", path),
    "x-default": absoluteUrl("en", path),
  } as const;
}

export function pageAlternates(locale: string, path = "") {
  return {
    canonical: localePath(locale, path),
    languages: { ...languageAlternates(path) },
  };
}

export function openGraphLocale(locale: string) {
  return locale === "fa" ? "fa_IR" : "en_US";
}

type BuildPageMetadataInput = {
  locale: string;
  path?: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  /** Skip title template (use for the homepage default title). */
  absoluteTitle?: boolean;
};

export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  image = profile.portraitPath,
  type = "website",
  noIndex = false,
  absoluteTitle = false,
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(locale, path);
  const ogLocale = openGraphLocale(locale);
  const alternateLocale = routing.locales
    .filter((item) => item !== locale)
    .map((item) => openGraphLocale(item));

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: pageAlternates(locale, path),
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      type,
      locale: ogLocale,
      alternateLocale,
      siteName: SITE_NAME,
      images: [{ url: image, alt: getProfileName(locale) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function personJsonLd(locale: string) {
  const name = getProfileName(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name,
    url: absoluteUrl(locale),
    image: `${SITE_URL}${profile.portraitPath}`,
    email: profile.email,
    telephone: profile.phoneTel,
    jobTitle: "Front-End Developer & UI Designer",
    sameAs: Object.values(profile.social),
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "UI Design",
      "Front-End Development",
    ],
  };
}

export function websiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: [...routing.locales],
    publisher: { "@id": `${SITE_URL}/#person` },
  };
}

export function webPageJsonLd({
  locale,
  path = "",
  title,
  description,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(locale, path)}#webpage`,
    url: absoluteUrl(locale, path),
    name: title,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    inLanguage: locale,
  };
}

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}
