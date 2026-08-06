import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import {
  getAllProjectSlugs,
  getLocalizedProjectBySlug,
  getProjectBySlug,
  projectsEnabled,
} from "@/content/projects";
import { ProjectDetailContent } from "@/components/pages/ProjectDetailContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  localePath,
  SITE_URL,
  webPageJsonLd,
} from "@/lib/seo";

type ProjectDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  // Static export forbids an empty generateStaticParams result.
  if (!projectsEnabled) {
    return ["en", "fa"].map((locale) => ({ locale, slug: "unavailable" }));
  }

  return getAllProjectSlugs().flatMap((slug) =>
    ["en", "fa"].map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!projectsEnabled) {
    return {
      title: "Project not found",
      robots: { index: false, follow: false },
    };
  }

  const project = getLocalizedProjectBySlug(slug, locale);

  if (!project) {
    return {
      title: "Project not found",
      robots: { index: false, follow: false },
    };
  }

  const t = await getTranslations({ locale, namespace: "projects" });

  return buildPageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: `${project.title} — ${t("title")}`,
    description: project.overview,
    image: project.image,
    type: "article",
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!projectsEnabled) {
    redirect(localePath(locale));
  }

  const project = getLocalizedProjectBySlug(slug, locale);
  if (!project || !getProjectBySlug(slug)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "projects" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            locale,
            path: `/projects/${slug}`,
            title: project.title,
            description: project.overview,
          }),
          breadcrumbJsonLd(locale, [
            { name: tNav("home"), path: "" },
            { name: tNav("projects"), path: "/projects" },
            { name: project.title, path: `/projects/${slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.overview,
            url: absoluteUrl(locale, `/projects/${slug}`),
            image: `${SITE_URL}${project.image}`,
            dateCreated: project.year,
            creator: { "@id": `${SITE_URL}/#person` },
            inLanguage: locale,
            keywords: project.technologies.join(", "),
          },
        ]}
      />
      <ProjectDetailContent slug={slug} />
    </>
  );
}
