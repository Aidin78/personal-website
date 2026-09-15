import { leaderboardEnabled, submitScore, type LeaderboardGameMode } from "@/lib/leaderboard";

export const LEADERBOARD_NAME_KEY = "aidin-portfolio-gaming-name";

export async function submitScoreOnExit(
  score: number,
  durationSeconds: number,
  gameMode: LeaderboardGameMode,
): Promise<boolean> {
  if (!leaderboardEnabled || score <= 0) return false;
  const name = typeof window === "undefined" ? null : window.localStorage.getItem(LEADERBOARD_NAME_KEY);
  if (!name) return false;
  return submitScore(name, score, durationSeconds, gameMode);
}

export async function finishRun(
  score: number,
  elapsedSeconds: number,
  gameMode: LeaderboardGameMode,
  endRun: () => void,
): Promise<void> {
  await submitScoreOnExit(score, elapsedSeconds, gameMode);
  endRun();
}
