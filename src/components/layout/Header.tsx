"use client";

import Image from "next/image";
import { Download, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getProfileName, profile } from "@/content/profile";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GamingModeToggle } from "@/components/gaming/GamingModeToggle";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/projects", key: "projects" as const },
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

  const displayName = getProfileName(locale);

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

        <nav className="hidden items-center gap-1 rounded-xl border border-border/80 bg-surface/80 p-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            <span className="hidden xl:inline">{t("cv")}</span>
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <GamingModeToggle />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? t("close") : t("menu")}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mx-auto mt-3 max-w-6xl overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="border-b border-border px-5 py-4">
            <p className="font-display text-base font-bold gradient-text">{displayName}</p>
            <p className="text-xs text-muted">{t("brandTagline")}</p>
          </div>

          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
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
            <GamingModeToggle />
            <LocaleSwitcher />
            <a
              href={profile.resumePath}
              download
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-4 py-3 text-sm font-semibold text-accent-foreground"
            >
              <Download className="h-4 w-4" />
              {t("cv")}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
