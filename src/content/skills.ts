export type SkillGroup = {
  category: "frontend" | "design" | "tools";
  items: string[];
};

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
      "Design & Implementation of UI/UX for 30+ Government Websites",
    ],
  },
  {
    category: "tools",
    items: [
      "Git (GitHub / GitLab)",
      "SQL",
      "Experience in Developing Custom CMS (Spirit Portal – Niafam)",
    ],
  },
];
