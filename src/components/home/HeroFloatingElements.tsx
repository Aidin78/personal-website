"use client";

import { Code2, Layers, Palette, Sparkles } from "lucide-react";

const floatingItems = [
  { icon: Code2, label: "React", className: "top-[12%] -start-4 animate-float-delay-1" },
  { icon: Palette, label: "UI Design", className: "top-[8%] end-0 animate-float-delay-2" },
  { icon: Layers, label: "Next.js", className: "bottom-[28%] -start-8 animate-float-delay-3" },
  { icon: Sparkles, label: "Figma", className: "bottom-[18%] end-4 animate-float-delay-4" },
];

export function HeroFloatingElements() {
  return (
    <>
      {floatingItems.map(({ icon: Icon, label, className }) => (
        <div
          key={label}
          className={`absolute z-10 hidden rounded-2xl border border-border bg-surface/90 px-3 py-2 shadow-lg backdrop-blur-md sm:flex sm:items-center sm:gap-2 ${className}`}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-xs font-semibold text-foreground">{label}</span>
        </div>
      ))}
    </>
  );
}
