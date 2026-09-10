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
      className="relative inline-flex h-7 w-14 shrink-0 items-center border border-border bg-surface transition-colors hover:border-accent"
      aria-label={label}
      title={label}
    >
      <span
        className={`flex h-[1.375rem] w-6 items-center justify-center border border-foreground bg-foreground text-background transition-transform duration-200 ${
          isDark ? "translate-x-[1.5rem]" : "translate-x-0.5"
        }`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>
    </button>
  );
}
