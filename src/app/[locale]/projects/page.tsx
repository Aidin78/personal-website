import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { ProjectsPageContent } from "@/components/pages/ProjectsPageContent";
import { projectsEnabled } from "@/content/projects";

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!projectsEnabled) {
    return { title: "Projects" };
  }

  const t = await getTranslations({ locale, namespace: "projects" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!projectsEnabled) {
    redirect(`/${locale}`);
  }

  return <ProjectsPageContent />;
}
