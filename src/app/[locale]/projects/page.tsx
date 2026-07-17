import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProjectsPageContent } from "@/components/pages/ProjectsPageContent";
import { projectsEnabled } from "@/content/projects";

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  if (!projectsEnabled) notFound();

  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectsPageContent />;
}
