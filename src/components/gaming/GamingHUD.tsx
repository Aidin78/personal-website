"use client";

import { Heart, Trophy, Zap } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useGamingMode } from "@/components/gaming/GamingModeProvider";
import { playGameOver, playLevelUp } from "@/lib/gamingSound";
import {
  fetchTopScores,
  leaderboardEnabled,
  submitScore,
  type LeaderboardEntry,
} from "@/lib/leaderboard";

const LEADERBOARD_NAME_KEY = "aidin-portfolio-gaming-name";

function usePulseOnChange(value: number) {
  const [pulsing, setPulsing] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value === prevRef.current) return;
    prevRef.current = value;
    setPulsing(true);
    const timer = window.setTimeout(() => setPulsing(false), 350);
    return () => window.clearTimeout(timer);
  }, [value]);

  return pulsing;
}

function GameOverBoard({ score }: { score: number }) {
  const t = useTranslations("gaming");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem(LEADERBOARD_NAME_KEY) ?? "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
  const [loadingTop, setLoadingTop] = useState(false);

  const loadTopScores = useCallback(async () => {
    setLoadingTop(true);
    const entries = await fetchTopScores();
    setTopScores(entries);
    setLoadingTop(false);
  }, []);

  useEffect(() => {
    void loadTopScores();
    nameInputRef.current?.focus();
  }, [loadTopScores]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || submitting || submitted) return;

    setSubmitting(true);
    const ok = await submitScore(name, score);
    setSubmitting(false);

    if (ok) {
      window.localStorage.setItem(LEADERBOARD_NAME_KEY, name.trim());
      setSubmitted(true);
      void loadTopScores();
    }
  };

  return (
    <div className="w-full max-w-xs space-y-3 text-start">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={nameInputRef}
            value={name}
            onChange={(event) => setName(event.target.value.slice(0, 12))}
            placeholder={t("namePlaceholder")}
            maxLength={12}
            className="gaming-pixel min-w-0 flex-1 border border-[#39ff14]/50 bg-black/40 px-2 py-2 text-sm text-[#39ff14] outline-none focus:border-[#39ff14]"
          />
          <button
            type="submit"
            disabled={!name.trim() || submitting}
            className="gaming-pixel shrink-0 border border-[#39ff14]/60 px-3 py-2 text-xs text-[#39ff14] disabled:opacity-40"
          >
            {t("submitScore")}
          </button>
        </form>
      ) : (
        <p className="gaming-pixel text-center text-sm text-[#39ff14]">{t("scoreSubmitted")}</p>
      )}

      <div className="gaming-panel px-3 py-2">
        <p className="gaming-pixel mb-2 text-xs text-[#ffe600]">{t("leaderboardTitle")}</p>
        {loadingTop ? (
          <p className="gaming-pixel text-xs text-muted">{t("leaderboardLoading")}</p>
        ) : topScores.length === 0 ? (
          <p className="gaming-pixel text-xs text-muted">{t("leaderboardEmpty")}</p>
        ) : (
          <ol className="space-y-1">
            {topScores.map((entry, index) => (
              <li
                key={`${entry.name}-${entry.created_at}`}
                className="gaming-pixel flex items-center justify-between gap-2 text-xs text-[#39ff14]"
              >
                <span>
                  {index + 1}. {entry.name}
                </span>
                <span>{entry.score}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export function GamingHUD() {
  const t = useTranslations("gaming");
  const {
    score,
    highScore,
    lives,
    level,
    toast,
    toggleGaming,
    restartSession,
  } = useGamingMode();
  const gameOverTitleId = useId();
  const retryRef = useRef<HTMLButtonElement>(null);
  const gameOverPanelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const scorePulsing = usePulseOnChange(score);
  const levelPulsing = usePulseOnChange(level);
  const prevLevelRef = useRef(level);
  const gameOverPlayedRef = useRef(false);

  useEffect(() => {
    if (level > prevLevelRef.current) playLevelUp();
    prevLevelRef.current = level;
  }, [level]);

  useEffect(() => {
    if (lives === 0 && !gameOverPlayedRef.current) {
      playGameOver();
      gameOverPlayedRef.current = true;
    } else if (lives > 0) {
      gameOverPlayedRef.current = false;
    }
  }, [lives]);

  useEffect(() => {
    if (lives !== 0) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => {
      if (!leaderboardEnabled) retryRef.current?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !gameOverPanelRef.current) return;

      const focusable = gameOverPanelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [lives]);

  return (
    <>
      <div className="gaming-hud pointer-events-none fixed inset-x-0 top-20 z-[60] px-4">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-3">
          <div className="gaming-panel pointer-events-auto px-4 py-3">
            <p className="gaming-pixel text-sm uppercase tracking-widest text-[#39ff14]">
              {t("player")} 01
            </p>
            <p className="gaming-pixel mt-1 text-base text-[#ff00ff]">{t("modeActive")}</p>
          </div>

          <div className="gaming-panel pointer-events-auto flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="flex items-center gap-2 text-[#39ff14]">
              <Zap className="h-5 w-5" aria-hidden />
              <span className={`gaming-pixel text-lg${scorePulsing ? " gaming-score-pop" : ""}`}>
                {score}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#00f0ff]">
              <Trophy className="h-5 w-5" aria-hidden />
              <span className="gaming-pixel text-lg">{highScore}</span>
            </div>
            <div className="flex items-center gap-1 text-[#ff3864]" aria-label={`${t("lives")}: ${lives}`}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Heart
                  key={index}
                  className={`h-5 w-5 ${index < lives ? "fill-current" : "opacity-25"}`}
                  aria-hidden
                />
              ))}
            </div>
            <span
              className={`gaming-pixel text-base text-[#ffe600]${levelPulsing ? " gaming-score-pop" : ""}`}
            >
              LV {level}
            </span>
          </div>
        </div>
      </div>

      <div className="gaming-hud pointer-events-none fixed inset-x-0 bottom-4 z-[60] px-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-3">
          <div className="gaming-panel pointer-events-auto hidden px-4 py-3 sm:block">
            <p className="gaming-pixel text-sm leading-relaxed text-[#00f0ff]">
              {t("controlsMove")}
            </p>
            <p className="gaming-pixel mt-1 text-sm leading-relaxed text-[#00f0ff]/80">
              {t("controlsCollect")}
            </p>
          </div>

          <div className="pointer-events-auto flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleGaming}
              className="gaming-panel gaming-pixel px-4 py-3 text-base text-[#ff3864]"
            >
              {t("exit")}
            </button>
          </div>
        </div>
      </div>

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="gaming-toast gaming-pixel fixed start-1/2 top-32 z-[70] -translate-x-1/2 px-5 py-3 text-lg text-[#39ff14] rtl:translate-x-1/2"
        >
          {toast}
        </div>
      ) : null}

      {lives === 0 ? (
        <div className="pointer-events-auto fixed inset-0 z-[75] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            ref={gameOverPanelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={gameOverTitleId}
            className="gaming-panel flex flex-col items-center gap-4 px-6 py-5 text-center"
          >
            <p id={gameOverTitleId} className="gaming-pixel text-lg text-[#ff3864]">
              {t("gameOver")}
            </p>

            {leaderboardEnabled ? <GameOverBoard score={score} /> : null}

            <button
              ref={retryRef}
              type="button"
              onClick={restartSession}
              className="gaming-pixel text-base text-[#39ff14] transition-transform hover:scale-105"
            >
              {t("retry")}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
