"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: ErrorProps) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      <p className="text-sm leading-relaxed text-muted">{t("description")}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
