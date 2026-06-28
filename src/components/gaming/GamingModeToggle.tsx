"use client";

import { Gamepad2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

export function GamingModeToggle() {
  const t = useTranslations("gaming");
  const { isGaming, toggleGaming } = useGamingMode();

  return (
    <button
      type="button"
      onClick={toggleGaming}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all sm:h-10 sm:w-10 ${
        isGaming
          ? "gaming-toggle-active border-[#39ff14]/60 bg-[#39ff14]/15 text-[#39ff14] shadow-[0_0_20px_rgba(57,255,20,0.35)]"
          : "border-border bg-surface text-muted hover:border-accent hover:text-accent"
      }`}
      aria-label={isGaming ? t("disable") : t("enable")}
      aria-pressed={isGaming}
      title={isGaming ? t("disable") : t("enable")}
    >
      <Gamepad2 className="h-4 w-4" />
    </button>
  );
}
