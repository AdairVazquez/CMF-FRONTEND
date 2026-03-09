import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User } from "@/types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(new Date(date));
}

export function getGreeting(name: string): string {
  const h = new Date().getHours();
  const prefix = h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
  return `${prefix}, ${name}`;
}

export function getUserRole(user: User): string {
  if (user.is_super_admin) return "super_admin";
  return user.roles[0]?.slug ?? "operador";
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: "Super Admin",
    director:    "Director",
    rh:          "Recursos Humanos",
    jefe_area:   "Jefe de Área",
    operador:    "Operador",
  };
  return labels[role] ?? role;
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    super_admin: "bg-purple-900/40 text-purple-300 border-purple-800",
    director:    "bg-blue-900/40 text-blue-300 border-blue-800",
    rh:          "bg-green-900/40 text-green-300 border-green-800",
    jefe_area:   "bg-orange-900/40 text-orange-300 border-orange-800",
    operador:    "bg-gray-900/40 text-gray-300 border-gray-700",
  };
  return colors[role] ?? "bg-gray-900/40 text-gray-300 border-gray-700";
}
