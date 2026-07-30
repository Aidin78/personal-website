"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");

  const next = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Moon : Sun;
  const label = next === "light" ? t("light") : t("dark");

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
