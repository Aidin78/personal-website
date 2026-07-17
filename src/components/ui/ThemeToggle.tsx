"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme, type Theme } from "@/components/providers/ThemeProvider";

const CYCLE: Theme[] = ["light", "dark", "system"];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");

  const current = theme ?? "system";
  const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length]!;

  const Icon = current === "dark" ? Moon : current === "light" ? Sun : Monitor;
  const label =
    next === "light" ? t("light") : next === "dark" ? t("dark") : t("system");

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
