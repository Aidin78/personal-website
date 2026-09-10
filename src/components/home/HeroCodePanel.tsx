import type { CSSProperties, ReactNode } from "react";

type HeroCodePanelProps = {
  name: string;
  role: string;
  stack: string[];
  focus: string;
  experience: string;
};

function Line({ n, children }: { n: number; children: ReactNode }) {
  const style = { animationDelay: `${0.15 + (n - 1) * 0.18}s` } as CSSProperties;

  return (
    <div className="flex">
      <span className="w-7 shrink-0 select-none text-right text-muted/50">{n}</span>
      <span className="typewriter-line ps-4 whitespace-pre" style={style}>
        {children}
      </span>
    </div>
  );
}

function Kw({ children }: { children: ReactNode }) {
  return <span className="text-accent">{children}</span>;
}

function Str({ children }: { children: ReactNode }) {
  return <span className="text-accent-secondary">{children}</span>;
}

function Prop({ children }: { children: ReactNode }) {
  return <span className="text-foreground">{children}</span>;
}

export function HeroCodePanel({ name, role, stack, focus, experience }: HeroCodePanelProps) {
  return (
    <div className="modern-panel overflow-hidden" dir="ltr">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <span className="font-mono text-xs text-muted">developer.ts</span>
      </div>
      <pre className="overflow-x-auto p-6 font-mono text-sm leading-loose sm:p-7 sm:text-base">
        <code>
          <Line n={1}>
            <span className="text-muted/70">{"// "}{focus}</span>
          </Line>
          <Line n={2}>
            <Kw>export const</Kw> <Prop>developer</Prop> = {"{"}
          </Line>
          <Line n={3}>
            {"  "}
            <Prop>name</Prop>: <Str>&quot;{name}&quot;</Str>,
          </Line>
          <Line n={4}>
            {"  "}
            <Prop>role</Prop>: <Str>&quot;{role}&quot;</Str>,
          </Line>
          <Line n={5}>
            {"  "}
            <Prop>stack</Prop>: [
            {stack.map((tech, index) => (
              <span key={tech}>
                <Str>&quot;{tech}&quot;</Str>
                {index < stack.length - 1 ? ", " : ""}
              </span>
            ))}
            ],
          </Line>
          <Line n={6}>
            {"  "}
            <Prop>experience</Prop>: <Str>&quot;{experience}&quot;</Str>,
          </Line>
          <Line n={7}>
            {"}"} <Kw>as const</Kw>;
          </Line>
        </code>
      </pre>
    </div>
  );
}
