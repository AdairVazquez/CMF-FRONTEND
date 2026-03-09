"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

gsap.registerPlugin(useGSAP);

interface StatCardProps {
  title:        string;
  value:        string | number;
  icon:         LucideIcon;
  description?: string;
  trend?:       { value: number; label: string };
  index?:       number;
  accent?:      string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  index = 0,
  accent = "#2F80ED",
}: StatCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const valueRef   = useRef<HTMLDivElement>(null);
  const isNumeric  = typeof value === "number";

  useGSAP(() => {
    /* Entrada con stagger */
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1, ease: "power3.out" }
    );

    /* Counter animado solo si es número */
    if (isNumeric && valueRef.current) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value as number,
        duration: 1.4,
        delay: index * 0.1 + 0.2,
        ease: "power2.out",
        onUpdate: () => {
          if (valueRef.current) {
            valueRef.current.textContent = Math.round(obj.val).toLocaleString("es-MX");
          }
        },
      });
    }
  }, { scope: cardRef });

  /* Hover glow */
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      boxShadow: `0 0 24px ${accent}18`,
      borderColor: `${accent}40`,
      duration: 0.25,
    });
  };
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      boxShadow: "0 0 0 transparent",
      borderColor: "#1C2333",
      duration: 0.25,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="p-6 rounded-xl border relative overflow-hidden cursor-default transition-colors"
      style={{ background: "#0D1117", borderColor: "#1C2333" }}
    >
      {/* Radial glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accent}12, transparent)`,
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
        >
          <Icon className="w-6 h-6" style={{ color: accent }} />
        </div>
        {trend && (
          <span
            className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
            style={{
              background: trend.value >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color:      trend.value >= 0 ? "#22c55e"              : "#ef4444",
            }}
          >
            {trend.value >= 0
              ? <TrendingUp  className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />}
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>

      <div
        ref={isNumeric ? valueRef : undefined}
        className="text-3xl font-bold mb-1 tabular-nums"
        style={{ color: "#F4F6F8" }}
      >
        {isNumeric ? "0" : value}
      </div>
      <div className="text-sm font-medium mb-1" style={{ color: "#B9C0C8" }}>
        {title}
      </div>
      {description && (
        <div className="text-xs" style={{ color: "#6B7280" }}>{description}</div>
      )}
    </div>
  );
}
