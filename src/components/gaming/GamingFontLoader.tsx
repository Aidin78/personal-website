"use client";

import { useEffect } from "react";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
const LINK_ID = "gaming-press-start-font";

/** Loads the arcade pixel font only after gaming mode is turned on. */
export function GamingFontLoader() {
  const { isGaming } = useGamingMode();

  useEffect(() => {
    if (!isGaming) return;
    if (document.getElementById(LINK_ID)) return;

    const link = document.createElement("link");
    link.id = LINK_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, [isGaming]);

  return null;
}
