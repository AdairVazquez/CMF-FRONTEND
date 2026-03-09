"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface LiveBadgeProps {
  label?: string;
  color?: string;
}

export function LiveBadge({ label = "EN VIVO", color = "#22c55e" }: LiveBadgeProps) {
  const dotRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.to(dotRef.current, {
      opacity: 0.2,
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      <span ref={dotRef} className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
