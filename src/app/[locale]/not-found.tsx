import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  const nav = await getTranslations("nav");

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="field-label">{t("eyebrow")}</span>
      <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      <p className="text-sm leading-relaxed text-muted">{t("description")}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {t("home")}
        </Link>
        <Link
          href="/about"
          className="border border-border px-5 py-2.5 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {nav("about")}
        </Link>
        <Link
          href="/contact"
          className="border border-border px-5 py-2.5 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {nav("contact")}
        </Link>
      </div>
    </div>
  );
}
