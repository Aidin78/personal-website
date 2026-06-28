import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ProjectItem } from "@/content/projects";
import { Link } from "@/i18n/navigation";

type FeaturedProjectsShowcaseProps = {
  projects: ProjectItem[];
};

const categoryGradients: Record<ProjectItem["category"], string> = {
  government: "from-violet-600/90 via-indigo-700/70 to-transparent",
  enterprise: "from-sky-600/90 via-blue-700/70 to-transparent",
  municipality: "from-emerald-600/90 via-teal-700/70 to-transparent",
  education: "from-fuchsia-600/90 via-purple-700/70 to-transparent",
};

function ShowcaseCard({
  project,
  visitLabel,
  categoryLabel,
  large = false,
  wide = false,
}: {
  project: ProjectItem;
  visitLabel: string;
  categoryLabel: string;
  large?: boolean;
  wide?: boolean;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group showcase-card relative block overflow-hidden rounded-[1.75rem] border border-border ${
        large ? "h-full min-h-[320px] lg:min-h-full" : wide ? "min-h-[220px]" : "min-h-[220px] lg:min-h-[250px]"
      }`}
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes={
          large
            ? "(max-width: 1024px) 100vw, 50vw"
            : wide
              ? "100vw"
              : "(max-width: 768px) 100vw, 25vw"
        }
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t ${categoryGradients[project.category]} via-black/25 to-black/10`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                {categoryLabel}
              </span>
              <span className="text-xs font-medium text-white/70">{project.year}</span>
            </div>
            <h3
              className={`font-display font-bold text-white ${
                large ? "text-2xl sm:text-4xl" : wide ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
              }`}
            >
              {project.title}
            </h3>
            {(large || wide) && (
              <p className="max-w-2xl text-sm text-white/75 sm:text-base">
                {project.description}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/90">
              {visitLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-white group-hover:text-foreground">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export async function FeaturedProjectsShowcase({
  projects,
}: FeaturedProjectsShowcaseProps) {
  const t = await getTranslations("projects");
  const [hero, second, third, fourth] = projects;

  if (!hero) return null;

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="grid gap-4 md:gap-5 lg:grid-cols-3 lg:grid-rows-2">
        <div className="lg:col-span-2 lg:row-span-2">
          <ShowcaseCard
            project={hero}
            visitLabel={t("viewCaseStudy")}
            categoryLabel={t(`categories.${hero.category}`)}
            large
          />
        </div>
        {second ? (
          <ShowcaseCard
            project={second}
            visitLabel={t("viewCaseStudy")}
            categoryLabel={t(`categories.${second.category}`)}
          />
        ) : null}
        {third ? (
          <ShowcaseCard
            project={third}
            visitLabel={t("viewCaseStudy")}
            categoryLabel={t(`categories.${third.category}`)}
          />
        ) : null}
      </div>
      {fourth ? (
        <ShowcaseCard
          project={fourth}
          visitLabel={t("viewCaseStudy")}
          categoryLabel={t(`categories.${fourth.category}`)}
          wide
        />
      ) : null}
    </div>
  );
}
