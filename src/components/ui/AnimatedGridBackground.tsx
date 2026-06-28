"use client";

import { FallingCapsules } from "@/components/ui/FallingCapsules";

type AnimatedGridBackgroundProps = {
  capsules?: boolean;
  organic?: boolean;
};

export function AnimatedGridBackground({
  capsules = false,
  organic = false,
}: AnimatedGridBackgroundProps) {
  return (
    <div aria-hidden className="animated-grid pointer-events-none absolute inset-0 overflow-hidden">
      {organic ? (
        <>
          <div className="animated-grid-layer animated-grid-layer-a" />
          <div className="animated-grid-layer animated-grid-layer-b" />
          <div className="animated-grid-layer animated-grid-layer-c" />
          <div className="animated-grid-diagonal" />
          <div className="animated-grid-dots" />
        </>
      ) : (
        <div className="animated-grid-lines" />
      )}

      <div className="animated-grid-glow animated-grid-glow-1" />
      <div className="animated-grid-glow animated-grid-glow-2" />
      <div className="animated-grid-beam" />

      {capsules ? <FallingCapsules /> : null}
    </div>
  );
}
