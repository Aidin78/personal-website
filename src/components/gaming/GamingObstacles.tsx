"use client";

import { useMemo } from "react";

type Obstacle = { id: number; x: number; y: number };

const OBSTACLE_COUNT = 6;
// Keeps obstacles clear of the snake's fixed spawn point (see initSegments in GamingPlayer.tsx).
const SPAWN_SAFE_X = 80;
const SPAWN_SAFE_Y = 120;
const SPAWN_SAFE_RADIUS = 140;

function generateObstacles(): Obstacle[] {
  if (typeof window === "undefined") return [];

  const list: Obstacle[] = [];
  let attempts = 0;

  while (list.length < OBSTACLE_COUNT && attempts < 200) {
    attempts += 1;
    const xPct = 8 + Math.random() * 84;
    const yPct = 20 + Math.random() * 58;
    const x = (xPct / 100) * window.innerWidth;
    const y = (yPct / 100) * window.innerHeight;

    if (Math.hypot(x - SPAWN_SAFE_X, y - SPAWN_SAFE_Y) < SPAWN_SAFE_RADIUS) continue;
    list.push({ id: attempts, x: xPct, y: yPct });
  }

  return list;
}

export function GamingObstacles() {
  const obstacles = useMemo(() => generateObstacles(), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[54]" aria-hidden>
      {obstacles.map((obstacle) => (
        <div
          key={obstacle.id}
          className="gaming-obstacle"
          data-obstacle
          data-obstacle-id={obstacle.id}
          style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
        />
      ))}
    </div>
  );
}
