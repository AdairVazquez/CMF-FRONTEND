"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Clock, CreditCard, Monitor,
  BarChart2, Calendar, Settings, ChevronLeft, ChevronRight,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { getRoleLabel, getRoleColor } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles?: string[];
  module?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Empleados", href: "/dashboard/empleados", icon: Users },
  { label: "Asistencia", href: "/dashboard/asistencia", icon: Clock },
  { label: "Tarjetas NFC", href: "/dashboard/tarjetas-nfc", icon: CreditCard },
  { label: "Dispositivos", href: "/dashboard/dispositivos", icon: Monitor },
  { label: "Reportes", href: "/dashboard/reportes", icon: BarChart2 },
  { label: "Ausencias", href: "/dashboard/ausencias", icon: Calendar, module: "ausencias" },
  { label: "Configuración", href: "/dashboard/configuracion", icon: Settings, roles: ["super_admin", "director"] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logout = useLogout();

  const filteredNav = navItems.filter((item) => {
    if (item.roles && user && !item.roles.includes(user.role)) return false;
    if (item.module && user?.company && !user.company.modules.includes(item.module)) return false;
    return true;
  });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-screen sticky top-0 overflow-hidden border-r z-30"
      style={{ background: "#080B0F", borderColor: "#1C2333" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "#1C2333", minHeight: 64 }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Logo size="sm" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          style={{ color: "#6B7280" }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group"
              style={{
                background: isActive ? "rgba(47, 128, 237, 0.1)" : "transparent",
                color: isActive ? "#2F80ED" : "#6B7280",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#F4F6F8";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "#6B7280";
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r"
                  style={{ background: "#2F80ED" }}
                />
              )}
              <item.icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {collapsed && (
                <div
                  className="absolute left-full ml-2 px-2 py-1 rounded text-xs font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                  style={{ background: "#0D1117", color: "#F4F6F8", border: "1px solid #1C2333" }}
                >
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t" style={{ borderColor: "#1C2333" }}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "#0D1117" }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "#0E2F4F", color: "#2F80ED", border: "1px solid #1C2333" }}
          >
            {initials}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#F4F6F8" }}>
                  {user?.name ?? "Usuario"}
                </p>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded border ${getRoleColor(user?.role ?? "")}`}
                >
                  {getRoleLabel(user?.role ?? "")}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-red-950/30 disabled:opacity-50"
          style={{ color: "#6B7280" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7280"; }}
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm">
                Cerrar sesión
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
