import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { experience } from "@/content/experience";
import { tContent } from "@/content/i18n";
import { getProfileName, profile } from "@/content/profile";
import { skills } from "@/content/skills";
import { stats } from "@/content/stats";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";

export async function AboutPageContent() {
  const about = await getTranslations("about");
  const experienceT = await getTranslations("experience");
  const skillsT = await getTranslations("skills");
  const home = await getTranslations("home");
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
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="mx-auto flex w-full max-w-sm flex-col gap-4 lg:sticky lg:top-24">
            <div className="overflow-hidden border border-border">
              <Image
                src={profile.portraitPath}
                alt={`${displayName} — portrait`}
                width={600}
                height={720}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <span className="field-label justify-center lg:justify-start">
              {home("locationTag")}
            </span>
          </div>

          <div className="space-y-8">
            <SectionHeading
              eyebrow={about("title")}
              title={displayName}
              subtitle={about("summary")}
              as="h1"
            />
            <div className="space-y-4 text-base leading-relaxed text-muted">
              <p>{about("description")}</p>
              <p>{about("description2")}</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-transparent hover:text-foreground"
            >
              {about("ctaContact")}
            </Link>
            <div className="divide-y divide-border border-y border-border">
              {highlights.map((item, index) => (
                <div key={item} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="shrink-0 font-display text-sm font-bold text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <span className="field-label mb-6">{about("statsEyebrow")}</span>
        <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.labelKey} className="bg-background p-6">
              <p className="font-display text-3xl font-bold signal-text sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {home(stat.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title={experienceT("title")} />
        <div className="relative space-y-0">
          <div className="absolute start-4 top-0 hidden h-full w-px bg-border sm:block" />
          {experience.map((item, index) => {
            const company = tContent(item.company, locale);
            const role = tContent(item.role, locale);
            const period = tContent(item.period, locale);
            return (
            <article
              key={`${company}-${period}`}
              className="relative grid gap-4 pb-10 sm:grid-cols-[120px_1fr] sm:gap-8"
            >
              <div className="hidden sm:block">
                <div className="relative z-10 mt-1 h-3 w-3 border-4 border-background bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_25%,transparent)]" />
              </div>
              <div className="glass-card p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold">
                      {company}
                    </h3>
                    <p className="mt-1 text-muted">{role}</p>
                  </div>
                  <p className="border border-border bg-surface px-3 py-1 text-sm text-muted">
                    {period.replace("Present", experienceT("present"))}
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
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionHeading title={skillsT("title")} />
        <div className="grid gap-5 md:grid-cols-3">
          {skills.map((group, index) => (
            <div
              key={group.category}
              className={`glass-card p-6 ${
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
                    className="border border-border bg-surface px-3 py-1.5 text-sm text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="pb-24 pt-8 sm:pt-12">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="border border-border p-8 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-3">
                <h2 className="font-display text-3xl font-bold sm:text-4xl">
                  {home("ctaTitle")}
                </h2>
                <p className="max-w-2xl text-muted">{home("ctaSubtitle")}</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-transparent hover:text-foreground"
              >
                {home("ctaButton")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
