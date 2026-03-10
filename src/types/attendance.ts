import type { Employee } from "./employee"

export type AttendanceType = "entrada" | "salida"
export type LeaveStatus = "pendiente" | "aprobado_jefe" | "aprobado_rh" | "rechazado"
export type LeaveType = "vacaciones" | "enfermedad" | "personal" | "otro"

export interface AttendanceLog {
  id: number
  employee_id: number
  employee: Employee
  type: AttendanceType
  recorded_at: string
  is_manual: boolean
  device_id: number | null
}

export interface AttendanceSummary {
  present: number
  absent: number
  late: number
  total: number
  date?: string
}

export interface WeeklyAttendance {
  day: string
  date?: string
  present: number
  absent: number
  late: number
}

export interface LeaveRequest {
  id: number
  employee_id: number
  employee: Employee
  leave_type: LeaveType
  start_date: string
  end_date: string
  days_requested?: number
  status: LeaveStatus
  reason?: string | null
  rejection_reason?: string | null
  created_at: string
}
