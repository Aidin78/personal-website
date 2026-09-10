type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  /** Use h1 once per page for the primary title. */
  as?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  as = "h2",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-start items-start";
  const HeadingTag = as;

  return (
    <div className={`mb-12 flex flex-col gap-4 ${alignClass}`}>
      {eyebrow ? <span className="field-label">{eyebrow}</span> : null}
      <HeadingTag className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {title}
      </HeadingTag>
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
