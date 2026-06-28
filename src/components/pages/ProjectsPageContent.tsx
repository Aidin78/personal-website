import { getTranslations } from "next-intl/server";
import { projects } from "@/content/projects";
import { PageShell } from "@/components/ui/PageShell";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";

export async function ProjectsPageContent() {
  const t = await getTranslations("projects");

  return (
    <PageShell>
      <Section className="pb-24 pt-8 sm:pt-12">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              visitLabel={t("viewCaseStudy")}
              featured={index === 0}
              index={index}
            />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
