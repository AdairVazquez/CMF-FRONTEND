"use client"

import * as React from "react"
import {
  BriefcaseIcon,
  BuildingIcon,
  LayoutDashboardIcon,
  MonitorIcon,
} from "lucide-react"

import { NavMain, type NavMainItem } from "@/components/dashboard/NavMain"
import { NavProjects } from "@/components/dashboard/NavProjects"
import { NavUser } from "@/components/dashboard/NavUser"
import { CmfIcon } from "@/components/shared/CmfIcon"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/store/authStore"
import { getUserRole } from "@/types/auth"
import { getProjectsByRole } from "@/config/nav-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const ROLE_ACCENT: Record<string, string> = {
  super_admin: "#0E2F4F",
  director: "#0E2F4F",
  rh: "#0E2F4F",
  jefe_area: "#2F80ED",
  operador: "#6B7280",
}

const NAV_MAIN_BY_ROLE: Record<string, NavMainItem[]> = {
  super_admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    {
      title: "Operación",
      icon: BriefcaseIcon,
      items: [
        { title: "Empleados", url: "/dashboard/empleados" },
        { title: "Asistencia", url: "/dashboard/asistencia" },
        { title: "Reportes", url: "/dashboard/reportes" },
      ],
    },
    {
      title: "Administración",
      icon: BuildingIcon,
      items: [
        { title: "Empresas", url: "/dashboard/empresas" },
        { title: "Usuarios", url: "/dashboard/usuarios" },
        { title: "Roles", url: "/dashboard/roles" },
        { title: "Seguridad", url: "/dashboard/seguridad" },
        { title: "Dispositivos", url: "/dashboard/dispositivos" },
      ],
    },
  ],
  director: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    {
      title: "Operación",
      icon: BriefcaseIcon,
      items: [
        { title: "Empleados", url: "/dashboard/empleados" },
        { title: "Asistencia", url: "/dashboard/asistencia" },
        { title: "Reportes", url: "/dashboard/reportes" },
      ],
    },
  ],
  rh: [
    {
      title: "Operación",
      icon: BriefcaseIcon,
      items: [
        { title: "Asistencia", url: "/dashboard/asistencia" },
        { title: "Empleados", url: "/dashboard/empleados" },
        { title: "Reportes", url: "/dashboard/reportes" },
      ],
    },
  ],
  jefe_area: [
    {
      title: "Operación",
      icon: BriefcaseIcon,
      items: [
        { title: "Asistencia", url: "/dashboard/asistencia" },
        { title: "Empleados", url: "/dashboard/empleados" },
      ],
    },
  ],
  operador: [
    { title: "Dispositivos", url: "/dashboard/dispositivos", icon: MonitorIcon },
  ],
}

function NavProjectsSkeleton() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <Skeleton className="h-3 w-24" />
      </SidebarGroupLabel>
      <SidebarMenu>
        {[1, 2].map((i) => (
          <SidebarMenuItem key={i}>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-32" />
            </div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const role = user ? getUserRole(user) : "operador"
  const navItems = NAV_MAIN_BY_ROLE[role] ?? NAV_MAIN_BY_ROLE.operador
  const accent = ROLE_ACCENT[role] ?? "#0E2F4F"
  const projects = user ? getProjectsByRole(user, role) : []

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          "--sidebar-accent": accent,
          "--sidebar-accent-foreground": "#F4F6F8",
        } as React.CSSProperties
      }
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-2 cursor-default select-none group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:min-h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:min-w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:gap-0">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-[width,height] duration-200 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:!border-transparent group-data-[collapsible=icon]:!bg-[var(--sidebar-accent)]"
                style={{
                  background: `${accent}20`,
                  borderColor: `${accent}50`,
                }}
              >
                <span
                  className="flex items-center justify-center transition-[transform] duration-200 group-data-[collapsible=icon]:scale-[0.667]"
                  style={{ color: "inherit" }}
                >
                  <CmfIcon size={24} color={accent} className="group-data-[collapsible=icon]:hidden" />
                  <CmfIcon size={24} color="#F4F6F8" className="hidden group-data-[collapsible=icon]:!block" />
                </span>
              </div>
              <span
                className="text-base font-bold tracking-tight truncate group-data-[collapsible=icon]:hidden"
                style={{ color: "#F4F6F8", letterSpacing: "0.02em" }}
              >
                ZEPHYREA
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} sectionLabel="Módulos" />
        {!isHydrated ? (
          <NavProjectsSkeleton />
        ) : (
          <NavProjects projects={projects} label="Accesos Rápidos" />
        )}
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
