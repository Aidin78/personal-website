export type SkillGroup = {
  category: "frontend" | "design" | "tools";
  items: string[];
};

/** Skill labels stay in English (tech names); category titles come from i18n messages. */
export const skills: SkillGroup[] = [
  {
    category: "frontend",
    items: [
      "HTML5, CSS3, SASS / SCSS",
      "JavaScript (ES6+), jQuery",
      "React.js, Redux",
      "Next.js",
      "Node.js",
      "RESTful API Integration",
    ],
  },
  {
    category: "design",
    items: [
      "UI/UX Design Principles",
      "Wireframing & Prototyping",
      "Figma, Adobe XD",
      "UI/UX for 30+ Government Websites",
    ],
  },
  {
    category: "tools",
    items: [
      "Git (GitHub / GitLab)",
      "SQL",
      "Custom CMS (Spirit Portal – Niafam)",
    ],
  },
];
