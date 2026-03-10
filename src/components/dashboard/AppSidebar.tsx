"use client"

import * as React from "react"
import {
  ActivityIcon,
  BarChart2Icon,
  BriefcaseIcon,
  Building2Icon,
  CalendarCheckIcon,
  CalendarXIcon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  LayersIcon,
  LayoutDashboardIcon,
  MonitorIcon,
  PackageIcon,
  ScrollTextIcon,
  UsersIcon,
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
  SidebarMenuButton,
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

interface NavSection {
  label: string
  items: NavMainItem[]
}

const NAV_SECTIONS_BY_ROLE: Record<string, NavSection[]> = {
  super_admin: [
    {
      label: "Inicio",
      items: [
        { title: "Panel Global", url: "/dashboard", icon: LayoutDashboardIcon },
      ],
    },
    {
      label: "Gestión SaaS",
      items: [
        { title: "Empresas", url: "/dashboard/empresas", icon: Building2Icon },
        { title: "Usuarios", url: "/dashboard/usuarios", icon: UsersIcon },
        { title: "Planes y módulos", url: "/dashboard/planes", icon: PackageIcon },
      ],
    },
    {
      label: "Sistema",
      items: [
        { title: "Health check", url: "/dashboard/sistema", icon: ActivityIcon },
        { title: "Logs", url: "/dashboard/logs", icon: ScrollTextIcon },
      ],
    },
  ],
  director: [
    {
      label: "Inicio",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
      ],
    },
    {
      label: "Operación",
      items: [
        { title: "Asistencia", url: "/dashboard/asistencia", icon: CalendarCheckIcon },
        { title: "Empleados", url: "/dashboard/empleados", icon: UsersIcon },
        { title: "Dispositivos", url: "/dashboard/dispositivos", icon: MonitorIcon },
      ],
    },
    {
      label: "Administración",
      items: [
        { title: "Sucursales", url: "/dashboard/sucursales", icon: Building2Icon },
        { title: "Departamentos", url: "/dashboard/departamentos", icon: LayersIcon },
        { title: "Turnos", url: "/dashboard/turnos", icon: ClockIcon },
        { title: "Usuarios", url: "/dashboard/usuarios", icon: UsersIcon },
      ],
    },
    {
      label: "Reportes",
      items: [
        { title: "Asistencia", url: "/dashboard/reportes/asistencia", icon: BarChart2Icon },
        { title: "Retardos", url: "/dashboard/reportes/retardos", icon: ClockIcon },
        { title: "Exportar", url: "/dashboard/reportes/exportar", icon: DownloadIcon },
      ],
    },
  ],
  rh: [
    {
      label: "Inicio",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
      ],
    },
    {
      label: "Personal",
      items: [
        { title: "Empleados", url: "/dashboard/empleados", icon: UsersIcon },
        { title: "Asistencia", url: "/dashboard/asistencia", icon: CalendarCheckIcon },
        { title: "Ausencias", url: "/dashboard/ausencias", icon: CalendarXIcon },
      ],
    },
    {
      label: "Reportes",
      items: [
        { title: "Asistencia", url: "/dashboard/reportes/asistencia", icon: FileTextIcon },
        { title: "Exportar", url: "/dashboard/reportes/exportar", icon: DownloadIcon },
      ],
    },
  ],
  jefe_area: [
    {
      label: "Inicio",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
      ],
    },
    {
      label: "Mi Área",
      items: [
        { title: "Asistencia", url: "/dashboard/asistencia", icon: CalendarCheckIcon },
        { title: "Ausencias", url: "/dashboard/ausencias", icon: CalendarXIcon },
      ],
    },
  ],
  operador: [
    {
      label: "Inicio",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
        { title: "Dispositivos", url: "/dashboard/dispositivos", icon: MonitorIcon },
      ],
    },
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
  const navSections = NAV_SECTIONS_BY_ROLE[role] ?? NAV_SECTIONS_BY_ROLE.operador
  const accent = ROLE_ACCENT[role] ?? "#0E2F4F"
  const projects = user ? getProjectsByRole(user, role) : []

  return (
    <Sidebar
      collapsible="icon"
      style={{ "--sidebar-accent": accent, "--sidebar-accent-foreground": "#F4F6F8" } as React.CSSProperties}
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
                <span className="flex items-center justify-center transition-[transform] duration-200 group-data-[collapsible=icon]:scale-[0.667]">
                  <CmfIcon size={24} color={accent} className="group-data-[collapsible=icon]:hidden" />
                  <CmfIcon size={24} color="#F4F6F8" className="hidden group-data-[collapsible=icon]:!block" />
                </span>
              </div>
              <span className="text-base font-bold tracking-tight truncate group-data-[collapsible=icon]:hidden" style={{ color: "#F4F6F8", letterSpacing: "0.02em" }}>
                ZEPHYREA
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navSections.map((section) => (
          <NavMain key={section.label} items={section.items} sectionLabel={section.label} />
        ))}
        {!isHydrated ? <NavProjectsSkeleton /> : <NavProjects projects={projects} label="Accesos Rápidos" />}
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
