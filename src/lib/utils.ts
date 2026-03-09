import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Buenos días, ${name}`;
  if (hour < 18) return `Buenas tardes, ${name}`;
  return `Buenas noches, ${name}`;
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: "Super Admin",
    director: "Director",
    rh: "Recursos Humanos",
    jefe_area: "Jefe de Área",
    operador: "Operador",
  };
  return labels[role] ?? role;
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    super_admin: "bg-purple-900/50 text-purple-300 border-purple-700",
    director: "bg-blue-900/50 text-blue-300 border-blue-700",
    rh: "bg-green-900/50 text-green-300 border-green-700",
    jefe_area: "bg-orange-900/50 text-orange-300 border-orange-700",
    operador: "bg-gray-900/50 text-gray-300 border-gray-700",
  };
  return colors[role] ?? "bg-gray-900/50 text-gray-300 border-gray-700";
}
