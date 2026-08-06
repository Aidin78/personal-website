"use client";

import { useEffect } from "react";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";
import { GamingHUD } from "@/components/gaming/GamingHUD";
import { GamingCollectibles } from "@/components/gaming/GamingCollectibles";
import { GamingPlayer } from "@/components/gaming/GamingPlayer";
import { GamingLinkBonus } from "@/components/gaming/GamingLinkBonus";
import { GamingFontLoader } from "@/components/gaming/GamingFontLoader";

export function GamingLayer() {
  const { isGaming, sessionId, toggleGaming } = useGamingMode();

  useEffect(() => {
    if (!isGaming) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      toggleGaming();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isGaming, toggleGaming]);

  if (!isGaming) return null;

  return (
    <>
      <GamingFontLoader />
      <div aria-hidden className="gaming-crt" />
      <div aria-hidden className="gaming-scanlines" />
      <GamingHUD />
      <GamingCollectibles key={`collectibles-${sessionId}`} />
      <GamingPlayer key={`player-${sessionId}`} />
      <GamingLinkBonus />
    </>
  );
}
