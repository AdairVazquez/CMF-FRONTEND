import {
  Building2Icon,
  CalendarCheckIcon,
  CpuIcon,
  FileTextIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import type { User } from "@/types/auth"

export interface NavProject {
  name: string
  url: string
  icon: LucideIcon
}

export function getProjectsByRole(user: User, role: string): NavProject[] {
  const company = user.company

  switch (role) {
    case "super_admin":
      // Acceso rápido a cada empresa registrada (simulado con la empresa del usuario)
      // En producción esto vendría de una query de empresas
      return company
        ? [
            {
              name: company.name,
              url: `/dashboard/empresas`,
              icon: Building2Icon,
            },
          ]
        : [
            {
              name: "Todas las empresas",
              url: "/dashboard/empresas",
              icon: Building2Icon,
            },
          ]

    case "director":
      return [
        {
          name: "Asistencia",
          url: "/dashboard/asistencia",
          icon: CalendarCheckIcon,
        },
        {
          name: "Reportes",
          url: "/dashboard/reportes",
          icon: FileTextIcon,
        },
        {
          name: "Mi empresa",
          url: "/dashboard/empresas",
          icon: Building2Icon,
        },
      ]

    case "rh":
      return [
        {
          name: "Asistencia hoy",
          url: "/dashboard/asistencia",
          icon: CalendarCheckIcon,
        },
        {
          name: "Ausencias pendientes",
          url: "/dashboard/reportes",
          icon: FileTextIcon,
        },
      ]

    case "jefe_area":
      return [
        {
          name: "Mi departamento",
          url: "/dashboard/empleados",
          icon: UsersIcon,
        },
        {
          name: "Asistencia del área",
          url: "/dashboard/asistencia",
          icon: CalendarCheckIcon,
        },
      ]

    case "operador":
      return [
        {
          name: "Dispositivos activos",
          url: "/dashboard/dispositivos",
          icon: CpuIcon,
        },
      ]

    default:
      return []
  }
}
