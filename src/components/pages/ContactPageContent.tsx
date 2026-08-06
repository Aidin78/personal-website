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
          <aside className="glass-card overflow-hidden rounded-[2rem]">
            <div className="relative h-full min-h-[18rem] sm:min-h-[20rem]">
              <Image
                src={profile.portraitPath}
                alt={`${displayName} — ${t("availability")}`}
                fill
                className="object-cover object-[center_18%] scale-105 blur-[2.5px]"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 sm:p-7">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {t("availableBadge")}
                </p>
                <div>
                  <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {displayName}
                  </p>
                  <p className="mt-1.5 text-sm text-white/85 sm:text-base">{t("availability")}</p>
                </div>
                <p className="flex items-center gap-2 text-sm text-white/75">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {tHome("locationTag")}
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-white/70">
                  {t("panelNote")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    {t("email")}
                  </a>
                  <a
                    href={`tel:${profile.phoneTel}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    <span dir="ltr">{profile.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <SectionHeading title={t("title")} subtitle={t("subtitle")} as="h1" />

            <div className="mt-6 grid gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-solid text-accent transition-colors group-hover:border-accent">
                  <Mail className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    {t("email")}
                  </span>
                  <span className="mt-1 block break-all text-base font-medium text-foreground" dir="ltr">
                    {profile.email}
                  </span>
                </span>
              </a>

              <a
                href={`tel:${profile.phoneTel}`}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-solid text-accent transition-colors group-hover:border-accent">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-muted">
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
