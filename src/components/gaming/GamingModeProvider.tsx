"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  useEffect(() => {
    localStorage.removeItem("aidin-portfolio-gaming");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("gaming-mode", isGaming);
  }, [isGaming]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1600);
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
  }, []);

  const restartSession = useCallback(() => {
    setSessionId((id) => id + 1);
    setLives(3);
    setSnakeLength(INITIAL_SNAKE_LENGTH);
    setArcadeOpen(false);
    setActiveGame(null);
  }, []);

  const startSession = useCallback(() => {
    setSessionId((id) => id + 1);
    resetSession();
  }, [resetSession]);

  const toggleGaming = useCallback(() => {
    setIsGaming((prev) => {
      const next = !prev;
      if (next) startSession();
      else resetSession();
      return next;
    });
  }, [resetSession, startSession]);

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
