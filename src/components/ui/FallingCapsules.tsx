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

const circles: CircleConfig[] = [
  { id: 1, left: "5%", size: "8px", duration: "18s", delay: "0s", drift: "-12px", opacity: 0.45, accent: "primary" },
  { id: 2, left: "14%", size: "10px", duration: "24s", delay: "3s", drift: "8px", opacity: 0.35, accent: "secondary" },
  { id: 3, left: "22%", size: "7px", duration: "20s", delay: "1s", drift: "-6px", opacity: 0.4, accent: "neutral" },
  { id: 4, left: "31%", size: "9px", duration: "26s", delay: "6s", drift: "10px", opacity: 0.38, accent: "primary" },
  { id: 5, left: "39%", size: "11px", duration: "22s", delay: "2s", drift: "-14px", opacity: 0.42, accent: "secondary" },
  { id: 6, left: "48%", size: "6px", duration: "19s", delay: "8s", drift: "7px", opacity: 0.32, accent: "neutral" },
  { id: 7, left: "56%", size: "10px", duration: "28s", delay: "4s", drift: "-10px", opacity: 0.4, accent: "primary" },
  { id: 8, left: "64%", size: "8px", duration: "21s", delay: "9s", drift: "12px", opacity: 0.36, accent: "neutral" },
  { id: 9, left: "72%", size: "12px", duration: "25s", delay: "5s", drift: "-8px", opacity: 0.44, accent: "secondary" },
  { id: 10, left: "80%", size: "7px", duration: "17s", delay: "7s", drift: "9px", opacity: 0.3, accent: "primary" },
  { id: 11, left: "88%", size: "9px", duration: "23s", delay: "10s", drift: "-11px", opacity: 0.37, accent: "neutral" },
  { id: 12, left: "95%", size: "6px", duration: "27s", delay: "11s", drift: "6px", opacity: 0.33, accent: "secondary" },
  { id: 13, left: "10%", size: "10px", duration: "29s", delay: "12s", drift: "14px", opacity: 0.35, accent: "primary" },
  { id: 14, left: "43%", size: "7px", duration: "16s", delay: "13s", drift: "-7px", opacity: 0.4, accent: "neutral" },
  { id: 15, left: "67%", size: "8px", duration: "30s", delay: "14s", drift: "11px", opacity: 0.34, accent: "secondary" },
  { id: 16, left: "36%", size: "9px", duration: "19s", delay: "15s", drift: "-9px", opacity: 0.38, accent: "primary" },
  { id: 17, left: "52%", size: "5px", duration: "24s", delay: "16s", drift: "5px", opacity: 0.28, accent: "neutral" },
  { id: 18, left: "76%", size: "9px", duration: "21s", delay: "17s", drift: "-13px", opacity: 0.36, accent: "secondary" },
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
