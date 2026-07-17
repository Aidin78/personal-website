import type { LocalizedString } from "@/content/i18n";
import { tContent, tContentList } from "@/content/i18n";

export type ProjectCategory =
  | "government"
  | "enterprise"
  | "municipality"
  | "education";

export type ProjectItem = {
  slug: string;
  title: LocalizedString;
  url: string;
  description: LocalizedString;
  overview: LocalizedString;
  role: LocalizedString;
  year: string;
  technologies: string[];
  highlights: LocalizedString[];
  image: string;
  /** Extra screenshots — add files to public/projects/{slug}/ and list paths here */
  gallery: string[];
  category: ProjectCategory;
};

export type LocalizedProject = {
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
  gallery: string[];
  category: ProjectCategory;
};

export const projects: ProjectItem[] = [
  {
    slug: "gsi",
    title: {
      en: "Geological Survey Organization",
      fa: "سازمان زمین‌شناسی کشور",
    },
    url: "https://gsi.ir",
    description: {
      en: "Government geological survey portal",
      fa: "پورتال دولتی سازمان زمین‌شناسی",
    },
    overview: {
      en: "Official portal for Iran's Geological Survey Organization — a content-rich government website with structured information architecture, accessible UI, and responsive layouts across devices.",
      fa: "پورتال رسمی سازمان زمین‌شناسی کشور — وب‌سایت دولتی غنی از محتوا با معماری اطلاعات ساختاریافته، UI دسترس‌پذیر و لایه‌بندی واکنش‌گرا.",
    },
    role: {
      en: "UI Design & Front-End Development",
      fa: "طراحی UI و توسعه فرانت‌اند",
    },
    year: "1402",
    technologies: ["HTML5", "CSS3", "JavaScript", "UI/UX Design", "Responsive Layout"],
    highlights: [
      {
        en: "Designed and implemented responsive government portal UI",
        fa: "طراحی و پیاده‌سازی UI واکنش‌گرای پورتال دولتی",
      },
      {
        en: "Structured content sections for public geological data",
        fa: "ساختاردهی بخش‌های محتوا برای داده‌های زمین‌شناسی عمومی",
      },
      {
        en: "Cross-browser compatible front-end implementation",
        fa: "پیاده‌سازی فرانت‌اند سازگار با مرورگرهای مختلف",
      },
    ],
    image: "/projects/gsi.svg",
    gallery: ["/projects/gsi.svg"],
    category: "government",
  },
  {
    slug: "daneshbonyan",
    title: {
      en: "Knowledge-Based Company Website",
      fa: "سامانه شرکت‌های دانش‌بنیان",
    },
    url: "https://daneshbonyan.isti.ir",
    description: {
      en: "ISTI knowledge-based companies platform",
      fa: "پلتفرم شرکت‌های دانش‌بنیان وابسته به معاونت علمی",
    },
    overview: {
      en: "Platform website for knowledge-based companies under ISTI — featuring company listings, filters, and a clean institutional design aligned with government digital standards.",
      fa: "وب‌سایت پلتفرم شرکت‌های دانش‌بنیان — شامل فهرست شرکت‌ها، فیلترها و طراحی سازمانی هم‌راستا با استانداردهای دیجیتال دولتی.",
    },
    role: {
      en: "UI Design & Front-End Development",
      fa: "طراحی UI و توسعه فرانت‌اند",
    },
    year: "1401",
    technologies: ["HTML5", "SCSS", "JavaScript", "Figma", "Responsive Design"],
    highlights: [
      {
        en: "Institutional UI aligned with government branding",
        fa: "UI سازمانی هم‌راستا با برندینگ دولتی",
      },
      {
        en: "Filterable company directory interface",
        fa: "رابط فهرست شرکت‌ها با قابلیت فیلتر",
      },
      {
        en: "Mobile-first responsive implementation",
        fa: "پیاده‌سازی واکنش‌گرا با رویکرد موبایل‌فرست",
      },
    ],
    image: "/projects/daneshbonyan.svg",
    gallery: ["/projects/daneshbonyan.svg"],
    category: "government",
  },
  {
    slug: "shahrekord-news",
    title: {
      en: "Shahrekord Municipality News",
      fa: "اخبار شهرداری شهرکرد",
    },
    url: "https://news.shahrekord.ir",
    description: {
      en: "Municipal news and announcements website",
      fa: "وب‌سایت اخبار و اطلاعیه‌های شهرداری",
    },
    overview: {
      en: "News and announcements portal for Shahrekord Municipality — optimized for frequent content updates, readable typography, and fast access to municipal information.",
      fa: "پورتال اخبار و اطلاعیه‌های شهرداری شهرکرد — بهینه‌شده برای به‌روزرسانی مکرر محتوا، تایپوگرافی خوانا و دسترسی سریع به اطلاعات شهرداری.",
    },
    role: {
      en: "UI Design & Front-End Development",
      fa: "طراحی UI و توسعه فرانت‌اند",
    },
    year: "1400",
    technologies: ["HTML5", "CSS3", "JavaScript", "CMS Integration", "UI Design"],
    highlights: [
      {
        en: "News listing and article detail templates",
        fa: "قالب‌های فهرست اخبار و جزئیات مقاله",
      },
      {
        en: "Readable typography for long-form municipal content",
        fa: "تایپوگرافی خوانا برای محتوای بلند شهرداری",
      },
      {
        en: "CMS-ready front-end structure",
        fa: "ساختار فرانت‌اند آماده اتصال به CMS",
      },
    ],
    image: "/projects/shahrekord-news.svg",
    gallery: ["/projects/shahrekord-news.svg"],
    category: "municipality",
  },
  {
    slug: "etemadmelal",
    title: {
      en: "Etemad Mellal Organization",
      fa: "سازمان اعتماد ملل",
    },
    url: "https://panel.etemadmelal.com/",
    description: {
      en: "Enterprise financial management panel",
      fa: "پنل مدیریت مالی سازمانی",
    },
    overview: {
      en: "Enterprise-grade financial management panel built with Next.js — complex dashboards, data tables, forms, and role-based UI for organizational financial operations.",
      fa: "پنل مدیریت مالی سازمانی با Next.js — داشبوردهای پیچیده، جداول داده، فرم‌ها و UI مبتنی بر نقش برای عملیات مالی سازمانی.",
    },
    role: {
      en: "Front-End Developer & UI Designer",
      fa: "توسعه‌دهنده فرانت‌اند و طراح UI",
    },
    year: "1403",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST API"],
    highlights: [
      {
        en: "Complex dashboard and data table interfaces",
        fa: "رابط‌های داشبورد و جدول داده پیچیده",
      },
      {
        en: "Enterprise form flows and validation UX",
        fa: "جریان فرم‌های سازمانی و UX اعتبارسنجی",
      },
      {
        en: "Scalable component-based front-end architecture",
        fa: "معماری فرانت‌اند مقیاس‌پذیر مبتنی بر کامپوننت",
      },
    ],
    image: "/projects/etemadmelal.svg",
    gallery: ["/projects/etemadmelal.svg"],
    category: "enterprise",
  },
  {
    slug: "psrai",
    title: {
      en: "Railway Employees Savings Fund",
      fa: "صندوق پس‌انداز کارکنان راه‌آهن",
    },
    url: "https://portalpsrai.com/",
    description: {
      en: "Portal for railway employees and managers",
      fa: "پورتال کارکنان و مدیران راه‌آهن",
    },
    overview: {
      en: "Member portal for railway employees and managers savings fund — secure login flows, member dashboards, and organizational service access.",
      fa: "پورتال اعضای صندوق پس‌انداز کارکنان راه‌آهن — جریان ورود امن، داشبورد اعضا و دسترسی به خدمات سازمانی.",
    },
    role: {
      en: "Front-End Developer",
      fa: "توسعه‌دهنده فرانت‌اند",
    },
    year: "1402",
    technologies: ["React", "JavaScript", "CSS3", "REST API", "UI Design"],
    highlights: [
      {
        en: "Member portal with authentication flows",
        fa: "پورتال اعضا با جریان احراز هویت",
      },
      {
        en: "Dashboard UI for savings fund services",
        fa: "UI داشبورد خدمات صندوق پس‌انداز",
      },
      {
        en: "Responsive layouts for desktop and mobile",
        fa: "لایه‌بندی واکنش‌گرا برای دسکتاپ و موبایل",
      },
    ],
    image: "/projects/psrai.svg",
    gallery: ["/projects/psrai.svg"],
    category: "enterprise",
  },
  {
    slug: "sep",
    title: {
      en: "Saman Electronic Payment (SEP)",
      fa: "پرداخت الکترونیک سامان (SEP)",
    },
    url: "https://sep.ir",
    description: {
      en: "Electronic payment services platform",
      fa: "پلتفرم خدمات پرداخت الکترونیک",
    },
    overview: {
      en: "Corporate website for Saman Electronic Payment — a high-trust financial services platform requiring clarity, security-focused UX, and polished institutional design.",
      fa: "وب‌سایت شرکتی پرداخت الکترونیک سامان — پلتفرم خدمات مالی با نیاز به وضوح، UX امنیت‌محور و طراحی سازمانی صیقلی.",
    },
    role: {
      en: "UI Design & Front-End Development",
      fa: "طراحی UI و توسعه فرانت‌اند",
    },
    year: "1401",
    technologies: ["HTML5", "SCSS", "JavaScript", "Adobe XD", "Responsive Design"],
    highlights: [
      {
        en: "Trust-focused financial services UI",
        fa: "UI خدمات مالی با تمرکز بر اعتماد",
      },
      {
        en: "Service pages with clear information hierarchy",
        fa: "صفحات خدمات با سلسله‌مراتب اطلاعات روشن",
      },
      {
        en: "Polished responsive corporate website",
        fa: "وب‌سایت شرکتی واکنش‌گرا و صیقلی",
      },
    ],
    image: "/projects/sep.svg",
    gallery: ["/projects/sep.svg"],
    category: "enterprise",
  },
  {
    slug: "yed",
    title: {
      en: "Yazd Electricity Distribution",
      fa: "توزیع برق استان یزد",
    },
    url: "https://www.yed.co.ir",
    description: {
      en: "Regional electricity distribution company",
      fa: "شرکت توزیع نیروی برق منطقه‌ای",
    },
    overview: {
      en: "Regional electricity distribution company website — public service information, outage notices, and customer-facing content with accessible government-style UI.",
      fa: "وب‌سایت شرکت توزیع برق منطقه‌ای — اطلاعات خدمات عمومی، اطلاعیه‌های قطعی و محتوای مشتری‌محور با UI دسترس‌پذیر دولتی.",
    },
    role: {
      en: "UI Design & Front-End Development",
      fa: "طراحی UI و توسعه فرانت‌اند",
    },
    year: "1399",
    technologies: ["HTML5", "CSS3", "JavaScript", "Figma", "Responsive Layout"],
    highlights: [
      {
        en: "Public utility information architecture",
        fa: "معماری اطلاعات خدمات عمومی",
      },
      {
        en: "Service-oriented page templates",
        fa: "قالب‌های صفحه‌محور خدمات",
      },
      {
        en: "Accessible responsive government UI",
        fa: "UI دولتی واکنش‌گرا و دسترس‌پذیر",
      },
    ],
    image: "/projects/yed.svg",
    gallery: ["/projects/yed.svg"],
    category: "government",
  },
  {
    slug: "shahrekord",
    title: {
      en: "Shahrekord Municipality",
      fa: "شهرداری شهرکرد",
    },
    url: "https://shahrekord.ir",
    description: {
      en: "Official municipality website",
      fa: "وب‌سایت رسمی شهرداری",
    },
    overview: {
      en: "Official municipality website for Shahrekord — comprehensive civic portal covering services, news, tourism, and municipal departments.",
      fa: "وب‌سایت رسمی شهرداری شهرکرد — پورتال جامع شهری شامل خدمات، اخبار، گردشگری و بخش‌های شهرداری.",
    },
    role: {
      en: "UI Design & Front-End Development",
      fa: "طراحی UI و توسعه فرانت‌اند",
    },
    year: "1400",
    technologies: ["HTML5", "SCSS", "JavaScript", "UI/UX Design", "CMS"],
    highlights: [
      {
        en: "Multi-section municipal portal design",
        fa: "طراحی پورتال چندبخشی شهرداری",
      },
      {
        en: "Tourism and services content modules",
        fa: "ماژول‌های محتوایی گردشگری و خدمات",
      },
      {
        en: "Full design-to-frontend delivery",
        fa: "تحویل کامل از طراحی تا فرانت‌اند",
      },
    ],
    image: "/projects/shahrekord.svg",
    gallery: ["/projects/shahrekord.svg"],
    category: "municipality",
  },
  {
    slug: "dums",
    title: {
      en: "Dezful University of Medical Sciences",
      fa: "دانشگاه علوم پزشکی دزفول",
    },
    url: "https://www.dums.ac.ir",
    description: {
      en: "University academic portal",
      fa: "پورتال دانشگاهی",
    },
    overview: {
      en: "Academic portal for Dezful University of Medical Sciences — faculty pages, academic programs, and university news with an educational institution design language.",
      fa: "پورتال دانشگاهی علوم پزشکی دزفول — صفحات دانشکده، برنامه‌های تحصیلی و اخبار دانشگاه با زبان طراحی آموزشی.",
    },
    role: {
      en: "UI Design & Front-End Development",
      fa: "طراحی UI و توسعه فرانت‌اند",
    },
    year: "1398",
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Figma"],
    highlights: [
      {
        en: "Academic program and faculty page templates",
        fa: "قالب‌های برنامه تحصیلی و صفحات دانشکده",
      },
      {
        en: "University news and events sections",
        fa: "بخش‌های اخبار و رویدادهای دانشگاه",
      },
      {
        en: "Educational institution UI system",
        fa: "سیستم UI مؤسسه آموزشی",
      },
    ],
    image: "/projects/dums.svg",
    gallery: ["/projects/dums.svg"],
    category: "education",
  },
  {
    slug: "ledc",
    title: {
      en: "Lorestan Electricity Distribution",
      fa: "توزیع برق لرستان",
    },
    url: "https://ledc.ir",
    description: {
      en: "Regional electricity distribution company",
      fa: "شرکت توزیع نیروی برق منطقه‌ای",
    },
    overview: {
      en: "Regional electricity distribution company portal — customer services, regional information, and utility announcements with consistent public-sector UX patterns.",
      fa: "پورتال شرکت توزیع برق منطقه‌ای — خدمات مشتری، اطلاعات منطقه‌ای و اطلاعیه‌های خدماتی با الگوهای UX بخش عمومی.",
    },
    role: {
      en: "UI Design & Front-End Development",
      fa: "طراحی UI و توسعه فرانت‌اند",
    },
    year: "1399",
    technologies: ["HTML5", "CSS3", "JavaScript", "UI Design", "Responsive Layout"],
    highlights: [
      {
        en: "Utility service information pages",
        fa: "صفحات اطلاعات خدمات برق",
      },
      {
        en: "Consistent regional branding UI",
        fa: "UI برندینگ منطقه‌ای یکدست",
      },
      {
        en: "Responsive public-facing portal",
        fa: "پورتال عمومی واکنش‌گرا",
      },
    ],
    image: "/projects/ledc.svg",
    gallery: ["/projects/ledc.svg"],
    category: "government",
  },
  {
    slug: "idro",
    title: {
      en: "IDRO",
      fa: "ایدرو",
    },
    url: "https://www.idro.ir",
    description: {
      en: "Industrial Development & Renovation Organization",
      fa: "سازمان گسترش و نوسازی صنایع ایران",
    },
    overview: {
      en: "Corporate portal for IDRO (Industrial Development & Renovation Organization) — industrial holdings, news, and organizational content with a formal enterprise design.",
      fa: "پورتال سازمانی ایدرو — هلدینگ‌های صنعتی، اخبار و محتوای سازمانی با طراحی رسمی سازمانی.",
    },
    role: {
      en: "UI Design & Front-End Development",
      fa: "طراحی UI و توسعه فرانت‌اند",
    },
    year: "1400",
    technologies: ["HTML5", "SCSS", "JavaScript", "Adobe XD", "Responsive Design"],
    highlights: [
      {
        en: "Enterprise organizational portal UI",
        fa: "UI پورتال سازمانی",
      },
      {
        en: "Industrial holdings content structure",
        fa: "ساختار محتوایی هلدینگ‌های صنعتی",
      },
      {
        en: "Formal corporate design language",
        fa: "زبان طراحی شرکتی رسمی",
      },
    ],
    image: "/projects/idro.svg",
    gallery: ["/projects/idro.svg"],
    category: "government",
  },
  {
    slug: "rasht",
    title: {
      en: "Rasht City Council",
      fa: "شورای اسلامی شهر رشت",
    },
    url: "https://shora.rasht.ir/",
    description: {
      en: "Municipal city council portal",
      fa: "پورتال شورای شهر",
    },
    overview: {
      en: "City council portal for Rasht — council sessions, member profiles, municipal decisions, and civic transparency content with accessible public UI.",
      fa: "پورتال شورای شهر رشت — جلسات شورا، پروفایل اعضا، تصمیمات شهرداری و محتوای شفافیت مدنی با UI عمومی دسترس‌پذیر.",
    },
    role: {
      en: "UI Design & Front-End Development",
      fa: "طراحی UI و توسعه فرانت‌اند",
    },
    year: "1401",
    technologies: ["HTML5", "CSS3", "JavaScript", "UI/UX Design", "CMS Integration"],
    highlights: [
      {
        en: "Council member and session page templates",
        fa: "قالب‌های صفحات اعضا و جلسات شورا",
      },
      {
        en: "Civic transparency content layout",
        fa: "چیدمان محتوای شفافیت مدنی",
      },
      {
        en: "Municipal portal responsive UI",
        fa: "UI واکنش‌گرای پورتال شهرداری",
      },
    ],
    image: "/projects/rasht.svg",
    gallery: ["/projects/rasht.svg"],
    category: "municipality",
  },
];

export function localizeProject(project: ProjectItem, locale: string): LocalizedProject {
  const jalaliYear = Number(project.year);
  const year =
    locale === "fa" || !Number.isFinite(jalaliYear)
      ? project.year
      : String(jalaliYear + 621);

  return {
    slug: project.slug,
    title: tContent(project.title, locale),
    url: project.url,
    description: tContent(project.description, locale),
    overview: tContent(project.overview, locale),
    role: tContent(project.role, locale),
    year,
    technologies: project.technologies,
    highlights: tContentList(project.highlights, locale),
    image: project.image,
    gallery: project.gallery,
    category: project.category,
  };
}

export const featuredProjects = projects.slice(0, 4);

export function getLocalizedProjects(locale: string) {
  return projects.map((project) => localizeProject(project, locale));
}

export function getLocalizedFeaturedProjects(locale: string) {
  return featuredProjects.map((project) => localizeProject(project, locale));
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getLocalizedProjectBySlug(slug: string, locale: string) {
  const project = getProjectBySlug(slug);
  return project ? localizeProject(project, locale) : undefined;
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

export function getLocalizedRelatedProjects(slug: string, locale: string, limit = 3) {
  return getRelatedProjects(slug, limit).map((project) =>
    localizeProject(project, locale),
  );
}

export function getAllProjectSlugs() {
  return projects.map((project) => project.slug);
}
