export const profile = {
  names: {
    en: "Aidin Sahebi",
    fa: "آیدین صاحبی",
  },
  resumePath: "/CV-en.pdf",
  email: "",
  avatarPath: "/images/profile.png",
  heroImagePath: "/images/hero-visual.png",
  social: {
    linkedin: "https://linkedin.com/in/aidin78",
    dribbble: "https://dribbble.com/aidin78",
    codepen: "https://codepen.io/Aidin-Sahebi",
    github: "https://github.com/Aidin78",
  },
} as const;

export type SocialKey = keyof typeof profile.social;

export function getProfileName(locale: string) {
  return locale === "fa" ? profile.names.fa : profile.names.en;
}

export function getProfileFirstName(locale: string) {
  const name = getProfileName(locale);
  return name.split(" ")[0] ?? name;
}
