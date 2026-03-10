export type EmployeeType = "base" | "confianza"
export type EmployeeStatus = "activo" | "inactivo" | "baja"

export interface Department {
  id: number
  name: string
  branch_id: number
  company_id: number
}

export interface Branch {
  id: number
  name: string
  address?: string
  company_id: number
}

export interface Shift {
  id: number
  name: string
  entry_time: string
  exit_time: string
  tolerance_minutes: number
}

export interface Employee {
  id: number
  first_name: string
  last_name: string
  full_name: string
  employee_type: EmployeeType
  status: EmployeeStatus
  department_id: number
  branch_id: number
  shift_id: number
  company_id: number
  created_at: string
  department?: Department
  branch?: Branch
  shift?: Shift
}
