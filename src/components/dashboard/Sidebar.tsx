"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CmfIcon } from "@/components/shared/CmfIcon";
import {
  LayoutDashboard, Users, Clock, CreditCard, Monitor,
  BarChart2, Calendar, UserCog, ChevronLeft, ChevronRight,
  LogOut, Shield, Settings, Building2, TrendingUp, FileText, Activity,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { getUserRole, getRoleColor, getRoleLabel } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

interface NavItem {
  label:  string;
  href:   string;
  icon:   typeof LayoutDashboard;
  roles?: string[];
}

interface NavGroup {
  section: string;
  items:   NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    section: "Módulos Principales",
    items: [
      { label: "Dashboard",    href: "/dashboard",              icon: LayoutDashboard, roles: ["super_admin","director","rh","jefe_area","operador"] },
      { label: "Empleados",    href: "/dashboard/empleados",    icon: Users,           roles: ["super_admin","director","rh"] },
      { label: "Asistencia",   href: "/dashboard/asistencia",   icon: Clock,           roles: ["super_admin","director","rh","jefe_area"] },
    ],
  },
  {
    section: "Administración",
    items: [
      { label: "Empresas",     href: "/dashboard/empresas",     icon: Building2,       roles: ["super_admin"] },
      { label: "Usuarios",     href: "/dashboard/usuarios",     icon: UserCog,         roles: ["super_admin","director"] },
      { label: "Roles",        href: "/dashboard/roles",        icon: Shield,          roles: ["super_admin"] },
    ],
  },
  {
    section: "Operaciones",
    items: [
      { label: "Tarjetas NFC", href: "/dashboard/tarjetas",     icon: CreditCard,      roles: ["super_admin","director","operador"] },
      { label: "Dispositivos", href: "/dashboard/dispositivos", icon: Monitor,         roles: ["super_admin","director","operador"] },
      { label: "Ausencias",    href: "/dashboard/ausencias",    icon: Calendar,        roles: ["super_admin","director","rh","jefe_area"] },
    ],
  },
  {
    section: "Reportes & Analytics",
    items: [
      { label: "Reportes",     href: "/dashboard/reportes",     icon: BarChart2,       roles: ["super_admin","director","rh"] },
      { label: "Analytics",    href: "/dashboard/analytics",    icon: TrendingUp,      roles: ["super_admin","director"] },
      { label: "Auditoría",    href: "/dashboard/auditoria",    icon: FileText,        roles: ["super_admin"] },
    ],
  },
  {
    section: "Sistema",
    items: [
      { label: "Configuración",      href: "/dashboard/configuracion", icon: Settings,  roles: ["super_admin","director"] },
      { label: "Estado del Sistema", href: "/dashboard/super",         icon: Activity,  roles: ["super_admin"] },
      { label: "Seguridad",          href: "/dashboard/seguridad",     icon: Shield,    roles: ["super_admin","director","rh","jefe_area","operador"] },
    ],
  },
];

interface SidebarProps {
  collapsed:  boolean;
  onToggle:   () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname   = usePathname();
  const { user }   = useAuthStore();
  const logout     = useLogout();
  const sidebarRef = useRef<HTMLElement>(null);

  const role = user ? getUserRole(user) : "operador";

  const filteredGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items
      .filter((item) => !item.roles || item.roles.includes(role))
      .map((item) =>
        // Super admin Dashboard link goes to /dashboard/super
        item.href === "/dashboard" && role === "super_admin"
          ? { ...item, href: "/dashboard/super" }
          : item
      ),
  })).filter((group) => group.items.length > 0);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  useEffect(() => {
    gsap.to(sidebarRef.current, {
      width: collapsed ? 72 : 256,
      duration: 0.28,
      ease: "power2.inOut",
    });
    gsap.to(".nav-label, .user-label, .nav-section-label", {
      opacity:  collapsed ? 0 : 1,
      x:        collapsed ? -8 : 0,
      duration: 0.18,
      ease: "power2.inOut",
    });
  }, [collapsed]);

  return (
    <aside
      ref={sidebarRef}
      className="flex flex-col h-screen sticky top-0 overflow-hidden border-r z-30 shrink-0"
      style={{ background: "#080B0F", borderColor: "#1C2333", width: collapsed ? 72 : 256 }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between p-4 border-b shrink-0"
        style={{ borderColor: "#1C2333", minHeight: 56 }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5 nav-label">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #0E2F4F 0%, #2F80ED 100%)" }}
            >
              <CmfIcon size={16} color="#F4F6F8" />
            </div>
            <span
              className="text-sm font-semibold whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #B9C0C8 0%, #F4F6F8 40%, #B9C0C8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              CMF Sistema
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5 shrink-0"
          style={{ color: "#6B7280" }}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto overflow-x-hidden">
        {filteredGroups.map((group) => (
          <div key={group.section}>
            <p
              className="nav-section-label text-xs font-semibold uppercase tracking-widest px-3 mb-1.5"
              style={{ color: "#374151" }}
            >
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative overflow-hidden"
                      style={{
                        background: isActive ? "rgba(47,128,237,0.08)" : "transparent",
                        color: isActive ? "#2F80ED" : "#6B7280",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "rgba(47,128,237,0.05)";
                          e.currentTarget.style.color = "#B9C0C8";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#6B7280";
                        }
                      }}
                    >
                      {isActive && (
                        <div
                          className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r"
                          style={{ background: "linear-gradient(180deg, transparent, #2F80ED, transparent)" }}
                        />
                      )}
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span
                        className="nav-label text-sm font-medium whitespace-nowrap truncate"
                        style={{ opacity: collapsed ? 0 : 1 }}
                      >
                        {item.label}
                      </span>
                    </Link>

                    {collapsed && (
                      <div
                        className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-xs font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                        style={{ background: "#0D1117", color: "#F4F6F8", border: "1px solid #1C2333", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
                      >
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t shrink-0" style={{ borderColor: "#1C2333" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1" style={{ background: "#0D1117" }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: getRoleAvatarColor(role), color: "#fff" }}
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="user-label flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium truncate" style={{ color: "#F4F6F8" }}>
                {user?.name ?? "Usuario"}
              </p>
              <span className={`text-xs px-1.5 py-0.5 rounded border ${getRoleColor(role)}`}>
                {getRoleLabel(role)}
              </span>
            </div>
          )}
        </div>

        <div className="relative group">
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-red-950/30 disabled:opacity-50"
            style={{ color: "#6B7280" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7280"; }}
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="nav-label text-sm" style={{ opacity: collapsed ? 0 : 1 }}>
              Cerrar sesión
            </span>
          </button>
          {collapsed && (
            <div
              className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-xs font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
              style={{ background: "#0D1117", color: "#ef4444", border: "1px solid #1C2333" }}
            >
              Cerrar sesión
            </div>
          )}
        </div>
      </div>
    </aside>
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
