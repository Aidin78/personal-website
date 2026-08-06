"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

const GamingLayer = dynamic(
  () =>
    import("@/components/gaming/GamingLayer").then((mod) => mod.GamingLayer),
  { ssr: false },
);

/**
 * Defers the gaming overlay until gaming mode is turned on once per session.
 */
export function GamingLayerGate() {
  const { isGaming } = useGamingMode();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (isGaming) setShouldLoad(true);
  }, [isGaming]);

  if (!shouldLoad) return null;
  return <GamingLayer />;
}
