"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("locale");

  const otherLocale = routing.locales.find((item) => item !== locale) ?? "en";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: otherLocale })}
      className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
      aria-label={`Switch to ${t(otherLocale)}`}
    >
      {t(otherLocale)}
    </button>
  );
}
