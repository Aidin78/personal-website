"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const shortLabel: Record<string, string> = {
  en: "EN",
  fa: "فا",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("locale");

  const otherLocale = routing.locales.find((item) => item !== locale) ?? "en";

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      hrefLang={otherLocale}
      className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
      aria-label={t("switchTo", { locale: t(otherLocale) })}
    >
      {shortLabel[locale] ?? locale.toUpperCase()}
      <ChevronDown className="h-3.5 w-3.5" aria-hidden />
    </Link>
  );
}
