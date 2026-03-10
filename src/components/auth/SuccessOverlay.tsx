"use client";
import { useState, useEffect } from "react";

interface Props {
  show: boolean;
  text?: string;
  onComplete?: () => void;
}

export function SuccessOverlay({ show, text = "Verificado", onComplete }: Props) {
  const [phase, setPhase] = useState<"hidden" | "fadeIn" | "circle" | "check" | "text">("hidden");

  useEffect(() => {
    if (!show) { setPhase("hidden"); return; }
    setPhase("fadeIn");
    const t1 = setTimeout(() => setPhase("circle"), 200);
    const t2 = setTimeout(() => setPhase("check"), 700);
    const t3 = setTimeout(() => setPhase("text"), 1100);
    const t4 = setTimeout(() => onComplete?.(), 2000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [show]);

  if (!show && phase === "hidden") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        opacity: phase === "hidden" ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r="50"
          fill="none" stroke="#10b981" strokeWidth="3"
          strokeDasharray="314"
          strokeDashoffset={phase === "fadeIn" || phase === "hidden" ? 314 : 0}
          style={{
            transition: "stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)",
            transformOrigin: "60px 60px",
            transform: "rotate(-90deg)",
          }}
        />
        <polyline
          points="38,62 52,76 82,46"
          fill="none" stroke="#10b981"
          strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="80"
          strokeDashoffset={phase === "check" || phase === "text" ? 0 : 80}
          style={{ transition: "stroke-dashoffset 0.4s cubic-bezier(0.4,0,0.2,1) 0.1s" }}
        />
      </svg>
      <p
        className="text-white text-xl font-semibold mt-6 tracking-wide"
        style={{
          opacity: phase === "text" ? 1 : 0,
          transform: phase === "text" ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.4s ease",
        }}
      >
        {text}
      </p>
    </div>
  );
}
