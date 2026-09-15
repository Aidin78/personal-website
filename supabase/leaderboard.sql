-- Run this once in the Supabase SQL editor for the project used by the
-- gaming-mode leaderboard (src/lib/leaderboard.ts). No user accounts —
-- visitors submit a nickname + score straight from the browser using the
-- public anon key, so the checks below are what keep the data sane.

create table if not exists public.leaderboard_scores (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 12),
  score integer not null check (score >= 0 and score <= 100000),
  duration_seconds integer not null default 0 check (duration_seconds >= 0 and duration_seconds <= 36000),
  created_at timestamptz not null default now()
);

-- Safe to re-run against a table created before duration_seconds existed.
alter table public.leaderboard_scores
  add column if not exists duration_seconds integer not null default 0;

-- Safe to re-run against a table created before game_mode existed. Endless
-- and Time Attack scores aren't comparable (different time budgets), so
-- they're ranked as separate leaderboards (see src/lib/leaderboard.ts).
alter table public.leaderboard_scores
  add column if not exists game_mode text not null default 'endless';

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_game_mode_check;

alter table public.leaderboard_scores
  add constraint leaderboard_scores_game_mode_check
  check (game_mode in ('endless', 'timeAttack'));

-- Dropped and recreated (rather than "if not exists") so a re-run also
-- upgrades an index created before game_mode was added to it.
drop index if exists leaderboard_scores_score_idx;

create index leaderboard_scores_score_idx
  on public.leaderboard_scores (game_mode, score desc, created_at asc);

-- Loose anti-cheat: the anon key can insert any row, so this blocks the
-- obviously-fabricated ones. Orbs spawn one every 2.2s and the richest is
-- worth 25 points, so sustained play tops out around 25/2.2 ≈ 11.4 pts/sec;
-- 20 pts/sec plus a flat +30 (covers the one-time nav-link bonus scored in
-- the same second) leaves real play comfortable headroom while still
-- rejecting scores no real run could produce for its duration.
alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_plausible_rate;

alter table public.leaderboard_scores
  add constraint leaderboard_scores_plausible_rate
  check (score <= 30 + duration_seconds * 20);

alter table public.leaderboard_scores enable row level security;

create policy "Anyone can read the leaderboard"
  on public.leaderboard_scores
  for select
  to anon
  using (true);

create policy "Anyone can submit a score"
  on public.leaderboard_scores
  for insert
  to anon
  with check (true);
