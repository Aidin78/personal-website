"use client";

import { Download, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { getProfileName, profile } from "@/content/profile";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GamingModeToggle } from "@/components/gaming/GamingModeToggle";
import { projectsEnabled } from "@/content/projects";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/projects", key: "projects" as const, requiresProjects: true },
  { href: "/contact", key: "contact" as const },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuTitleId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const displayName = getProfileName(locale);
  const initial = displayName.charAt(0);
  const visibleNavItems = navItems.filter(
    (item) => !("requiresProjects" in item && item.requiresProjects) || projectsEnabled,
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const menuButton = menuButtonRef.current;
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      menuButton?.focus();
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background transition-shadow ${
        scrolled ? "border-border shadow-[0_1px_0_0_var(--border)]" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground font-display text-sm font-bold">
            {initial}
          </span>
          <span className="hidden min-w-0 leading-tight sm:flex sm:flex-col">
            <span className="truncate font-display text-sm font-bold">
              {displayName}
            </span>
            <span className="truncate text-xs text-muted">
              {t("brandTagline")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label={t("menu")}>
          {visibleNavItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b-2 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  active
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <GamingModeToggle />
          <ThemeToggle />
          <LocaleSwitcher />
          <a
            href={profile.resumePath}
            download
            className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-transparent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Download className="h-4 w-4" aria-hidden />
            <span className="hidden xl:inline">{t("cv")}</span>
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <GamingModeToggle />
          <ThemeToggle />
          <a
            href={profile.resumePath}
            download
            className="inline-flex h-10 w-10 items-center justify-center border border-foreground bg-foreground text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:w-auto sm:gap-1.5 sm:px-3"
            aria-label={t("cv")}
          >
            <Download className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline text-sm font-semibold">{t("cv")}</span>
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? t("close") : t("menu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={menuTitleId}
          className="border-t border-border bg-background lg:hidden"
        >
          <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <p id={menuTitleId} className="font-display text-base font-bold">
                {displayName}
              </p>
              <p className="text-xs text-muted">{t("brandTagline")}</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={t("close")}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <nav className="flex flex-col">
            {visibleNavItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`border-b border-border px-5 py-4 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    active ? "text-accent" : "text-foreground"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 p-4">
            <LocaleSwitcher />
          </div>
        </div>
      ) : null}
    </header>
  );
}
