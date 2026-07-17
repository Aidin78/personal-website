import type { LocalizedString } from "@/content/i18n";

export type ExperienceItem = {
  company: LocalizedString;
  role: LocalizedString;
  period: string;
  url?: string;
};

export const experience: ExperienceItem[] = [
  {
    company: "Reoweb Co",
    role: {
      en: "Front-End Developer",
      fa: "توسعه‌دهنده فرانت‌اند",
    },
    period: "1404 – Present",
  },
  {
    company: { en: "Talayedaran", fa: "طلایه‌داران" },
    role: {
      en: "Front-End Developer — Next.js",
      fa: "توسعه‌دهنده فرانت‌اند — Next.js",
    },
    period: "1404 – Present",
  },
  {
    company: "Niafam",
    role: {
      en: "Frontend Developer & UI Designer",
      fa: "توسعه‌دهنده فرانت‌اند و طراح UI",
    },
    period: "1401 – 1404",
    url: "https://niafam.com",
  },
  {
    company: { en: "Neevaa", fa: "نیوا" },
    role: {
      en: "Front-End Developer",
      fa: "توسعه‌دهنده فرانت‌اند",
    },
    period: "1399 – 1401",
  },
  {
    company: { en: "Etemadmelal", fa: "اعتماد ملل" },
    role: {
      en: "Development & Support",
      fa: "توسعه و پشتیبانی",
    },
    period: "1396 – 1398",
    url: "https://etemadmelal.com",
  },
];
