import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`page-shell min-h-[calc(100vh-4rem)] ${className}`}>
      {children}
    </div>
  );
}
