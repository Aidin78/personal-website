"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { getProfileName } from "@/content/profile";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
      <div
        className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6"
        inert={open}
      >
        <Link
          href="/"
          className="min-w-0 justify-self-start leading-tight"
          onClick={() => setOpen(false)}
        >
          <span className="block truncate font-display text-sm font-bold">
            {displayName}
          </span>
          <span className="block truncate text-xs text-muted">
            {t("brandTagline")}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 justify-self-center lg:flex" aria-label={t("menu")}>
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

        <div className="hidden items-center gap-3 justify-self-end lg:flex">
          <ThemeToggle />
        </div>

        <div className="col-start-3 flex items-center gap-2 justify-self-end lg:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? t("close") : t("menu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={menuTitleId}
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-40 overflow-y-auto bg-background transition-opacity duration-300 ease-out lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <p id={menuTitleId} className="sr-only">
          {t("menu")}
        </p>
        <div className="flex h-16 items-center justify-between gap-3 border-b border-border px-5">
          <Link
            href="/"
            className="min-w-0 leading-tight"
            onClick={() => setOpen(false)}
          >
            <span className="block truncate font-display text-sm font-bold">
              {displayName}
            </span>
            <span className="block truncate text-xs text-muted">
              {t("brandTagline")}
            </span>
          </Link>
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
      </div>
    </header>
  );
}
