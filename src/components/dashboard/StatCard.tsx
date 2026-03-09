"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; label: string };
  index?: number;
  accent?: string;
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-xl border relative overflow-hidden"
      style={{ background: "#0D1117", borderColor: "#1C2333" }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accent}15, transparent)`,
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
        >
          <Icon className="w-6 h-6" style={{ color: accent }} />
        </div>
        {trend && (
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              background: trend.value >= 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
              color: trend.value >= 0 ? "#22c55e" : "#ef4444",
            }}
          >
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>

      <div className="text-3xl font-bold mb-1" style={{ color: "#F4F6F8" }}>
        {value}
      </div>
      <div className="text-sm font-medium mb-1" style={{ color: "#B9C0C8" }}>
        {title}
      </div>
      {description && (
        <div className="text-xs" style={{ color: "#6B7280" }}>
          {description}
        </div>
      )}
    </motion.div>
  );
}
