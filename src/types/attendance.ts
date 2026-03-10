import type { Employee } from "./employee"

export type AttendanceType = "entrada" | "salida"
export type LeaveStatus = "pendiente" | "aprobada" | "rechazada"
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
}

export interface WeeklyAttendance {
  day: string
  present: number
  absent: number
  late: number
}

export interface LeaveRequest {
  id: number
  employee_id: number
  employee: Employee
  type: LeaveType
  start_date: string
  end_date: string
  status: LeaveStatus
  notes?: string
  created_at: string
}
