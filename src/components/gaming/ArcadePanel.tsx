"use client";

import { useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";
import { NeonBlasterGame } from "@/components/gaming/games/NeonBlasterGame";
import { StarCatcherGame } from "@/components/gaming/games/StarCatcherGame";

export function ArcadePanel() {
  const t = useTranslations("gaming");
  const { arcadeOpen, setArcadeOpen, activeGame, setActiveGame } = useGamingMode();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!arcadeOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
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
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [arcadeOpen]);

  useEffect(() => {
    if (!arcadeOpen) return;

    const focusTimer = window.setTimeout(() => {
      if (activeGame) {
        panelRef.current?.querySelector<HTMLElement>("button")?.focus();
      } else {
        closeRef.current?.focus();
      }
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [arcadeOpen, activeGame]);

  if (!arcadeOpen) return null;

  const closeArcade = () => {
    setActiveGame(null);
    setArcadeOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={closeArcade}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="gaming-arcade w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-[#39ff14]/40"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#39ff14]/30 bg-black/80 px-5 py-4">
          <div>
            <p id={titleId} className="gaming-pixel text-sm text-[#39ff14]">
              {t("arcadeTitle")}
            </p>
            <p className="mt-1 text-xs text-[#00f0ff]/80">{t("arcadeSubtitle")}</p>
            <p className="mt-1 text-[10px] text-[#ffe600]/70">{t("blasterLivesNote")}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeArcade}
            className="gaming-pixel text-xs text-[#ff3864]"
          >
            {t("close")}
          </button>
        </div>

        {!activeGame ? (
          <div className="space-y-4 bg-black/90 p-5">
            <button
              type="button"
              onClick={() => setActiveGame("blaster")}
              className="gaming-arcade-card gaming-arcade-card-hot group w-full text-start"
            >
              <div className="flex items-center gap-2">
                <span className="gaming-pixel text-[#39ff14]">{t("blasterTitle")}</span>
                <span className="rounded-full bg-[#ff3864] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  {t("hot")}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#00f0ff]/80">{t("blasterDesc")}</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveGame("stars")}
              className="gaming-arcade-card group w-full text-start"
            >
              <span className="gaming-pixel text-[#ff00ff]">{t("starsTitle")}</span>
              <p className="mt-2 text-sm text-[#00f0ff]/80">{t("starsDesc")}</p>
            </button>
          </div>
        ) : (
          <div className="bg-black/90 p-5">
            <button
              type="button"
              onClick={() => setActiveGame(null)}
              className="gaming-pixel mb-4 text-xs text-[#00f0ff]"
            >
              ← {t("backToMenu")}
            </button>
            {activeGame === "blaster" ? (
              <NeonBlasterGame key="blaster" />
            ) : (
              <StarCatcherGame key="stars" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
