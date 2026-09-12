"use client";

import { Trophy, Zap } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { useGamingMode, SNAKE_PALETTES, type SnakePalette } from "@/components/gaming/GamingModeProvider";
import { playGameStart, playLevelUp } from "@/lib/gamingSound";
import { fetchTopScores, leaderboardEnabled, type LeaderboardEntry } from "@/lib/leaderboard";
import { LEADERBOARD_NAME_KEY, finishRun } from "@/components/gaming/gamingLeaderboardExit";

const PALETTE_GRADIENT: Record<SnakePalette, [string, string]> = {
  green: ["#39ff14", "#00f0ff"],
  magenta: ["#ff00ff", "#ff3864"],
  gold: ["#ffe600", "#ff8a00"],
};

const PALETTE_LABEL_KEY: Record<SnakePalette, "paletteGreen" | "paletteMagenta" | "paletteGold"> = {
  green: "paletteGreen",
  magenta: "paletteMagenta",
  gold: "paletteGold",
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function useLeaderboard() {
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
  const [loadingTop, setLoadingTop] = useState(leaderboardEnabled);

  useEffect(() => {
    if (!leaderboardEnabled) return;
    void fetchTopScores().then((entries) => {
      setTopScores(entries);
      setLoadingTop(false);
    });
  }, []);

  return { topScores, loadingTop };
}

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

function LeaderboardList({
  topScores,
  loadingTop,
  isMine,
}: {
  topScores: LeaderboardEntry[];
  loadingTop: boolean;
  isMine?: (entry: LeaderboardEntry) => boolean;
}) {
  const t = useTranslations("gaming");

  if (loadingTop) return <p className="text-xs text-muted">{t("leaderboardLoading")}</p>;
  if (topScores.length === 0) return <p className="text-xs text-muted">{t("leaderboardEmpty")}</p>;

  return (
    <ol className="flex flex-col gap-1.5">
      {topScores.map((entry, index) => {
        const mine = isMine?.(entry) ?? false;
        return (
          <li
            key={`${entry.name}-${entry.created_at}`}
            className={`flex items-center justify-between gap-3 rounded px-1.5 py-0.5 text-sm${
              mine ? " gaming-leaderboard-mine" : index === 0 ? " text-[#ffe600]" : " text-[#eaffea]"
            }`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="tabular-nums opacity-60">{index + 1}</span>
              <span className="truncate">{entry.name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3 tabular-nums">
              <span className="text-xs text-[#00f0ff]">{formatDuration(entry.duration_seconds)}</span>
              <span>{entry.score}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function GatePanel({
  accent,
  wide,
  onSubmit,
  children,
}: {
  accent: [string, string];
  wide: boolean;
  onSubmit: (event: FormEvent) => void;
  children: ReactNode;
}) {
  const [accentA, accentB] = accent;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[75] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        style={{ "--accent": accentA, "--accent-2": accentB } as CSSProperties}
        className={`gaming-startgate grid w-full grid-cols-1 gap-6 px-6 py-7 sm:px-9 sm:py-8${
          wide ? " max-w-2xl sm:grid-cols-[1.1fr_1fr] sm:gap-8" : " max-w-sm"
        }`}
      >
        <span className="gaming-corner gaming-corner-tl" aria-hidden />
        <span className="gaming-corner gaming-corner-tr" aria-hidden />
        <span className="gaming-corner gaming-corner-bl" aria-hidden />
        <span className="gaming-corner gaming-corner-br" aria-hidden />
        {children}
      </form>
    </div>
  );
}

function StartGate() {
  const t = useTranslations("gaming");
  const { snakePalette, setSnakePalette, enterArena } = useGamingMode();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem(LEADERBOARD_NAME_KEY) ?? "",
  );
  const { topScores, loadingTop } = useLeaderboard();

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleStart = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim().slice(0, 12);
    if (!trimmed) return;
    window.localStorage.setItem(LEADERBOARD_NAME_KEY, trimmed);
    playGameStart();
    enterArena();
  };

  return (
    <GatePanel accent={PALETTE_GRADIENT[snakePalette]} wide={leaderboardEnabled} onSubmit={handleStart}>
      <div className="flex flex-col gap-6">
        <div>
          <p className="gaming-pixel text-base text-[var(--accent,#39ff14)]">{t("newGame")}</p>
          <p className="mt-1 text-xs text-muted">{t("newGameHint")}</p>
        </div>

        <input
          ref={nameInputRef}
          value={name}
          onChange={(event) => setName(event.target.value.slice(0, 12))}
          placeholder={t("namePlaceholder")}
          maxLength={12}
          required
          className="gaming-pixel gaming-startgate-input w-full bg-transparent px-1 py-2 text-lg tracking-wide outline-none"
        />

        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted">{t("selectPalette")}</p>
          <div className="flex items-center gap-4">
            {SNAKE_PALETTES.map((palette) => {
              const [a, b] = PALETTE_GRADIENT[palette];
              return (
                <button
                  key={palette}
                  type="button"
                  onClick={() => setSnakePalette(palette)}
                  aria-label={t(PALETTE_LABEL_KEY[palette])}
                  aria-pressed={snakePalette === palette}
                  className={`gaming-palette-swatch${snakePalette === palette ? " gaming-palette-swatch-selected" : ""}`}
                  style={{ background: `linear-gradient(135deg, ${a}, ${b})`, color: a }}
                />
              );
            })}
          </div>
        </div>

        <button type="submit" className="gaming-startgate-cta gaming-pixel w-full px-4 py-2.5 text-sm">
          {t("start")}
        </button>
      </div>

      {leaderboardEnabled ? (
        <div className="flex flex-col gap-2 border-t border-white/10 pt-5 sm:border-t-0 sm:border-s sm:ps-8 sm:pt-0">
          <div>
            <p className="gaming-pixel text-xs text-[#ffe600]">{t("leaderboardTitle")}</p>
            <p className="mt-1 text-xs text-muted">{t("leaderboardHint")}</p>
          </div>
          <LeaderboardList topScores={topScores} loadingTop={loadingTop} />
        </div>
      ) : null}
    </GatePanel>
  );
}

function EndScreen() {
  const t = useTranslations("gaming");
  const { snakePalette, runResult, startAgain, toggleGaming } = useGamingMode();
  const { topScores, loadingTop } = useLeaderboard();
  const myName = typeof window === "undefined" ? "" : window.localStorage.getItem(LEADERBOARD_NAME_KEY);

  if (!runResult) return null;

  const handleStartAgain = (event: FormEvent) => {
    event.preventDefault();
    playGameStart();
    startAgain();
  };

  const isMine = (entry: LeaderboardEntry) =>
    entry.name === myName &&
    entry.score === runResult.score &&
    entry.duration_seconds === runResult.elapsedSeconds;

  return (
    <GatePanel accent={PALETTE_GRADIENT[snakePalette]} wide={leaderboardEnabled} onSubmit={handleStartAgain}>
      <div className="flex flex-col gap-6">
        <div>
          <p className="gaming-pixel text-base text-[var(--accent,#39ff14)]">{t("runComplete")}</p>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-[#39ff14]">
              <Zap className="h-4 w-4" aria-hidden />
              {runResult.score}
            </span>
            <span className="text-[#00f0ff]">{formatDuration(runResult.elapsedSeconds)}</span>
          </div>
        </div>

        <button type="submit" className="gaming-startgate-cta gaming-pixel w-full px-4 py-2.5 text-sm">
          {t("startAgain")}
        </button>

        <button
          type="button"
          onClick={toggleGaming}
          className="text-xs text-muted transition-colors hover:text-[#eaffea]"
        >
          {t("leave")}
        </button>
      </div>

      {leaderboardEnabled ? (
        <div className="flex flex-col gap-2 border-t border-white/10 pt-5 sm:border-t-0 sm:border-s sm:ps-8 sm:pt-0">
          <div>
            <p className="gaming-pixel text-xs text-[#ffe600]">{t("leaderboardTitle")}</p>
            <p className="mt-1 text-xs text-muted">{t("leaderboardHint")}</p>
          </div>
          <LeaderboardList topScores={topScores} loadingTop={loadingTop} isMine={isMine} />
        </div>
      ) : null}
    </GatePanel>
  );
}

export function GamingHUD() {
  const t = useTranslations("gaming");
  const { score, highScore, level, toast, arenaEntered, elapsedSeconds, runResult, endRun } =
    useGamingMode();
  const scorePulsing = usePulseOnChange(score);
  const prevLevelRef = useRef(level);

  useEffect(() => {
    if (level > prevLevelRef.current) playLevelUp();
    prevLevelRef.current = level;
  }, [level]);

  const handleEndRun = useCallback(() => {
    void finishRun(score, elapsedSeconds, endRun);
  }, [score, elapsedSeconds, endRun]);

  return (
    <>
      {arenaEntered ? (
        <div className="gaming-hud pointer-events-none fixed inset-x-0 top-20 z-[60] px-4">
          <div className="mx-auto grid max-w-7xl grid-cols-3 items-start gap-3">
            <div />

            <div className="gaming-panel pointer-events-auto justify-self-center px-4 py-2">
              <span className="gaming-pixel text-base text-[#00f0ff]" aria-label={t("time")}>
                {formatDuration(elapsedSeconds)}
              </span>
            </div>

            <div className="gaming-panel pointer-events-auto flex flex-wrap items-center justify-self-end gap-3 px-4 py-3">
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
            </div>
          </div>
        </div>
      ) : null}

      {arenaEntered ? (
        <div className="gaming-hud pointer-events-none fixed inset-x-0 bottom-4 z-[60] px-4">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-end gap-3">
            <div className="pointer-events-auto flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleEndRun}
                className="gaming-panel gaming-pixel px-3.5 py-2.5 text-sm text-[#ff3864]"
              >
                {t("exit")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="gaming-toast gaming-pixel fixed start-1/2 top-32 z-[70] -translate-x-1/2 px-5 py-3 text-lg text-[#39ff14] rtl:translate-x-1/2"
        >
          {toast}
        </div>
      ) : null}

      {!arenaEntered ? (runResult ? <EndScreen /> : <StartGate />) : null}
    </>
  );
}
