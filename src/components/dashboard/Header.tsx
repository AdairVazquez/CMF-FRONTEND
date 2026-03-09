"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getRoleLabel, getRoleColor } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/empleados": "Empleados",
  "/dashboard/asistencia": "Asistencia",
  "/dashboard/tarjetas-nfc": "Tarjetas NFC",
  "/dashboard/dispositivos": "Dispositivos",
  "/dashboard/reportes": "Reportes",
  "/dashboard/ausencias": "Ausencias",
  "/dashboard/configuracion": "Configuración",
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const breadcrumbs = ["Inicio", breadcrumbMap[pathname] ?? ""].filter(Boolean);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-20"
      style={{ background: "#0A0D12", borderColor: "#1C2333" }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="w-3 h-3" style={{ color: "#1C2333" }} />}
            <span
              style={{ color: i === breadcrumbs.length - 1 ? "#B9C0C8" : "#6B7280" }}
              className="font-medium"
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user?.company && (
          <span className="hidden sm:block text-sm" style={{ color: "#6B7280" }}>
            {user.company.name}
          </span>
        )}

        {user && (
          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getRoleColor(user.role)}`}>
            {getRoleLabel(user.role)}
          </span>
        )}

        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5 relative"
          style={{ color: "#6B7280" }}
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#2F80ED" }}
          />
        </button>

        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
          style={{ background: "#0E2F4F", color: "#2F80ED", border: "1px solid #1C2333" }}
          aria-label="Menú de usuario"
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
