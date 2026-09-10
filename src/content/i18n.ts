export type LocalizedString = string | { en: string; fa: string };

export function tContent(value: LocalizedString, locale: string): string {
  if (typeof value === "string") return value;
  return locale === "fa" ? value.fa : value.en;
}

export function tContentList(values: LocalizedString[], locale: string): string[] {
  return values.map((value) => tContent(value, locale));
}

/** Renders a 1-based index as a locale-appropriate 2-digit numeral (e.g. "01" / "۰۱"). */
export function localizedIndex(n: number, locale: string): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    minimumIntegerDigits: 2,
  }).format(n);
}
