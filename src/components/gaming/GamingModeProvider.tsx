"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const HIGH_SCORE_KEY = "aidin-portfolio-gaming-highscore";
const PALETTE_KEY = "aidin-portfolio-gaming-palette";

export const SNAKE_PALETTES = ["green", "magenta", "gold"] as const;
export type SnakePalette = (typeof SNAKE_PALETTES)[number];

export type GamingRunResult = { score: number; elapsedSeconds: number };

type GamingContextValue = {
  isGaming: boolean;
  toggleGaming: () => void;
  score: number;
  highScore: number;
  addScore: (points: number, reason?: string) => void;
  level: number;
  toast: string | null;
  snakeLength: number;
  growSnake: () => void;
  resetSnake: () => void;
  sessionId: number;
  collectOrb: (id: number, points: number, reason: string) => boolean;
  registerOrbCollector: (fn: ((id: number) => boolean) | null) => void;
  arenaEntered: boolean;
  enterArena: () => void;
  snakePalette: SnakePalette;
  setSnakePalette: (palette: SnakePalette) => void;
  elapsedSeconds: number;
  runResult: GamingRunResult | null;
  endRun: () => void;
  startAgain: () => void;
};

const INITIAL_SNAKE_LENGTH = 3;

function isSnakePalette(value: string): value is SnakePalette {
  return (SNAKE_PALETTES as readonly string[]).includes(value);
}

function readStoredPalette(): SnakePalette {
  if (typeof window === "undefined") return "green";
  const raw = localStorage.getItem(PALETTE_KEY);
  return raw && isSnakePalette(raw) ? raw : "green";
}

const GamingContext = createContext<GamingContextValue | null>(null);

function getLevel(score: number) {
  return Math.floor(score / 250) + 1;
}

function readStoredHighScore() {
  if (typeof window === "undefined") return 0;
  const raw = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
  return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 0;
}

export function GamingModeProvider({ children }: { children: ReactNode }) {
  const [isGaming, setIsGaming] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => readStoredHighScore());
  const [toast, setToast] = useState<string | null>(null);
  const [snakeLength, setSnakeLength] = useState(INITIAL_SNAKE_LENGTH);
  const [sessionId, setSessionId] = useState(0);
  const [arenaEntered, setArenaEntered] = useState(false);
  const [snakePalette, setSnakePaletteState] = useState<SnakePalette>(() => readStoredPalette());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [runResult, setRunResult] = useState<GamingRunResult | null>(null);

  const toastTimerRef = useRef<number | null>(null);
  const collectedOrbsRef = useRef(new Set<number>());
  const orbCollectorRef = useRef<((id: number) => boolean) | null>(null);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(readStoredHighScore());
  const arenaStartRef = useRef<number | null>(null);
  const elapsedIntervalRef = useRef<number | null>(null);

  const stopElapsedTimer = useCallback(() => {
    if (elapsedIntervalRef.current !== null) {
      window.clearInterval(elapsedIntervalRef.current);
      elapsedIntervalRef.current = null;
    }
    arenaStartRef.current = null;
  }, []);

  useEffect(() => stopElapsedTimer, [stopElapsedTimer]);

  useEffect(() => {
    localStorage.removeItem("aidin-portfolio-gaming");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("gaming-mode", isGaming);
    return () => {
      document.documentElement.classList.remove("gaming-mode");
    };
  }, [isGaming]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 1600);
  }, []);

  const addScore = useCallback(
    (points: number, reason?: string) => {
      if (points !== 0) {
        const next = scoreRef.current + points;
        scoreRef.current = next;
        setScore(next);

        if (next > highScoreRef.current) {
          highScoreRef.current = next;
          setHighScore(next);
          localStorage.setItem(HIGH_SCORE_KEY, String(next));
        }
      }
      if (reason) showToast(reason);
    },
    [showToast],
  );

  const growSnake = useCallback(() => {
    setSnakeLength((prev) => prev + 1);
  }, []);

  const resetSnake = useCallback(() => {
    setSnakeLength(INITIAL_SNAKE_LENGTH);
  }, []);

  const resetSession = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
    setSnakeLength(INITIAL_SNAKE_LENGTH);
    collectedOrbsRef.current.clear();
    setArenaEntered(false);
    setElapsedSeconds(0);
    stopElapsedTimer();
  }, [stopElapsedTimer]);

  const startSession = useCallback(() => {
    setSessionId((id) => id + 1);
    resetSession();
  }, [resetSession]);

  const enterArena = useCallback(() => {
    stopElapsedTimer();
    setArenaEntered(true);
    setElapsedSeconds(0);
    arenaStartRef.current = Date.now();
    elapsedIntervalRef.current = window.setInterval(() => {
      if (arenaStartRef.current === null) return;
      setElapsedSeconds(Math.floor((Date.now() - arenaStartRef.current) / 1000));
    }, 1000);
  }, [stopElapsedTimer]);

  const setSnakePalette = useCallback((palette: SnakePalette) => {
    setSnakePaletteState(palette);
    localStorage.setItem(PALETTE_KEY, palette);
  }, []);

  const endRun = useCallback(() => {
    setRunResult({ score, elapsedSeconds });
    resetSession();
  }, [score, elapsedSeconds, resetSession]);

  const startAgain = useCallback(() => {
    setRunResult(null);
    setSessionId((id) => id + 1);
    enterArena();
  }, [enterArena]);

  const pendingSessionActionRef = useRef<"start" | "reset" | null>(null);

  const toggleGaming = useCallback(() => {
    setIsGaming((prev) => {
      pendingSessionActionRef.current = prev ? "reset" : "start";
      return !prev;
    });
  }, []);

  useEffect(() => {
    const action = pendingSessionActionRef.current;
    if (!action) return;
    pendingSessionActionRef.current = null;
    if (action === "start") {
      startSession();
    } else {
      resetSession();
      setRunResult(null);
    }
  }, [isGaming, startSession, resetSession]);

  const registerOrbCollector = useCallback((fn: ((id: number) => boolean) | null) => {
    orbCollectorRef.current = fn;
  }, []);

  const collectOrb = useCallback(
    (id: number, points: number, reason: string) => {
      if (collectedOrbsRef.current.has(id)) return false;
      collectedOrbsRef.current.add(id);

      const removed = orbCollectorRef.current?.(id) ?? true;
      if (!removed) {
        collectedOrbsRef.current.delete(id);
        return false;
      }

      addScore(points, reason);
      growSnake();
      return true;
    },
    [addScore, growSnake],
  );

  const level = getLevel(score);

  const value = useMemo(
    () => ({
      isGaming,
      toggleGaming,
      score,
      highScore,
      addScore,
      level,
      toast,
      snakeLength,
      growSnake,
      resetSnake,
      sessionId,
      collectOrb,
      registerOrbCollector,
      arenaEntered,
      enterArena,
      snakePalette,
      setSnakePalette,
      elapsedSeconds,
      runResult,
      endRun,
      startAgain,
    }),
    [
      isGaming,
      toggleGaming,
      score,
      highScore,
      addScore,
      level,
      toast,
      snakeLength,
      growSnake,
      resetSnake,
      sessionId,
      collectOrb,
      registerOrbCollector,
      arenaEntered,
      enterArena,
      snakePalette,
      setSnakePalette,
      elapsedSeconds,
      runResult,
      endRun,
      startAgain,
    ],
  );

  return (
    <GamingContext.Provider value={value}>{children}</GamingContext.Provider>
  );
}

export function useGamingMode() {
  const ctx = useContext(GamingContext);
  if (!ctx) {
    throw new Error("useGamingMode must be used within GamingModeProvider");
  }
  return ctx;
}
