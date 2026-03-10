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

// Paleta CMF: Azul Confianza #0E2F4F, Azul Cambio #2F80ED, Plata #B9C0C8
export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    super_admin: "bg-[#0E2F4F]/50 text-[#B9C0C8] border-[#0E2F4F]",
    director:    "bg-[#0E2F4F]/50 text-[#B9C0C8] border-[#0E2F4F]",
    rh:          "bg-[#0E2F4F]/50 text-[#B9C0C8] border-[#0E2F4F]",
    jefe_area:   "bg-[#2F80ED]/30 text-[#F4F6F8] border-[#2F80ED]",
    operador:    "bg-[#1C2333] text-[#B9C0C8] border-[#1C2333]",
  };
  return colors[role] ?? "bg-[#1C2333] text-[#B9C0C8] border-[#1C2333]";
}
