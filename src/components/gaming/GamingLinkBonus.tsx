"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

function clearLinkBonuses() {
  document.querySelectorAll<HTMLElement>("[data-gaming-bonus]").forEach((link) => {
    delete link.dataset.gamingBonus;
  });
}

export function GamingLinkBonus() {
  const t = useTranslations("gaming");
  const { isGaming, addScore, arcadeOpen, activeGame, sessionId } = useGamingMode();

  useEffect(() => {
    clearLinkBonuses();
  }, [sessionId, isGaming]);

  useEffect(() => {
    if (!isGaming || arcadeOpen || activeGame) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link || link.dataset.gamingBonus === "true") return;
      if (link.closest(".gaming-arcade") || link.closest(".gaming-hud")) return;

      link.dataset.gamingBonus = "true";
      addScore(30, t("linkBonus"));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [isGaming, addScore, t, arcadeOpen, activeGame]);

  return null;
}
