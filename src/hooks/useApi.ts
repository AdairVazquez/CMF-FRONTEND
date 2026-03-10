"use client"

import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import { useAuthStore } from "@/store/authStore"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { CompanyFull } from "@/types/company"
import type { Employee, Branch, Department } from "@/types/employee"
import type {
  AttendanceSummary,
  AttendanceLog,
  LeaveRequest,
  WeeklyAttendance,
} from "@/types/attendance"
import type { Device, DeviceEvent } from "@/types/device"

const STALE_LONG = 5 * 60 * 1000 // 5 min — datos poco cambiantes
const STALE_RT = 30 * 1000 // 30 s — asistencia / dispositivos en tiempo real

// ─── Empresas ──────────────────────────────────────────────────────────────

export function useCompanies() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<CompanyFull[]>>("/companies")
      return res.data
    },
    staleTime: STALE_LONG,
    enabled: !!user,
  })
}

export function useCompany(id: number) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["companies", id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<CompanyFull>>(`/companies/${id}`)
      return res.data
    },
    staleTime: STALE_LONG,
    enabled: !!user && id > 0,
  })
}

// ─── Sucursales ─────────────────────────────────────────────────────────────

export function useBranches() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["branches", user?.company_id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<Branch[]>>("/branches")
      return res.data
    },
    staleTime: STALE_LONG,
    enabled: !!user,
  })
}

// ─── Departamentos ──────────────────────────────────────────────────────────

export function useDepartments() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["departments", user?.company_id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<Department[]>>("/departments")
      return res.data
    },
    staleTime: STALE_LONG,
    enabled: !!user,
  })
}

// ─── Empleados ──────────────────────────────────────────────────────────────

export function useEmployees() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["employees", user?.company_id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<PaginatedResponse<Employee>>>("/employees")
      return res.data
    },
    staleTime: STALE_LONG,
    enabled: !!user,
  })
}

export function useEmployee(id: number) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["employees", id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<Employee>>(`/employees/${id}`)
      return res.data
    },
    staleTime: STALE_LONG,
    enabled: !!user && id > 0,
  })
}

// ─── Dispositivos ────────────────────────────────────────────────────────────

export function useDevices() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["devices", user?.company_id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<Device[]>>("/devices")
      return res.data
    },
    staleTime: STALE_RT,
    refetchInterval: STALE_RT,
    enabled: !!user,
  })
}

export function useDeviceEvents() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["device-events", user?.company_id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<DeviceEvent[]>>("/devices/events/recent")
      return res.data
    },
    staleTime: STALE_RT,
    refetchInterval: STALE_RT,
    enabled: !!user,
  })
}

// ─── Asistencia ─────────────────────────────────────────────────────────────

export function useAttendanceToday() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["attendance", "today", user?.company_id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<AttendanceSummary>>("/attendance/today")
      return res.data
    },
    staleTime: STALE_RT,
    refetchInterval: STALE_RT,
    enabled: !!user,
  })
}

export function useAttendance(employeeId: number) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["attendance", "employee", employeeId],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<AttendanceLog[]>>(
        `/attendance/${employeeId}`
      )
      return res.data
    },
    staleTime: STALE_LONG,
    enabled: !!user && employeeId > 0,
  })
}

// ─── Solicitudes de ausencia ─────────────────────────────────────────────────

export function useLeaveRequests() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["leave-requests", user?.company_id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<LeaveRequest[]>>("/leave-requests")
      return res.data
    },
    staleTime: STALE_LONG,
    enabled: !!user,
  })
}

// ─── Reportes ────────────────────────────────────────────────────────────────

export function useAttendanceWeekly() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["reports", "attendance", "weekly", user?.company_id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<WeeklyAttendance[]>>(
        "/reports/attendance/weekly"
      )
      return res.data
    },
    staleTime: STALE_LONG,
    enabled: !!user,
  })
}

export function useReports(type: string) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ["reports", "attendance", type, user?.company_id],
    queryFn: async () => {
      const res = await apiClient.get<never, ApiResponse<unknown>>(
        `/reports/attendance/${type}`
      )
      return res.data
    },
    staleTime: STALE_LONG,
    enabled: !!user && !!type,
  })
}
