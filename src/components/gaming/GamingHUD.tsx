"use client";

import { Crosshair, Heart, Trophy, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

export function GamingHUD() {
  const t = useTranslations("gaming");
  const {
    score,
    highScore,
    lives,
    level,
    toast,
    arcadeOpen,
    setArcadeOpen,
    toggleGaming,
    restartSession,
  } = useGamingMode();

  return (
    <>
      <div className="gaming-hud pointer-events-none fixed inset-x-0 top-20 z-[60] px-4">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-3">
          <div className="gaming-panel pointer-events-auto px-4 py-3">
            <p className="gaming-pixel text-[10px] uppercase tracking-widest text-[#39ff14]">
              {t("player")} 01
            </p>
            <p className="gaming-pixel mt-1 text-xs text-[#ff00ff]">{t("modeActive")}</p>
          </div>

          <div className="gaming-panel pointer-events-auto flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="flex items-center gap-2 text-[#39ff14]">
              <Zap className="h-4 w-4" />
              <span className="gaming-pixel text-sm">{score}</span>
            </div>
            <div className="flex items-center gap-2 text-[#00f0ff]">
              <Trophy className="h-4 w-4" />
              <span className="gaming-pixel text-sm">{highScore}</span>
            </div>
            <div className="flex items-center gap-1 text-[#ff3864]">
              {Array.from({ length: 3 }).map((_, index) => (
                <Heart
                  key={index}
                  className={`h-4 w-4 ${index < lives ? "fill-current" : "opacity-25"}`}
                />
              ))}
            </div>
            <span className="gaming-pixel text-xs text-[#ffe600]">LV {level}</span>
          </div>
        </div>
      </div>

      <div className="gaming-hud pointer-events-none fixed inset-x-0 bottom-4 z-[60] px-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3">
          <div className="gaming-panel pointer-events-auto hidden px-4 py-3 sm:block">
            <p className="gaming-pixel text-[10px] leading-relaxed text-[#00f0ff]">
              {t("controlsMove")}
            </p>
            <p className="gaming-pixel mt-1 text-[10px] leading-relaxed text-[#00f0ff]/80">
              {t("controlsCollect")}
            </p>
          </div>

          <div className="pointer-events-auto flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setArcadeOpen(!arcadeOpen)}
              className="gaming-panel gaming-pixel flex items-center gap-2 px-4 py-3 text-xs text-[#39ff14] transition-transform hover:scale-105"
            >
              <Crosshair className="h-4 w-4" />
              {t("openArcade")}
            </button>
            <button
              type="button"
              onClick={toggleGaming}
              className="gaming-panel gaming-pixel px-4 py-3 text-xs text-[#ff3864]"
            >
              {t("exit")}
            </button>
          </div>
        </div>
      </div>

      {toast ? (
        <div className="gaming-toast gaming-pixel fixed start-1/2 top-32 z-[70] -translate-x-1/2 px-5 py-3 text-sm text-[#39ff14] rtl:translate-x-1/2">
          {toast}
        </div>
      ) : null}

      {lives === 0 ? (
        <div className="pointer-events-auto fixed inset-0 z-[75] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="gaming-panel flex flex-col items-center gap-4 px-6 py-5 text-center">
            <p className="gaming-pixel text-sm text-[#ff3864]">{t("gameOver")}</p>
            <button
              type="button"
              onClick={restartSession}
              className="gaming-pixel text-xs text-[#39ff14] transition-transform hover:scale-105"
            >
              {t("retry")}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
