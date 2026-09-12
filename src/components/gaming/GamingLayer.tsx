"use client";

import { useEffect } from "react";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";
import { GamingHUD } from "@/components/gaming/GamingHUD";
import { GamingCollectibles } from "@/components/gaming/GamingCollectibles";
import { GamingPlayer } from "@/components/gaming/GamingPlayer";
import { GamingLinkBonus } from "@/components/gaming/GamingLinkBonus";
import { GamingFontLoader } from "@/components/gaming/GamingFontLoader";
import { submitScoreOnExit } from "@/components/gaming/gamingLeaderboardExit";

export function GamingLayer() {
  const { isGaming, arenaEntered, score, elapsedSeconds, sessionId, toggleGaming, endRun } =
    useGamingMode();

  useEffect(() => {
    if (!isGaming) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (arenaEntered) {
        void submitScoreOnExit(score, elapsedSeconds).then(() => endRun());
      } else {
        toggleGaming();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isGaming, arenaEntered, score, elapsedSeconds, toggleGaming, endRun]);

  if (!isGaming) return null;

  return (
    <>
      <GamingFontLoader />
      <div aria-hidden className="gaming-crt" />
      <div aria-hidden className="gaming-scanlines" />
      <GamingHUD />
      {arenaEntered ? (
        <>
          <GamingCollectibles key={`collectibles-${sessionId}`} />
          <GamingPlayer key={`player-${sessionId}`} />
        </>
      ) : null}
      <GamingLinkBonus />
    </>
  );
}
