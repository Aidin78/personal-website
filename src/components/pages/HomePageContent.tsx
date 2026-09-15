import { getLocale, getTranslations } from "next-intl/server";
import { getProfileName } from "@/content/profile";
import { getLocalizedFeaturedProjects, projectsEnabled } from "@/content/projects";
import { services, techStack } from "@/content/home";
import { stats } from "@/content/stats";
import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/ui/Marquee";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedProjectsShowcase } from "@/components/home/FeaturedProjectsShowcase";
import { HeroCodePanel } from "@/components/home/HeroCodePanel";
import { HomeGamingBanner } from "@/components/home/HomeGamingBanner";
import { ProofShowcase } from "@/components/home/ProofShowcase";
import { getPinnedRepos } from "@/lib/github";
import { proof } from "@/content/proof";

export async function HomeHero() {
  const t = await getTranslations("hero");
  const home = await getTranslations("home");
  const locale = await getLocale();
  const displayName = getProfileName(locale);
  const yearsExperience = stats.find((stat) => stat.labelKey === "yearsExperience")?.value;

  return (
    <section className="relative pb-12 pt-10 sm:pt-16 lg:pb-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="relative mx-auto hidden w-full max-w-md order-1 lg:order-2 lg:block lg:max-w-none">
            <HeroCodePanel
              name={getProfileName("en")}
              role="Front-End Developer & UI Designer"
              stack={techStack.slice(0, 4)}
              focus="Interfaces for government & enterprise platforms"
              experience={yearsExperience ? `${yearsExperience} years` : "7+ years"}
            />
          </div>

          <div className="animate-fade-up order-2 space-y-7 text-center lg:order-1 lg:space-y-9 lg:text-start">
            <div className="space-y-5">
              <h1
                className={`font-display leading-[0.95] tracking-tight text-foreground ${
                  locale === "fa"
                    ? "text-4xl font-black sm:text-5xl lg:text-[4.75rem]"
                    : "text-5xl font-bold sm:text-6xl lg:text-[6rem]"
                }`}
              >
                {displayName}
              </h1>
              <p className="max-w-xl text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                {t("title")}
              </p>
              <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {t("pitch")}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-transparent hover:text-foreground"
              >
                {home("ctaButton")}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-y border-border py-5 lg:mt-20">
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
      <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.labelKey} className="bg-background p-6">
            <p className="font-display text-3xl font-bold signal-text sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t(stat.labelKey)}
            </p>
          </div>
        ))}
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
      <div className="divide-y divide-border border-y border-border">
        {services.map(({ key }) => (
          <div
            key={key}
            className="grid gap-2 py-8 sm:grid-cols-[1fr_2fr] sm:items-baseline sm:gap-10"
          >
            <h3 className="font-display text-xl font-bold">
              {t(`services.${key}.title`)}
            </h3>
            <p className="max-w-2xl text-sm leading-relaxed text-muted">
              {t(`services.${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export async function HomeFeaturedProjects() {
  if (!projectsEnabled) return null;

  const t = await getTranslations("projects");
  const home = await getTranslations("home");
  const locale = await getLocale();
  const featured = getLocalizedFeaturedProjects(locale);

  return (
    <Section>
      <SectionHeading
        eyebrow={home("featuredEyebrow")}
        title={t("title")}
        subtitle={home("featuredSubtitle")}
      />
      <FeaturedProjectsShowcase projects={featured} />
      <div className="mt-10 flex justify-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground"
        >
          {home("viewAllProjects")}
        </Link>
      </div>
    </Section>
  );
}

export async function HomeProof() {
  if (!proof.enabled) return null;

  const t = await getTranslations("proof");
  const repos = await getPinnedRepos();

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <ProofShowcase repos={repos} />
    </Section>
  );
}

export async function HomeCta() {
  const t = await getTranslations("home");

  return (
    <section className="pt-8 pb-24 sm:pt-12">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="border border-border p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                {t("ctaTitle")}
              </h2>
              <p className="max-w-2xl text-muted">{t("ctaSubtitle")}</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-transparent hover:text-foreground"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function HomePageContent() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <HomeHero />
      <HomeStats />
      <HomeGamingBanner />
      <HomeServices />
      <HomeFeaturedProjects />
      <HomeProof />
      <HomeCta />
    </div>
  );
}
