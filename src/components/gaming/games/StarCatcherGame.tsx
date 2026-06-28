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
  const activeRef = useRef(true);

  const spawnStar = useCallback(() => {
    if (!activeRef.current) return;
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
    setStars((prev) => prev.filter((star) => star.id !== id));
  }, []);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const spawnInterval = window.setInterval(spawnStar, 700);
    const initial = window.setTimeout(spawnStar, 200);
    return () => {
      window.clearInterval(spawnInterval);
      window.clearTimeout(initial);
    };
  }, [active, spawnStar]);

  useEffect(() => {
    if (!active) return;

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
  }, [active]);

  const catchStar = (id: number) => {
    removeStar(id);
    addScore(20, t("starCaught"));
  };

  const restart = () => {
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
            }}
            onClick={() => catchStar(star.id)}
            onAnimationEnd={() => removeStar(star.id)}
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
