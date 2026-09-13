const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const TABLE = "leaderboard_scores";

export const leaderboardEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export type LeaderboardEntry = {
  name: string;
  score: number;
  duration_seconds: number;
  created_at: string;
};

export type LeaderboardRange = "today" | "week" | "all";

function sinceIso(range: LeaderboardRange): string | null {
  if (range === "all") return null;

  const now = new Date();
  if (range === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  }
  return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

function headers() {
  return {
    apikey: SUPABASE_ANON_KEY ?? "",
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function fetchTopScores(
  limit = 10,
  range: LeaderboardRange = "all",
): Promise<LeaderboardEntry[]> {
  if (!leaderboardEnabled) return [];

  try {
    const since = sinceIso(range);
    const rangeFilter = since ? `&created_at=gte.${encodeURIComponent(since)}` : "";
    const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=name,score,duration_seconds,created_at&order=score.desc,created_at.asc&limit=${limit}${rangeFilter}`;
    const response = await fetch(url, { headers: headers() });
    if (!response.ok) return [];
    return (await response.json()) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

/** 1-based rank among all submitted scores (ties share a rank), or null when unknown. */
export async function fetchRank(score: number): Promise<number | null> {
  if (!leaderboardEnabled) return null;

  try {
    const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=id&score=gt.${score}&limit=1`;
    const response = await fetch(url, {
      headers: { ...headers(), Prefer: "count=exact" },
    });
    if (!response.ok) return null;
    const contentRange = response.headers.get("content-range");
    const total = contentRange ? Number(contentRange.split("/")[1]) : NaN;
    return Number.isFinite(total) ? total + 1 : null;
  } catch {
    return null;
  }
}

export async function submitScore(
  name: string,
  score: number,
  durationSeconds: number,
): Promise<boolean> {
  if (!leaderboardEnabled) return false;

  const trimmedName = name.trim().slice(0, 12);
  if (!trimmedName) return false;

  try {
    const url = `${SUPABASE_URL}/rest/v1/${TABLE}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { ...headers(), Prefer: "return=minimal" },
      body: JSON.stringify({
        name: trimmedName,
        score,
        duration_seconds: Math.max(0, Math.floor(durationSeconds)),
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
