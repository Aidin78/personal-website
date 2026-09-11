export const profile = {
  names: {
    en: "Aidin Sahebi",
    fa: "آیدین صاحبی",
  },
  resumePath: "/CV-en.pdf",
  email: "sahebi.aidin78@gmail.com",
  /** Display number (Iran local). Use `phoneTel` for tel: links. */
  phone: "0936 384 0760",
  phoneTel: "+989363840760",
  /** Small crop for header / cards (~3KB). */
  avatarPath: "/images/avatar.webp",
  /** Medium crop for floating UI (~7KB). */
  avatarMediumPath: "/images/avatar-md.webp",
  heroImagePath: "/images/hero-visual.webp",
  portraitPath: "/images/profile-portrait.webp",
  social: {
    github: "https://github.com/Aidin78",
    linkedin: "https://www.linkedin.com/in/aidin78",
    dribbble: "https://dribbble.com/aidin78",
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
