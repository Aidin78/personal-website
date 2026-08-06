import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { ProjectsPageContent } from "@/components/pages/ProjectsPageContent";
import { projectsEnabled } from "@/content/projects";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  localePath,
  webPageJsonLd,
} from "@/lib/seo";

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!projectsEnabled) {
    return {
      title: "Projects",
      robots: { index: false, follow: false },
    };
  }

  const t = await getTranslations({ locale, namespace: "projects" });

  return buildPageMetadata({
    locale,
    path: "/projects",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!projectsEnabled) {
    redirect(localePath(locale));
  }

  const t = await getTranslations({ locale, namespace: "projects" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            locale,
            path: "/projects",
            title: t("title"),
            description: t("subtitle"),
          }),
          breadcrumbJsonLd(locale, [
            { name: tNav("home"), path: "" },
            { name: tNav("projects"), path: "/projects" },
          ]),
        ]}
      />
      <ProjectsPageContent />
    </>
  );
}
