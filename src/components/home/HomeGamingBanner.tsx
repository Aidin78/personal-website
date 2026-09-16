"use client";

import { Gamepad2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

export function HomeGamingBanner() {
  const t = useTranslations("home");
  const { isGaming, toggleGaming } = useGamingMode();

  return (
    <section className="py-10 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <button
          type="button"
          onClick={toggleGaming}
          aria-pressed={isGaming}
          aria-label={isGaming ? t("gamingBanner.ctaActive") : t("gamingBanner.cta")}
          className="gaming-banner group relative isolate block w-full overflow-hidden border border-[#39ff14]/40 p-8 text-start transition-all hover:border-[#39ff14]/70 hover:shadow-[0_0_50px_rgba(57,255,20,0.25)] sm:p-12"
        >
          <div aria-hidden className="gaming-banner-grid" />
          <div aria-hidden className="gaming-banner-glow" />
          <div aria-hidden className="gaming-banner-scan" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3 text-center lg:text-start">
              <span className="inline-flex items-center justify-center gap-2 text-[13px] font-semibold tracking-wide text-[#39ff14] lg:justify-start">
                <span className="h-1.5 w-1.5 shrink-0 bg-[#39ff14]" />
                {t("gamingBanner.eyebrow")}
              </span>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                {t("gamingBanner.title")}
              </h2>
              <p className="mx-auto max-w-2xl text-white/70 lg:mx-0">{t("gamingBanner.description")}</p>
            </div>

            <span
              className={`gaming-banner-cta inline-flex items-center justify-center gap-2 whitespace-nowrap border px-6 py-3.5 text-sm font-semibold transition-colors ${
                isGaming
                  ? "border-[#39ff14] bg-[#39ff14] text-[#05070a]"
                  : "border-[#39ff14]/60 bg-[#39ff14]/10 text-[#39ff14] group-hover:bg-[#39ff14]/20"
              }`}
            >
              <Gamepad2 className="h-4 w-4 shrink-0" aria-hidden />
              {isGaming ? t("gamingBanner.ctaActive") : t("gamingBanner.cta")}
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
