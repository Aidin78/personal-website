type GradientOrbProps = {
  className?: string;
};

export function GradientOrb({ className = "" }: GradientOrbProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        background:
          "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
      }}
    />
  );
}
