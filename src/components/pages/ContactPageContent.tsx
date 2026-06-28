import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getProfileName, profile } from "@/content/profile";
import { PageShell } from "@/components/ui/PageShell";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";

export async function ContactPageContent() {
  const t = await getTranslations("contact");
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
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
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
            <SectionHeading title={t("title")} subtitle={t("subtitle")} />
            <SocialLinks emailLabel={t("email")} className="mt-2" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {Object.entries(profile.social).map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-border bg-surface px-4 py-4 text-sm font-medium capitalize text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {key}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
