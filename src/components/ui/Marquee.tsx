"use client";

type MarqueeProps = {
  items: string[];
  speed?: "slow" | "normal" | "fast";
};

export function Marquee({ items, speed = "normal" }: MarqueeProps) {
  const duration =
    speed === "slow" ? "40s" : speed === "fast" ? "18s" : "28s";
  const loop = [...items, ...items];

  return (
    <div className="marquee-mask relative overflow-hidden">
      <div
        className="flex w-max gap-3"
        style={{ animation: `marquee ${duration} linear infinite` }}
      >
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex shrink-0 items-center border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <span className="me-2 h-1.5 w-1.5 bg-accent" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
