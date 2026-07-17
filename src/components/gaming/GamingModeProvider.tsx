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

export type ArcadeGame = "blaster" | "stars" | null;

type GamingContextValue = {
  isGaming: boolean;
  toggleGaming: () => void;
  score: number;
  highScore: number;
  addScore: (points: number, reason?: string) => void;
  lives: number;
  loseLife: () => void;
  resetLives: () => void;
  level: number;
  toast: string | null;
  arcadeOpen: boolean;
  setArcadeOpen: (open: boolean) => void;
  activeGame: ArcadeGame;
  setActiveGame: (game: ArcadeGame) => void;
  snakeLength: number;
  growSnake: () => void;
  resetSnake: () => void;
  restartSession: () => void;
  sessionId: number;
  collectOrb: (id: number, points: number, reason: string) => boolean;
  registerOrbCollector: (fn: ((id: number) => boolean) | null) => void;
};

const INITIAL_SNAKE_LENGTH = 3;

const GamingContext = createContext<GamingContextValue | null>(null);

function getLevel(score: number) {
  return Math.floor(score / 250) + 1;
}

function readStoredHighScore() {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
}

export function GamingModeProvider({ children }: { children: ReactNode }) {
  const [isGaming, setIsGaming] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => readStoredHighScore());
  const [lives, setLives] = useState(3);
  const [toast, setToast] = useState<string | null>(null);
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<ArcadeGame>(null);
  const [snakeLength, setSnakeLength] = useState(INITIAL_SNAKE_LENGTH);
  const [sessionId, setSessionId] = useState(0);

  const toastTimerRef = useRef<number | null>(null);
  const collectedOrbsRef = useRef(new Set<number>());
  const orbCollectorRef = useRef<((id: number) => boolean) | null>(null);

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
        setScore((prev) => {
          const next = prev + points;
          setHighScore((high) => {
            const updated = Math.max(high, next);
            localStorage.setItem(HIGH_SCORE_KEY, String(updated));
            return updated;
          });
          return next;
        });
      }
      if (reason) showToast(reason);
    },
    [showToast],
  );

  const loseLife = useCallback(() => {
    setLives((prev) => Math.max(0, prev - 1));
  }, []);

  const resetLives = useCallback(() => {
    setLives(3);
  }, []);

  const growSnake = useCallback(() => {
    setSnakeLength((prev) => prev + 1);
  }, []);

  const resetSnake = useCallback(() => {
    setSnakeLength(INITIAL_SNAKE_LENGTH);
  }, []);

  const resetSession = useCallback(() => {
    setArcadeOpen(false);
    setActiveGame(null);
    setScore(0);
    setLives(3);
    setSnakeLength(INITIAL_SNAKE_LENGTH);
    collectedOrbsRef.current.clear();
  }, []);

  const restartSession = useCallback(() => {
    setSessionId((id) => id + 1);
    setLives(3);
    setSnakeLength(INITIAL_SNAKE_LENGTH);
    setArcadeOpen(false);
    setActiveGame(null);
    setScore(0);
    collectedOrbsRef.current.clear();
  }, []);

  const startSession = useCallback(() => {
    setSessionId((id) => id + 1);
    resetSession();
  }, [resetSession]);

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
    if (action === "start") startSession();
    else resetSession();
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
      lives,
      loseLife,
      resetLives,
      level,
      toast,
      arcadeOpen,
      setArcadeOpen,
      activeGame,
      setActiveGame,
      snakeLength,
      growSnake,
      resetSnake,
      restartSession,
      sessionId,
      collectOrb,
      registerOrbCollector,
    }),
    [
      isGaming,
      toggleGaming,
      score,
      highScore,
      addScore,
      lives,
      loseLife,
      resetLives,
      level,
      toast,
      arcadeOpen,
      activeGame,
      snakeLength,
      growSnake,
      resetSnake,
      restartSession,
      sessionId,
      collectOrb,
      registerOrbCollector,
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
