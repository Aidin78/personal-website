export type ProjectCategory =
  | "government"
  | "enterprise"
  | "municipality"
  | "education";

export type ProjectItem = {
  slug: string;
  title: string;
  url: string;
  description: string;
  overview: string;
  role: string;
  year: string;
  technologies: string[];
  highlights: string[];
  image: string;
  /** Extra screenshots — add files to public/projects/{slug}/ and list paths here */
  gallery: string[];
  category: ProjectCategory;
};

export const projects: ProjectItem[] = [
  {
    slug: "gsi",
    title: "Geological Survey Organization",
    url: "https://gsi.ir",
    description: "Government geological survey portal",
    overview:
      "Official portal for Iran's Geological Survey Organization — a content-rich government website with structured information architecture, accessible UI, and responsive layouts across devices.",
    role: "UI Design & Front-End Development",
    year: "1402",
    technologies: ["HTML5", "CSS3", "JavaScript", "UI/UX Design", "Responsive Layout"],
    highlights: [
      "Designed and implemented responsive government portal UI",
      "Structured content sections for public geological data",
      "Cross-browser compatible front-end implementation",
    ],
    image: "/projects/gsi.svg",
    gallery: [],
    category: "government",
  },
  {
    slug: "daneshbonyan",
    title: "Knowledge-Based Company Website",
    url: "https://daneshbonyan.isti.ir",
    description: "ISTI knowledge-based companies platform",
    overview:
      "Platform website for knowledge-based companies under ISTI — featuring company listings, filters, and a clean institutional design aligned with government digital standards.",
    role: "UI Design & Front-End Development",
    year: "1401",
    technologies: ["HTML5", "SCSS", "JavaScript", "Figma", "Responsive Design"],
    highlights: [
      "Institutional UI aligned with government branding",
      "Filterable company directory interface",
      "Mobile-first responsive implementation",
    ],
    image: "/projects/daneshbonyan.svg",
    gallery: [],
    category: "government",
  },
  {
    slug: "shahrekord-news",
    title: "Shahrekord Municipality News",
    url: "https://news.shahrekord.ir",
    description: "Municipal news and announcements website",
    overview:
      "News and announcements portal for Shahrekord Municipality — optimized for frequent content updates, readable typography, and fast access to municipal information.",
    role: "UI Design & Front-End Development",
    year: "1400",
    technologies: ["HTML5", "CSS3", "JavaScript", "CMS Integration", "UI Design"],
    highlights: [
      "News listing and article detail templates",
      "Readable typography for long-form municipal content",
      "CMS-ready front-end structure",
    ],
    image: "/projects/shahrekord-news.svg",
    gallery: [],
    category: "municipality",
  },
  {
    slug: "etemadmelal",
    title: "Etemad Mellal Organization",
    url: "https://panel.etemadmelal.com/",
    description: "Enterprise financial management panel",
    overview:
      "Enterprise-grade financial management panel built with Next.js — complex dashboards, data tables, forms, and role-based UI for organizational financial operations.",
    role: "Front-End Developer & UI Designer",
    year: "1403",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST API"],
    highlights: [
      "Complex dashboard and data table interfaces",
      "Enterprise form flows and validation UX",
      "Scalable component-based front-end architecture",
    ],
    image: "/projects/etemadmelal.svg",
    gallery: [],
    category: "enterprise",
  },
  {
    slug: "psrai",
    title: "Railway Employees Savings Fund",
    url: "https://portalpsrai.com/",
    description: "Portal for railway employees and managers",
    overview:
      "Member portal for railway employees and managers savings fund — secure login flows, member dashboards, and organizational service access.",
    role: "Front-End Developer",
    year: "1402",
    technologies: ["React", "JavaScript", "CSS3", "REST API", "UI Design"],
    highlights: [
      "Member portal with authentication flows",
      "Dashboard UI for savings fund services",
      "Responsive layouts for desktop and mobile",
    ],
    image: "/projects/psrai.svg",
    gallery: [],
    category: "enterprise",
  },
  {
    slug: "sep",
    title: "Saman Electronic Payment (SEP)",
    url: "https://sep.ir",
    description: "Electronic payment services platform",
    overview:
      "Corporate website for Saman Electronic Payment — a high-trust financial services platform requiring clarity, security-focused UX, and polished institutional design.",
    role: "UI Design & Front-End Development",
    year: "1401",
    technologies: ["HTML5", "SCSS", "JavaScript", "Adobe XD", "Responsive Design"],
    highlights: [
      "Trust-focused financial services UI",
      "Service pages with clear information hierarchy",
      "Polished responsive corporate website",
    ],
    image: "/projects/sep.svg",
    gallery: [],
    category: "enterprise",
  },
  {
    slug: "yed",
    title: "Yazd Electricity Distribution",
    url: "https://www.yed.co.ir",
    description: "Regional electricity distribution company",
    overview:
      "Regional electricity distribution company website — public service information, outage notices, and customer-facing content with accessible government-style UI.",
    role: "UI Design & Front-End Development",
    year: "1399",
    technologies: ["HTML5", "CSS3", "JavaScript", "Figma", "Responsive Layout"],
    highlights: [
      "Public utility information architecture",
      "Service-oriented page templates",
      "Accessible responsive government UI",
    ],
    image: "/projects/yed.svg",
    gallery: [],
    category: "government",
  },
  {
    slug: "shahrekord",
    title: "Shahrekord Municipality",
    url: "https://shahrekord.ir",
    description: "Official municipality website",
    overview:
      "Official municipality website for Shahrekord — comprehensive civic portal covering services, news, tourism, and municipal departments.",
    role: "UI Design & Front-End Development",
    year: "1400",
    technologies: ["HTML5", "SCSS", "JavaScript", "UI/UX Design", "CMS"],
    highlights: [
      "Multi-section municipal portal design",
      "Tourism and services content modules",
      "Full design-to-frontend delivery",
    ],
    image: "/projects/shahrekord.svg",
    gallery: [],
    category: "municipality",
  },
  {
    slug: "dums",
    title: "Dezful University of Medical Sciences",
    url: "https://www.dums.ac.ir",
    description: "University academic portal",
    overview:
      "Academic portal for Dezful University of Medical Sciences — faculty pages, academic programs, and university news with an educational institution design language.",
    role: "UI Design & Front-End Development",
    year: "1398",
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Figma"],
    highlights: [
      "Academic program and faculty page templates",
      "University news and events sections",
      "Educational institution UI system",
    ],
    image: "/projects/dums.svg",
    gallery: [],
    category: "education",
  },
  {
    slug: "ledc",
    title: "Lorestan Electricity Distribution",
    url: "https://ledc.ir",
    description: "Regional electricity distribution company",
    overview:
      "Regional electricity distribution company portal — customer services, regional information, and utility announcements with consistent public-sector UX patterns.",
    role: "UI Design & Front-End Development",
    year: "1399",
    technologies: ["HTML5", "CSS3", "JavaScript", "UI Design", "Responsive Layout"],
    highlights: [
      "Utility service information pages",
      "Consistent regional branding UI",
      "Responsive public-facing portal",
    ],
    image: "/projects/ledc.svg",
    gallery: [],
    category: "government",
  },
  {
    slug: "idro",
    title: "IDRO",
    url: "https://www.idro.ir",
    description: "Industrial Development & Renovation Organization",
    overview:
      "Corporate portal for IDRO (Industrial Development & Renovation Organization) — industrial holdings, news, and organizational content with a formal enterprise design.",
    role: "UI Design & Front-End Development",
    year: "1400",
    technologies: ["HTML5", "SCSS", "JavaScript", "Adobe XD", "Responsive Design"],
    highlights: [
      "Enterprise organizational portal UI",
      "Industrial holdings content structure",
      "Formal corporate design language",
    ],
    image: "/projects/idro.svg",
    gallery: [],
    category: "government",
  },
  {
    slug: "rasht",
    title: "Rasht City Council",
    url: "https://shora.rasht.ir/",
    description: "Municipal city council portal",
    overview:
      "City council portal for Rasht — council sessions, member profiles, municipal decisions, and civic transparency content with accessible public UI.",
    role: "UI Design & Front-End Development",
    year: "1401",
    technologies: ["HTML5", "CSS3", "JavaScript", "UI/UX Design", "CMS Integration"],
    highlights: [
      "Council member and session page templates",
      "Civic transparency content layout",
      "Municipal portal responsive UI",
    ],
    image: "/projects/rasht.svg",
    gallery: [],
    category: "municipality",
  },
];

export const featuredProjects = projects.slice(0, 4);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(slug: string, limit = 3) {
  const current = getProjectBySlug(slug);
  if (!current) return [];

  return projects
    .filter(
      (project) =>
        project.slug !== slug && project.category === current.category,
    )
    .slice(0, limit);
}

export function getAllProjectSlugs() {
  return projects.map((project) => project.slug);
}
