export type LocalizedString = string | { en: string; fa: string };

export function tContent(value: LocalizedString, locale: string): string {
  if (typeof value === "string") return value;
  return locale === "fa" ? value.fa : value.en;
}

export function tContentList(values: LocalizedString[], locale: string): string[] {
  return values.map((value) => tContent(value, locale));
}
