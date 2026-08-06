import type { LocalizedString } from "@/content/i18n";

export type ExperienceItem = {
  company: LocalizedString;
  role: LocalizedString;
  period: LocalizedString;
  url?: string;
};

/**
 * Periods use Jalali years as the source of truth; Gregorian is approximate year-level.
 * Current concurrent roles first, then past roles newest → oldest.
 */
export const experience: ExperienceItem[] = [
  {
    company: { en: "Talayedaran", fa: "طلایه‌داران" },
    role: {
      en: "Front-End Developer — Next.js & Blazor",
      fa: "توسعه‌دهنده فرانت‌اند — Next.js و Blazor",
    },
    period: { en: "2026 – Present", fa: "۱۴۰۵ – اکنون" },
  },
  {
    company: { en: "Etemadmelal", fa: "اعتماد ملل" },
    role: {
      en: "Development & Support",
      fa: "توسعه و پشتیبانی",
    },
    period: { en: "2025 – Present", fa: "۱۴۰۴ – اکنون" },
    url: "https://etemadmelal.com",
  },
  {
    company: { en: "Niafam", fa: "نیافام" },
    role: {
      en: "Frontend Developer & UI Designer",
      fa: "توسعه‌دهنده فرانت‌اند و طراح UI",
    },
    period: { en: "2022 – Present", fa: "۱۴۰۱ – اکنون" },
    url: "https://niafam.com",
  },
  {
    company: { en: "Neevaa", fa: "نیوا" },
    role: {
      en: "Front-End Developer",
      fa: "توسعه‌دهنده فرانت‌اند",
    },
    period: { en: "2020 – 2025", fa: "۱۳۹۹ – ۱۴۰۴" },
  },
  {
    company: { en: "Reoweb Co", fa: "ریووب" },
    role: {
      en: "Front-End Developer",
      fa: "توسعه‌دهنده فرانت‌اند",
    },
    period: { en: "2017 – 2019", fa: "۱۳۹۶ – ۱۳۹۸" },
  },
];
