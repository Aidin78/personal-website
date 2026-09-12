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

function headers() {
  return {
    apikey: SUPABASE_ANON_KEY ?? "",
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function fetchTopScores(limit = 10): Promise<LeaderboardEntry[]> {
  if (!leaderboardEnabled) return [];

  try {
    const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=name,score,duration_seconds,created_at&order=score.desc,created_at.asc&limit=${limit}`;
    const response = await fetch(url, { headers: headers() });
    if (!response.ok) return [];
    return (await response.json()) as LeaderboardEntry[];
  } catch {
    return [];
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
