export interface DashboardConfig {
  title: string
  description: string
  /** Nombre del componente widget que renderiza este dashboard */
  widget: "SuperAdminDashboard" | "DirectorDashboard" | "RhDashboard" | "JefeAreaDashboard" | "OperadorDashboard"
}

export const DASHBOARD_BY_ROLE: Record<string, DashboardConfig> = {
  super_admin: {
    title: "Panel Global",
    description: "Vista general del SaaS ZEPHYREA",
    widget: "SuperAdminDashboard",
  },
  director: {
    title: "Dashboard",
    description: "Estado general de tu empresa",
    widget: "DirectorDashboard",
  },
  rh: {
    title: "Recursos Humanos",
    description: "Gestión de personal y asistencia",
    widget: "RhDashboard",
  },
  jefe_area: {
    title: "Mi Área",
    description: "Asistencia y personal de tu departamento",
    widget: "JefeAreaDashboard",
  },
  operador: {
    title: "Dispositivos",
    description: "Monitor de dispositivos NFC",
    widget: "OperadorDashboard",
  },
}
