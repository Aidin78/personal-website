import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      <p className="text-sm leading-relaxed text-muted">{t("description")}</p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {t("home")}
      </Link>
    </div>
  );
}
