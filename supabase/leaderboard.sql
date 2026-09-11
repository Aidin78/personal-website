-- Run this once in the Supabase SQL editor for the project used by the
-- gaming-mode leaderboard (src/lib/leaderboard.ts). No user accounts —
-- visitors submit a nickname + score straight from the browser using the
-- public anon key, so the checks below are what keep the data sane.

create table if not exists public.leaderboard_scores (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 12),
  score integer not null check (score >= 0 and score <= 100000),
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_scores_score_idx
  on public.leaderboard_scores (score desc, created_at asc);

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
