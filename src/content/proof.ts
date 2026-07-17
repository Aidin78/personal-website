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
   * Shot embeds are blocked by Dribbble (X-Frame-Options: SAMEORIGIN),
   * so we show CDN thumbnails that link to the shot page.
   */
  dribbbleShots: [
    {
      id: "22590088",
      title: {
        en: "Multi-lang website — intro",
        fa: "وب‌سایت چندزبانه — صفحه معرفی",
      },
      image:
        "https://cdn.dribbble.com/userupload/10148182/file/original-432327ba34cce9252e73a1b43a71618e.png?resize=800x600",
    },
    {
      id: "22558795",
      title: {
        en: "Organization of nomadic affairs",
        fa: "سازمان امور عشایر",
      },
      image:
        "https://cdn.dribbble.com/userupload/10064319/file/original-58952c4958167b6b39e7f8296719964c.png?resize=800x600",
    },
    {
      id: "22557112",
      title: {
        en: "Government organization",
        fa: "سازمان دولتی",
      },
      image:
        "https://cdn.dribbble.com/userupload/10060368/file/original-10391ccd957f46a3ebb86dbf98b9c12b.png?resize=800x600",
    },
    {
      id: "22556701",
      title: {
        en: "Insurance company design",
        fa: "طراحی شرکت بیمه",
      },
      image:
        "https://cdn.dribbble.com/userupload/10059354/file/original-02f93ec73eaf2e896d609ef6f545bfd4.png?resize=800x600",
    },
    {
      id: "22543931",
      title: {
        en: "Oil refining company",
        fa: "شرکت پالایش نفت",
      },
      image:
        "https://cdn.dribbble.com/userupload/10026736/file/original-634193911321a447e8aa1f4a850ae747.png?resize=800x600",
    },
    {
      id: "22393381",
      title: {
        en: "Kerman governorate",
        fa: "استانداری کرمان",
      },
      image:
        "https://cdn.dribbble.com/userupload/9619367/file/original-8b2d9bd46583773e14e13b178b655cfa.png?resize=800x600",
    },
  ] satisfies { id: string; title: LocalizedString; image: string }[],
} as const;
