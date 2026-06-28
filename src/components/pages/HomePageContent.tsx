import Image from "next/image";
import {
  ArrowRight,
  Download,
  Layers,
  Palette,
  Sparkles,
  Code2,
  Briefcase,
  Globe,
  Zap,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { getProfileName, profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { services, techStack } from "@/content/home";
import { stats } from "@/content/stats";
import { Link } from "@/i18n/navigation";
import { AnimatedGridBackground } from "@/components/ui/AnimatedGridBackground";
import { Marquee } from "@/components/ui/Marquee";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedProjectsShowcase } from "@/components/home/FeaturedProjectsShowcase";
import { HeroFloatingElements } from "@/components/home/HeroFloatingElements";

const serviceIcons = {
  palette: Palette,
  code: Code2,
  layers: Layers,
};

const statIcons = [Briefcase, Globe, Zap, Sparkles];

export async function HomeHero() {
  const t = await getTranslations("hero");
  const home = await getTranslations("home");
  const locale = await getLocale();
  const displayName = getProfileName(locale);
  const nameParts = displayName.split(" ");

  return (
    <section className="home-hero relative overflow-hidden pb-8 pt-6 sm:pt-10">
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t("badge")}
          </div>
          <span className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
            {home("locationTag")}
          </span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                {t("greeting")}
              </p>
              <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-[5.5rem]">
                {nameParts.map((part, index) => (
                  <span key={`${part}-${index}`} className={index === 0 ? "gradient-text" : ""}>
                    {part}{" "}
                  </span>
                ))}
              </h1>
              <p className="max-w-xl text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                {t("title")}
              </p>
              <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {t("pitch")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {techStack.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-transform hover:-translate-y-0.5"
              >
                {t("viewProjects")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={profile.resumePath}
                download
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <Download className="h-4 w-4" />
                {t("downloadCv")}
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <HeroFloatingElements />
            <div className="absolute -inset-6 animate-pulse-glow rounded-[2rem] bg-gradient-to-br from-accent/25 to-accent-secondary/25 blur-3xl" />
            <div className="modern-panel relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-border">
              <Image
                src={profile.heroImagePath}
                alt={displayName}
                width={900}
                height={700}
                priority
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            <div className="animate-float absolute -bottom-5 -start-4 modern-panel rounded-2xl p-4 shadow-xl sm:-start-8">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-accent/30">
                  <Image
                    src={profile.avatarPath}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="font-display text-sm font-bold">{displayName}</p>
                  <p className="text-xs text-muted">{t("title")}</p>
                </div>
              </div>
            </div>

            <div className="animate-float-delay-2 absolute -end-2 top-8 modern-panel rounded-2xl px-4 py-3 shadow-lg sm:-end-6">
              <p className="font-display text-2xl font-bold gradient-text">30+</p>
              <p className="text-xs text-muted">{home("projectsDelivered")}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-y border-border py-5">
          <Marquee items={techStack} />
        </div>
      </div>
    </section>
  );
}

export async function HomeStats() {
  const t = await getTranslations("home");

  return (
    <Section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = statIcons[index] ?? Sparkles;
          return (
            <div
              key={stat.labelKey}
              className="modern-panel group rounded-3xl p-6 transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display text-4xl font-bold gradient-text">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(stat.labelKey)}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export async function HomeServices() {
  const t = await getTranslations("home");

  return (
    <Section>
      <SectionHeading
        eyebrow={t("servicesEyebrow")}
        title={t("servicesTitle")}
        subtitle={t("servicesSubtitle")}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {services.map(({ key, icon }) => {
          const Icon = serviceIcons[icon as keyof typeof serviceIcons];
          return (
            <div
              key={key}
              className="modern-panel group rounded-[1.75rem] p-6 transition-all hover:-translate-y-1 hover:border-accent/30"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent-secondary/10 text-accent">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold">{t(`services.${key}.title`)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t(`services.${key}.description`)}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export async function HomeFeaturedProjects() {
  const t = await getTranslations("projects");
  const home = await getTranslations("home");

  return (
    <Section className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <SectionHeading
        eyebrow={home("featuredEyebrow")}
        title={t("title")}
        subtitle={home("featuredSubtitle")}
      />
      <FeaturedProjectsShowcase projects={featuredProjects} />
      <div className="mt-10 flex justify-center">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-accent hover:bg-accent hover:text-accent-foreground"
        >
          {home("viewAllProjects")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Section>
  );
}

export async function HomeCta() {
  const t = await getTranslations("home");

  return (
    <Section className="pb-24">
      <div className="modern-panel relative overflow-hidden rounded-[2rem] p-8 sm:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-secondary/10" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-3">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="max-w-2xl text-muted">{t("ctaSubtitle")}</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            {t("ctaButton")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}

export async function HomePageContent() {
  return (
    <div className="home-shell relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <AnimatedGridBackground capsules organic />
      <HomeHero />
      <HomeStats />
      <HomeServices />
      <HomeFeaturedProjects />
      <HomeCta />
    </div>
  );
}
