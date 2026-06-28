import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { experience } from "@/content/experience";
import { getProfileName, profile } from "@/content/profile";
import { skills } from "@/content/skills";
import { PageShell } from "@/components/ui/PageShell";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";

export async function AboutPageContent() {
  const about = await getTranslations("about");
  const experienceT = await getTranslations("experience");
  const skillsT = await getTranslations("skills");
  const locale = await getLocale();
  const displayName = getProfileName(locale);

  const highlights = [
    about("highlight1"),
    about("highlight2"),
    about("highlight3"),
  ];

  return (
    <PageShell>
      <Section className="pt-10 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/40 to-accent-secondary/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border">
              <Image
                src={profile.avatarPath}
                alt={displayName}
                width={600}
                height={720}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading
              eyebrow={about("title")}
              title={displayName}
              subtitle={about("summary")}
            />
            <div className="space-y-4 text-base leading-relaxed text-muted">
              <p>{about("description")}</p>
              <p>{about("description2")}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-1">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="glass-card rounded-2xl px-4 py-3 text-sm leading-relaxed text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow={experienceT("title")}
          title={experienceT("title")}
        />
        <div className="relative space-y-0">
          <div className="absolute start-4 top-0 hidden h-full w-px bg-border sm:block" />
          {experience.map((item, index) => (
            <article
              key={`${item.company}-${item.period}`}
              className="relative grid gap-4 pb-10 sm:grid-cols-[120px_1fr] sm:gap-8"
            >
              <div className="hidden sm:block">
                <div className="relative z-10 mt-1 h-3 w-3 rounded-full border-4 border-background bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_25%,transparent)]" />
              </div>
              <div className="glass-card rounded-3xl p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold">
                      {item.company}
                    </h3>
                    <p className="mt-1 text-muted">{item.role}</p>
                  </div>
                  <p className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted">
                    {item.period.replace("Present", experienceT("present"))}
                  </p>
                </div>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent transition-opacity hover:opacity-80"
                  >
                    {item.url.replace("https://", "")}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="pb-24">
        <SectionHeading eyebrow={skillsT("title")} title={skillsT("title")} />
        <div className="grid gap-5 md:grid-cols-3">
          {skills.map((group, index) => (
            <div
              key={group.category}
              className={`glass-card rounded-3xl p-6 ${
                index === 0 ? "md:col-span-2 md:row-span-1" : ""
              }`}
            >
              <h3 className="font-display text-xl font-bold text-accent">
                {skillsT(group.category)}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
