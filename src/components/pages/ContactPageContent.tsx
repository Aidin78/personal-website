import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getProfileName, profile } from "@/content/profile";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";

export async function ContactPageContent() {
  const t = await getTranslations("contact");
  const tSocial = await getTranslations("social");
  const locale = await getLocale();
  const displayName = getProfileName(locale);

  return (
    <PageShell>
      <Section className="pt-10 sm:pt-16 pb-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="glass-card overflow-hidden rounded-[2rem]">
            <div className="relative min-h-72">
              <Image
                src={profile.heroImagePath}
                alt={`${displayName} — ${t("availability")}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="font-display text-3xl font-bold text-white">
                  {displayName}
                </p>
                <p className="mt-2 text-white/80">{t("availability")}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-8 sm:p-10">
            <SectionHeading title={t("title")} subtitle={t("subtitle")} as="h1" />
            <SocialLinks emailLabel={t("email")} className="mt-2" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {(Object.entries(profile.social) as [keyof typeof profile.social, string][]).map(
                ([key, href]) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="rounded-2xl border border-border bg-surface px-4 py-4 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {tSocial(key)}
                  </a>
                ),
              )}
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex text-sm font-semibold text-accent transition-opacity hover:opacity-80"
            >
              {t("aboutLink")}
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
