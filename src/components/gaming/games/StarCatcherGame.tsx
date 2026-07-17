"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

type Star = {
  id: number;
  x: number;
  delay: number;
  duration: number;
};

let starId = 0;

export function StarCatcherGame() {
  const t = useTranslations("gaming");
  const { addScore } = useGamingMode();
  const [stars, setStars] = useState<Star[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [active, setActive] = useState(true);
  const [visible, setVisible] = useState(true);
  const activeRef = useRef(true);
  const visibleRef = useRef(true);
  const caughtRef = useRef(new Set<number>());
  const despawnTimersRef = useRef(new Map<number, number>());

  const spawnStar = useCallback(() => {
    if (!activeRef.current || !visibleRef.current) return;
    setStars((prev) => {
      if (prev.length >= 6) return prev;
      return [
        ...prev,
        {
          id: ++starId,
          x: 10 + Math.random() * 80,
          delay: Math.random() * 0.8,
          duration: 2.8 + Math.random() * 1.4,
        },
      ];
    });
  }, []);

  const removeStar = useCallback((id: number) => {
    const timer = despawnTimersRef.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      despawnTimersRef.current.delete(id);
    }
    setStars((prev) => prev.filter((star) => star.id !== id));
  }, []);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const onVisibility = () => {
      const isVisible = !document.hidden;
      visibleRef.current = isVisible;
      setVisible(isVisible);
    };

    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!active || !visible) return;

    const spawnInterval = window.setInterval(spawnStar, 700);
    const initial = window.setTimeout(spawnStar, 200);
    return () => {
      window.clearInterval(spawnInterval);
      window.clearTimeout(initial);
    };
  }, [active, visible, spawnStar]);

  useEffect(() => {
    if (!active || !visible) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          activeRef.current = false;
          setActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [active, visible]);

  // Timer-based despawn so stars clear even when CSS animation is disabled
  useEffect(() => {
    const alive = new Set(stars.map((star) => star.id));

    for (const star of stars) {
      if (despawnTimersRef.current.has(star.id)) continue;
      const timer = window.setTimeout(
        () => {
          despawnTimersRef.current.delete(star.id);
          removeStar(star.id);
        },
        (star.delay + star.duration) * 1000,
      );
      despawnTimersRef.current.set(star.id, timer);
    }

    for (const [id, timer] of despawnTimersRef.current) {
      if (alive.has(id)) continue;
      window.clearTimeout(timer);
      despawnTimersRef.current.delete(id);
    }
  }, [stars, removeStar]);

  useEffect(() => {
    const timers = despawnTimersRef.current;
    return () => {
      for (const timer of timers.values()) {
        window.clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  const catchStar = (id: number) => {
    if (caughtRef.current.has(id)) return;
    caughtRef.current.add(id);
    removeStar(id);
    addScore(20, t("starCaught"));
  };

  const restart = () => {
    for (const timer of despawnTimersRef.current.values()) {
      window.clearTimeout(timer);
    }
    despawnTimersRef.current.clear();
    caughtRef.current.clear();
    setStars([]);
    setTimeLeft(30);
    activeRef.current = true;
    setActive(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="gaming-pixel text-sm text-[#ffe600]">
        {t("timeLeft")}: {timeLeft}s
      </p>
      <div className="gaming-stars-field relative h-72 w-full max-w-xl overflow-hidden rounded-xl border-2 border-[#ff00ff]/40 bg-black/60">
        {stars.map((star) => (
          <button
            key={star.id}
            type="button"
            className="gaming-star absolute top-0"
            style={{
              left: `${star.x}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              animationPlayState: visible ? "running" : "paused",
            }}
            onClick={() => catchStar(star.id)}
            aria-label={t("catchStar")}
          />
        ))}
        {!active ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <p className="gaming-pixel text-[#39ff14]">{t("timeUp")}</p>
            <button
              type="button"
              onClick={restart}
              className="gaming-pixel mt-4 text-sm text-[#00f0ff]"
            >
              {t("retry")}
            </button>
          </div>
        ) : null}
      </div>
      <p className="gaming-pixel text-xs text-[#00f0ff]/80">{t("starsHint")}</p>
    </div>
  );
}
