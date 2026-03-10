export type DeviceStatus = "activo" | "inactivo" | "mantenimiento"

export interface Device {
  id: number
  company_id: number
  branch_id: number | null
  device_code: string
  name: string
  location?: string
  status: DeviceStatus
  ip_address?: string | null
  mac_address?: string | null
  last_ping_at: string | null
  config?: Record<string, unknown> | null
  created_at: string
  /** Computed by backend: last_ping_at within 5 minutes */
  is_online: boolean
}

export interface DeviceEvent {
  id: number
  device_id: number | null
  device_name?: string | null
  employee_id: number
  employee_name: string
  type: "entrada" | "salida"
  recorded_at: string
}
