"use client";

import { useEffect } from "react";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

const STYLE_ID = "gaming-press-start-font-style";

/**
 * Loads the gaming pixel font from a local file (no Google Fonts CDN).
 */
export function GamingFontLoader() {
  const { isGaming } = useGamingMode();

  useEffect(() => {
    if (!isGaming) return;
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
@font-face {
  font-family: "Press Start 2P";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/PressStart2P-Regular.woff2") format("woff2");
}
`;
    document.head.appendChild(style);
  }, [isGaming]);

  return null;
}
