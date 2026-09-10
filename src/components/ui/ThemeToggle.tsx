"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");

  const isDark = theme === "dark";
  const next = isDark ? "light" : "dark";
  const label = next === "light" ? t("light") : t("dark");
  const Icon = isDark ? Moon : Sun;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(next)}
      className="relative inline-flex h-8 w-16 shrink-0 items-center border border-border bg-surface px-1 transition-colors hover:border-accent"
      aria-label={label}
      title={label}
    >
      <span className="pointer-events-none absolute inset-y-0 left-1 flex w-6 items-center justify-center text-muted/50">
        <Sun className="h-3.5 w-3.5" aria-hidden />
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-1 flex w-6 items-center justify-center text-muted/50">
        <Moon className="h-3.5 w-3.5" aria-hidden />
      </span>
      <span
        className={`relative z-10 flex h-6 w-6 items-center justify-center bg-accent text-accent-foreground transition-transform duration-300 ease-out ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>
    </button>
  );
}
