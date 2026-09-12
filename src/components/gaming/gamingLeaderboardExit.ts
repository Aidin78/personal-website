import { leaderboardEnabled, submitScore } from "@/lib/leaderboard";

export const LEADERBOARD_NAME_KEY = "aidin-portfolio-gaming-name";

export async function submitScoreOnExit(score: number, durationSeconds: number): Promise<boolean> {
  if (!leaderboardEnabled || score <= 0) return false;
  const name = typeof window === "undefined" ? null : window.localStorage.getItem(LEADERBOARD_NAME_KEY);
  if (!name) return false;
  return submitScore(name, score, durationSeconds);
}
