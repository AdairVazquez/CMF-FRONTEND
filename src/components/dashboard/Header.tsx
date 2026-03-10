"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronRight, Menu, LogOut, User, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { getUserRole, getRoleColor, getRoleLabel } from "@/lib/utils";
import { LiveBadge } from "@/components/dashboard/LiveBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard":               "Dashboard",
  "/dashboard/super":         "Panel Super Admin",
  "/dashboard/empleados":     "Empleados",
  "/dashboard/asistencia":    "Asistencia",
  "/dashboard/tarjetas":      "Tarjetas NFC",
  "/dashboard/dispositivos":  "Dispositivos",
  "/dashboard/reportes":      "Reportes",
  "/dashboard/analytics":     "Analytics",
  "/dashboard/auditoria":     "Auditoría de Logs",
  "/dashboard/ausencias":     "Ausencias",
  "/dashboard/usuarios":      "Usuarios",
  "/dashboard/roles":         "Roles",
  "/dashboard/empresas":      "Empresas",
  "/dashboard/seguridad":     "Seguridad",
  "/dashboard/configuracion": "Configuración",
  "/dashboard/perfil":        "Mi Perfil",
};

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user } = useAuthStore();
  const logout   = useLogout();
  const [clock, setClock] = useState<string>("");

  const role     = user ? getUserRole(user) : "operador";
  const crumbs   = ["Inicio", BREADCRUMB_MAP[pathname] ?? ""].filter(Boolean);
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  useEffect(() => {
    const tick = () => setClock(format(new Date(), "HH:mm:ss", { locale: es }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="h-14 flex items-center justify-between px-4 border-b sticky top-0 z-20 shrink-0"
      style={{ background: "#0A0D12", borderColor: "#1C2333" }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
          style={{ color: "#6B7280" }}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          {crumbs.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3" style={{ color: "#1C2333" }} />}
              <span
                className="font-medium"
                style={{ color: i === crumbs.length - 1 ? "#B9C0C8" : "#6B7280" }}
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Live clock */}
        {clock && (
          <span className="hidden lg:block text-xs font-mono" style={{ color: "#374151" }}>
            {clock}
          </span>
        )}

        {/* Live badge */}
        <div className="hidden md:block">
          <LiveBadge />
        </div>

        {user?.company && (
          <span className="hidden md:block text-sm" style={{ color: "#6B7280" }}>
            {user.company.name}
          </span>
        )}

        {/* Role badge */}
        <span className={`hidden sm:inline text-xs px-2 py-1 rounded-full border font-medium ${getRoleColor(role)}`}>
          {getRoleLabel(role)}
        </span>

        {/* Bell */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5 relative"
          style={{ color: "#6B7280" }}
          aria-label="Notificaciones"
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{ background: "#2F80ED" }}
          />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: getRoleAvatarColor(role), color: "#fff" }}
              aria-label="Menú de usuario"
            >
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48"
            style={{ background: "#0D1117", border: "1px solid #1C2333" }}
          >
            <div className="px-3 py-2 border-b" style={{ borderColor: "#1C2333" }}>
              <p className="text-sm font-medium truncate" style={{ color: "#F4F6F8" }}>
                {user?.name}
              </p>
              <p className="text-xs truncate" style={{ color: "#6B7280" }}>
                {user?.email}
              </p>
            </div>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              style={{ color: "#B9C0C8" }}
              onClick={() => router.push("/dashboard/perfil")}
            >
              <User className="w-4 h-4" />
              Mi perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              style={{ color: "#B9C0C8" }}
              onClick={() => router.push("/dashboard/seguridad")}
            >
              <Shield className="w-4 h-4" />
              Autenticación 2FA
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ background: "#1C2333" }} />
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              style={{ color: "#ef4444" }}
              onClick={() => logout.mutate()}
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function getRoleAvatarColor(role: string): string {
  const map: Record<string, string> = {
    super_admin: "#7C3AED",
    director:    "#2F80ED",
    rh:          "#059669",
    jefe_area:   "#D97706",
    operador:    "#6B7280",
  };
  return map[role] ?? "#6B7280";
}
