"use client"

import * as React from "react"
import {
  BarChartIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarCheckIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LockIcon,
  MonitorIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/NavMain"
import { NavSecondary } from "@/components/dashboard/NavSecondary"
import { NavUser } from "@/components/dashboard/NavUser"
import { CmfIcon } from "@/components/shared/CmfIcon"
import { useAuthStore } from "@/store/authStore"
import { getUserRole } from "@/types/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  super_admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Empresas", url: "/dashboard/empresas", icon: BuildingIcon },
    { title: "Usuarios", url: "/dashboard/usuarios", icon: UsersIcon },
    { title: "Roles", url: "/dashboard/roles", icon: ShieldIcon },
    { title: "Seguridad", url: "/dashboard/seguridad", icon: LockIcon },
    { title: "Dispositivos", url: "/dashboard/dispositivos", icon: MonitorIcon },
    { title: "Empleados", url: "/dashboard/empleados", icon: BriefcaseIcon },
    { title: "Asistencia", url: "/dashboard/asistencia", icon: CalendarCheckIcon },
    { title: "Reportes", url: "/dashboard/reportes", icon: BarChartIcon },
  ],
  director: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Empleados", url: "/dashboard/empleados", icon: BriefcaseIcon },
    { title: "Asistencia", url: "/dashboard/asistencia", icon: CalendarCheckIcon },
    { title: "Reportes", url: "/dashboard/reportes", icon: BarChartIcon },
  ],
  rh: [
    { title: "Asistencia", url: "/dashboard/asistencia", icon: CalendarCheckIcon },
    { title: "Empleados", url: "/dashboard/empleados", icon: BriefcaseIcon },
    { title: "Reportes", url: "/dashboard/reportes", icon: BarChartIcon },
  ],
  jefe_area: [
    { title: "Asistencia", url: "/dashboard/asistencia", icon: CalendarCheckIcon },
    { title: "Empleados", url: "/dashboard/empleados", icon: BriefcaseIcon },
  ],
  operador: [
    { title: "Dispositivos", url: "/dashboard/dispositivos", icon: MonitorIcon },
  ],
}

const ROLE_ACCENT: Record<string, string> = {
  super_admin: "#7C3AED",
  director: "#2F80ED",
  rh: "#059669",
  jefe_area: "#D97706",
  operador: "#6B7280",
}

const SECONDARY_NAV: NavItem[] = [
  { title: "Configuración", url: "/dashboard/configuracion", icon: SettingsIcon },
  { title: "Ayuda", url: "#", icon: HelpCircleIcon },
  { title: "Buscar", url: "#", icon: SearchIcon },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()
  const role = user ? getUserRole(user) : "operador"
  const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.operador
  const accent = ROLE_ACCENT[role] ?? "#2F80ED"

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          "--sidebar-accent": accent,
          "--sidebar-accent-foreground": "#ffffff",
        } as React.CSSProperties
      }
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <CmfIcon size={20} color={accent} />
                <span className="text-base font-semibold">CMF</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={SECONDARY_NAV} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
