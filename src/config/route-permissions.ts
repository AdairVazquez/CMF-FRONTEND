/**
 * Rutas protegidas por rol. Si una ruta no aparece aquí, cualquier usuario
 * autenticado puede acceder. Si aparece, solo los roles listados pueden entrar.
 * El proxy.ts compara con pathname.startsWith(prefix) — orden importa: más
 * específicas primero.
 */
export interface RoutePermission {
  prefix: string
  roles: string[]
}

export const PROTECTED_ROUTES: RoutePermission[] = [
  // Super admin exclusivo
  { prefix: "/dashboard/planes", roles: ["super_admin"] },
  { prefix: "/dashboard/sistema", roles: ["super_admin"] },
  { prefix: "/dashboard/logs", roles: ["super_admin"] },
  { prefix: "/dashboard/roles", roles: ["super_admin"] },
  { prefix: "/dashboard/seguridad", roles: ["super_admin"] },
  { prefix: "/dashboard/empresas", roles: ["super_admin"] },

  // Super admin + director
  { prefix: "/dashboard/sucursales", roles: ["super_admin", "director"] },
  { prefix: "/dashboard/departamentos", roles: ["super_admin", "director"] },
  { prefix: "/dashboard/turnos", roles: ["super_admin", "director"] },
  { prefix: "/dashboard/usuarios", roles: ["super_admin", "director"] },

  // Todos menos operador
  { prefix: "/dashboard/empleados", roles: ["super_admin", "director", "rh", "jefe_area"] },
  { prefix: "/dashboard/asistencia", roles: ["super_admin", "director", "rh", "jefe_area"] },
  { prefix: "/dashboard/ausencias", roles: ["super_admin", "director", "rh", "jefe_area"] },
  { prefix: "/dashboard/reportes", roles: ["super_admin", "director", "rh"] },

  // Todos menos rh y jefe_area
  { prefix: "/dashboard/dispositivos", roles: ["super_admin", "director", "operador"] },
]
