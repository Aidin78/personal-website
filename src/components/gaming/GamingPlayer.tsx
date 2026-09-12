"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";
import { playBurn } from "@/lib/gamingSound";
import { finishRun } from "@/components/gaming/gamingLeaderboardExit";

const CELL = 13;
const TICK = 68;
const BOOST_TICK = 38;
const INITIAL_LENGTH = 3;
const BURN_MS = 900;
const LEVEL_TICK_STEP = 4;
const MIN_TICK = 34;
const MIN_BOOST_TICK = 22;

function tickForLevel(level: number, boosting: boolean) {
  const base = Math.max(MIN_TICK, TICK - (level - 1) * LEVEL_TICK_STEP);
  if (!boosting) return base;
  return Math.max(MIN_BOOST_TICK, base - (TICK - BOOST_TICK));
}

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

function snapCell(n: number) {
  return Math.round(n / CELL) * CELL;
}

function getBounds() {
  const minCol = Math.ceil(16 / CELL);
  const maxCol = Math.floor((window.innerWidth - CELL - 16) / CELL);
  const minRow = Math.ceil(16 / CELL);
  const maxRow = Math.floor((window.innerHeight - CELL - 16) / CELL);
  return {
    minX: minCol * CELL,
    maxX: Math.max(minCol, maxCol) * CELL,
    minY: minRow * CELL,
    maxY: Math.max(minRow, maxRow) * CELL,
  };
}

function wrapHead(x: number, y: number): { point: Point; wrapped: boolean } {
  const { minX, maxX, minY, maxY } = getBounds();
  let nx = x;
  let ny = y;
  let wrapped = false;

  if (nx > maxX) {
    nx = minX;
    wrapped = true;
  } else if (nx < minX) {
    nx = maxX;
    wrapped = true;
  }

  if (ny > maxY) {
    ny = minY;
    wrapped = true;
  } else if (ny < minY) {
    ny = maxY;
    wrapped = true;
  }

  return { point: { x: nx, y: ny }, wrapped };
}

function initSegments(): Point[] {
  const x = snapCell(80);
  const y = snapCell(120);
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
  const { snakeLength, addScore, collectOrb, snakePalette, score, elapsedSeconds, endRun, level } =
    useGamingMode();
  const [segments, setSegments] = useState<Point[]>(initSegments);
  const [facing, setFacing] = useState<Dir>("up");
  const [burning, setBurning] = useState(false);
  const [boosting, setBoosting] = useState(false);
  const [wrapping, setWrapping] = useState(false);
  const directionRef = useRef<Dir>("up");
  const pendingDirRef = useRef<Dir>("up");
  const burningRef = useRef(false);
  const burnTimerRef = useRef<number | null>(null);
  const heldKeysRef = useRef(new Set<string>());
  const heldPointersRef = useRef(new Set<number>());
  const snakeLengthRef = useRef(snakeLength);
  const levelRef = useRef(level);
  const wrapClearRef = useRef<number | null>(null);

  useEffect(() => {
    snakeLengthRef.current = snakeLength;
  }, [snakeLength]);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    return () => {
      if (burnTimerRef.current !== null) {
        window.clearTimeout(burnTimerRef.current);
      }
      if (wrapClearRef.current !== null) {
        window.clearTimeout(wrapClearRef.current);
      }
    };
  }, []);

  const markWrapped = useCallback(() => {
    setWrapping(true);
    if (wrapClearRef.current !== null) {
      window.clearTimeout(wrapClearRef.current);
    }
    wrapClearRef.current = window.setTimeout(() => {
      wrapClearRef.current = null;
      setWrapping(false);
    }, 0);
  }, []);

  const syncBoost = useCallback(() => {
    setBoosting(heldKeysRef.current.size > 0 || heldPointersRef.current.size > 0);
  }, []);

  const queueDirection = useCallback((next: Dir) => {
    if (burningRef.current) return;
    if (next !== OPPOSITE[directionRef.current]) {
      pendingDirRef.current = next;
    }
  }, []);

  const triggerDeath = useCallback(() => {
    if (burningRef.current) return;

    burningRef.current = true;
    setBurning(true);
    addScore(0, t("snakeBurn"));
    playBurn();

    if (burnTimerRef.current !== null) {
      window.clearTimeout(burnTimerRef.current);
    }
    burnTimerRef.current = window.setTimeout(() => {
      burnTimerRef.current = null;
      void finishRun(score, elapsedSeconds, endRun);
    }, BURN_MS);
  }, [addScore, score, elapsedSeconds, endRun, t]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (burningRef.current) return;

      const key = event.key.toLowerCase();
      if (!MOVE_KEYS.has(key)) return;

      event.preventDefault();
      heldKeysRef.current.add(key);
      syncBoost();

      const next = keyToDir(key);
      if (next) queueDirection(next);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!MOVE_KEYS.has(key)) return;
      heldKeysRef.current.delete(key);
      syncBoost();
    };

    const clearHeld = () => {
      heldKeysRef.current.clear();
      heldPointersRef.current.clear();
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
  }, [syncBoost, queueDirection]);

  const handlePadPointerDown = useCallback(
    (dir: Dir) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (burningRef.current) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      heldPointersRef.current.add(event.pointerId);
      syncBoost();
      queueDirection(dir);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(10);
    },
    [queueDirection, syncBoost],
  );

  const handlePadPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      heldPointersRef.current.delete(event.pointerId);
      syncBoost();
    },
    [syncBoost],
  );

  useEffect(() => {
    let timeoutId = 0;

    const step = () => {
      if (burningRef.current || document.hidden) return;

      directionRef.current = pendingDirRef.current;
      setFacing(pendingDirRef.current);
      const delta = DELTA[directionRef.current];
      const length = snakeLengthRef.current;

      setSegments((prev) => {
        const head = prev[0]!;
        const { point: nextHead, wrapped } = wrapHead(
          head.x + delta.x,
          head.y + delta.y,
        );

        if (hitsSelf(nextHead, prev.slice(1))) {
          window.setTimeout(triggerDeath, 0);
          return prev;
        }

        if (wrapped) {
          window.setTimeout(markWrapped, 0);
        }

        return [nextHead, ...prev].slice(0, length);
      });
    };

    const loop = () => {
      step();
      const boosting = heldKeysRef.current.size > 0 || heldPointersRef.current.size > 0;
      const delay = tickForLevel(levelRef.current, boosting);
      timeoutId = window.setTimeout(loop, delay);
    };

    timeoutId = window.setTimeout(loop, TICK);

    return () => window.clearTimeout(timeoutId);
  }, [triggerDeath, markWrapped]);

  useEffect(() => {
    if (burningRef.current) return;

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
  }, [segments, collectOrb, t]);

  return (
    <>
      <div
        className={`gaming-snake gaming-snake-palette-${snakePalette} pointer-events-none fixed z-[78]${burning ? " gaming-snake-burning" : ""}${boosting ? " gaming-snake-boost" : ""}${wrapping ? " gaming-snake-wrapping" : ""}`}
        aria-hidden
      >
        {segments.map((seg, i) => {
          const isHead = i === 0;
          const size = isHead ? CELL : Math.max(7, CELL * (1 - (i / segments.length) * 0.45));
          const offset = (CELL - size) / 2;
          const tailDistance = segments.length - 1 - i;
          const eatDelayMs = (tailDistance / Math.max(1, segments.length - 1)) * 350;
          return (
            <div
              key={i}
              className={isHead ? "gaming-snake-head" : "gaming-snake-segment"}
              data-facing={isHead ? facing : undefined}
              style={
                {
                  left: seg.x + offset,
                  top: seg.y + offset,
                  width: size,
                  height: size,
                  zIndex: segments.length - i,
                  opacity: isHead ? 1 : Math.max(0.45, 1 - i / segments.length),
                  "--eat-delay": `${eatDelayMs}ms`,
                } as CSSProperties
              }
            />
          );
        })}
      </div>

      <div className="gaming-dpad" role="group" aria-label={t("dpadLabel")}>
        <button
          type="button"
          className="gaming-dpad-btn gaming-dpad-up"
          aria-label={t("dpadUp")}
          onPointerDown={handlePadPointerDown("up")}
          onPointerUp={handlePadPointerUp}
          onPointerCancel={handlePadPointerUp}
          onPointerLeave={handlePadPointerUp}
        />
        <button
          type="button"
          className="gaming-dpad-btn gaming-dpad-left"
          aria-label={t("dpadLeft")}
          onPointerDown={handlePadPointerDown("left")}
          onPointerUp={handlePadPointerUp}
          onPointerCancel={handlePadPointerUp}
          onPointerLeave={handlePadPointerUp}
        />
        <button
          type="button"
          className="gaming-dpad-btn gaming-dpad-right"
          aria-label={t("dpadRight")}
          onPointerDown={handlePadPointerDown("right")}
          onPointerUp={handlePadPointerUp}
          onPointerCancel={handlePadPointerUp}
          onPointerLeave={handlePadPointerUp}
        />
        <button
          type="button"
          className="gaming-dpad-btn gaming-dpad-down"
          aria-label={t("dpadDown")}
          onPointerDown={handlePadPointerDown("down")}
          onPointerUp={handlePadPointerUp}
          onPointerCancel={handlePadPointerUp}
          onPointerLeave={handlePadPointerUp}
        />
      </div>
    </>
  );
}
