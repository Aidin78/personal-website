import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Calendar, Layers, User } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getRelatedProjects,
  type ProjectCategory,
} from "@/content/projects";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectGallery } from "@/components/ui/ProjectGallery";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";

const categoryColors: Record<ProjectCategory, string> = {
  government: "bg-violet-500/15 text-violet-500",
  enterprise: "bg-sky-500/15 text-sky-500",
  municipality: "bg-emerald-500/15 text-emerald-500",
  education: "bg-fuchsia-500/15 text-fuchsia-500",
};

type ProjectDetailContentProps = {
  slug: string;
};

export async function ProjectDetailContent({ slug }: ProjectDetailContentProps) {
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations("projectDetail");
  const projectsT = await getTranslations("projects");
  const related = getRelatedProjects(slug);

  return (
    <PageShell>
      <Section className="pt-8 sm:pt-12">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToProjects")}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${categoryColors[project.category]}`}
                >
                  {projectsT(`categories.${project.category}`)}
                </span>
                <span className="text-sm text-muted">{project.year}</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-muted">
                {project.overview}
              </p>
            </div>

            <ProjectGallery
              cover={project.image}
              title={project.title}
              gallery={project.gallery}
              galleryLabel={t("gallery")}
              emptyHint={t("galleryEmptyHint", { slug: project.slug })}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="modern-panel rounded-[1.75rem] p-6">
                <h2 className="font-display text-xl font-bold">{t("overview")}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
              </div>
              <div className="modern-panel rounded-[1.75rem] p-6">
                <h2 className="font-display text-xl font-bold">{t("highlights")}</h2>
                <ul className="mt-4 space-y-3">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="relative ps-4 text-sm leading-relaxed text-muted before:absolute before:start-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="modern-panel sticky top-24 space-y-5 rounded-[1.75rem] p-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-accent" />
                <div>
                  <p className="font-medium text-foreground">{t("role")}</p>
                  <p className="text-muted">{project.role}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-accent" />
                <div>
                  <p className="font-medium text-foreground">{t("year")}</p>
                  <p className="text-muted">{project.year}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Layers className="mt-0.5 h-4 w-4 text-accent" />
                <div>
                  <p className="font-medium text-foreground">{t("technologies")}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("livePreview")}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section className="pb-24">
          <SectionHeading
            eyebrow={t("relatedEyebrow")}
            title={t("relatedProjects")}
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <ProjectCard
                key={item.slug}
                project={item}
                visitLabel={projectsT("viewCaseStudy")}
              />
            ))}
          </div>
        </Section>
      ) : null}
    </PageShell>
  );
}
