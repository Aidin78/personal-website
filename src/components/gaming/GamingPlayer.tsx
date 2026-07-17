"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";

const CELL = 13;
const TICK = 68;
const BOOST_TICK = 38;
const INITIAL_LENGTH = 3;
const BURN_MS = 900;

type Point = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const DELTA: Record<Dir, Point> = {
  up: { x: 0, y: -CELL },
  down: { x: 0, y: CELL },
  left: { x: -CELL, y: 0 },
  right: { x: CELL, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function getBounds() {
  return {
    minX: 16,
    maxX: window.innerWidth - CELL - 16,
    minY: 16,
    maxY: window.innerHeight - CELL - 16,
  };
}

function wrapHead(x: number, y: number): Point {
  const { minX, maxX, minY, maxY } = getBounds();
  let nx = x;
  let ny = y;

  if (nx > maxX) nx = minX;
  else if (nx < minX) nx = maxX;

  if (ny > maxY) ny = minY;
  else if (ny < minY) ny = maxY;

  return { x: nx, y: ny };
}

function initSegments(): Point[] {
  const x = 80;
  const y = 120;
  return Array.from({ length: INITIAL_LENGTH }, (_, i) => ({
    x,
    y: y + i * CELL,
  }));
}

function hitsSelf(head: Point, body: Point[]) {
  return body.some((seg) => seg.x === head.x && seg.y === head.y);
}

const MOVE_KEYS = new Set([
  "arrowleft",
  "arrowright",
  "arrowup",
  "arrowdown",
  "a",
  "d",
  "w",
  "s",
]);

function keyToDir(key: string): Dir | null {
  if (key === "arrowleft" || key === "a") return "left";
  if (key === "arrowright" || key === "d") return "right";
  if (key === "arrowup" || key === "w") return "up";
  if (key === "arrowdown" || key === "s") return "down";
  return null;
}

export function GamingPlayer() {
  const t = useTranslations("gaming");
  const {
    activeGame,
    arcadeOpen,
    snakeLength,
    loseLife,
    addScore,
    resetSnake,
    lives,
    collectOrb,
  } = useGamingMode();
  const paused = activeGame !== null || arcadeOpen;
  const [segments, setSegments] = useState<Point[]>(initSegments);
  const [facing, setFacing] = useState<Dir>("up");
  const [burning, setBurning] = useState(false);
  const [dead, setDead] = useState(false);
  const [boosting, setBoosting] = useState(false);
  const directionRef = useRef<Dir>("up");
  const pendingDirRef = useRef<Dir>("up");
  const burningRef = useRef(false);
  const burnTimerRef = useRef<number | null>(null);
  const heldKeysRef = useRef(new Set<string>());
  const snakeLengthRef = useRef(snakeLength);

  useEffect(() => {
    snakeLengthRef.current = snakeLength;
  }, [snakeLength]);

  useEffect(() => {
    return () => {
      if (burnTimerRef.current !== null) {
        window.clearTimeout(burnTimerRef.current);
      }
    };
  }, []);

  const resetSnakeState = useCallback(() => {
    setSegments(initSegments());
    directionRef.current = "up";
    pendingDirRef.current = "up";
    setFacing("up");
    resetSnake();
  }, [resetSnake]);

  const triggerBurn = useCallback(() => {
    if (burningRef.current || dead) return;

    const willDie = lives <= 1;
    burningRef.current = true;
    setBurning(true);
    loseLife();
    addScore(0, t("snakeBurn"));

    if (burnTimerRef.current !== null) {
      window.clearTimeout(burnTimerRef.current);
    }
    burnTimerRef.current = window.setTimeout(() => {
      burnTimerRef.current = null;
      if (willDie) {
        setDead(true);
      } else {
        resetSnakeState();
      }
      burningRef.current = false;
      setBurning(false);
    }, BURN_MS);
  }, [addScore, dead, lives, loseLife, resetSnakeState, t]);

  useEffect(() => {
    if (!paused) return;
    heldKeysRef.current.clear();
  }, [paused]);

  useEffect(() => {
    if (paused || lives === 0) return;

    const syncBoost = () => {
      setBoosting(heldKeysRef.current.size > 0);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (burningRef.current || dead) return;

      const key = event.key.toLowerCase();
      if (!MOVE_KEYS.has(key)) return;

      event.preventDefault();
      heldKeysRef.current.add(key);
      syncBoost();

      const next = keyToDir(key);
      if (next && next !== OPPOSITE[directionRef.current]) {
        pendingDirRef.current = next;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!MOVE_KEYS.has(key)) return;
      heldKeysRef.current.delete(key);
      syncBoost();
    };

    const clearHeld = () => {
      heldKeysRef.current.clear();
      setBoosting(false);
    };

    const onBlur = clearHeld;
    const onVisibility = () => {
      if (document.hidden) clearHeld();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused, dead, lives]);

  useEffect(() => {
    if (paused || lives === 0) return;

    let timeoutId = 0;

    const step = () => {
      if (burningRef.current || dead || document.hidden) return;

      directionRef.current = pendingDirRef.current;
      setFacing(pendingDirRef.current);
      const delta = DELTA[directionRef.current];
      const length = snakeLengthRef.current;

      setSegments((prev) => {
        const head = prev[0]!;
        const nextHead = wrapHead(head.x + delta.x, head.y + delta.y);

        if (hitsSelf(nextHead, prev.slice(1))) {
          window.setTimeout(triggerBurn, 0);
          return prev;
        }

        return [nextHead, ...prev].slice(0, length);
      });
    };

    const loop = () => {
      step();
      const delay = heldKeysRef.current.size > 0 ? BOOST_TICK : TICK;
      timeoutId = window.setTimeout(loop, delay);
    };

    timeoutId = window.setTimeout(loop, TICK);

    return () => window.clearTimeout(timeoutId);
  }, [paused, lives, dead, triggerBurn]);

  useEffect(() => {
    if (paused || burningRef.current) return;

    const head = segments[0];
    if (!head) return;

    const orbs = document.querySelectorAll<HTMLElement>(".gaming-orb");
    orbs.forEach((orb) => {
      const id = Number(orb.dataset.orbId);
      const tone = orb.dataset.orbTone as "green" | "cyan" | "pink" | undefined;
      if (!Number.isFinite(id) || !tone) return;

      const rect = orb.getBoundingClientRect();
      const headRect = {
        left: head.x,
        top: head.y,
        right: head.x + CELL,
        bottom: head.y + CELL,
      };
      const overlap =
        rect.left < headRect.right &&
        rect.right > headRect.left &&
        rect.top < headRect.bottom &&
        rect.bottom > headRect.top;
      if (overlap) {
        const points = tone === "pink" ? 25 : tone === "cyan" ? 15 : 10;
        collectOrb(id, points, t("orbCollected", { points }));
      }
    });
  }, [segments, paused, collectOrb, t]);

  if (paused) return null;

  return (
    <div
      className={`gaming-snake pointer-events-none fixed z-[78]${burning ? " gaming-snake-burning" : ""}${boosting && !paused ? " gaming-snake-boost" : ""}${dead || lives === 0 ? " gaming-snake-dead" : ""}`}
      aria-hidden
    >
      {segments.map((seg, i) => {
        const isHead = i === 0;
        return (
          <div
            key={i}
            className={isHead ? "gaming-snake-head" : "gaming-snake-segment"}
            data-facing={isHead ? facing : undefined}
            style={{
              left: seg.x,
              top: seg.y,
              width: CELL,
              height: CELL,
              zIndex: segments.length - i,
            }}
          />
        );
      })}
    </div>
  );
}
