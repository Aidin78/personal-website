import type { LocalizedString } from "@/content/i18n";

export const proof = {
  /** Flip to true when GitHub pins / Dribbble shots should show on the home page. */
  enabled: true,
  githubUsername: "Aidin78",
  /** Display order for home GitHub cards — metadata is filled from the API. */
  githubRepos: [
    "personal-website",
    "Etemad-Melal",
    "huntFlow",
    "ui-portfolio",
    "Quantitative-Trading",
    "blazor-app",
  ],
  dribbbleUsername: "aidin78",
  /**
   * Local WebP mirrors of Dribbble shots (no CDN at runtime — better for Iran/VPN).
   * Re-run `node scripts/optimize-assets.mjs` to refresh.
   */
  dribbbleShots: [
    {
      id: "22590088",
      title: {
        en: "Multi-lang website — intro",
        fa: "وب‌سایت چندزبانه — صفحه معرفی",
      },
      image: "/images/dribbble/22590088.webp",
    },
    {
      id: "22558795",
      title: {
        en: "Organization of nomadic affairs",
        fa: "سازمان امور عشایر",
      },
      image: "/images/dribbble/22558795.webp",
    },
    {
      id: "22557112",
      title: {
        en: "Government organization",
        fa: "سازمان دولتی",
      },
      image: "/images/dribbble/22557112.webp",
    },
    {
      id: "22556701",
      title: {
        en: "Insurance company design",
        fa: "طراحی شرکت بیمه",
      },
      image: "/images/dribbble/22556701.webp",
    },
    {
      id: "22543931",
      title: {
        en: "Oil refining company",
        fa: "شرکت پالایش نفت",
      },
      image: "/images/dribbble/22543931.webp",
    },
    {
      id: "22393381",
      title: {
        en: "Kerman governorate",
        fa: "استانداری کرمان",
      },
      image: "/images/dribbble/22393381.webp",
    },
  ] satisfies { id: string; title: LocalizedString; image: string }[],
} as const;
