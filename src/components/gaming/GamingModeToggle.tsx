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
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border px-2.5 transition-all sm:h-10 sm:gap-2 sm:px-3 ${
        isGaming
          ? "gaming-toggle-active border-[#39ff14]/60 bg-[#39ff14]/15 text-[#39ff14] shadow-[0_0_20px_rgba(57,255,20,0.35)]"
          : "gaming-toggle-idle border-[#39ff14]/45 bg-[#39ff14]/10 text-[#39ff14] shadow-[0_0_14px_rgba(57,255,20,0.2)] hover:border-[#39ff14]/70 hover:bg-[#39ff14]/18 hover:shadow-[0_0_22px_rgba(57,255,20,0.35)]"
      }`}
      aria-label={isGaming ? t("disable") : t("enable")}
      aria-pressed={isGaming}
      title={isGaming ? t("disable") : t("enable")}
    >
      <Gamepad2 className="h-4 w-4 shrink-0" aria-hidden />
      <span className="hidden text-sm font-semibold tracking-wide sm:inline">
        {isGaming ? t("toggleOn") : t("toggleLabel")}
      </span>
    </button>
  );
}
