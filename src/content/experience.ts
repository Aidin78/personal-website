import type { LocalizedString } from "@/content/i18n";

export type ExperienceItem = {
  company: LocalizedString;
  role: LocalizedString;
  period: LocalizedString;
  url?: string;
};

export const experience: ExperienceItem[] = [
  {
    company: { en: "Reoweb Co", fa: "ریووب" },
    role: {
      en: "Front-End Developer",
      fa: "توسعه‌دهنده فرانت‌اند",
    },
    period: { en: "2025 – Present", fa: "۱۴۰۴ – اکنون" },
  },
  {
    company: { en: "Talayedaran", fa: "طلایه‌داران" },
    role: {
      en: "Front-End Developer — Next.js",
      fa: "توسعه‌دهنده فرانت‌اند — Next.js",
    },
    period: { en: "2025 – Present", fa: "۱۴۰۴ – اکنون" },
  },
  {
    company: { en: "Niafam", fa: "نیافام" },
    role: {
      en: "Frontend Developer & UI Designer",
      fa: "توسعه‌دهنده فرانت‌اند و طراح UI",
    },
    period: { en: "2022 – 2025", fa: "۱۴۰۱ – ۱۴۰۴" },
    url: "https://niafam.com",
  },
  {
    company: { en: "Neevaa", fa: "نیوا" },
    role: {
      en: "Front-End Developer",
      fa: "توسعه‌دهنده فرانت‌اند",
    },
    period: { en: "2020 – 2022", fa: "۱۳۹۹ – ۱۴۰۱" },
  },
  {
    company: { en: "Etemadmelal", fa: "اعتماد ملل" },
    role: {
      en: "Development & Support",
      fa: "توسعه و پشتیبانی",
    },
    period: { en: "2017 – 2019", fa: "۱۳۹۶ – ۱۳۹۸" },
    url: "https://etemadmelal.com",
  },
];
