"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

type Orb = {
  id: number;
  x: number;
  y: number;
  tone: "green" | "cyan" | "pink";
  spawnAt: number;
  ttl: number;
};

let orbId = 0;

const ORB_TTL_MIN = 3500;
const ORB_TTL_MAX = 6000;

export function GamingCollectibles() {
  const t = useTranslations("gaming");
  const {
    activeGame,
    arcadeOpen,
    lives,
    collectOrb,
    registerOrbCollector,
  } = useGamingMode();
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const orbsRef = useRef(orbs);

  useEffect(() => {
    orbsRef.current = orbs;
  }, [orbs]);

  const removeOrb = useCallback((id: number) => {
    if (!orbsRef.current.some((orb) => orb.id === id)) return false;
    setOrbs((prev) => prev.filter((orb) => orb.id !== id));
    return true;
  }, []);

  useEffect(() => {
    registerOrbCollector(removeOrb);
    return () => registerOrbCollector(null);
  }, [registerOrbCollector, removeOrb]);

  const spawnOrb = useCallback(() => {
    const tones: Orb["tone"][] = ["green", "cyan", "pink"];
    setOrbs((prev) => {
      if (prev.length >= 10) return prev;
      const next: Orb = {
        id: ++orbId,
        x: 8 + Math.random() * 84,
        y: 18 + Math.random() * 62,
        tone: tones[Math.floor(Math.random() * tones.length)]!,
        spawnAt: Date.now(),
        ttl: ORB_TTL_MIN + Math.random() * (ORB_TTL_MAX - ORB_TTL_MIN),
      };
      return [...prev, next];
    });
  }, []);

  useEffect(() => {
    if (activeGame || arcadeOpen || lives === 0) return;

    const tick = window.setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);
      setOrbs((prev) => {
        const next = prev.filter((orb) => currentNow - orb.spawnAt < orb.ttl);
        return next.length === prev.length ? prev : next;
      });
    }, 200);
    const spawn = window.setInterval(spawnOrb, 2200);
    const initial = window.setTimeout(spawnOrb, 500);

    return () => {
      window.clearInterval(tick);
      window.clearInterval(spawn);
      window.clearTimeout(initial);
    };
  }, [spawnOrb, activeGame, arcadeOpen, lives]);

  const tryCollect = (id: number, tone: Orb["tone"]) => {
    if (lives === 0) return;
    const points = tone === "pink" ? 25 : tone === "cyan" ? 15 : 10;
    collectOrb(id, points, t("orbCollected", { points }));
  };

  if (lives === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[55]">
      {orbs.map((orb) => {
        const elapsed = now - orb.spawnAt;
        const remaining = orb.ttl - elapsed;
        const fade = Math.max(0, Math.min(1, remaining / 1200));
        const scale = 0.75 + fade * 0.25;

        return (
          <button
            key={orb.id}
            type="button"
            data-orb-id={orb.id}
            data-orb-tone={orb.tone}
            className={`gaming-orb gaming-orb-${orb.tone} pointer-events-auto absolute`}
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              opacity: fade,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
            onClick={() => tryCollect(orb.id, orb.tone)}
            aria-label={t("collectOrb")}
          />
        );
      })}
    </div>
  );
}
