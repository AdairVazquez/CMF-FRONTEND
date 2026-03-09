"use client";

import { getRoleColor, getRoleLabel } from "@/lib/utils";

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border font-medium ${getRoleColor(role)} ${className}`}
    >
      {getRoleLabel(role)}
    </span>
  );
}
