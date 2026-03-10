export type CompanyStatus = "activo" | "inactivo" | "suspendido"

export interface CompanyFull {
  id: number
  name: string
  status: CompanyStatus
  plan: string
  modules: string[]
  created_at: string
  users_count?: number
  employees_count?: number
}
