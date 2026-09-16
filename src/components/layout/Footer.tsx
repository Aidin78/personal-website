import { getLocale, getTranslations } from "next-intl/server";
import { getProfileName, profile } from "@/content/profile";
import { projectsEnabled } from "@/content/projects";
import { Link } from "@/i18n/navigation";
import { SocialLinks } from "@/components/ui/SocialLinks";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const locale = await getLocale();
  const displayName = getProfileName(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-surface-solid/80">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4 text-center md:text-start">
          <Link href="/" className="font-display text-2xl font-bold">
            <span className="signal-text">{displayName}</span>
          </Link>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted md:mx-0">
            {t("tagline")}
          </p>
          <SocialLinks showEmail={false} className="justify-center md:justify-start" />
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-3 text-center sm:text-start">
            <p className="font-semibold text-foreground">{t("navigation")}</p>
            <div className="flex flex-col items-center gap-2 text-muted sm:items-start">
              <Link href="/" className="transition-colors hover:text-accent">
                {nav("home")}
              </Link>
              <Link href="/about" className="transition-colors hover:text-accent">
                {nav("about")}
              </Link>
              {projectsEnabled ? (
                <Link href="/projects" className="transition-colors hover:text-accent">
                  {nav("projects")}
                </Link>
              ) : null}
              <Link href="/contact" className="transition-colors hover:text-accent">
                {nav("contact")}
              </Link>
            </div>
          </div>
          <div className="space-y-3 text-center sm:text-start">
            <p className="font-semibold text-foreground">{t("connect")}</p>
            <div className="flex flex-col items-center gap-2 text-muted sm:items-start">
              <a
                href={`mailto:${profile.email}`}
                dir="ltr"
                className="transition-colors hover:text-accent"
              >
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phoneTel}`}
                dir="ltr"
                className="transition-colors hover:text-accent"
              >
                {profile.phone}
              </a>
              <a
                href={profile.social.github}
                target="_blank"
                rel="me noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {t("github")}
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="me noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {t("linkedin")}
              </a>
              <a
                href={profile.social.dribbble}
                target="_blank"
                rel="me noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {t("dribbble")}
              </a>
              <a
                href={profile.resumePath}
                download
                className="transition-colors hover:text-accent"
              >
                {nav("cv")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-6 py-5 text-center text-sm text-muted md:justify-start md:text-start">
          <p>
            © {year} {displayName}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
