import type { ReactNode } from "react";
import { GradientOrb } from "@/components/ui/GradientOrb";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`page-shell min-h-[calc(100vh-4rem)] ${className}`}>
      <GradientOrb className="-start-24 top-0 h-72 w-72 opacity-80" />
      <GradientOrb className="-end-16 top-40 h-96 w-96 opacity-60" />
      <GradientOrb className="bottom-0 start-1/3 h-80 w-80 opacity-50" />
      {children}
    </div>
  );
}
