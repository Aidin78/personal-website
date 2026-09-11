import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { getProfileName, profile } from "@/content/profile";
import { PageShell } from "@/components/ui/PageShell";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";

export async function ContactPageContent() {
  const t = await getTranslations("contact");
  const tHome = await getTranslations("home");
  const displayName = getProfileName(await getLocale());

  return (
    <PageShell>
      <Section className="pt-10 sm:pt-16 pb-24">
        <div className="grid items-stretch gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="flex flex-col gap-4">
            <div className="overflow-hidden border border-border">
              <div className="relative h-72 sm:h-80 lg:h-[22rem]">
                <Image
                  src={profile.portraitPath}
                  alt={`${displayName} — ${t("availability")}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                />
              </div>
            </div>
            <div className="glass-card flex-1 space-y-4 p-6">
              <p className="inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground">
                <span className="h-1.5 w-1.5 shrink-0 bg-emerald-500" aria-hidden />
                {t("availableBadge")}
              </p>
              <div>
                <p className="font-display text-2xl font-bold">{displayName}</p>
                <p className="mt-1.5 text-sm text-muted">{t("availability")}</p>
              </div>
              <p className="flex items-center gap-2 text-sm text-muted">
                <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                {tHome("locationTag")}
              </p>
              <p className="text-sm leading-relaxed text-muted">{t("panelNote")}</p>
            </div>
          </aside>

          <div className="glass-card p-6 sm:p-8">
            <SectionHeading title={t("title")} subtitle={t("subtitle")} as="h1" />

            <div className="mt-6 grid gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-start gap-4 border border-border bg-surface px-5 py-4 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-surface-solid text-accent transition-colors group-hover:border-accent">
                  <Mail className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-muted">
                    {t("email")}
                  </span>
                  <span className="mt-1 block break-all text-base font-medium text-foreground" dir="ltr">
                    {profile.email}
                  </span>
                </span>
              </a>

              <a
                href={`tel:${profile.phoneTel}`}
                className="group flex items-start gap-4 border border-border bg-surface px-5 py-4 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-surface-solid text-accent transition-colors group-hover:border-accent">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-muted">
                    {t("phone")}
                  </span>
                  <span className="mt-1 block text-base font-medium text-foreground" dir="ltr">
                    {profile.phone}
                  </span>
                </span>
              </a>
            </div>

            <p className="mt-6 text-sm font-semibold text-foreground">{t("socialTitle")}</p>
            <SocialLinks showEmail={false} className="mt-3" />
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
