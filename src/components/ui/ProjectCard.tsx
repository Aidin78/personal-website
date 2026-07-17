import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { LocalizedProject } from "@/content/projects";
import { Link } from "@/i18n/navigation";

type ProjectCardProps = {
  project: LocalizedProject;
  visitLabel: string;
  featured?: boolean;
  index?: number;
};

const categoryColors: Record<LocalizedProject["category"], string> = {
  government: "from-violet-600/80 to-indigo-900/80",
  enterprise: "from-sky-600/80 to-blue-900/80",
  municipality: "from-emerald-600/80 to-teal-900/80",
  education: "from-fuchsia-600/80 to-purple-900/80",
};

export function ProjectCard({
  project,
  visitLabel,
  featured = false,
  index = 0,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group modern-panel image-shine flex h-full flex-col overflow-hidden rounded-[1.75rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10 ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
      } ${index % 5 === 0 && !featured ? "md:col-span-2 md:grid md:grid-cols-[1.1fr_0.9fr]" : ""}`}
    >
      <div
        className={`relative overflow-hidden ${
          featured || index % 5 === 0
            ? "min-h-64 md:min-h-full"
            : "aspect-[16/10]"
        }`}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={
            featured || index % 5 === 0
              ? "(max-width: 1024px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${categoryColors[project.category]}`}
        />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-semibold capitalize text-white backdrop-blur-md">
            {project.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {project.year}
            </p>
            <h3 className="font-display text-2xl font-bold text-foreground transition-colors group-hover:text-accent">
              {project.title}
            </h3>
          </div>
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>
        <span className="text-sm font-semibold text-accent">{visitLabel}</span>
      </div>
    </Link>
  );
}
