"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";
import { playOrbCollect } from "@/lib/gamingSound";

type Orb = {
  id: number;
  x: number;
  y: number;
  tone: "green" | "cyan" | "pink";
  spawnAt: number;
  ttl: number;
};

type Burst = {
  id: number;
  x: number;
  y: number;
  tone: Orb["tone"];
};

let orbId = 0;
let burstId = 0;

const ORB_TTL_MIN = 3500;
const ORB_TTL_MAX = 6000;
const BURST_PARTICLES = 6;
const BURST_MS = 500;

export function GamingCollectibles() {
  const t = useTranslations("gaming");
  const { collectOrb, registerOrbCollector, doubleScoreActive } = useGamingMode();
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [visible, setVisible] = useState(true);
  const orbsRef = useRef(orbs);
  const hiddenAtRef = useRef<number | null>(null);
  const burstTimersRef = useRef(new Set<number>());

  const spawnBurst = useCallback((x: number, y: number, tone: Orb["tone"]) => {
    const id = ++burstId;
    setBursts((prev) => [...prev, { id, x, y, tone }]);
    const timer = window.setTimeout(() => {
      burstTimersRef.current.delete(timer);
      setBursts((prev) => prev.filter((burst) => burst.id !== id));
    }, BURST_MS);
    burstTimersRef.current.add(timer);
  }, []);

  useEffect(() => {
    const timers = burstTimersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

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

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
        setVisible(false);
        return;
      }

      const hiddenAt = hiddenAtRef.current;
      if (hiddenAt !== null) {
        const pausedFor = Date.now() - hiddenAt;
        hiddenAtRef.current = null;
        setOrbs((prev) =>
          prev.map((orb) => ({ ...orb, spawnAt: orb.spawnAt + pausedFor })),
        );
      }
      setVisible(true);
    };

    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const spawnOrb = useCallback(() => {
    if (document.hidden) return;
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
    if (!visible) return;

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
  }, [spawnOrb, visible]);

  const tryCollect = (id: number, tone: Orb["tone"], x: number, y: number) => {
    const points = tone === "pink" ? 25 : tone === "cyan" ? 15 : 10;
    const awardedPoints = doubleScoreActive ? points * 2 : points;
    const collected = collectOrb(id, points, t("orbCollected", { points: awardedPoints }));
    if (collected) {
      spawnBurst(x, y, tone);
      playOrbCollect(tone);
    }
  };

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
            onClick={() => tryCollect(orb.id, orb.tone, orb.x, orb.y)}
            aria-label={t("collectOrb")}
          />
        );
      })}

      {bursts.map((burst) => (
        <div
          key={burst.id}
          aria-hidden
          className="absolute"
          style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
        >
          {Array.from({ length: BURST_PARTICLES }).map((_, i) => (
            <span
              key={i}
              className={`gaming-particle gaming-particle-${burst.tone}`}
              style={
                {
                  "--particle-angle": `${(360 / BURST_PARTICLES) * i}deg`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
