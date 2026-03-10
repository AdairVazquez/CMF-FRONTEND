export type DeviceStatus = "online" | "offline"

export interface Device {
  id: number
  name: string
  serial_number: string
  status: DeviceStatus
  branch_id: number | null
  last_seen: string | null
  created_at: string
}

export interface DeviceEvent {
  id: number
  device_id: number
  device_name?: string
  employee_id: number
  employee_name: string
  type: "entrada" | "salida"
  recorded_at: string
}
