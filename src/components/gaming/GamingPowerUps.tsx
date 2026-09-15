"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";
import { playPowerUp } from "@/lib/gamingSound";

type PowerUpKind = "shield" | "slow" | "double";

type PowerUp = { id: number; x: number; y: number; kind: PowerUpKind };

let powerUpId = 0;

const KINDS: PowerUpKind[] = ["shield", "slow", "double"];
const POWERUP_TTL_MS = 5000;
const SPAWN_INTERVAL_MS = 12000;
const SLOW_DURATION_MS = 6000;
const DOUBLE_DURATION_MS = 8000;

const KIND_GLYPH: Record<PowerUpKind, string> = {
  shield: "\u{1F6E1}",
  slow: "\u{1F422}",
  double: "×2",
};

const KIND_LABEL_KEY: Record<PowerUpKind, "powerUpShield" | "powerUpSlow" | "powerUpDouble"> = {
  shield: "powerUpShield",
  slow: "powerUpSlow",
  double: "powerUpDouble",
};

export function GamingPowerUps() {
  const t = useTranslations("gaming");
  const { activateShield, activateSlow, activateDoubleScore, addScore, registerPowerUpCollector } =
    useGamingMode();
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const expireTimersRef = useRef(new Set<number>());
  const powerUpsRef = useRef(powerUps);

  useEffect(() => {
    powerUpsRef.current = powerUps;
  }, [powerUps]);

  const removePowerUp = useCallback((id: number) => {
    setPowerUps((prev) => prev.filter((powerUp) => powerUp.id !== id));
  }, []);

  useEffect(() => {
    const timers = expireTimersRef.current;

    const spawn = () => {
      if (document.hidden) return;

      const id = ++powerUpId;
      const kind = KINDS[Math.floor(Math.random() * KINDS.length)]!;
      setPowerUps((prev) => [
        ...prev,
        { id, x: 10 + Math.random() * 80, y: 22 + Math.random() * 55, kind },
      ]);

      const expireTimer = window.setTimeout(() => {
        timers.delete(expireTimer);
        removePowerUp(id);
      }, POWERUP_TTL_MS);
      timers.add(expireTimer);
    };

    const interval = window.setInterval(spawn, SPAWN_INTERVAL_MS);
    return () => {
      window.clearInterval(interval);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, [removePowerUp]);

  const collect = useCallback(
    (powerUp: PowerUp) => {
      removePowerUp(powerUp.id);
      playPowerUp();

      if (powerUp.kind === "shield") activateShield();
      else if (powerUp.kind === "slow") activateSlow(SLOW_DURATION_MS);
      else activateDoubleScore(DOUBLE_DURATION_MS);

      addScore(0, t(KIND_LABEL_KEY[powerUp.kind]));
    },
    [removePowerUp, activateShield, activateSlow, activateDoubleScore, addScore, t],
  );

  const collectById = useCallback(
    (id: number) => {
      const powerUp = powerUpsRef.current.find((candidate) => candidate.id === id);
      if (!powerUp) return false;
      collect(powerUp);
      return true;
    },
    [collect],
  );

  useEffect(() => {
    registerPowerUpCollector(collectById);
    return () => registerPowerUpCollector(null);
  }, [registerPowerUpCollector, collectById]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[56]">
      {powerUps.map((powerUp) => (
        <button
          key={powerUp.id}
          type="button"
          data-powerup-id={powerUp.id}
          data-powerup-kind={powerUp.kind}
          className={`gaming-powerup gaming-powerup-${powerUp.kind} pointer-events-auto absolute`}
          style={{ left: `${powerUp.x}%`, top: `${powerUp.y}%` }}
          onClick={() => collect(powerUp)}
          aria-label={t(KIND_LABEL_KEY[powerUp.kind])}
        >
          {KIND_GLYPH[powerUp.kind]}
        </button>
      ))}
    </div>
  );
}
