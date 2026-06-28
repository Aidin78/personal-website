import { Mail } from "lucide-react";
import { profile, type SocialKey } from "@/content/profile";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function DribbbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm7.568 5.302c1.4 1.737 2.24 3.932 2.24 6.316 0 .19-.006.378-.016.565-2.436-.548-4.666-.258-6.524.595-.05-.118-.102-.234-.156-.348 2.048-1.858 3.456-4.298 4.456-7.128zm-3.213 1.258c-.884 2.592-2.198 4.893-3.858 6.802-1.258-.672-2.658-1.168-4.15-1.458.842-2.704 2.312-5.058 4.248-6.888 1.286 1.01 2.434 2.214 3.42 3.544h.34zm-5.886 1.024c1.376.274 2.676.73 3.858 1.336-1.524 1.676-3.386 2.988-5.468 3.812-.524-1.624-.824-3.358-.824-5.148 0-.336.014-.668.042-.998 1.012.242 2.054.398 3.124.462l.268.536zm-4.312 2.666c2.286-.876 4.312-2.312 5.936-4.148.928 1.876 1.562 3.922 1.858 6.048-2.312.548-4.748.624-7.124.224.312-1.376.824-2.676 1.33-2.124zm1.024 5.624c2.124.336 4.312.224 6.312-.336-.548 2.124-1.676 4.024-3.124 5.524-1.676-1.024-3.124-2.436-4.188-4.188z" />
    </svg>
  );
}

function CodePenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.568 18.005c-.298-.298-.298-.782 0-1.08l4.573-4.573-4.573-4.573c-.298-.298-.298-.782 0-1.08.298-.298.782-.298 1.08 0l5.113 5.113c.298.298.298.782 0 1.08l-5.113 5.113c-.298.298-.782.298-1.08 0zm-2.866-2.866c-.298-.298-.298-.782 0-1.08l7.439-7.439c.298-.298.782-.298 1.08 0 .298.298.298.782 0 1.08l-7.439 7.439c-.298.298-.782.298-1.08 0z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const iconMap = {
  linkedin: LinkedInIcon,
  dribbble: DribbbleIcon,
  codepen: CodePenIcon,
  github: GitHubIcon,
} as const;

type SocialLinksProps = {
  showEmail?: boolean;
  emailLabel?: string;
  className?: string;
};

export function SocialLinks({
  showEmail = true,
  emailLabel = "Email",
  className = "",
}: SocialLinksProps) {
  const socialEntries = Object.entries(profile.social) as [SocialKey, string][];

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {socialEntries.map(([key, href]) => {
        const Icon = iconMap[key];
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-muted transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-lg hover:shadow-accent/10"
            aria-label={key}
          >
            <Icon />
          </a>
        );
      })}
      {showEmail && profile.email ? (
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <Mail className="h-4 w-4" />
          {emailLabel}
        </a>
      ) : null}
    </div>
  );
}
