import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  getAllProjectSlugs,
  getLocalizedProjectBySlug,
  getProjectBySlug,
} from "@/content/projects";
import { ProjectDetailContent } from "@/components/pages/ProjectDetailContent";

type ProjectDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllProjectSlugs().flatMap((slug) =>
    ["en", "fa"].map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getLocalizedProjectBySlug(slug, locale);

  if (!project) {
    return { title: "Project not found" };
  }

  const t = await getTranslations({ locale, namespace: "projects" });

  return {
    title: `${project.title} — ${t("title")}`,
    description: project.overview,
    openGraph: {
      title: project.title,
      description: project.overview,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!getProjectBySlug(slug)) {
    notFound();
  }

  return <ProjectDetailContent slug={slug} />;
}
