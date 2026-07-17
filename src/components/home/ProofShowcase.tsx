import Image from "next/image";
import { ArrowUpRight, GitBranch, Star } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { proof } from "@/content/proof";
import { tContent } from "@/content/i18n";
import { profile } from "@/content/profile";
import type { GithubRepoCard } from "@/lib/github";

type ProofShowcaseProps = {
  repos: GithubRepoCard[];
};

export async function ProofShowcase({ repos }: ProofShowcaseProps) {
  const t = await getTranslations("proof");
  const locale = await getLocale();

  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {t("githubLabel")}
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold">{t("githubTitle")}</h3>
          </div>
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <GitBranch className="h-4 w-4" aria-hidden />
            {t("viewGithub")}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <li key={repo.name}>
              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-card flex h-full flex-col rounded-[1.5rem] p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-lg font-bold text-foreground group-hover:text-accent">
                    {repo.name}
                  </p>
                  <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </div>
                {repo.description ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                    {repo.description}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-muted">{t("noDescription")}</p>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5 text-xs text-muted">
                  {repo.language ? (
                    <span aria-label={t("language", { language: repo.language })}>
                      {repo.language}
                    </span>
                  ) : null}
                  <span
                    className="inline-flex items-center gap-1"
                    aria-label={t("stars", { count: repo.stars })}
                  >
                    <Star className="h-3.5 w-3.5" aria-hidden />
                    {repo.stars}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {t("dribbbleLabel")}
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold">{t("dribbbleTitle")}</h3>
          </div>
          <a
            href={profile.social.dribbble}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {t("viewDribbble")}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {proof.dribbbleShots.map((shot) => {
            const title = tContent(shot.title, locale);
            const href = `https://dribbble.com/shots/${shot.id}`;
            return (
              <li key={shot.id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-[1.5rem] border border-border bg-surface-solid transition-colors hover:border-accent"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/5 dark:bg-white/5">
                    <Image
                      src={shot.image}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
                    <span className="truncate text-sm font-medium text-foreground">
                      {title}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent">
                      {t("openShot")}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
