"use client";

import Image from "next/image";
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
    <header className="sticky top-0 z-50 px-4 pt-3">
      <div
        className={`header-bar mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 rounded-2xl border px-3 sm:px-5 ${
          scrolled
            ? "border-border/90 bg-background/90 shadow-xl shadow-black/8 backdrop-blur-xl dark:shadow-black/30"
            : "border-border/60 bg-background/70 shadow-lg shadow-black/5 backdrop-blur-lg dark:shadow-black/20"
        }`}
      >
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-accent to-accent-secondary opacity-70 blur-[1px] transition-opacity group-hover:opacity-100" />
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background sm:h-11 sm:w-11">
              <Image
                src={profile.avatarPath}
                alt={displayName}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="44px"
              />
            </div>
          </div>

          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-sm font-bold tracking-tight sm:text-base">
              <span className="gradient-text">{displayName}</span>
            </p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-muted sm:text-[11px]">
              {t("brandTagline")}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-xl border border-border/80 bg-surface/80 p-1 lg:flex" aria-label={t("menu")}>
          {visibleNavItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  active
                    ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <GamingModeToggle />
          <ThemeToggle />
          <LocaleSwitcher />
          <a
            href={profile.resumePath}
            download
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Download className="h-4 w-4" aria-hidden />
            <span className="hidden xl:inline">{t("cv")}</span>
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <GamingModeToggle />
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
          className="mx-auto mt-3 max-w-6xl overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <p id={menuTitleId} className="font-display text-base font-bold gradient-text">
                {displayName}
              </p>
              <p className="text-xs text-muted">{t("brandTagline")}</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={t("close")}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-3">
            {visibleNavItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-4 py-3.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 border-t border-border p-4">
            <LocaleSwitcher />
            <a
              href={profile.resumePath}
              download
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-4 py-3 text-sm font-semibold text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Download className="h-4 w-4" aria-hidden />
              {t("cv")}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
