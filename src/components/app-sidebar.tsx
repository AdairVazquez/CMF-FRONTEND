"use client"

import * as React from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import {
  LayoutDashboard,
  Users,
  Clock,
  Building2,
  UserCog,
  Shield,
  CreditCard,
  Monitor,
  CalendarOff,
  BarChart3,
  TrendingUp,
  FileSearch,
  Lock,
  Settings2,
  Activity,
  type LucideIcon,
} from "lucide-react"

import { NavMain, type CmfNavGroup } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/authStore"
import { useLogout } from "@/hooks/useAuth"
import { getUserRole, getRoleLabel } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

// Color de acento por rol — se aplica como CSS variable --sidebar-accent
const ROLE_ACCENT: Record<string, string> = {
  super_admin: "#8b5cf6",
  director:    "#3b82f6",
  rh:          "#10b981",
  jefe_area:   "#f59e0b",
  operador:    "#06b6d4",
  empleado:    "#6366f1",
  auditor:     "#ef4444",
}

interface RawNavItem {
  label: string
  href:  string
  icon:  LucideIcon
  roles?: string[]
}

interface RawNavGroup {
  section: string
  items:   RawNavItem[]
}

const NAV_GROUPS: RawNavGroup[] = [
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
      { label: "Ausencias",    href: "/dashboard/ausencias",    icon: CalendarOff,     roles: ["super_admin","director","rh","jefe_area"] },
    ],
  },
  {
    section: "Reportes & Analytics",
    items: [
      { label: "Reportes",     href: "/dashboard/reportes",     icon: BarChart3,       roles: ["super_admin","director","rh"] },
      { label: "Analytics",    href: "/dashboard/analytics",    icon: TrendingUp,      roles: ["super_admin","director"] },
      { label: "Auditoría",    href: "/dashboard/auditoria",    icon: FileSearch,      roles: ["super_admin"] },
    ],
  },
  {
    section: "Sistema",
    items: [
      { label: "Estado del Sistema", href: "/dashboard/super",         icon: Activity,  roles: ["super_admin"] },
      { label: "Seguridad",          href: "/dashboard/seguridad",     icon: Lock,      roles: ["super_admin","director","rh","jefe_area","operador"] },
      { label: "Configuración",      href: "/dashboard/configuracion", icon: Settings2, roles: ["super_admin","director"] },
    ],
  },
]

export function AppSidebar({ style: propStyle, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()
  const logout   = useLogout()
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  const role        = user ? getUserRole(user) : "operador"
  const roleColor   = ROLE_ACCENT[role] ?? "#6B7280"
  const companyName = user?.company?.name ?? "CMF Sistema"
  const companyPlan = user?.company?.plan ?? "Enterprise"

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??"

  const filteredGroups: CmfNavGroup[] = NAV_GROUPS
    .map((group) => ({
      section: group.section,
      items: group.items
        .filter((item) => !item.roles || item.roles.includes(role))
        .map((item) => ({
          title: item.label,
          url:
            item.href === "/dashboard" && role === "super_admin"
              ? "/dashboard/super"
              : item.href,
          icon: item.icon,
        })),
    }))
    .filter((group) => group.items.length > 0)

  useGSAP(
    () => {
      gsap.fromTo(
        ".nav-item",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" },
      )
    },
    { scope: sidebarRef },
  )

  return (
    <Sidebar
      ref={sidebarRef}
      collapsible="icon"
      style={
        {
          "--sidebar-accent": roleColor,
          "--sidebar-accent-foreground": "#ffffff",
          ...propStyle,
        } as React.CSSProperties
      }
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher name={companyName} plan={companyPlan} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={filteredGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name:            user?.name ?? "Usuario",
            email:           user?.email ?? "",
            initials,
            roleLabel:       getRoleLabel(role),
            roleAccentColor: roleColor,
          }}
          onLogout={() => logout.mutate()}
          isLoggingOut={logout.isPending}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
