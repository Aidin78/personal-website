"use client";

import { useEffect } from "react";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";
import { GamingHUD } from "@/components/gaming/GamingHUD";
import { GamingCollectibles } from "@/components/gaming/GamingCollectibles";
import { GamingPlayer } from "@/components/gaming/GamingPlayer";
import { ArcadePanel } from "@/components/gaming/ArcadePanel";
import { GamingLinkBonus } from "@/components/gaming/GamingLinkBonus";

export function GamingLayer() {
  const { isGaming, sessionId } = useGamingMode();

  useEffect(() => {
    if (!isGaming) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isGaming]);

  if (!isGaming) return null;

  return (
    <>
      <div aria-hidden className="gaming-crt" />
      <div aria-hidden className="gaming-scanlines" />
      <GamingHUD />
      <GamingCollectibles key={sessionId} />
      <GamingPlayer key={sessionId} />
      <ArcadePanel />
      <GamingLinkBonus />
    </>
  );
}
