"use client";

import type { CSSProperties } from "react";

type CircleConfig = {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
  drift: string;
  opacity: number;
  accent?: "primary" | "secondary" | "neutral";
};

/** Fewer particles — same look, less paint/compositor work on mid-range phones. */
const circles: CircleConfig[] = [
  { id: 1, left: "8%", size: "8px", duration: "18s", delay: "0s", drift: "-12px", opacity: 0.45, accent: "primary" },
  { id: 2, left: "22%", size: "10px", duration: "24s", delay: "3s", drift: "8px", opacity: 0.35, accent: "secondary" },
  { id: 3, left: "38%", size: "7px", duration: "20s", delay: "1s", drift: "-6px", opacity: 0.4, accent: "neutral" },
  { id: 4, left: "52%", size: "9px", duration: "26s", delay: "6s", drift: "10px", opacity: 0.38, accent: "primary" },
  { id: 5, left: "66%", size: "11px", duration: "22s", delay: "2s", drift: "-14px", opacity: 0.42, accent: "secondary" },
  { id: 6, left: "78%", size: "6px", duration: "19s", delay: "8s", drift: "7px", opacity: 0.32, accent: "neutral" },
  { id: 7, left: "88%", size: "10px", duration: "28s", delay: "4s", drift: "-10px", opacity: 0.4, accent: "primary" },
  { id: 8, left: "14%", size: "8px", duration: "21s", delay: "9s", drift: "12px", opacity: 0.36, accent: "neutral" },
];

export function FallingCapsules() {
  return (
    <div aria-hidden className="falling-capsules">
      {circles.map((circle) => (
        <span
          key={circle.id}
          className={`falling-capsule falling-capsule-${circle.accent ?? "neutral"}`}
          style={
            {
              left: circle.left,
              width: circle.size,
              height: circle.size,
              opacity: circle.opacity,
              "--fall-duration": circle.duration,
              "--fall-delay": circle.delay,
              "--fall-drift": circle.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
