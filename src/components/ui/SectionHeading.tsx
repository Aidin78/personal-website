type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-start items-start";

  return (
    <div className={`mb-12 flex flex-col gap-4 ${alignClass}`}>
      {eyebrow ? (
        <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-lg leading-relaxed text-muted">{subtitle}</p>
      ) : null}
    </div>
  );
}

type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function Section({ children, className = "" }: SectionProps) {
  return (
    <section className={`py-16 sm:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
    </section>
  );
}
